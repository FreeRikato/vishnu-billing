import { Suspense } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Pie, PolarChart } from "victory-native";
import { homeStyles } from "@/styles/home";
import type { InvoiceDoc } from "@/types/invoice";
import { formatCurrency } from "@/utils/currency";

interface InvoiceStatsChartProps {
	invoices: InvoiceDoc[];
}

// Loading component for Suspense fallback
function ChartLoader() {
	return (
		<View style={[homeStyles.chartContainer, { justifyContent: "center" }]}>
			<ActivityIndicator size="small" color="#13EC6A" />
		</View>
	);
}

export function InvoiceStatsChart({ invoices }: InvoiceStatsChartProps) {
	// Calculate totals from store data
	let paidCalc = 0;
	let totalCalc = 0;

	for (const inv of invoices) {
		paidCalc += inv.amountPaid || 0;
		totalCalc += inv.total || 0;
	}

	// Ensure strictly non-negative numbers
	const paid = Math.max(0, paidCalc);
	const total = Math.max(0, totalCalc);
	const unpaid = Math.max(0, total - paid);

	// Prepare data for Victory Native
	const chartData = [
		{ value: paid, color: "#13EC6A", label: "Paid" }, // Green
		{ value: unpaid, color: "#EF4444", label: "Unpaid" }, // Red
	];

	// If no data exists, don't render anything
	if (total === 0) return null;

	return (
		<View style={homeStyles.chartCard}>
			<Text style={homeStyles.chartTitle}>Payment Overview</Text>

			<View style={homeStyles.chartContentContainer}>
				{/* Chart Section */}
				<Suspense fallback={<ChartLoader />}>
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
				</Suspense>

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
