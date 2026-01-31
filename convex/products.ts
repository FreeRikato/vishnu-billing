import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
	args: {
		includeDeleted: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		// Default to first 50 items for performance
		if (args.includeDeleted) {
			return await ctx.db.query("products").take(50);
		}
		// Use the by_deletedAt index for efficient filtering
		return await ctx.db
			.query("products")
			.withIndex("by_deletedAt")
			.filter((q) => q.eq(q.field("deletedAt"), undefined))
			.take(50);
	},
});

export const search = query({
	args: {
		query: v.string(),
		includeDeleted: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		if (!args.query.trim()) {
			// Return first 50 products when query is empty
			if (args.includeDeleted) {
				return await ctx.db.query("products").take(50);
			}
			return await ctx.db
				.query("products")
				.withIndex("by_deletedAt")
				.filter((q) => q.eq(q.field("deletedAt"), undefined))
				.take(50);
		}

		// Use the search index with pagination for efficient search
		const results = await ctx.db
			.query("products")
			.withSearchIndex("search_name", (q) => q.search("name", args.query))
			.take(50);

		// Filter by deletedAt if needed
		if (!args.includeDeleted) {
			return results.filter((p) => p.deletedAt === undefined);
		}
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
		// Soft delete by setting deletedAt to current timestamp
		const deletedAt = new Date().toISOString();
		await ctx.db.patch(args.id, { deletedAt });
		return { success: true };
	},
});
