// Export UI types as default (for use in components)
export type { ContactUI as Contact } from "./contact";
export type { ProductUI as Product } from "./product";
export type { UserUI as User } from "./user";

// Export original Convex types for internal use
export type { Contact, ContactUI } from "./contact";
export type { Product, ProductUI } from "./product";
export type { User, UserUI } from "./user";

// Export invoice types
export * from "./invoice";
