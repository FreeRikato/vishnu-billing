import { eq, like } from "drizzle-orm";
import { db } from "@/db/client";
import { InvoiceItem, Product } from "@/db/schema";
import type { Product as ProductType } from "@/types";

export async function getAllProducts(): Promise<ProductType[]> {
	try {
		const products = await db.select().from(Product);
		return products;
	} catch (error) {
		console.error("Error fetching products:", error);
		return [];
	}
}

export async function searchProducts(query: string): Promise<ProductType[]> {
	try {
		if (!query.trim()) {
			return getAllProducts();
		}

		const products = await db
			.select()
			.from(Product)
			.where(like(Product.name, `%${query}%`));

		return products;
	} catch (error) {
		console.error("Error searching products:", error);
		return [];
	}
}

export async function getProductById(id: number): Promise<ProductType | null> {
	try {
		const products = await db
			.select()
			.from(Product)
			.where(eq(Product.id, id))
			.limit(1);

		return products[0] || null;
	} catch (error) {
		console.error("Error fetching product by ID:", error);
		return null;
	}
}

export async function createProduct(
	product: Omit<ProductType, "id">,
): Promise<ProductType | null> {
	try {
		const result = await db
			.insert(Product)
			.values({
				name: product.name,
				price: product.price,
				unit: product.unit,
			})
			.returning();

		return result[0] || null;
	} catch (error) {
		console.error("Error creating product:", error);
		return null;
	}
}

export async function updateProduct(
	id: number,
	product: Partial<Omit<ProductType, "id">>,
): Promise<ProductType | null> {
	try {
		const result = await db
			.update(Product)
			.set({
				...(product.name && { name: product.name }),
				...(product.price !== undefined && { price: product.price }),
				...(product.unit && { unit: product.unit }),
			})
			.where(eq(Product.id, id))
			.returning();

		return result[0] || null;
	} catch (error) {
		console.error("Error updating product:", error);
		return null;
	}
}

export async function deleteProduct(id: number): Promise<{
	success: boolean;
	reason?: "in_use" | "error";
}> {
	try {
		// Check if product is used in any invoice items
		const usage = await db
			.select()
			.from(InvoiceItem)
			.where(eq(InvoiceItem.productId, id))
			.limit(1);

		if (usage.length > 0) {
			return { success: false, reason: "in_use" };
		}

		await db.delete(Product).where(eq(Product.id, id));
		return { success: true };
	} catch (error) {
		console.error("Error deleting product:", error);
		return { success: false, reason: "error" };
	}
}
