// Polyfills for React Native Skia/Victory Native - MUST be first
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import "text-encoding";

import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks";
import config from "@/utils/config";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

export const unstable_settings = {
	anchor: "(tabs)",
};

export default function RootLayout() {
	const colorScheme = useColorScheme();

	// Initialize Convex client
	const convex = new ConvexReactClient(config.CONVEX_URL, {
		unsavedChangesWarning: false, // React Native doesn't have window
	});

	return (
		<ConvexProvider client={convex}>
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
		</ConvexProvider>
	);
}
