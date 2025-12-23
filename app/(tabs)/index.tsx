import { router } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	CreateInvoiceButton,
	HomeHeader,
	RecoverButton,
	SyncStatusIndicator,
} from "@/components";
import { HOME_CONSTANTS } from "@/constants/home";
import { useSync } from "@/hooks/useSync";
import { useUser } from "@/hooks/useUser";
import { homeStyles } from "@/styles";

export default function HomeScreen() {
	const { user, isLoading, error } = useUser();
	const {
		isSyncing,
		handleBackupToCloud,
		handleRecoverFromCloud,
		isRecoveryEnabled,
	} = useSync();

	const handleCreateInvoice = () => {
		router.push("/invoice/create");
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
			<HomeHeader user={user} onSyncCloud={handleBackupToCloud} />

			{/* Sync Status Indicator */}
			<SyncStatusIndicator isSyncing={isSyncing} />

			{/* Content Area */}
			<View style={{ flex: 1, paddingHorizontal: 24, gap: 20 }}>
				{/* Create Invoice Button */}
				<CreateInvoiceButton onPress={handleCreateInvoice} />

				{/* Developer Only Recover Button - Hidden by default */}
				<RecoverButton
					onRecover={handleRecoverFromCloud}
					enabled={isRecoveryEnabled}
				/>
			</View>
		</SafeAreaView>
	);
}
