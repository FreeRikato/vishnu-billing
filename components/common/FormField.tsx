import { MaterialIcons } from "@expo/vector-icons";
import {
	StyleSheet,
	Text,
	TextInput,
	type TextInputProps,
	View,
} from "react-native";

interface FormFieldProps extends TextInputProps {
	label: string;
	icon?: keyof typeof MaterialIcons.glyphMap;
	required?: boolean;
	rightIcon?: keyof typeof MaterialIcons.glyphMap;
}

export function FormField({
	label,
	icon,
	required,
	rightIcon = "edit",
	style,
	...props
}: FormFieldProps) {
	return (
		<View style={styles.fieldContainer}>
			<View style={styles.labelContainer}>
				{icon && <MaterialIcons name={icon} size={20} color="#9CA3AF" />}
				<Text style={styles.label}>{label}</Text>
				{required && <Text style={styles.required}>*</Text>}
			</View>
			<View style={styles.inputContainer}>
				<TextInput
					style={[
						styles.input,
						props.editable === false && styles.disabledInput,
						props.multiline && styles.multilineInput,
						style,
					]}
					placeholderTextColor="#666"
					{...props}
				/>
				{rightIcon && !props.multiline && (
					<MaterialIcons
						name={rightIcon}
						size={20}
						color="#13EC6A"
						style={styles.inputIcon}
					/>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	fieldContainer: { marginBottom: 32 },
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
	required: { fontSize: 24, color: "#13EC6A", top: -2 },
	inputContainer: { position: "relative" },
	input: {
		width: "100%",
		height: 72,
		backgroundColor: "#1A1A1A",
		borderWidth: 2,
		borderColor: "#333333",
		borderRadius: 16,
		paddingHorizontal: 24,
		fontSize: 20,
		color: "#FFFFFF",
		fontWeight: "500",
	},
	multilineInput: {
		height: 120,
		textAlignVertical: "top", // Align text to top on Android for multiline inputs
	},
	disabledInput: {
		backgroundColor: "#2A2A2A",
		color: "#9CA3AF",
		borderColor: "#333333",
	},
	inputIcon: { position: "absolute", right: 24, top: "50%", marginTop: -10 },
});
