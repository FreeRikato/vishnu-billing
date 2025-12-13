import { db, expoDb } from "@/db/client"; // Import expoDb
import migrations from "@/drizzle/migrations";
import { useColorScheme } from "@/hooks";
import { useContactStore } from "@/store/contactStore";
import { useProductStore } from "@/store/productStore";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
	const fetchContacts = useContactStore((state) => state.fetchAll);
	const fetchProducts = useProductStore((state) => state.fetchAll);

	useEffect(() => {
		if (success) {
			// Fetch initial data for both contacts and products
			fetchContacts();
			fetchProducts();
		}
	}, [success, fetchContacts, fetchProducts]);

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
				</Stack>
				<StatusBar style="auto" />
			</SafeAreaProvider>
		</ThemeProvider>
	);
}
