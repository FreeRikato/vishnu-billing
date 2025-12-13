import { CreateInvoiceButton, HomeHeader } from "@/components";
import { HOME_CONSTANTS } from "@/constants/home";
import { useUser } from "@/hooks/useUser";
import { homeStyles } from "@/styles";
import { ActivityIndicator, Alert, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function HomeScreen() {
	const { user, isLoading, error } = useUser(HOME_CONSTANTS.USER_ID);

	const handleCreateInvoice = () => {
		router.push("/invoice/create");
	};

	const handleSyncCloud = () => {
		const { title, message } = HOME_CONSTANTS.ALERT_MESSAGES.CLOUD_SYNC;
		Alert.alert(title, message);
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

			{/* Create Invoice Button */}
			<CreateInvoiceButton onPress={handleCreateInvoice} />
		</SafeAreaView>
	);
}
