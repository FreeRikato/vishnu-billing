import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks";
import { scale, verticalScale } from "@/utils/responsive";

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
				headerShown: false,
				tabBarStyle: {
					paddingBottom: scale(8),
					height: verticalScale(80),
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => (
						<MaterialIcons name="home" size={scale(24)} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="invoice"
				options={{
					title: "Invoice",
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="invoice-text-multiple"
							size={scale(24)}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="contact"
				options={{
					title: "Contact",
					tabBarIcon: ({ color }) => (
						<MaterialIcons name="contacts" size={scale(24)} color={color} />
					),
				}}
			/>

			<Tabs.Screen
				name="product"
				options={{
					title: "Product",
					tabBarIcon: ({ color }) => (
						<MaterialIcons
							name="shopping-cart"
							size={scale(24)}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
