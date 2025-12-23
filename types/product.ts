import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { Product as ProductSchema } from "@/db/schema";

// Infer Product type from Drizzle schema
export type Product = InferSelectModel<typeof ProductSchema>;

// Type for creating a new product (excludes auto-generated id)
export type NewProduct = InferInsertModel<typeof ProductSchema>;
