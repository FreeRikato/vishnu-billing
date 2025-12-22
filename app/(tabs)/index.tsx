import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreateInvoiceButton, HomeHeader } from "@/components";
import { HOME_CONSTANTS } from "@/constants/home";
import { useUser } from "@/hooks/useUser";
import { SyncService } from "@/services/syncService";
import { useContactStore } from "@/store/contactStore";
import { useInvoiceStore } from "@/store/invoiceStore";
import { useProductStore } from "@/store/productStore";
import { homeStyles } from "@/styles";

// ---------------------------------------------------------
// DEVELOPER BYPASS CONFIGURATION
// Change this to 'true' to enable the Recover button in the UI
const ENABLE_RECOVERY_MODE = false;
// ---------------------------------------------------------

export default function HomeScreen() {
	const { user, isLoading, error } = useUser();
	const [isSyncing, setIsSyncing] = useState(false);

	// Get store refresh functions to update UI after recovery
	const refreshInvoices = useInvoiceStore((s) => s.refresh);
	const refreshContacts = useContactStore((s) => s.refresh);
	const refreshProducts = useProductStore((s) => s.refresh);

	const handleCreateInvoice = () => {
		router.push("/invoice/create");
	};

	const handleSyncCloud = async () => {
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

	const handleRecover = async () => {
		// Double check protection logic
		if (!ENABLE_RECOVERY_MODE) return;

		Alert.alert(
			"⚠️ DANGER ZONE",
			"This will WIPE all local data and replace it with the cloud backup. This cannot be undone. Are you absolutely sure?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Overwrite Local Data",
					style: "destructive",
					onPress: async () => {
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
					},
				},
			],
		);
	};

	if (isLoading) {
		return (
			<SafeAreaView
				style={homeStyles.container}
				edges={["top", "left", "right"]}
			>
				<ActivityIndicator
					size="large"
					color={HOME_CONSTANTS.STYLES.PRIMARY_COLOR}
				/>
			</SafeAreaView>
		);
	}

	if (error) {
		return (
			<SafeAreaView
				style={homeStyles.container}
				edges={["top", "left", "right"]}
			>
				<Text style={homeStyles.errorText}>
					Failed to load user data: {error.message}
				</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={homeStyles.container} edges={["top", "left", "right"]}>
			{/* Header Section */}
			<HomeHeader user={user} onSyncCloud={handleSyncCloud} />

			{/* Sync Status Indicator */}
			{isSyncing && (
				<View style={localStyles.syncIndicator}>
					<ActivityIndicator size="small" color="#13EC6A" />
					<Text style={localStyles.syncText}>Syncing with Cloud...</Text>
				</View>
			)}

			{/* Content Area */}
			<View style={{ flex: 1, paddingHorizontal: 24, gap: 20 }}>
				{/* Create Invoice Button */}
				<CreateInvoiceButton onPress={handleCreateInvoice} />

				{/* Developer Only Recover Button - Hidden by default */}
				<View
					style={[
						localStyles.devSection,
						!ENABLE_RECOVERY_MODE && localStyles.hidden,
					]}
				>
					<TouchableOpacity
						style={[
							localStyles.recoverButton,
							!ENABLE_RECOVERY_MODE && localStyles.recoverButtonDisabled,
						]}
						onPress={handleRecover}
						activeOpacity={ENABLE_RECOVERY_MODE ? 0.7 : 1}
						disabled={!ENABLE_RECOVERY_MODE}
					>
						<MaterialIcons
							name="restore-page"
							size={24}
							color={ENABLE_RECOVERY_MODE ? "#EF4444" : "#555"}
						/>
						<View>
							<Text
								style={[
									localStyles.recoverText,
									!ENABLE_RECOVERY_MODE && localStyles.recoverTextDisabled,
								]}
							>
								Recover from Cloud
							</Text>
							{!ENABLE_RECOVERY_MODE && (
								<Text style={localStyles.devNote}>
									(Disabled: Code Bypass Required)
								</Text>
							)}
						</View>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
}

const localStyles = StyleSheet.create({
	syncIndicator: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 8,
		gap: 8,
		backgroundColor: "rgba(19, 236, 106, 0.1)",
	},
	syncText: {
		color: "#13EC6A",
		fontSize: 14,
		fontWeight: "600",
	},
	hidden: {
		display: "none",
	},
	devSection: {
		marginTop: 20,
		borderTopWidth: 1,
		borderTopColor: "#222",
		paddingTop: 20,
	},
	recoverButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 12,
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#EF4444",
		backgroundColor: "rgba(239, 68, 68, 0.1)",
	},
	recoverButtonDisabled: {
		borderColor: "#333",
		backgroundColor: "#1A1A1A",
	},
	recoverText: {
		color: "#EF4444",
		fontSize: 16,
		fontWeight: "bold",
	},
	recoverTextDisabled: {
		color: "#555",
	},
	devNote: {
		fontSize: 10,
		color: "#555",
		marginTop: 2,
	},
});
