import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface FloatingShareButtonProps {
	visible: boolean;
	selectedCount: number;
	onPress?: () => void;
	onCancel?: () => void;
}

export default function FloatingShareButton({
	visible,
	selectedCount,
	onPress,
	onCancel,
}: FloatingShareButtonProps) {
	if (!visible || selectedCount === 0) return null;

	const styles = {
		floatingAction: {
			position: "absolute" as const,
			bottom: 30,
			right: 20,
			zIndex: 50,
			alignItems: "center" as const,
			gap: 16,
		},
		cancelButton: {
			width: 48,
			height: 48,
			backgroundColor: "#1C1C1E",
			borderRadius: 24,
			justifyContent: "center" as const,
			alignItems: "center" as const,
			borderWidth: 1,
			borderColor: "rgba(255, 255, 255, 0.1)",
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.2,
			shadowRadius: 8,
			elevation: 8,
		},
		floatingButton: {
			width: 56,
			height: 56,
			backgroundColor: "#13ec6a",
			borderRadius: 28,
			justifyContent: "center" as const,
			alignItems: "center" as const,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.2,
			shadowRadius: 8,
			elevation: 8,
		},
		selectedCount: {
			position: "absolute" as const,
			top: -8,
			right: -8,
			backgroundColor: "#ef4444",
			borderRadius: 10,
			minWidth: 20,
			height: 20,
			justifyContent: "center" as const,
			alignItems: "center" as const,
			paddingHorizontal: 6,
		},
		selectedCountText: {
			fontSize: 12,
			fontWeight: "700" as const,
			color: "#ffffff",
		},
	};

	return (
		<View style={styles.floatingAction}>
			{onCancel && (
				<TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
					<Ionicons name="close" size={24} color="#ffffff" />
				</TouchableOpacity>
			)}
			<TouchableOpacity style={styles.floatingButton} onPress={onPress}>
				<Ionicons name="share" size={24} color="#000000" />
				<View style={styles.selectedCount}>
					<Text style={styles.selectedCountText}>{selectedCount}</Text>
				</View>
			</TouchableOpacity>
		</View>
	);
}
