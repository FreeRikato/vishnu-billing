import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Helper functions (server-side)
function generateInitials(name: string): string {
	return name
		.split(" ")
		.map((w) => w.charAt(0).toUpperCase())
		.join("")
		.slice(0, 2);
}

function generateRandomHexColor(): string {
	const colors = [
		"#3B82F6",
		"#8B5CF6",
		"#F97316",
		"#10B981",
		"#14B8A6",
		"#F59E0B",
		"#EF4444",
		"#EC4899",
		"#6366F1",
		"#84CC16",
		"#06B6D4",
		"#64748B",
		"#F43F5E",
		"#A855F7",
		"#22C55E",
	];
	return colors[Math.floor(Math.random() * colors.length)];
}

export const list = query({
	handler: async (ctx) => {
		// Default to first 50 items for performance
		return await ctx.db.query("contacts").take(50);
	},
});

export const search = query({
	args: { query: v.string() },
	handler: async (ctx, args) => {
		if (!args.query.trim()) {
			// Return first 50 contacts when query is empty
			return await ctx.db.query("contacts").take(50);
		}

		// Use the search index with pagination for efficient search
		const results = await ctx.db
			.query("contacts")
			.withSearchIndex("search_name", (q) => q.search("name", args.query))
			.take(50);

		return results;
	},
});

export const get = query({
	args: { id: v.id("contacts") },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	},
});

export const create = mutation({
	args: {
		name: v.string(),
		phone: v.string(),
		address: v.string(),
		gstin: v.optional(v.string()),
		dlNo: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const initials = generateInitials(args.name);
		const color = generateRandomHexColor();

		const id = await ctx.db.insert("contacts", {
			name: args.name,
			phone: args.phone,
			initials,
			color,
			address: args.address,
			gstin: args.gstin ?? undefined,
			dlNo: args.dlNo ?? undefined,
		});

		return await ctx.db.get(id);
	},
});

export const update = mutation({
	args: {
		id: v.id("contacts"),
		name: v.optional(v.string()),
		phone: v.optional(v.string()),
		address: v.optional(v.string()),
		gstin: v.optional(v.string()),
		dlNo: v.optional(v.string()),
		color: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { id, ...updates } = args;

		const updateData: Record<string, unknown> = {};

		if (updates.name !== undefined) {
			updateData.name = updates.name;
			updateData.initials = generateInitials(updates.name);
		}
		if (updates.phone !== undefined) {
			updateData.phone = updates.phone;
		}
		if (updates.address !== undefined) {
			updateData.address = updates.address;
		}
		if (updates.gstin !== undefined) {
			updateData.gstin = updates.gstin;
		}
		if (updates.dlNo !== undefined) {
			updateData.dlNo = updates.dlNo;
		}
		if (updates.color !== undefined) {
			updateData.color = updates.color;
		}

		await ctx.db.patch(id, updateData);
		return await ctx.db.get(id);
	},
});

export const remove = mutation({
	args: { id: v.id("contacts") },
	handler: async (ctx, args) => {
		// Check for existing invoices first
		const existingInvoices = await ctx.db
			.query("invoices")
			.withIndex("by_customer", (q) => q.eq("customerId", args.id))
			.collect();

		if (existingInvoices.length > 0) {
			return {
				success: false,
				reason: "has_invoices" as const,
			};
		}

		await ctx.db.delete(args.id);
		return { success: true };
	},
});
