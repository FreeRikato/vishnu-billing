import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Pie, PolarChart } from "victory-native";
import { useInvoiceStore } from "@/store/invoiceStore";
import { formatCurrency } from "@/utils/currency";

export function InvoiceStatsChart() {
	const invoices = useInvoiceStore((state) => state.invoices);

	// Calculate totals from store data
	const { paid, unpaid, total } = useMemo(() => {
		let paidCalc = 0;
		let totalCalc = 0;

		for (const inv of invoices) {
			paidCalc += inv.amountPaid || 0;
			totalCalc += inv.total || 0;
		}

		// Ensure strictly non-negative numbers
		const safePaid = Math.max(0, paidCalc);
		const safeTotal = Math.max(0, totalCalc);
		const safeUnpaid = Math.max(0, safeTotal - safePaid);

		return { paid: safePaid, unpaid: safeUnpaid, total: safeTotal };
	}, [invoices]);

	// Prepare data for Victory Native
	const chartData = useMemo(
		() => [
			{ value: paid, color: "#13EC6A", label: "Paid" }, // Green
			{ value: unpaid, color: "#EF4444", label: "Unpaid" }, // Red
		],
		[paid, unpaid],
	);

	// If no data exists, don't render anything
	if (total === 0) return null;

	return (
		<View style={styles.card}>
			<Text style={styles.title}>Payment Overview</Text>

			<View style={styles.contentContainer}>
				{/* Chart Section */}
				<View style={styles.chartContainer}>
					<PolarChart
						data={chartData}
						labelKey="label"
						valueKey="value"
						colorKey="color"
					>
						<Pie.Chart innerRadius="70%" />
					</PolarChart>

					{/* Center Text (Donut Hole) */}
					<View style={styles.centerTextContainer}>
						<Text style={styles.centerLabel}>Total</Text>
						<Text
							style={styles.centerValue}
							numberOfLines={1}
							adjustsFontSizeToFit
						>
							{formatCurrency(total)}
						</Text>
					</View>
				</View>

				{/* Legend Section */}
				<View style={styles.legendContainer}>
					{/* Paid Legend */}
					<View style={styles.legendItem}>
						<View style={[styles.dot, { backgroundColor: "#13EC6A" }]} />
						<View>
							<Text style={styles.legendLabel}>Paid</Text>
							<Text style={styles.legendValuePaid}>{formatCurrency(paid)}</Text>
						</View>
					</View>

					{/* Unpaid Legend */}
					<View style={styles.legendItem}>
						<View style={[styles.dot, { backgroundColor: "#EF4444" }]} />
						<View>
							<Text style={styles.legendLabel}>Due</Text>
							<Text style={styles.legendValueUnpaid}>
								{formatCurrency(unpaid)}
							</Text>
						</View>
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#1C1C1E", // Matches app card style
		borderRadius: 24,
		padding: 24,
		marginBottom: 8, // Spacing above the create button
	},
	title: {
		color: "#FFFFFF",
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 24,
	},
	contentContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: 20,
	},
	chartContainer: {
		width: 140,
		height: 140,
		position: "relative",
	},
	centerTextContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
		padding: 10,
	},
	centerLabel: {
		color: "#9CA3AF",
		fontSize: 12,
		fontWeight: "500",
		marginBottom: 2,
	},
	centerValue: {
		color: "#FFFFFF",
		fontSize: 14,
		fontWeight: "bold",
	},
	legendContainer: {
		flex: 1,
		gap: 20,
	},
	legendItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	dot: {
		width: 10,
		height: 10,
		borderRadius: 5,
		marginTop: 2,
	},
	legendLabel: {
		color: "#9CA3AF",
		fontSize: 13,
		fontWeight: "500",
		marginBottom: 2,
	},
	legendValuePaid: {
		color: "#13EC6A",
		fontSize: 18,
		fontWeight: "bold",
	},
	legendValueUnpaid: {
		color: "#EF4444",
		fontSize: 18,
		fontWeight: "bold",
	},
});
