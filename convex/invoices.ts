import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Status calculation helper
function calculateStatus(
	amountPaid: number,
	total: number,
): "unpaid" | "partial" | "paid" {
	if (amountPaid >= total) return "paid";
	if (amountPaid > 0) return "partial";
	return "unpaid";
}

// Invoice number generation
function generateInvoiceNumber(): string {
	const timestamp = Date.now();
	const random = Math.floor(Math.random() * 10000)
		.toString()
		.padStart(4, "0");
	return `INV-${timestamp}-${random}`;
}

export const list = query({
	handler: async (ctx) => {
		// Use the by_deletedAt index for efficient filtering
		// Default to first 50 non-deleted invoices for performance
		const results = await ctx.db
			.query("invoices")
			.withIndex("by_deletedAt")
			.filter((q) => q.eq(q.field("deletedAt"), undefined))
			.take(50);

		return results;
	},
});

export const search = query({
	args: {
		query: v.string(),
		status: v.optional(
			v.union(v.literal("unpaid"), v.literal("partial"), v.literal("paid")),
		),
	},
	handler: async (ctx, args) => {
		if (!args.query.trim()) {
			// Return first 50 non-deleted invoices when no query
			const results = await ctx.db
				.query("invoices")
				.withIndex("by_deletedAt")
				.filter((q) => q.eq(q.field("deletedAt"), undefined))
				.take(50);
			return results;
		}

		// Use search index for efficient full-text search on customerName
		// This avoids full table scan and scales to large datasets
		const results = await ctx.db
			.query("invoices")
			.withSearchIndex("search_customerName", (q) =>
				q.search("customerName", args.query),
			)
			.filter((q) => q.eq(q.field("deletedAt"), undefined))
			.take(50);

		// Filter by status if provided
		if (args.status) {
			return results.filter((inv) => inv.status === args.status);
		}

		return results;
	},
});

export const get = query({
	args: { id: v.id("invoices") },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	},
});

export const getByNumber = query({
	args: { invoiceNumber: v.string() },
	handler: async (ctx, args) => {
		const invoices = await ctx.db
			.query("invoices")
			.withIndex("by_invoiceNumber", (q) =>
				q.eq("invoiceNumber", args.invoiceNumber),
			)
			.collect();

		return invoices[0] ?? null;
	},
});

export const create = mutation({
	args: {
		customerId: v.id("contacts"),
		customerName: v.string(),
		customerPhone: v.string(),
		customerAddress: v.string(),
		customerGstin: v.optional(v.string()),
		customerDlNo: v.optional(v.string()),
		subtotal: v.number(), // Paise
		totalDiscount: v.number(), // Paise
		tax: v.number(), // Paise
		total: v.number(), // Paise
		amountPaid: v.number(), // Paise
		date: v.string(), // ISO date string
		items: v.array(
			v.object({
				id: v.optional(v.string()), // Optional line item ID
				productId: v.optional(v.id("products")),
				name: v.string(),
				description: v.string(),
				price: v.number(), // Paise
				quantity: v.number(),
				discount: v.optional(
					v.object({
						value: v.number(), // Paise or basis points
						type: v.union(v.literal("flat"), v.literal("percent")),
					}),
				),
			}),
		),
	},
	handler: async (ctx, args) => {
		const invoiceNumber = generateInvoiceNumber();
		const status = calculateStatus(args.amountPaid, args.total);

		// Add id field to items if not present
		const itemsWithIds = args.items.map((item, index) => ({
			...item,
			id: item.id || `item-${Date.now()}-${index}`,
		}));

		const id = await ctx.db.insert("invoices", {
			invoiceNumber,
			customerId: args.customerId,
			customerName: args.customerName,
			customerPhone: args.customerPhone,
			customerAddress: args.customerAddress,
			customerGstin: args.customerGstin ?? undefined,
			customerDlNo: args.customerDlNo ?? undefined,
			subtotal: args.subtotal,
			totalDiscount: args.totalDiscount,
			tax: args.tax,
			total: args.total,
			amountPaid: args.amountPaid,
			date: args.date,
			status,
			items: itemsWithIds,
		});

		return await ctx.db.get(id);
	},
});

export const updateStatus = mutation({
	args: {
		id: v.id("invoices"),
		status: v.union(
			v.literal("unpaid"),
			v.literal("partial"),
			v.literal("paid"),
		),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.id, { status: args.status });
		return { success: true };
	},
});

export const updatePayment = mutation({
	args: {
		id: v.id("invoices"),
		amountPaid: v.number(), // Paise
	},
	handler: async (ctx, args) => {
		// First get the invoice to know the total
		const invoice = await ctx.db.get(args.id);
		if (!invoice) {
			return { success: false };
		}

		// Ensure amountPaid is not negative
		const cleanAmountPaid = Math.max(0, args.amountPaid);

		// Calculate new status
		const newStatus = calculateStatus(cleanAmountPaid, invoice.total);

		// Perform update
		await ctx.db.patch(args.id, {
			amountPaid: cleanAmountPaid,
			status: newStatus,
		});

		return {
			success: true,
			newStatus,
			newAmountPaid: cleanAmountPaid,
		};
	},
});

export const attachPdf = mutation({
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

export const remove = mutation({
	args: { id: v.id("invoices") },
	handler: async (ctx, args) => {
		// Soft delete by setting deletedAt to current timestamp
		const deletedAt = new Date().toISOString();
		await ctx.db.patch(args.id, { deletedAt });
		return { success: true };
	},
});
