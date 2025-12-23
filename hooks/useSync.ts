import { useState } from "react";
import { Alert } from "react-native";
import { SyncService } from "@/services/syncService";
import { useContactStore } from "@/store/contactStore";
import { useInvoiceStore } from "@/store/invoiceStore";
import { useProductStore } from "@/store/productStore";

// Developer bypass configuration
const ENABLE_RECOVERY_MODE = false;

export function useSync() {
	const [isSyncing, setIsSyncing] = useState(false);

	// Get store refresh functions to update UI after recovery
	const refreshInvoices = useInvoiceStore((s) => s.refresh);
	const refreshContacts = useContactStore((s) => s.refresh);
	const refreshProducts = useProductStore((s) => s.refresh);

	const handleBackupToCloud = async () => {
		if (isSyncing) return;

		setIsSyncing(true);
		try {
			await SyncService.backupToCloud();
			Alert.alert("Cloud Sync", "Data successfully backed up to the cloud!");
		} catch (error) {
			Alert.alert(
				"Sync Failed",
				error instanceof Error ? error.message : "Unknown error",
			);
		} finally {
			setIsSyncing(false);
		}
	};

	const handleRecoverFromCloud = async () => {
		// Double check protection logic
		if (!ENABLE_RECOVERY_MODE) return;

		setIsSyncing(true);
		try {
			await SyncService.recoverFromCloud();
			// Refresh Zustand stores to show new data immediately
			await Promise.all([
				refreshInvoices(),
				refreshContacts(),
				refreshProducts(),
			]);
			Alert.alert(
				"Recovery Complete",
				"Local database has been restored from cloud.",
			);
		} catch (error) {
			Alert.alert(
				"Recovery Failed",
				error instanceof Error ? error.message : "Unknown error",
			);
		} finally {
			setIsSyncing(false);
		}
	};

	return {
		isSyncing,
		handleBackupToCloud,
		handleRecoverFromCloud,
		isRecoveryEnabled: ENABLE_RECOVERY_MODE,
	};
}
