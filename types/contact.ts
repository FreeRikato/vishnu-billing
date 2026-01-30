// Contact type from Convex (with _id)
export type Contact = {
	_id: string; // Convex ID
	_creationTime: number;
	name: string;
	phone: string;
	initials: string;
	color: string;
	address: string;
	gstin?: string;
	dlNo?: string;
};

// Contact type for UI components (with id instead of _id)
export type ContactUI = Omit<Contact, "_id" | "_creationTime"> & {
	id: string; // Map _id to id for UI components
};
