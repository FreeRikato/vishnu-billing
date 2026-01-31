import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getSettings = query({
	handler: async (ctx) => {
		const settings = await ctx.db.query("systemMeta").collect();

		// Convert to key-value object
		const settingsMap: Record<string, string> = {};
		for (const setting of settings) {
			settingsMap[setting.key] = setting.value;
		}

		return settingsMap;
	},
});

export const getSetting = query({
	args: { key: v.string() },
	handler: async (ctx, args) => {
		const setting = await ctx.db
			.query("systemMeta")
			.withIndex("by_key", (q) => q.eq("key", args.key))
			.first();

		return setting?.value ?? null;
	},
});

export const updateSetting = mutation({
	args: {
		key: v.string(),
		value: v.string(),
	},
	handler: async (ctx, args) => {
		// Check if setting exists
		const existing = await ctx.db
			.query("systemMeta")
			.withIndex("by_key", (q) => q.eq("key", args.key))
			.first();

		if (existing) {
			// Update existing
			await ctx.db.patch(existing._id, { value: args.value });
		} else {
			// Create new
			await ctx.db.insert("systemMeta", {
				key: args.key,
				value: args.value,
			});
		}

		return { success: true };
	},
});

export const toggleSetting = mutation({
	args: { key: v.string() },
	handler: async (ctx, args) => {
		// Check if setting exists
		const existing = await ctx.db
			.query("systemMeta")
			.withIndex("by_key", (q) => q.eq("key", args.key))
			.first();

		const newValue = existing?.value === "true" ? "false" : "true";

		if (existing) {
			// Update existing
			await ctx.db.patch(existing._id, { value: newValue });
		} else {
			// Create new with default true
			await ctx.db.insert("systemMeta", {
				key: args.key,
				value: "true",
			});
		}

		return { success: true, value: newValue };
	},
});
