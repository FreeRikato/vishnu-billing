import { Alert, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@/hooks/useUser";
import { HOME_CONSTANTS } from "@/constants/home";
import { HomeHeader, CreateInvoiceButton } from "@/components";
import { homeStyles } from "@/styles";

export default function HomeScreen() {
	const { user, isLoading, error } = useUser(HOME_CONSTANTS.USER_ID);

	// Debug logging
	console.log("User data:", { user, isLoading, error });

	const handleCreateInvoice = () => {
		// TODO: Navigate to create invoice screen
		console.log("Create new invoice");
	};

	const handleSyncCloud = () => {
		const { title, message } = HOME_CONSTANTS.ALERT_MESSAGES.CLOUD_SYNC;
		Alert.alert(title, message);
	};

	if (isLoading) {
		return (
			<SafeAreaView style={homeStyles.container} edges={["top", "left", "right"]}>
				<ActivityIndicator size="large" color={HOME_CONSTANTS.STYLES.PRIMARY_COLOR} />
			</SafeAreaView>
		);
	}

	if (error) {
		return (
			<SafeAreaView style={homeStyles.container} edges={["top", "left", "right"]}>
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

			{/* Create Invoice Button */}
			<CreateInvoiceButton onPress={handleCreateInvoice} />
		</SafeAreaView>
	);
}
