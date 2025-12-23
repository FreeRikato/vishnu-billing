import type { Discount } from "@/types/invoice";

/**
 * Calculate the discount amount for a given item total and discount.
 * All values are in cents (integers) to avoid floating-point precision issues.
 *
 * For percent discounts, discount.value is stored in basis points (e.g., 10% = 1000).
 * For fixed discounts, discount.value is stored in cents (e.g., ₹10 = 1000).
 *
 * @param itemTotalInCents - The total price before discount in cents (price * quantity)
 * @param discount - The discount to apply
 * @returns The discount amount in cents
 */
export function calculateDiscountAmount(
	itemTotalInCents: number,
	discount?: Discount,
): number {
	if (!discount) return 0;

	if (discount.type === "percent") {
		// discount.value is in basis points (e.g., 10% = 1000 basis points)
		return Math.round((itemTotalInCents * discount.value) / 10000);
	}
	// Fixed discount - discount.value is already in cents
	// Ensure discount doesn't exceed the item total
	return Math.min(discount.value, itemTotalInCents);
}
