import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";
import { invoiceStyles } from "@/styles";
import { scale } from "@/utils/responsive";

interface ZoomHintProps {
	text?: string;
}

export function ZoomHint({ text = "Pinch to zoom invoice" }: ZoomHintProps) {
	return (
		<View style={invoiceStyles.zoomHint}>
			<MaterialIcons name="zoom-in" size={scale(16)} color="#9CA3AF" />
			<Text style={invoiceStyles.zoomHintText}>{text}</Text>
		</View>
	);
}
