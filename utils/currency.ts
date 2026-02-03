/**
 * Currency utility functions for handling monetary values in paise (Indian Rupees).
 *
 * All currency values are stored as integers (paise) in the database
 * to avoid floating-point precision errors.
 * Example: ₹10.50 is stored as 1050 paise.
 */

/**
 * Convert a currency value in paise to a decimal display value in rupees.
 * @param paise - The value in paise (e.g., 1050)
 * @returns The value in rupees (e.g., 10.50)
 *
 * @example
 * paiseToDecimal(1050) // returns 10.50
 * paiseToDecimal(100) // returns 1.00
 * paiseToDecimal(0) // returns 0.00
 */
export function paiseToDecimal(paise: number): number {
	return paise / 100;
}

/**
 * Convert a decimal currency value in rupees to paise for storage.
 * Uses Math.round to handle floating-point precision issues.
 * @param rupees - The value in rupees (e.g., 10.50)
 * @returns The value in paise (e.g., 1050)
 *
 * @example
 * decimalToPaise(10.50) // returns 1050
 * decimalToPaise(1.00) // returns 100
 * decimalToPaise(0.99) // returns 99
 */
export function decimalToPaise(rupees: number): number {
	return Math.round(rupees * 100);
}

/**
 * Format a paise value as a currency string for display in rupees.
 * @param paise - The value in paise
 * @param currencySymbol - The currency symbol (default: "₹")
 * @returns Formatted currency string (e.g., "₹10.50")
 *
 * @example
 * formatCurrency(1050) // returns "₹10.50"
 * formatCurrency(100) // returns "₹1.00"
 * formatCurrency(0) // returns "₹0.00"
 */
export function formatCurrency(paise: number, currencySymbol = "₹"): string {
	const rupees = paiseToDecimal(paise);
	return `${currencySymbol}${rupees.toFixed(2)}`;
}

/**
 * Safe multiplication for currency values in paise.
 * Multiplies a per-unit price (in paise) by a quantity.
 * @param priceInPaise - Price per unit in paise
 * @param quantity - Quantity to multiply by
 * @returns Total in paise
 *
 * @example
 * multiplyPaise(1050, 2) // returns 2100 (₹10.50 * 2 = ₹21.00)
 */
export function multiplyPaise(priceInPaise: number, quantity: number): number {
	return priceInPaise * quantity;
}

/**
 * Calculate percentage-based discount amount in paise.
 * @param amountInPaise - Original amount in paise
 * @param percentInBasisPoints - Percentage in basis points (e.g., 10% = 1000)
 * @returns Discount amount in paise
 *
 * @example
 * calculatePercentDiscount(10000, 1000) // returns 1000 (10% of ₹100 = ₹10)
 */
export function calculatePercentDiscount(
	amountInPaise: number,
	percentInBasisPoints: number,
): number {
	return Math.round((amountInPaise * percentInBasisPoints) / 10000);
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
 * Add two currency values in paise.
 * @param amountInPaise1 - First amount in paise
 * @param amountInPaise2 - Second amount in paise
 * @returns Sum in paise
 */
export function addPaise(
	amountInPaise1: number,
	amountInPaise2: number,
): number {
	return amountInPaise1 + amountInPaise2;
}

/**
 * Subtract two currency values in paise.
 * @param amountInPaise1 - First amount in paise
 * @param amountInPaise2 - Second amount in paise
 * @returns Difference in paise
 */
export function subtractPaise(
	amountInPaise1: number,
	amountInPaise2: number,
): number {
	return amountInPaise1 - amountInPaise2;
}

/**
 * Calculate tax amount in paise.
 * @param amountInPaise - Amount to calculate tax on (in paise)
 * @param taxRateInBasisPoints - Tax rate in basis points (e.g., 5% = 500)
 * @returns Tax amount in paise
 *
 * @example
 * calculateTax(10000, 500) // returns 500 (5% of ₹100 = ₹5)
 */
export function calculateTax(
	amountInPaise: number,
	taxRateInBasisPoints: number,
): number {
	return Math.round((amountInPaise * taxRateInBasisPoints) / 10000);
}

/**
 * Convert a number to words in Indian numbering system.
 * @param amountInPaise - Amount in paise (integer)
 * @returns Amount in words (e.g., "One Thousand Five Hundred Rupees Only")
 *
 * @example
 * numberToWords(105000) // returns "One Thousand Fifty Rupees Only"
 * numberToWords(150050) // returns "One Thousand Five Hundred Rupees and Fifty Paise Only"
 * numberToWords(0) // returns "Zero Rupees Only"
 */
export function numberToWords(amountInPaise: number): string {
	const rupees = Math.floor(amountInPaise / 100);
	const paise = amountInPaise % 100;

	let result = "";

	if (rupees === 0 && paise === 0) {
		return "Zero Rupees Only";
	}

	// Convert rupees to words
	if (rupees > 0) {
		result = convertNumberToWords(rupees);
		result += rupees === 1 ? " Rupee" : " Rupees";
	}

	// Add paise if present
	if (paise > 0) {
		if (rupees > 0) {
			result += " and ";
		}
		result += convertNumberToWords(paise);
		result += paise === 1 ? " Paise" : " Paise";
	}

	return result + " Only";
}

/**
 * Convert a number to words (supports Indian numbering system).
 * @private
 */
function convertNumberToWords(num: number): string {
	if (num === 0) return "Zero";

	const ones = [
		"",
		"One",
		"Two",
		"Three",
		"Four",
		"Five",
		"Six",
		"Seven",
		"Eight",
		"Nine",
		"Ten",
		"Eleven",
		"Twelve",
		"Thirteen",
		"Fourteen",
		"Fifteen",
		"Sixteen",
		"Seventeen",
		"Eighteen",
		"Nineteen",
	];

	const tens = [
		"",
		"",
		"Twenty",
		"Thirty",
		"Forty",
		"Fifty",
		"Sixty",
		"Seventy",
		"Eighty",
		"Ninety",
	];

	function getHundreds(n: number): string {
		if (n === 0) return "";
		if (n < 20) return ones[n];
		if (n < 100) {
			const ten = Math.floor(n / 10);
			const one = n % 10;
			return tens[ten] + (one > 0 ? " " + ones[one] : "");
		}
		const hundred = Math.floor(n / 100);
		const remainder = n % 100;
		return (
			ones[hundred] +
			" Hundred" +
			(remainder > 0 ? " " + getHundreds(remainder) : "")
		);
	}

	// Indian numbering system: units, tens, hundreds, thousands, lakhs, crores
	let words = "";
	let remaining = num;

	// Crores (1,00,00,000)
	if (remaining >= 10000000) {
		const crores = Math.floor(remaining / 10000000);
		words += getHundreds(crores) + " Crore ";
		remaining %= 10000000;
	}

	// Lakhs (1,00,000)
	if (remaining >= 100000) {
		const lakhs = Math.floor(remaining / 100000);
		words += getHundreds(lakhs) + " Lakh ";
		remaining %= 100000;
	}

	// Thousands (1,000)
	if (remaining >= 1000) {
		const thousands = Math.floor(remaining / 1000);
		words += getHundreds(thousands) + " Thousand ";
		remaining %= 1000;
	}

	// Hundreds (1-999)
	if (remaining > 0) {
		words += getHundreds(remaining);
	}

	return words.trim();
}
