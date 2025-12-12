import Constants from "expo-constants";
import { z } from "zod";

// Define the schema for environment variables
const envSchema = z.object({
  FIREBASE_API_KEY: z.string().min(1, "Firebase API key is required"),
  FIREBASE_AUTH_DOMAIN: z.string().min(1, "Firebase auth domain is required"),
  FIREBASE_PROJECT_ID: z.string().min(1, "Firebase project ID is required"),
  FIREBASE_STORAGE_BUCKET: z
    .string()
    .min(1, "Firebase storage bucket is required"),
  FIREBASE_MESSAGING_SENDER_ID: z
    .string()
    .min(1, "Firebase messaging sender ID is required"),
  FIREBASE_APP_ID: z.string().min(1, "Firebase app ID is required"),
  FIREBASE_MEASUREMENT_ID: z
    .string()
    .min(1, "Firebase measurement ID is required"),
});

// Get environment variables from Expo Constants
const expoConfig = Constants.expoConfig?.extra || {};

// Create environment object with fallback to process.env for web development
const envVars = {
  FIREBASE_API_KEY: expoConfig.firebaseApiKey || process.env.FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN:
    expoConfig.firebaseAuthDomain || process.env.FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID:
    expoConfig.firebaseProjectId || process.env.FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET:
    expoConfig.firebaseStorageBucket || process.env.FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID:
    expoConfig.firebaseMessagingSenderId ||
    process.env.FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: expoConfig.firebaseAppId || process.env.FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID:
    expoConfig.firebaseMeasurementId || process.env.FIREBASE_MEASUREMENT_ID,
};

// Validate and parse environment variables
const env = envSchema.parse(envVars);

// Export the validated environment variables
export default env;
