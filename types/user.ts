// User type from Convex (with _id)
export type User = {
	_id: string; // Convex ID
	_creationTime: number;
	name: string;
};

// User type for UI components (with id instead of _id)
export type UserUI = Omit<User, "_id" | "_creationTime"> & {
	id: string; // Map _id to id for UI components
};
