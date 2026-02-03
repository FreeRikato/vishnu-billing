import { query } from "./_generated/server";

export interface DistrictStats {
	district: string;
	totalInvoices: number;
	totalAmount: number;
	paidAmount: number;
	paidRatio: number;
}

export const getByDistrict = query({
	args: {},
	handler: async (ctx): Promise<DistrictStats[]> => {
		// Get all non-deleted invoices
		const invoices = await ctx.db
			.query("invoices")
			.withIndex("by_deletedAt")
			.filter((q) => q.eq(q.field("deletedAt"), undefined))
			.collect();

		// Group by customer's district
		const districtMap = new Map<string, DistrictStats>();

		for (const invoice of invoices) {
			// Get customer contact to find district
			const contact = await ctx.db.get(invoice.customerId);
			if (!contact || !contact.district) continue;

			const district = contact.district;

			if (!districtMap.has(district)) {
				districtMap.set(district, {
					district,
					totalInvoices: 0,
					totalAmount: 0,
					paidAmount: 0,
					paidRatio: 0,
				});
			}

			const stats = districtMap.get(district);
			if (stats) {
				stats.totalInvoices += 1;
				stats.totalAmount += invoice.total;
				stats.paidAmount += invoice.amountPaid || 0;
			}
		}

		// Calculate paidRatio
		const result = Array.from(districtMap.values());
		for (const stats of result) {
			stats.paidRatio =
				stats.totalAmount > 0 ? stats.paidAmount / stats.totalAmount : 0;
		}

		return result;
	},
});
