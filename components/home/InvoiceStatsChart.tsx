import { useMemo } from "react";
import { Text, View } from "react-native";
import { Pie, PolarChart } from "victory-native";
import { useInvoiceStore } from "@/store/invoiceStore";
import { homeStyles } from "@/styles/home";
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
		<View style={homeStyles.chartCard}>
			<Text style={homeStyles.chartTitle}>Payment Overview</Text>

			<View style={homeStyles.chartContentContainer}>
				{/* Chart Section */}
				<View style={homeStyles.chartContainer}>
					<PolarChart
						data={chartData}
						labelKey="label"
						valueKey="value"
						colorKey="color"
					>
						<Pie.Chart innerRadius="70%" />
					</PolarChart>

					{/* Center Text (Donut Hole) */}
					<View style={homeStyles.centerTextContainer}>
						<Text style={homeStyles.centerLabel}>Total</Text>
						<Text
							style={homeStyles.centerValue}
							numberOfLines={1}
							adjustsFontSizeToFit
						>
							{formatCurrency(total)}
						</Text>
					</View>
				</View>

				{/* Legend Section */}
				<View style={homeStyles.legendContainer}>
					{/* Paid Legend */}
					<View style={homeStyles.legendItem}>
						<View
							style={[homeStyles.legendDot, { backgroundColor: "#13EC6A" }]}
						/>
						<View>
							<Text style={homeStyles.legendLabel}>Paid</Text>
							<Text style={homeStyles.legendValuePaid}>
								{formatCurrency(paid)}
							</Text>
						</View>
					</View>

					{/* Unpaid Legend */}
					<View style={homeStyles.legendItem}>
						<View
							style={[homeStyles.legendDot, { backgroundColor: "#EF4444" }]}
						/>
						<View>
							<Text style={homeStyles.legendLabel}>Due</Text>
							<Text style={homeStyles.legendValueUnpaid}>
								{formatCurrency(unpaid)}
							</Text>
						</View>
					</View>
				</View>
			</View>
		</View>
	);
}
