import type { Doc, Id } from "@/convex/_generated/dataModel";

// Type alias for Convex Product document
export type Product = Doc<"products">;

// Type alias for Product ID
export type ProductId = Id<"products">;

// Product type for UI components (with id instead of _id)
export type ProductUI = Omit<Product, "_id" | "_creationTime"> & {
	id: string; // Map _id to id for UI components
};
