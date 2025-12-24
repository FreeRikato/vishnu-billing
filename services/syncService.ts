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
type FirebaseData<T> = Record<string, unknown> & Partial<T>;

interface FirebaseUser extends FirebaseData<User> {}
interface FirebaseContact extends FirebaseData<Contact> {}
interface FirebaseProduct extends FirebaseData<Product> {}
interface FirebaseInvoice extends FirebaseData<Invoice> {}
interface FirebaseInvoiceItem extends FirebaseData<InvoiceItem> {}

// Hardcoded ID for this example since there is no Auth system.
// In production, this should be derived from the authenticated user ID
const DEVICE_BACKUP_ID = "user_device_backup";
const BACKGROUND_BACKUP_TASK = "BACKGROUND_AUTO_BACKUP";

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

		// 2. Create a batch write for efficiency
		// Firestore allows up to 500 operations per batch
		const batch = writeBatch(firestore);

		// Metadata document with timestamp
		const metaRef = doc(
			collection(firestore, "backups", DEVICE_BACKUP_ID, "meta"),
		);
		batch.set(metaRef, {
			lastUpdated: Timestamp.now(),
			backupType: type,
			version: "2.0",
			timestamp: Date.now(),
		});

		// Clear existing collections first
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
			snapshot.forEach((doc) => {
				batch.delete(doc.ref);
			});
		}

		// Add users
		users.forEach((user) => {
			const docRef = doc(
				collection(firestore, "backups", DEVICE_BACKUP_ID, "users"),
				user.id.toString(),
			);
			batch.set(docRef, user);
		});

		// Add contacts
		contacts.forEach((contact) => {
			const docRef = doc(
				collection(firestore, "backups", DEVICE_BACKUP_ID, "contacts"),
				contact.id.toString(),
			);
			batch.set(docRef, contact);
		});

		// Add products
		products.forEach((product) => {
			const docRef = doc(
				collection(firestore, "backups", DEVICE_BACKUP_ID, "products"),
				product.id.toString(),
			);
			batch.set(docRef, product);
		});

		// Add invoices
		invoices.forEach((invoice) => {
			const docRef = doc(
				collection(firestore, "backups", DEVICE_BACKUP_ID, "invoices"),
				invoice.id.toString(),
			);
			batch.set(docRef, invoice);
		});

		// Add invoice items
		invoiceItems.forEach((item) => {
			const docRef = doc(
				collection(firestore, "backups", DEVICE_BACKUP_ID, "invoice_items"),
				item.id.toString(),
			);
			batch.set(docRef, item);
		});

		// Commit the batch
		await batch.commit();

		// 3. Update Metadata
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

			if (users.length > 0) await tx.insert(User).values(users as User[]);
			if (contacts.length > 0)
				await tx.insert(Contact).values(contacts as Contact[]);
			if (products.length > 0)
				await tx.insert(Product).values(products as Product[]);
			if (invoices.length > 0)
				await tx.insert(Invoice).values(invoices as Invoice[]);
			if (invoiceItems.length > 0)
				await tx.insert(InvoiceItem).values(invoiceItems as InvoiceItem[]);
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
