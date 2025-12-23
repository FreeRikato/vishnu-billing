export const COLORS = [
	"#3B82F6",
	"#8B5CF6",
	"#F97316",
	"#10B981",
	"#14B8A6",
	"#F59E0B",
	"#EF4444",
	"#EC4899",
	"#6366F1",
	"#84CC16",
	"#06B6D4",
	"#64748B",
	"#F43F5E",
	"#A855F7",
	"#22C55E",
] as const;

/**
 * Generate initials from a contact name.
 * Takes the first character of each word and capitalizes it.
 * Returns up to 2 initials.
 * @param name - The contact name
 * @returns The generated initials
 */
export function generateInitials(name: string): string {
	return name
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase())
		.join("")
		.slice(0, 2);
}

/**
 * Generate a random color from the predefined color palette.
 * @returns A random color hex code
 */
export function generateRandomColor(): string {
	return COLORS[Math.floor(Math.random() * COLORS.length)];
}
