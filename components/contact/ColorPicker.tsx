import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { commonStyles, contactsStyles } from "@/styles";
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
		<View style={commonStyles.fieldContainer}>
			<View style={commonStyles.labelContainer}>
				<MaterialIcons name="palette" size={20} color="#9CA3AF" />
				<Text style={commonStyles.label}>Color</Text>
			</View>
			<View style={contactsStyles.colorPickerContainer}>
				{COLORS.map((color) => (
					<TouchableOpacity
						key={color}
						style={[
							contactsStyles.colorOption,
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
