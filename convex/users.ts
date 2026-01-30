import { query, mutation } from "./_generated/server";

export const getCurrent = query({
	handler: async (ctx) => {
		const users = await ctx.db.query("users").take(1);
		return users[0] ?? null;
	},
});

export const ensureDefault = mutation({
	handler: async (ctx) => {
		const existing = await ctx.db.query("users").take(1);
		if (existing.length > 0) return existing[0];

		const id = await ctx.db.insert("users", { name: "User" });
		return await ctx.db.get(id);
	},
});
