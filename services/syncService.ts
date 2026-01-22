import NetInfo from "@react-native-community/netinfo";
import { eq } from "drizzle-orm";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	Timestamp,
	writeBatch,
} from "firebase/firestore";
import { firestore } from "@/config/firebase";
import { db } from "@/db/client";
import {
	Contact,
	Invoice,
	InvoiceItem,
	Product,
	SystemMeta,
	User,
} from "@/db/schema";

// Types for Firebase data (may include additional fields like Timestamps)
type FirebaseData<_T> = Record<string, unknown>;

// Extract the model types from Drizzle schema
type UserModel = typeof User.$inferInsert;
type ContactModel = typeof Contact.$inferInsert;
type ProductModel = typeof Product.$inferInsert;
type InvoiceModel = typeof Invoice.$inferInsert;
type InvoiceItemModel = typeof InvoiceItem.$inferInsert;

interface FirebaseUser extends FirebaseData<UserModel> {}
interface FirebaseContact extends FirebaseData<ContactModel> {}
interface FirebaseProduct extends FirebaseData<ProductModel> {}
interface FirebaseInvoice extends FirebaseData<InvoiceModel> {}
interface FirebaseInvoiceItem extends FirebaseData<InvoiceItemModel> {}

// Maximum operations per Firestore batch (500 is the hard limit)
const MAX_BATCH_SIZE = 450; // Use 450 to provide safety margin

// Hardcoded ID for this example since there is no Auth system.
// In production, this should be derived from the authenticated user ID
const DEVICE_BACKUP_ID = "user_device_backup";
const BACKGROUND_BACKUP_TASK = "BACKGROUND_AUTO_BACKUP";

/**
 * Helper function to execute batched writes to Firestore
 * Splits operations into chunks to respect the 500 operation limit per batch
 */
async function executeBatchedWrites<T>(
	collectionName: string,
	data: T[],
	docIdSelector: (item: T) => string,
): Promise<void> {
	const totalOperations = data.length;
	if (totalOperations === 0) return;

	for (let i = 0; i < totalOperations; i += MAX_BATCH_SIZE) {
		const batch = writeBatch(firestore);
		const chunk = data.slice(i, Math.min(i + MAX_BATCH_SIZE, totalOperations));

		chunk.forEach((item) => {
			const docRef = doc(
				collection(firestore, "backups", DEVICE_BACKUP_ID, collectionName),
				docIdSelector(item),
			);
			batch.set(docRef, item as Record<string, unknown>);
		});

		await batch.commit();
		console.log(
			`Wrote ${chunk.length} records to ${collectionName} (${i + 1}-${Math.min(i + MAX_BATCH_SIZE, totalOperations)}/${totalOperations})`,
		);
	}
}

export const SyncService = {
	/**
	 * Initialize background fetch task for "Cron-like" behavior
	 */
	async initBackgroundFetch() {
		try {
			const status = await BackgroundFetch.getStatusAsync();
			if (
				status === BackgroundFetch.BackgroundFetchStatus.Restricted ||
				status === BackgroundFetch.BackgroundFetchStatus.Denied
			) {
				console.log("Background fetch is restricted or denied");
				return;
			}

			// Register the task
			await BackgroundFetch.registerTaskAsync(BACKGROUND_BACKUP_TASK, {
				minimumInterval: 60 * 60, // Check every hour
				stopOnTerminate: false, // Continue even if app is closed
				startOnBoot: true, // Restart on device boot
			});
			console.log("Background backup task registered successfully");
		} catch (err) {
			console.log("Task registration failed:", err);
		}
	},

	/**
	 * Checks if internet is reachable
	 */
	async isOnline(): Promise<boolean> {
		const state = await NetInfo.fetch();
		return !!(state.isConnected && state.isInternetReachable);
	},

	/**
	 * Helpers for SystemMeta
	 */
	async getMeta(key: string): Promise<string | null> {
		try {
			const result = await db
				.select()
				.from(SystemMeta)
				.where(eq(SystemMeta.key, key));
			return result[0]?.value || null;
		} catch (e) {
			console.log("Error fetching meta:", e);
			return null;
		}
	},

	async setMeta(key: string, value: string) {
		try {
			await db
				.insert(SystemMeta)
				.values({ key, value })
				.onConflictDoUpdate({ target: SystemMeta.key, set: { value } });
		} catch (e) {
			console.log("Error setting meta:", e);
		}
	},

	/**
	 * Uploads all local SQLite data to Firestore using collections
	 * @param type 'auto' (cron) or 'manual' (user triggered)
	 */
	async backupToCloud(type: "auto" | "manual" = "manual") {
		if (!(await this.isOnline())) {
			if (type === "manual")
				throw new Error("No internet connection available.");
			return false;
		}

		// Use Local Time for date calculation to respect user's midnight
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, "0");
		const day = String(now.getDate()).padStart(2, "0");
		const today = `${year}-${month}-${day}`;

		// Scope variable here so it is available throughout the function
		let currentManualCount = 0;

		// --- Logic for Auto (Cron) ---
		if (type === "auto") {
			const lastAutoDate = await this.getMeta("last_auto_backup_date");

			// If we already backed up "today", skip execution (ensures once-a-day logic)
			if (lastAutoDate === today) {
				console.log("Auto backup already completed for today.");
				return BackgroundFetch.BackgroundFetchResult.NoData;
			}
		}

		// --- Logic for Manual Limits ---
		if (type === "manual") {
			const lastManualDate = await this.getMeta("manual_backup_date");

			// If it's the same day, check count
			if (lastManualDate === today) {
				const countStr = await this.getMeta("manual_backup_count");
				currentManualCount = countStr ? parseInt(countStr, 10) : 0;
			} else {
				// New day, reset count to 0
				currentManualCount = 0;
			}

			if (currentManualCount >= 3) {
				throw new Error(
					"Daily limit reached: You can only perform 3 manual backups per day.",
				);
			}
		}

		console.log(`Starting Cloud Backup (${type})...`);

		// 1. Fetch all data from SQLite
		const users = await db.select().from(User);
		const contacts = await db.select().from(Contact);
		const products = await db.select().from(Product);
		const invoices = await db.select().from(Invoice);
		const invoiceItems = await db.select().from(InvoiceItem);

		// 2. Clear existing collections first (chunked deletes)
		const existingCollections = [
			"users",
			"contacts",
			"products",
			"invoices",
			"invoice_items",
		];

		for (const collectionName of existingCollections) {
			const snapshot = await getDocs(
				collection(firestore, "backups", DEVICE_BACKUP_ID, collectionName),
			);

			// Delete in chunks to respect batch size limit
			const docsToDelete = snapshot.docs;
			for (let i = 0; i < docsToDelete.length; i += MAX_BATCH_SIZE) {
				const batch = writeBatch(firestore);
				const chunk = docsToDelete.slice(
					i,
					Math.min(i + MAX_BATCH_SIZE, docsToDelete.length),
				);
				chunk.forEach((docSnapshot) => {
					batch.delete(docSnapshot.ref);
				});
				await batch.commit();
				console.log(`Deleted ${chunk.length} records from ${collectionName}`);
			}
		}

		// 3. Write all data using batched writes
		await executeBatchedWrites("users", users, (user) => user.id.toString());
		await executeBatchedWrites("contacts", contacts, (contact) =>
			contact.id.toString(),
		);
		await executeBatchedWrites("products", products, (product) =>
			product.id.toString(),
		);
		await executeBatchedWrites("invoices", invoices, (invoice) =>
			invoice.id.toString(),
		);
		await executeBatchedWrites("invoice_items", invoiceItems, (item) =>
			item.id.toString(),
		);

		// 4. Write metadata document
		const metaRef = doc(
			collection(firestore, "backups", DEVICE_BACKUP_ID, "meta"),
		);
		const metaBatch = writeBatch(firestore);
		metaBatch.set(metaRef, {
			lastUpdated: Timestamp.now(),
			backupType: type,
			version: "2.0",
			timestamp: Date.now(),
		});
		await metaBatch.commit();

		// 5. Update Metadata
		if (type === "auto") {
			await this.setMeta("last_auto_backup_date", today);
			return BackgroundFetch.BackgroundFetchResult.NewData;
		} else {
			// Manual: Increment count and set date
			await this.setMeta("manual_backup_date", today);
			await this.setMeta(
				"manual_backup_count",
				(currentManualCount + 1).toString(),
			);
		}

		console.log(`Cloud Backup Complete (${type}).`);
		return true;
	},

	/**
	 * Downloads data from Firestore collections and replaces local SQLite data
	 * WARNING: This is destructive and will replace all local data
	 */
	async recoverFromCloud() {
		if (!(await this.isOnline())) {
			throw new Error("No internet connection available for recovery.");
		}

		console.log("Starting Recovery...");

		// Check if backup exists
		const metaRef = doc(
			collection(firestore, "backups", DEVICE_BACKUP_ID, "meta"),
		);
		const metaSnap = await getDoc(metaRef);

		if (!metaSnap.exists()) {
			throw new Error("No backup found in cloud.");
		}

		// Fetch all collections
		const [
			usersSnap,
			contactsSnap,
			productsSnap,
			invoicesSnap,
			invoiceItemsSnap,
		] = await Promise.all([
			getDocs(collection(firestore, "backups", DEVICE_BACKUP_ID, "users")),
			getDocs(collection(firestore, "backups", DEVICE_BACKUP_ID, "contacts")),
			getDocs(collection(firestore, "backups", DEVICE_BACKUP_ID, "products")),
			getDocs(collection(firestore, "backups", DEVICE_BACKUP_ID, "invoices")),
			getDocs(
				collection(firestore, "backups", DEVICE_BACKUP_ID, "invoice_items"),
			),
		]);

		const users = usersSnap.docs.map((doc) => doc.data() as FirebaseUser);
		const contacts = contactsSnap.docs.map(
			(doc) => doc.data() as FirebaseContact,
		);
		const products = productsSnap.docs.map(
			(doc) => doc.data() as FirebaseProduct,
		);
		const invoices = invoicesSnap.docs.map(
			(doc) => doc.data() as FirebaseInvoice,
		);
		const invoiceItems = invoiceItemsSnap.docs.map(
			(doc) => doc.data() as FirebaseInvoiceItem,
		);

		await db.transaction(async (tx) => {
			await tx.delete(InvoiceItem);
			await tx.delete(Invoice);
			await tx.delete(Contact);
			await tx.delete(Product);
			await tx.delete(User);

			// Type assertion needed because Firebase data may have extra fields
			// Cast through unknown to bypass type checking since we trust the backup data
			if (users.length > 0)
				await tx.insert(User).values(users as unknown as UserModel[]);
			if (contacts.length > 0)
				await tx.insert(Contact).values(contacts as unknown as ContactModel[]);
			if (products.length > 0)
				await tx.insert(Product).values(products as unknown as ProductModel[]);
			if (invoices.length > 0)
				await tx.insert(Invoice).values(invoices as unknown as InvoiceModel[]);
			if (invoiceItems.length > 0)
				await tx
					.insert(InvoiceItem)
					.values(invoiceItems as unknown as InvoiceItemModel[]);
		});

		console.log("Recovery Complete.");
		return true;
	},
};

// Define the background task globally
TaskManager.defineTask(BACKGROUND_BACKUP_TASK, async () => {
	try {
		console.log("Running background backup task...");
		const result = await SyncService.backupToCloud("auto");
		return result || BackgroundFetch.BackgroundFetchResult.NoData;
	} catch (error) {
		console.error("Background backup failed:", error);
		return BackgroundFetch.BackgroundFetchResult.Failed;
	}
});
