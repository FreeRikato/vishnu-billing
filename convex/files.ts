import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
	handler: async (ctx) => {
		return await ctx.storage.generateUploadUrl();
	},
});

export const attachPdfToInvoice = mutation({
	args: {
		invoiceId: v.id("invoices"),
		storageId: v.id("_storage"),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.invoiceId, {
			pdfStorageId: args.storageId,
		});
		return { success: true };
	},
});

export const getInvoicePdfUrl = query({
	args: { invoiceId: v.id("invoices") },
	handler: async (ctx, args) => {
		const invoice = await ctx.db.get(args.invoiceId);
		if (!invoice?.pdfStorageId) return null;
		return await ctx.storage.getUrl(invoice.pdfStorageId);
	},
});
