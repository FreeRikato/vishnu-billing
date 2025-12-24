import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFirebaseConfig } from "@/utils/validation";

// Firebase configuration for Vishnu Billing
const firebaseConfig = getFirebaseConfig();

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
