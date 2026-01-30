// Product type from Convex (with _id)
export type Product = {
	_id: string; // Convex ID
	_creationTime: number;
	name: string;
	price: number; // Paise
	unit: string;
};

// Product type for UI components (with id instead of _id)
export type ProductUI = Omit<Product, "_id" | "_creationTime"> & {
	id: string; // Map _id to id for UI components
};
