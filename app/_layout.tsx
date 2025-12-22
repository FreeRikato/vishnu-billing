import "react-native-reanimated";
import NetInfo from "@react-native-community/netinfo";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { db, expoDb } from "@/db/client"; // Import expoDb
import migrations from "@/drizzle/migrations";
import { useColorScheme } from "@/hooks";
import { SyncService } from "@/services/syncService";
import { useContactStore } from "@/store/contactStore";
import { useInvoiceStore } from "@/store/invoiceStore";
import { useProductStore } from "@/store/productStore";
import { useUserStore } from "@/store/userStore";

export const unstable_settings = {
	anchor: "(tabs)",
};

export default function RootLayout() {
	const colorScheme = useColorScheme();
	// Connect to Drizzle Studio
	useDrizzleStudio(expoDb);

	const { success, error } = useMigrations(db, migrations);

	// Initialize Zustand stores after successful database migration
	// This ensures data is loaded once on app start, not on every navigation
	const ensureDefaultUser = useUserStore((state) => state.ensureDefault);
	const fetchContacts = useContactStore((state) => state.fetchAll);
	const fetchProducts = useProductStore((state) => state.fetchAll);
	const fetchInvoices = useInvoiceStore((state) => state.fetchAll);

	useEffect(() => {
		if (success) {
			// Ensure default user exists first
			ensureDefaultUser();
			// Fetch initial data for contacts, products, and invoices
			fetchContacts();
			fetchProducts();
			fetchInvoices();
		}
	}, [success, ensureDefaultUser, fetchContacts, fetchProducts, fetchInvoices]);

	// Automatic Cloud Sync on network connection
	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener((state) => {
			if (state.isConnected && state.isInternetReachable) {
				console.log("Internet detected, attempting auto-backup...");
				SyncService.backupToCloud()
					.then(() => console.log("Auto-backup successful"))
					.catch((err) => console.log("Auto-backup skipped:", err.message));
			}
		});

		return () => unsubscribe();
	}, []);

	if (error) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text>Migration Error: {error.message}</Text>
			</View>
		);
	}

	if (!success) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" />
				<Text>Setting up database...</Text>
			</View>
		);
	}

	return (
		<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DarkTheme}>
			<StatusBar style="light" animated />
			<SafeAreaProvider>
				<Stack>
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen
						name="contact/[id]"
						options={{
							headerShown: false,
						}}
					/>
					<Stack.Screen
						name="contact/create"
						options={{
							headerShown: false,
						}}
					/>
					<Stack.Screen
						name="product/[id]"
						options={{
							headerShown: false,
						}}
					/>
					<Stack.Screen
						name="product/create"
						options={{
							headerShown: false,
						}}
					/>
					<Stack.Screen
						name="invoice/create"
						options={{
							headerShown: false,
							presentation: "modal",
						}}
					/>
					<Stack.Screen
						name="invoice/[id]"
						options={{
							headerShown: false,
						}}
					/>
				</Stack>
				<StatusBar style="auto" />
			</SafeAreaProvider>
		</ThemeProvider>
	);
}
