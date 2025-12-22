import type { Discount } from "@/types/invoice";

/**
 * Calculate the discount amount for a given item total and discount.
 * Rounds to 2 decimal places to ensure currency integrity.
 * @param itemTotal - The total price before discount (price * quantity)
 * @param discount - The discount to apply
 * @returns The discount amount
 */
export function calculateDiscountAmount(
	itemTotal: number,
	discount?: Discount,
): number {
	if (!discount) return 0;
	let amount = 0;
	if (discount.type === "percent") {
		amount = (itemTotal * discount.value) / 100;
	} else {
		amount = Math.min(discount.value, itemTotal);
	}
	// Round to 2 decimal places to ensure currency integrity
	return Math.round(amount * 100) / 100;
}
