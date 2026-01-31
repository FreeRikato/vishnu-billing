import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
	handler: async (ctx) => {
		// Default to first 50 items for performance
		return await ctx.db.query("products").take(50);
	},
});

export const search = query({
	args: { query: v.string() },
	handler: async (ctx, args) => {
		if (!args.query.trim()) {
			// Return first 50 products when query is empty
			return await ctx.db.query("products").take(50);
		}

		// Use the search index with pagination for efficient search
		const results = await ctx.db
			.query("products")
			.withSearchIndex("search_name", (q) => q.search("name", args.query))
			.take(50);

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
		// Simple deletion - product usage tracking can be added later if needed
		await ctx.db.delete(args.id);
		return { success: true };
	},
});
