import type { Doc, Id } from "@/convex/_generated/dataModel";

// Type alias for Convex Contact document
export type Contact = Doc<"contacts">;

// Type alias for Contact ID
export type ContactId = Id<"contacts">;

// Contact type for UI components (with id instead of _id)
export type ContactUI = Omit<Contact, "_id" | "_creationTime"> & {
	id: string; // Map _id to id for UI components
};
