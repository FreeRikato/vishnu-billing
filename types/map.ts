/**
 * District statistics from backend (raw)
 */
export interface DistrictStats {
	district: string;
	totalInvoices: number;
	totalAmount: number; // Paise
	paidAmount: number; // Paise
	paidRatio: number; // 0 to 1
}

/**
 * Formatted district stats for UI display
 */
export interface DistrictStatsUI {
	district: string;
	totalInvoices: number;
	totalAmount: string; // Formatted currency (e.g., "₹1,234.56")
	paidAmount: string; // Formatted currency
	unpaidAmount: string; // Formatted currency
	paidRatio: number; // 0 to 1
	paidPercentage: string; // e.g., "75%"
}

/**
 * Map interaction state
 */
export interface MapInteraction {
	selectedDistrict: string | null;
	showDetail: boolean;
}

/**
 * Legend item for map
 */
export interface MapLegendItem {
	label: string;
	color: string;
	range: string;
}
