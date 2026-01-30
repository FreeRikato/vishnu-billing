import { router } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	CreateInvoiceButton,
	HomeHeader,
	InvoiceStatsChart,
} from "@/components";
import { HOME_CONSTANTS } from "@/constants/home";
import { useUser } from "@/hooks/useUser";
import { homeStyles } from "@/styles";

export default function HomeScreen() {
	const { user, isLoading, error } = useUser();

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
			<ScrollView showsVerticalScrollIndicator={false}>
				{/* Header Section */}
				<HomeHeader user={user} />

				{/* Content Area */}
				<View
					style={{ flex: 1, paddingHorizontal: 24, gap: 20, paddingBottom: 40 }}
				>
					{/* Create Invoice Button */}
					<CreateInvoiceButton onPress={handleCreateInvoice} />

					{/* Invoice Statistics Chart */}
					<InvoiceStatsChart />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
