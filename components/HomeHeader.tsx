import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { homeStyles } from "@/styles";
import type { User } from "@/types";

interface HomeHeaderProps {
	user: User | null;
	onSyncCloud: () => void;
}

export function HomeHeader({ user, onSyncCloud }: HomeHeaderProps) {
	return (
		<View style={homeStyles.header}>
			<View style={homeStyles.headerTop}>
				<Text style={homeStyles.greeting}>Hello, {user?.name || "User"}</Text>
				<TouchableOpacity
					style={homeStyles.backupIcon}
					onPress={onSyncCloud}
					activeOpacity={0.7}
				>
					<MaterialIcons name="cloud-done" size={24} color="#4CAF50" />
				</TouchableOpacity>
			</View>
			<Text style={homeStyles.backupStatus}>
				Everything is backed up safely.
			</Text>
		</View>
	);
}
