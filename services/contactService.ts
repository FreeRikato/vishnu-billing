import { eq, like } from "drizzle-orm";
import { db } from "@/db/client";
import { Contact, Invoice } from "@/db/schema";
import type { Contact as ContactType } from "@/types";

function generateRandomHexColor(): string {
	// Generate random hex color
	const colors = [
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
	];
	return colors[Math.floor(Math.random() * colors.length)];
}

function generateInitials(name: string): string {
	return name
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase())
		.join("")
		.slice(0, 2);
}

export async function getAllContacts(): Promise<ContactType[]> {
	try {
		const contacts = await db.select().from(Contact);
		return contacts;
	} catch (error) {
		console.error("Error fetching contacts:", error);
		return [];
	}
}

export async function searchContacts(query: string): Promise<ContactType[]> {
	try {
		if (!query.trim()) {
			return getAllContacts();
		}

		const contacts = await db
			.select()
			.from(Contact)
			.where(like(Contact.name, `%${query}%`));

		return contacts;
	} catch (error) {
		console.error("Error searching contacts:", error);
		return [];
	}
}

export async function getContactById(id: number): Promise<ContactType | null> {
	try {
		const contacts = await db
			.select()
			.from(Contact)
			.where(eq(Contact.id, id))
			.limit(1);

		return contacts[0] || null;
	} catch (error) {
		console.error("Error fetching contact by ID:", error);
		return null;
	}
}

export async function createContact(
	contact: Omit<ContactType, "id" | "initials" | "color">,
): Promise<ContactType | null> {
	try {
		const initials = generateInitials(contact.name);
		const color = generateRandomHexColor();

		const result = await db
			.insert(Contact)
			.values({
				name: contact.name,
				phone: contact.phone,
				initials,
				color,
				address: contact.address ?? "",
				gstin: contact.gstin ?? null,
				dlNo: contact.dlNo ?? null,
			})
			.returning();

		return result[0] || null;
	} catch (error) {
		console.error("Error creating contact:", error);
		return null;
	}
}

export async function updateContact(
	id: number,
	contact: Partial<Omit<ContactType, "id">>,
): Promise<ContactType | null> {
	try {
		const updateData: {
			name?: string;
			initials?: string;
			phone?: string;
			address?: string;
			gstin?: string | null;
			dlNo?: string | null;
			color?: string;
		} = {
			...(contact.name && {
				name: contact.name,
				initials: generateInitials(contact.name),
			}),
			...(contact.phone && { phone: contact.phone }),
			...(contact.address !== undefined && { address: contact.address }),
			...(contact.gstin !== undefined && { gstin: contact.gstin }),
			...(contact.dlNo !== undefined && { dlNo: contact.dlNo }),
			...(contact.color && { color: contact.color }),
		};

		const result = await db
			.update(Contact)
			.set(updateData)
			.where(eq(Contact.id, id))
			.returning();

		return result[0] || null;
	} catch (error) {
		console.error("Error updating contact:", error);
		return null;
	}
}

export async function deleteContact(
	id: number,
): Promise<
	| { success: true }
	| { success: false; reason: "has_invoices" | "unknown_error" }
> {
	try {
		// Check for existing invoices first
		const existingInvoices = await db
			.select()
			.from(Invoice)
			.where(eq(Invoice.customerId, id));

		if (existingInvoices.length > 0) {
			return { success: false, reason: "has_invoices" };
		}

		await db.delete(Contact).where(eq(Contact.id, id));
		return { success: true };
	} catch (error) {
		console.error("Error deleting contact:", error);
		return { success: false, reason: "unknown_error" };
	}
}
