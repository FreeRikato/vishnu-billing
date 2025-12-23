import { ActivityIndicator, Text, View } from "react-native";
import { homeStyles } from "@/styles";

interface SyncStatusIndicatorProps {
	isSyncing: boolean;
}

export function SyncStatusIndicator({ isSyncing }: SyncStatusIndicatorProps) {
	if (!isSyncing) {
		return null;
	}

	return (
		<View style={homeStyles.syncIndicator}>
			<ActivityIndicator size="small" color="#13EC6A" />
			<Text style={homeStyles.syncText}>Syncing with Cloud...</Text>
		</View>
	);
}
