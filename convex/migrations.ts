import { mutation } from "./_generated/server";

/**
 * TEMPORARY MIGRATION TRIGGER
 *
 * This function triggers the addInvoiceItemIds migration to add missing `id` fields
 * to all existing invoice items in the database.
 *
 * IMPORTANT: After running this migration successfully, delete this file.
 *
 * TO RUN:
 * 1. Run `npx convex dev`
 * 2. Go to Convex Dashboard: https://dashboard.convex.dev
 * 3. Navigate to your project
 * 4. Go to Functions → migrations → runAddInvoiceItemIdsMigration
 * 5. Click "Run Function"
 * 6. Verify the result shows updatedCount > 0
 * 7. DELETE THIS FILE after successful migration
 */
export const runAddInvoiceItemIdsMigration = mutation({
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
			success: true,
			updatedCount,
			totalItemsUpdated,
			totalInvoices: invoices.length,
			message: `Updated ${updatedCount} invoices with ${totalItemsUpdated} items.`,
		};
	},
});
