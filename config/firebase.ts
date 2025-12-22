import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration for Vishnu Billing
const firebaseConfig = {
	apiKey: "AIzaSyBMPp_sFe4vO7sAJiAriKEfZZr7uvwQE-E",
	authDomain: "vishnu-billing.firebaseapp.com",
	projectId: "vishnu-billing",
	storageBucket: "vishnu-billing.firebasestorage.app",
	messagingSenderId: "796249157660",
	appId: "1:796249157660:web:1a5d4ea83126c51355efd9",
	measurementId: "G-P58P36DBRR",
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
