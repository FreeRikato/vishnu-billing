import { ActivityIndicator, View } from "react-native";
import { commonStyles } from "@/styles";

interface LoadingOverlayProps {
	visible: boolean;
	color?: string;
}

export function LoadingOverlay({
	visible,
	color = "#13ec6a",
}: LoadingOverlayProps) {
	if (!visible) return null;

	return (
		<View style={commonStyles.loadingOverlay}>
			<ActivityIndicator size="large" color={color} />
		</View>
	);
}
