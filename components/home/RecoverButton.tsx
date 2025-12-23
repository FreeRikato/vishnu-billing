import { MaterialIcons } from "@expo/vector-icons";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface RecoverButtonProps {
	onRecover: () => void;
	enabled: boolean;
}

export function RecoverButton({ onRecover, enabled }: RecoverButtonProps) {
	const handlePress = () => {
		if (!enabled) return;

		Alert.alert(
			"⚠️ DANGER ZONE",
			"This will WIPE all local data and replace it with the cloud backup. This cannot be undone. Are you absolutely sure?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Overwrite Local Data",
					style: "destructive",
					onPress: onRecover,
				},
			],
		);
	};

	return (
		<View style={[styles.devSection, !enabled && styles.hidden]}>
			<TouchableOpacity
				style={[styles.recoverButton, !enabled && styles.recoverButtonDisabled]}
				onPress={handlePress}
				activeOpacity={enabled ? 0.7 : 1}
				disabled={!enabled}
			>
				<MaterialIcons
					name="restore-page"
					size={24}
					color={enabled ? "#EF4444" : "#555"}
				/>
				<View>
					<Text
						style={[styles.recoverText, !enabled && styles.recoverTextDisabled]}
					>
						Recover from Cloud
					</Text>
					{!enabled && (
						<Text style={styles.devNote}>(Disabled: Code Bypass Required)</Text>
					)}
				</View>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	hidden: {
		display: "none",
	},
	devSection: {
		marginTop: 20,
		borderTopWidth: 1,
		borderTopColor: "#222",
		paddingTop: 20,
	},
	recoverButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 12,
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#EF4444",
		backgroundColor: "rgba(239, 68, 68, 0.1)",
	},
	recoverButtonDisabled: {
		borderColor: "#333",
		backgroundColor: "#1A1A1A",
	},
	recoverText: {
		color: "#EF4444",
		fontSize: 16,
		fontWeight: "bold",
	},
	recoverTextDisabled: {
		color: "#555",
	},
	devNote: {
		fontSize: 10,
		color: "#555",
		marginTop: 2,
	},
});
