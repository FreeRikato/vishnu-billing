import { router } from "expo-router";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	CreateInvoiceButton,
	HomeHeader,
	InvoiceStatsChart,
} from "@/components";
import { HOME_CONSTANTS } from "@/constants/home";
import { useInvoices } from "@/hooks/useInvoices";
import { useUser } from "@/hooks/useUser";
import { homeStyles } from "@/styles";
import { scale, verticalScale } from "@/utils/responsive";

export default function HomeScreen() {
	const { user, isLoading } = useUser();
	const { invoicesMap, loading: invoicesLoading } = useInvoices();

	// Convert invoicesMap to array for the chart
	const invoices = Object.values(invoicesMap);

	const handleCreateInvoice = () => {
		router.push("/invoice/create");
	};

	if (isLoading || invoicesLoading) {
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

	return (
		<SafeAreaView style={homeStyles.container} edges={["top", "left", "right"]}>
			<ScrollView showsVerticalScrollIndicator={false}>
				{/* Header Section */}
				<HomeHeader user={user} />

				{/* Content Area */}
				<View
					style={{
						flex: 1,
						paddingHorizontal: scale(24),
						gap: scale(20),
						paddingBottom: verticalScale(40),
					}}
				>
					{/* Create Invoice Button */}
					<CreateInvoiceButton onPress={handleCreateInvoice} />

					{/* Invoice Statistics Chart */}
					<InvoiceStatsChart invoices={invoices} />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
