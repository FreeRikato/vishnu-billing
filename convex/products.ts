import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
	handler: async (ctx) => {
		return await ctx.db.query("products").collect();
	},
});

export const search = query({
	args: { query: v.string() },
	handler: async (ctx, args) => {
		if (!args.query.trim()) {
			return await ctx.db.query("products").collect();
		}

		// Use the search index
		const results = await ctx.db
			.query("products")
			.withSearchIndex("search_name", (q) => q.search("name", args.query))
			.collect();

		return results;
	},
});

export const get = query({
	args: { id: v.id("products") },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	},
});

export const create = mutation({
	args: {
		name: v.string(),
		price: v.number(), // Paise
		unit: v.string(),
	},
	handler: async (ctx, args) => {
		const id = await ctx.db.insert("products", {
			name: args.name,
			price: args.price,
			unit: args.unit,
		});

		return await ctx.db.get(id);
	},
});

export const update = mutation({
	args: {
		id: v.id("products"),
		name: v.optional(v.string()),
		price: v.optional(v.number()), // Paise
		unit: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { id, ...updates } = args;

		await ctx.db.patch(id, updates);
		return await ctx.db.get(id);
	},
});

export const remove = mutation({
	args: { id: v.id("products") },
	handler: async (ctx, args) => {
		// Check if product is used in any invoices
		const invoices = await ctx.db.query("invoices").collect();
		const productInUse = invoices.some((invoice) =>
			invoice.items.some((item) =>
				item.productId ? item.productId === args.id : false,
			),
		);

		if (productInUse) {
			return {
				success: false,
				reason: "in_use" as const,
			};
		}

		await ctx.db.delete(args.id);
		return { success: true };
	},
});
