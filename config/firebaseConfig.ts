// Import the functions you need from the SDKs you need
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";
import env from "./env";

const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
  measurementId: env.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Analytics instance - will be initialized only on supported platforms
let analyticsInstance: any = null;

// Initialize Analytics only if supported and on web platform
export const initializeAnalytics = async () => {
  try {
    // Only initialize analytics on web platform
    if (Platform.OS === "web") {
      const supported = await isSupported();
      if (supported) {
        analyticsInstance = getAnalytics(app);
        return analyticsInstance;
      }
    }
    return null;
  } catch (error) {
    console.warn("Analytics initialization failed:", error);
    return null;
  }
};

// Export a function to get analytics instance
export const getAnalyticsInstance = () => analyticsInstance;

// Export a function to initialize analytics (call this from your app initialization)
export const initAnalytics = async () => {
  if (!analyticsInstance) {
    return await initializeAnalytics();
  }
  return analyticsInstance;
};

// Safer wrapper for analytics events
export const logEvent = async (eventName: string, params?: any) => {
  const instance = await initializeAnalytics();
  if (instance) {
    // You might need to cast instance or import logEvent from firebase/analytics
    // import { logEvent as firebaseLogEvent } from "firebase/analytics";
    // firebaseLogEvent(instance, eventName, params);
    console.log(`Analytics event: ${eventName}`, params);
  }
};
