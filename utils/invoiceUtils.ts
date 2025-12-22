import type { Discount } from "@/types/invoice";

/**
 * Calculate the discount amount for a given item total and discount.
 * @param itemTotal - The total price before discount (price * quantity)
 * @param discount - The discount to apply
 * @returns The discount amount
 */
export function calculateDiscountAmount(
	itemTotal: number,
	discount?: Discount,
): number {
	if (!discount) return 0;
	if (discount.type === "percent") {
		return (itemTotal * discount.value) / 100;
	}
	return Math.min(discount.value, itemTotal);
}
