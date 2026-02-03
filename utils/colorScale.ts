/**
 * Get color for district based on payment ratio
 * @param paidRatio - Payment ratio from 0 to 1
 * @param hasData - Whether the district has any invoice data
 * @returns Hex color string
 */
export function getDistrictColor(paidRatio: number, hasData: boolean): string {
	if (!hasData) {
		return "#2A2A2A"; // Gray for no data
	}

	const ratio = Math.max(0, Math.min(1, paidRatio));

	if (ratio >= 0.8) {
		return "#13EC6A"; // Green (80%+ paid)
	}
	if (ratio >= 0.5) {
		return "#84CC16"; // Light green (50-80%)
	}
	if (ratio >= 0.2) {
		return "#F59E0B"; // Yellow (20-50%)
	}
	return "#EF4444"; // Red (<20%)
}

/**
 * Legend color configuration
 */
export const MAP_LEGEND_COLORS = {
	fullPaid: "#13EC6A", // 100% paid
	mostlyPaid: "#84CC16", // 50-80% paid
	partiallyPaid: "#F59E0B", // 20-50% paid
	mostlyUnpaid: "#EF4444", // 0-20% paid
	noData: "#2A2A2A", // No invoices
} as const;
