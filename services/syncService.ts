import NetInfo from "@react-native-community/netinfo";
import { eq } from "drizzle-orm";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
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

// Hardcoded ID for this example since there is no Auth system.
const BACKUP_DOC_ID = "user_device_backup";
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
	 * Uploads all local SQLite data to Firestore
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

		const backupData = {
			users,
			contacts,
			products,
			invoices,
			invoiceItems,
			lastUpdated: Timestamp.now(),
			backupType: type,
			version: "1.0",
		};

		// 2. Upload to Firestore
		await setDoc(doc(firestore, "backups", BACKUP_DOC_ID), backupData);

		// 3. Update Metadata
		if (type === "auto") {
			await this.setMeta("last_auto_backup_date", today);
			return BackgroundFetch.BackgroundFetchResult.NewData;
		} else {
			// Manual: Increment count and set date
			// This logic is now safe because currentManualCount is scoped correctly
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
	 * Downloads data from Firestore and replaces local SQLite data
	 */
	async recoverFromCloud() {
		if (!(await this.isOnline())) {
			throw new Error("No internet connection available for recovery.");
		}

		console.log("Starting Recovery...");

		const docRef = doc(firestore, "backups", BACKUP_DOC_ID);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			throw new Error("No backup found in cloud.");
		}

		const data = docSnap.data();

		await db.transaction(async (tx) => {
			await tx.delete(InvoiceItem);
			await tx.delete(Invoice);
			await tx.delete(Contact);
			await tx.delete(Product);
			await tx.delete(User);

			if (data.users?.length) await tx.insert(User).values(data.users);
			if (data.products?.length) await tx.insert(Product).values(data.products);
			if (data.contacts?.length) await tx.insert(Contact).values(data.contacts);
			if (data.invoices?.length) await tx.insert(Invoice).values(data.invoices);
			if (data.invoiceItems?.length)
				await tx.insert(InvoiceItem).values(data.invoiceItems);
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
