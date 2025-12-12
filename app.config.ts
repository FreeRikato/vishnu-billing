import { ExpoConfig } from "expo/config";

// Validate required environment variables
const requiredEnvVars = [
  "EXPO_PUBLIC_FIREBASE_API_KEY",
  "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
  "EXPO_PUBLIC_FIREBASE_APP_ID",
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error("❌ Missing required environment variables:");
  missingEnvVars.forEach((envVar) => {
    console.error(`   - ${envVar}`);
  });
  console.error(
    "\nPlease set these environment variables in your .env file or CI/CD pipeline."
  );
  process.exit(1);
}

// Load environment variables with validation
const firebaseApiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY!;
const firebaseAuthDomain = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!;
const firebaseProjectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!;
const firebaseStorageBucket =
  process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "";
const firebaseMessagingSenderId =
  process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "";
const firebaseAppId = process.env.EXPO_PUBLIC_FIREBASE_APP_ID!;
const firebaseMeasurementId =
  process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "";

export default {
  expo: {
    name: "Vishnu-billing",
    slug: "Vishnu-billing",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "vishnubilling",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    extra: {
      firebaseApiKey,
      firebaseAuthDomain,
      firebaseProjectId,
      firebaseStorageBucket,
      firebaseMessagingSenderId,
      firebaseAppId,
      firebaseMeasurementId,
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
} as unknown as ExpoConfig;
