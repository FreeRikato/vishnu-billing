import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface SyncStatusIndicatorProps {
	isSyncing: boolean;
}

export function SyncStatusIndicator({ isSyncing }: SyncStatusIndicatorProps) {
	if (!isSyncing) {
		return null;
	}

	return (
		<View style={styles.syncIndicator}>
			<ActivityIndicator size="small" color="#13EC6A" />
			<Text style={styles.syncText}>Syncing with Cloud...</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	syncIndicator: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 8,
		gap: 8,
		backgroundColor: "rgba(19, 236, 106, 0.1)",
	},
	syncText: {
		color: "#13EC6A",
		fontSize: 14,
		fontWeight: "600",
	},
});
