import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const User = sqliteTable("user", {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
});

export const Product = sqliteTable("product", {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	price: int().notNull(), // Stored in cents (e.g., $10.50 = 1050)
	unit: text().notNull(),
});

export const Contact = sqliteTable("contact", {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	phone: text().notNull(),
	initials: text().notNull(),
	color: text().notNull(),
});

export const Invoice = sqliteTable("invoice", {
	id: int().primaryKey({ autoIncrement: true }),
	invoiceNumber: text().notNull().unique(),
	customerId: int()
		.notNull()
		.references(() => Contact.id),
	customerName: text().notNull(),
	customerPhone: text().notNull(),
	subtotal: int().notNull(), // Stored in cents
	totalDiscount: int().notNull(), // Stored in cents
	tax: int().notNull(), // Stored in cents
	total: int().notNull(), // Stored in cents
	amountPaid: int().notNull().default(0), // Stored in cents
	date: text().notNull(),
	status: text().notNull().default("unpaid"),
	pdfPath: text(),
	deletedAt: text(),
});

export const InvoiceItem = sqliteTable("invoice_item", {
	id: int().primaryKey({ autoIncrement: true }),
	invoiceId: int()
		.notNull()
		.references(() => Invoice.id),
	productId: int().references(() => Product.id),
	name: text().notNull(),
	description: text().notNull(),
	price: int().notNull(), // Stored in cents
	quantity: int().notNull(),
	discountValue: int(), // Stored in cents for fixed, or basis points for percent (e.g., 10% = 1000)
	discountType: text(),
});

export const SystemMeta = sqliteTable("system_meta", {
	key: text().primaryKey(),
	value: text().notNull(),
});
