// Export UI types as default (for use in components)
// Export Convex types with their original names for internal use
export type {
	Contact as ContactConvex,
	ContactUI as Contact,
	ContactUI,
} from "./contact";
// Export all other invoice types (InvoiceStatus, DiscountType, etc.)
export type {
	Customer,
	Discount,
	DiscountType,
	InvoiceDoc as InvoiceConvex,
	InvoiceId,
	InvoiceProduct,
	InvoiceStatus,
	InvoiceSummary,
	InvoiceUI as Invoice,
	InvoiceUI,
	InvoiceWithItems,
} from "./invoice";
export type {
	Product as ProductConvex,
	ProductUI as Product,
	ProductUI,
} from "./product";
export type { User as UserConvex, UserUI as User, UserUI } from "./user";
