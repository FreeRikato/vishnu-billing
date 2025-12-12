import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const User = sqliteTable("user", {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
});

export const Product = sqliteTable("product", {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	price: real().notNull(),
	unit: text().notNull(),
});
