import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { User } from "@/db/schema";
import type { User as UserType } from "@/types";

/**
 * Get user by ID
 */
export async function getUserById(id: number): Promise<UserType | null> {
	try {
		const user = await db.select().from(User).where(eq(User.id, id)).limit(1);

		return user[0] || null;
	} catch (error) {
		console.error("Error fetching user:", error);
		return null;
	}
}

/**
 * Create a new user
 */
export async function createUser(
	user: Omit<UserType, "id">,
): Promise<UserType | null> {
	try {
		const result = await db
			.insert(User)
			.values({
				name: user.name,
			})
			.returning();

		return result[0] || null;
	} catch (error) {
		console.error("Error creating user:", error);
		return null;
	}
}

/**
 * Update user name
 */
export async function updateUser(
	id: number,
	name: string,
): Promise<UserType | null> {
	try {
		const result = await db
			.update(User)
			.set({ name })
			.where(eq(User.id, id))
			.returning();

		return result[0] || null;
	} catch (error) {
		console.error("Error updating user:", error);
		return null;
	}
}

/**
 * Ensure default user exists (ID=1)
 * Creates a default user with name "User" if none exists
 */
export async function ensureDefaultUser(): Promise<UserType | null> {
	try {
		// Check if user with ID=1 exists
		const existingUser = await getUserById(1);

		if (existingUser) {
			return existingUser;
		}

		// Create default user
		const defaultUser = await createUser({ name: "User" });
		console.log("Created default user with ID=1");
		return defaultUser;
	} catch (error) {
		console.error("Error ensuring default user:", error);
		return null;
	}
}
