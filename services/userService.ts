import { db } from "@/db/client";
import { eq } from "drizzle-orm";
import { User } from "@/db/schema";
import type { User as UserType } from "@/types";

export async function getUserById(id: number): Promise<UserType | null> {
	try {
		const user = await db.select().from(User).where(eq(User.id, id)).limit(1);

		return user[0] || null;
	} catch (error) {
		console.error("Error fetching user:", error);
		return null;
	}
}
