import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { DistrictStatsUI } from "@/types/map";
import { formatCurrency } from "@/utils/currency";

export function useDistrictStats() {
	// Fetch district statistics from Convex
	const districtStats = useQuery(api.districtStats.getByDistrict) || [];
	const isLoading = districtStats === undefined;

	// Transform to UI format
	const districtStatsUI: DistrictStatsUI[] = districtStats.map((stats) => ({
		district: stats.district,
		totalInvoices: stats.totalInvoices,
		totalAmount: formatCurrency(stats.totalAmount),
		paidAmount: formatCurrency(stats.paidAmount),
		unpaidAmount: formatCurrency(stats.totalAmount - stats.paidAmount),
		paidRatio: stats.paidRatio,
		paidPercentage: `${Math.round(stats.paidRatio * 100)}%`,
	}));

	// Create a map for quick lookup
	const statsMap = new Map<string, DistrictStatsUI>(
		districtStatsUI.map((s) => [s.district, s]),
	);

	// Get stats for a specific district
	const getDistrictStats = (district: string): DistrictStatsUI | undefined => {
		return statsMap.get(district);
	};

	return {
		districtStats: districtStatsUI,
		statsMap,
		getDistrictStats,
		loading: isLoading,
	};
}
