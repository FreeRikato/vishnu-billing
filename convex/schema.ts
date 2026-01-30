import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Shared validator for invoice items (embedded in Invoice)
const invoiceItemValidator = v.object({
	id: v.string(), // Unique identifier for the line item (used as key in UI)
	productId: v.optional(v.id("products")),
	name: v.string(),
	description: v.string(),
	price: v.number(), // Paise (integer)
	quantity: v.number(),
	discount: v.optional(
		v.object({
			value: v.number(), // Paise or basis points
			type: v.union(v.literal("flat"), v.literal("percent")),
		}),
	),
});

export default defineSchema({
	// Users
	users: defineTable({
		name: v.string(),
	}).index("by_name", ["name"]),

	// Contacts (Customers)
	contacts: defineTable({
		name: v.string(),
		phone: v.string(),
		initials: v.string(), // Auto-generated: first 2 chars
		color: v.string(), // Auto-generated: random hex
		address: v.string(),
		gstin: v.optional(v.string()),
		dlNo: v.optional(v.string()),
	})
		.index("by_name", ["name"])
		.searchIndex("search_name", { searchField: "name" }),

	// Products
	products: defineTable({
		name: v.string(),
		price: v.number(), // Paise
		unit: v.string(),
	})
		.index("by_name", ["name"])
		.searchIndex("search_name", { searchField: "name" }),

	// Invoices (with embedded items)
	invoices: defineTable({
		invoiceNumber: v.string(), // INV-{timestamp}-{random}
		customerId: v.id("contacts"),

		// Denormalized customer snapshot
		customerName: v.string(),
		customerPhone: v.string(),
		customerAddress: v.string(),
		customerGstin: v.optional(v.string()),
		customerDlNo: v.optional(v.string()),

		// Financials (all in paise)
		subtotal: v.number(),
		totalDiscount: v.number(),
		tax: v.number(),
		total: v.number(),
		amountPaid: v.number(),

		// Metadata
		date: v.string(), // ISO date string
		status: v.union(
			v.literal("unpaid"),
			v.literal("partial"),
			v.literal("paid"),
		),

		// Embedded items (CRITICAL: replaces InvoiceItem table)
		items: v.array(invoiceItemValidator),

		// PDF Storage
		pdfStorageId: v.optional(v.id("_storage")),

		// Soft delete
		deletedAt: v.optional(v.string()),
	})
		.index("by_customer", ["customerId"])
		.index("by_date", ["date"])
		.index("by_status", ["status"])
		.index("by_invoiceNumber", ["invoiceNumber"]),

	// System Meta
	systemMeta: defineTable({
		key: v.string(),
		value: v.string(),
	}).index("by_key", ["key"]),
});
