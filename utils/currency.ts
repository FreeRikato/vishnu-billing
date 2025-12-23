/**
 * Currency utility functions for handling monetary values in cents.
 *
 * All currency values are stored as integers (cents/paise) in the database
 * to avoid floating-point precision errors.
 * Example: $10.50 is stored as 1050 cents.
 */

/**
 * Convert a currency value in cents to a decimal display value.
 * @param cents - The value in cents (e.g., 1050)
 * @returns The value in dollars (e.g., 10.50)
 *
 * @example
 * centsToDecimal(1050) // returns 10.50
 * centsToDecimal(100) // returns 1.00
 * centsToDecimal(0) // returns 0.00
 */
export function centsToDecimal(cents: number): number {
	return cents / 100;
}

/**
 * Convert a decimal currency value to cents for storage.
 * Uses Math.round to handle floating-point precision issues.
 * @param decimal - The value in dollars (e.g., 10.50)
 * @returns The value in cents (e.g., 1050)
 *
 * @example
 * decimalToCents(10.50) // returns 1050
 * decimalToCents(1.00) // returns 100
 * decimalToCents(0.99) // returns 99
 */
export function decimalToCents(decimal: number): number {
	return Math.round(decimal * 100);
}

/**
 * Format a cents value as a currency string for display.
 * @param cents - The value in cents
 * @param currencySymbol - The currency symbol (default: "₹")
 * @returns Formatted currency string (e.g., "₹10.50")
 *
 * @example
 * formatCurrency(1050) // returns "₹10.50"
 * formatCurrency(100) // returns "₹1.00"
 * formatCurrency(0) // returns "₹0.00"
 */
export function formatCurrency(cents: number, currencySymbol = "₹"): string {
	const rupees = centsToDecimal(cents);
	return `${currencySymbol}${rupees.toFixed(2)}`;
}

/**
 * Safe multiplication for currency values in cents.
 * Multiplies a per-unit price (in cents) by a quantity.
 * @param priceInCents - Price per unit in cents
 * @param quantity - Quantity to multiply by
 * @returns Total in cents
 *
 * @example
 * multiplyCents(1050, 2) // returns 2100 (₹10.50 * 2 = ₹21.00)
 */
export function multiplyCents(priceInCents: number, quantity: number): number {
	return priceInCents * quantity;
}

/**
 * Calculate percentage-based discount amount in cents.
 * @param amountInCents - Original amount in cents
 * @param percentInBasisPoints - Percentage in basis points (e.g., 10% = 1000)
 * @returns Discount amount in cents
 *
 * @example
 * calculatePercentDiscount(10000, 1000) // returns 1000 (10% of ₹100 = ₹10)
 */
export function calculatePercentDiscount(
	amountInCents: number,
	percentInBasisPoints: number,
): number {
	return Math.round((amountInCents * percentInBasisPoints) / 10000);
}

/**
 * Convert percentage to basis points for storage.
 * @param percent - Percentage value (e.g., 10 for 10%)
 * @returns Basis points (e.g., 1000 for 10%)
 *
 * @example
 * percentToBasisPoints(10) // returns 1000
 * percentToBasisPoints(5.5) // returns 550
 */
export function percentToBasisPoints(percent: number): number {
	return Math.round(percent * 100);
}

/**
 * Convert basis points to percentage.
 * @param basisPoints - Basis points (e.g., 1000)
 * @returns Percentage (e.g., 10 for 10%)
 *
 * @example
 * basisPointsToPercent(1000) // returns 10
 * basisPointsToPercent(550) // returns 5.5
 */
export function basisPointsToPercent(basisPoints: number): number {
	return basisPoints / 100;
}

/**
 * Add two currency values in cents.
 * @param a - First amount in cents
 * @param b - Second amount in cents
 * @returns Sum in cents
 */
export function addCents(a: number, b: number): number {
	return a + b;
}

/**
 * Subtract two currency values in cents.
 * @param a - First amount in cents
 * @param b - Second amount in cents
 * @returns Difference in cents
 */
export function subtractCents(a: number, b: number): number {
	return a - b;
}

/**
 * Calculate tax amount in cents.
 * @param amountInCents - Amount to calculate tax on
 * @param taxRateInBasisPoints - Tax rate in basis points (e.g., 5% = 500)
 * @returns Tax amount in cents
 *
 * @example
 * calculateTax(10000, 500) // returns 500 (5% of ₹100 = ₹5)
 */
export function calculateTax(
	amountInCents: number,
	taxRateInBasisPoints: number,
): number {
	return Math.round((amountInCents * taxRateInBasisPoints) / 10000);
}
