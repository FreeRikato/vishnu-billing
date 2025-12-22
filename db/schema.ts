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
	subtotal: real().notNull(),
	totalDiscount: real().notNull(),
	tax: real().notNull(),
	total: real().notNull(),
	date: text().notNull(),
	status: text().notNull().default("unpaid"),
	pdfPath: text(),
});

export const InvoiceItem = sqliteTable("invoice_item", {
	id: int().primaryKey({ autoIncrement: true }),
	invoiceId: int()
		.notNull()
		.references(() => Invoice.id),
	productId: int().references(() => Product.id),
	name: text().notNull(),
	description: text().notNull(),
	price: real().notNull(),
	quantity: int().notNull(),
	discountValue: real(),
	discountType: text(),
});
