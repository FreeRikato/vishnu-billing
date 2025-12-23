import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/utils/contactUtils";

interface ColorPickerProps {
	selectedColor: string;
	onColorChange: (color: string) => void;
}

export default function ColorPicker({
	selectedColor,
	onColorChange,
}: ColorPickerProps) {
	return (
		<View style={styles.fieldContainer}>
			<View style={styles.labelContainer}>
				<MaterialIcons name="palette" size={20} color="#9CA3AF" />
				<Text style={styles.label}>Color</Text>
			</View>
			<View style={styles.colorPickerContainer}>
				{COLORS.map((color) => (
					<TouchableOpacity
						key={color}
						style={[
							styles.colorOption,
							{
								backgroundColor: color,
								borderWidth: selectedColor === color ? 3 : 0,
								borderColor:
									selectedColor === color ? "#000000" : "transparent",
							},
						]}
						onPress={() => onColorChange(color)}
					>
						{selectedColor === color && (
							<MaterialIcons name="check" size={16} color="#FFFFFF" />
						)}
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	fieldContainer: {
		marginBottom: 32,
	},
	labelContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginBottom: 12,
		paddingLeft: 8,
	},
	label: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#9CA3AF",
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	colorPickerContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 12,
		paddingHorizontal: 8,
	},
	colorOption: {
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: "center",
		justifyContent: "center",
	},
});
