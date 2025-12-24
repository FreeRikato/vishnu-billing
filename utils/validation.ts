import { z } from "zod";

/**
 * Validation Schemas using Zod
 * Provides consistent form validation across the application
 */

// Contact Schema
export const ContactSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.min(2, "Name must be at least 2 characters")
		.max(100, "Name must be less than 100 characters"),
	phone: z
		.string()
		.min(1, "Phone number is required")
		.min(10, "Phone number must be at least 10 digits")
		.max(15, "Phone number is too long"),
	address: z.string().min(1, "Address is required"),
	gstin: z.string().optional(),
	dlNo: z.string().optional(),
});

export type ContactInput = z.infer<typeof ContactSchema>;

// Product Schema - using custom refinement for price validation
export const ProductSchema = z.object({
	name: z
		.string()
		.min(1, "Product name is required")
		.min(2, "Product name must be at least 2 characters")
		.max(100, "Product name must be less than 100 characters"),
	price: z
		.number({
			message: "Price is required",
		})
		.refine((val) => !Number.isNaN(val), {
			message: "Price must be a valid number",
		})
		.refine((val) => val >= 0, {
			message: "Price cannot be negative",
		})
		.refine((val) => val <= 999999.99, {
			message: "Price is too high",
		}),
	unit: z
		.string()
		.min(1, "Unit is required")
		.min(1, "Unit must be at least 1 character")
		.max(20, "Unit must be less than 20 characters"),
});

export type ProductInput = z.infer<typeof ProductSchema>;

// Invoice Product Schema (for create invoice flow)
export const InvoiceProductSchema = z.object({
	id: z.number(),
	name: z.string().min(1),
	description: z.string(),
	price: z.number().min(0),
	quantity: z.number().min(1),
	discount: z
		.object({
			value: z.number().min(0),
			type: z.enum(["flat", "percent"]),
		})
		.optional(),
});

export type InvoiceProductInput = z.infer<typeof InvoiceProductSchema>;

// Customer Schema (for invoice creation)
export const CustomerSchema = z.object({
	id: z.number(),
	name: z.string().min(1),
});

export type CustomerInput = z.infer<typeof CustomerSchema>;

// Helper function to get first error message from ZodError
function getFirstErrorMessage(error: z.ZodError): string {
	const firstIssue = error.issues[0];
	if (!firstIssue) {
		return "Validation failed";
	}
	// Handle different issue formats
	if (firstIssue.message) {
		return firstIssue.message;
	}
	return "Validation failed";
}

// Helper function to validate and return error message
export function getValidationError(
	schema: z.ZodSchema<unknown>,
	data: unknown,
): string | null {
	const result = schema.safeParse(data);
	if (!result.success) {
		return getFirstErrorMessage(result.error);
	}
	return null;
}

// Helper function to validate Contact form
export function validateContact(
	data: unknown,
): { success: true; data: ContactInput } | { success: false; error: string } {
	const result = ContactSchema.safeParse(data);
	if (!result.success) {
		return {
			success: false,
			error: getFirstErrorMessage(result.error),
		};
	}
	return { success: true, data: result.data };
}

// Helper function to validate Product form
export function validateProduct(
	data: unknown,
): { success: true; data: ProductInput } | { success: false; error: string } {
	const result = ProductSchema.safeParse(data);
	if (!result.success) {
		return {
			success: false,
			error: getFirstErrorMessage(result.error),
		};
	}
	return { success: true, data: result.data };
}

// ============ Environment Variables Validation ============

// Firebase Environment Variables Schema
const FirebaseEnvSchema = z.object({
	EXPO_PUBLIC_FIREBASE_API_KEY: z
		.string()
		.min(1, "FIREBASE_API_KEY is required"),
	EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: z
		.string()
		.min(1, "FIREBASE_AUTH_DOMAIN is required"),
	EXPO_PUBLIC_FIREBASE_PROJECT_ID: z
		.string()
		.min(1, "FIREBASE_PROJECT_ID is required"),
	EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: z
		.string()
		.min(1, "FIREBASE_STORAGE_BUCKET is required"),
	EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z
		.string()
		.min(1, "FIREBASE_MESSAGING_SENDER_ID is required"),
	EXPO_PUBLIC_FIREBASE_APP_ID: z.string().min(1, "FIREBASE_APP_ID is required"),
	EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(),
});

// Type for validated Firebase config
export type FirebaseEnvConfig = z.infer<typeof FirebaseEnvSchema>;

/**
 * Validates and returns environment variables
 * Throws an error if validation fails during development
 * Returns validated config object
 */
function validateEnv(): FirebaseEnvConfig {
	const envVars = {
		EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
		EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN:
			process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
		EXPO_PUBLIC_FIREBASE_PROJECT_ID:
			process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
		EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET:
			process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
		EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
			process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
		EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
		EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID:
			process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
	};

	const result = FirebaseEnvSchema.safeParse(envVars);

	if (!result.success) {
		const errorMessages = result.error.issues
			.map((issue) => `${issue.path.join(".")}: ${issue.message}`)
			.join("\n");
		throw new Error(
			`Environment validation failed:\n${errorMessages}\n\nPlease check your .env file.`,
		);
	}

	return result.data;
}

// Singleton instance of validated env
let _cachedEnv: FirebaseEnvConfig | null = null;

/**
 * Get validated environment variables
 * This should be imported and used throughout the app
 *
 * @example
 * import { env } from '@/utils/validation';
 *
 * const firebaseConfig = {
 *   apiKey: env.FIREBASE_API_KEY,
 *   authDomain: env.FIREBASE_AUTH_DOMAIN,
 *   // ...
 * };
 */
export const env = new Proxy({} as FirebaseEnvConfig, {
	get(_target, prop: keyof FirebaseEnvConfig) {
		if (!_cachedEnv) {
			_cachedEnv = validateEnv();
		}
		return _cachedEnv[prop];
	},
});

/**
 * Utility to get Firebase config object for initialization
 * This formats the env vars into the structure expected by Firebase
 */
export function getFirebaseConfig() {
	return {
		apiKey: env.EXPO_PUBLIC_FIREBASE_API_KEY,
		authDomain: env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
		projectId: env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
		storageBucket: env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
		messagingSenderId: env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
		appId: env.EXPO_PUBLIC_FIREBASE_APP_ID,
		measurementId: env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
	};
}
