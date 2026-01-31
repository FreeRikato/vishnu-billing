import { internalMutation } from "../_generated/server";

export const addInvoiceItemIds = internalMutation({
	handler: async (ctx) => {
		const invoices = await ctx.db.query("invoices").collect();

		let updatedCount = 0;
		let totalItemsUpdated = 0;

		for (const invoice of invoices) {
			// Check if any items are missing IDs
			const needsUpdate = invoice.items.some((item) => !item.id);

			if (needsUpdate) {
				const itemsWithIds = invoice.items.map((item, index) => ({
					...item,
					id: item.id || `item-${invoice._id}-${index}`,
				}));

				await ctx.db.patch(invoice._id, { items: itemsWithIds });
				updatedCount++;
				totalItemsUpdated += itemsWithIds.length;
			}
		}

		return {
			updatedCount,
			totalItemsUpdated,
			totalInvoices: invoices.length,
		};
	},
});
