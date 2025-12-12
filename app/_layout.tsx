import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Text, View } from "react-native";
import { db, expoDb } from "@/db/client"; // Import expoDb
import migrations from "@/drizzle/migrations";
import { useColorScheme } from "@/hooks";
import "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export const unstable_settings = {
	anchor: "(tabs)",
};

export default function RootLayout() {
	const colorScheme = useColorScheme();
	// Connect to Drizzle Studio
	useDrizzleStudio(expoDb);

	const { success, error } = useMigrations(db, migrations);

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
		<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
			<SafeAreaProvider>
				<SafeAreaView style={{ flex: 1 }}>
					<Stack>
						<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					</Stack>
					<StatusBar style="auto" />
				</SafeAreaView>
			</SafeAreaProvider>
		</ThemeProvider>
	);
}
