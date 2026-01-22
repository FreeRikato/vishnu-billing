import type { Discount } from "@/types/invoice";

/**
 * Calculate the discount amount for a given item total and discount.
 * All values are in paise (integers) to avoid floating-point precision issues.
 *
 * For percent discounts, discount.value is stored in basis points (e.g., 10% = 1000).
 * For fixed discounts, discount.value is stored in paise (e.g., ₹10 = 1000).
 *
 * @param itemTotalInPaise - The total price before discount in paise (price * quantity)
 * @param discount - The discount to apply
 * @returns The discount amount in paise
 */
export function calculateDiscountAmount(
	itemTotalInPaise: number,
	discount?: Discount,
): number {
	if (!discount) return 0;

	if (discount.type === "percent") {
		// discount.value is in basis points (e.g., 10% = 1000 basis points)
		return Math.round((itemTotalInPaise * discount.value) / 10000);
	}
	// Fixed discount - discount.value is already in paise
	// Ensure discount doesn't exceed the item total
	return Math.min(discount.value, itemTotalInPaise);
}
