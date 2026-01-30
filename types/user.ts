import type { Doc, Id } from "@/convex/_generated/dataModel";

// Type alias for Convex User document
export type User = Doc<"users">;

// Type alias for User ID
export type UserId = Id<"users">;

// User type for UI components (with id instead of _id)
export type UserUI = Omit<User, "_id" | "_creationTime"> & {
	id: string; // Map _id to id for UI components
};
