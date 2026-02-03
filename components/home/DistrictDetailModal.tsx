import { MaterialIcons } from "@expo/vector-icons";
import { Suspense } from "react";
import {
	ActivityIndicator,
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pie, PolarChart } from "victory-native";
import { homeStyles } from "@/styles/home";
import type { DistrictStatsUI } from "@/types/map";

interface DistrictDetailModalProps {
	visible: boolean;
	district: string;
	stats?: DistrictStatsUI;
	onClose: () => void;
}

export default function DistrictDetailModal({
	visible,
	district,
	stats,
	onClose,
}: DistrictDetailModalProps) {
	if (!stats) return null;

	// Prepare chart data for Victory Native
	const chartData = [
		{
			value: parseFloat(stats.paidAmount.replace(/[₹,]/g, "")),
			color: "#13EC6A",
			label: "Paid",
		},
		{
			value: parseFloat(stats.unpaidAmount.replace(/[₹,]/g, "")),
			color: "#EF4444",
			label: "Unpaid",
		},
	];

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={onClose}
		>
			<SafeAreaView style={modalStyles.overlay}>
				<View style={homeStyles.modalContainer}>
					{/* Header */}
					<View style={homeStyles.modalHeader}>
						<Text style={homeStyles.modalTitle}>{district}</Text>
						<TouchableOpacity onPress={onClose}>
							<MaterialIcons name="close" size={24} color="#FFFFFF" />
						</TouchableOpacity>
					</View>

					{/* Stats Summary */}
					<View style={modalStyles.statsRow}>
						<View style={modalStyles.statItem}>
							<Text style={modalStyles.statLabel}>Total Invoices</Text>
							<Text style={modalStyles.statValue}>{stats.totalInvoices}</Text>
						</View>
						<View style={modalStyles.statItem}>
							<Text style={modalStyles.statLabel}>Collection Rate</Text>
							<Text style={[modalStyles.statValue, modalStyles.accent]}>
								{stats.paidPercentage}
							</Text>
						</View>
					</View>

					{/* Pie Chart */}
					<Text style={modalStyles.sectionTitle}>Payment Breakdown</Text>
					<View style={modalStyles.chartContainer}>
						<Suspense
							fallback={<ActivityIndicator size="small" color="#13EC6A" />}
						>
							<PolarChart
								data={chartData}
								labelKey="label"
								valueKey="value"
								colorKey="color"
							>
								<Pie.Chart />
							</PolarChart>
						</Suspense>
					</View>

					{/* Amounts */}
					<View style={modalStyles.amountRow}>
						<Text style={modalStyles.amountLabel}>Paid: </Text>
						<Text style={[modalStyles.amountValue, { color: "#13EC6A" }]}>
							{stats.paidAmount}
						</Text>
					</View>
					<View style={modalStyles.amountRow}>
						<Text style={modalStyles.amountLabel}>Unpaid: </Text>
						<Text style={[modalStyles.amountValue, { color: "#EF4444" }]}>
							{stats.unpaidAmount}
						</Text>
					</View>

					{/* Close Button */}
					<TouchableOpacity
						style={[homeStyles.applyButton, modalStyles.closeBtn]}
						onPress={onClose}
					>
						<Text style={homeStyles.applyButtonText}>Close</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</Modal>
	);
}

const modalStyles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
	},
	statsRow: {
		flexDirection: "row",
		justifyContent: "space-around",
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#2A2A2A",
	},
	statItem: {
		alignItems: "center",
	},
	statLabel: {
		color: "#9CA3AF",
		fontSize: 12,
		marginBottom: 4,
	},
	statValue: {
		color: "#FFFFFF",
		fontSize: 20,
		fontWeight: "bold",
	},
	accent: {
		color: "#13EC6A",
	},
	sectionTitle: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "bold",
		marginTop: 16,
		marginBottom: 8,
	},
	chartContainer: {
		alignItems: "center",
		paddingVertical: 20,
		minHeight: 200,
	},
	amountRow: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 4,
	},
	amountLabel: {
		color: "#9CA3AF",
		fontSize: 14,
	},
	amountValue: {
		fontSize: 16,
		fontWeight: "bold",
		marginLeft: 8,
	},
	closeBtn: {
		marginTop: 16,
	},
});
