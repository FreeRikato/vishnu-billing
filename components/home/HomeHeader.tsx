import { Text, View } from "react-native";
import { homeStyles } from "@/styles";
import type { User } from "@/types";

interface HomeHeaderProps {
	user: User | null;
}

export function HomeHeader({ user }: HomeHeaderProps) {
	return (
		<View style={homeStyles.header}>
			<View style={homeStyles.headerTop}>
				<Text style={homeStyles.greeting}>Hello, {user?.name || "Ravi"}</Text>
			</View>
		</View>
	);
}
