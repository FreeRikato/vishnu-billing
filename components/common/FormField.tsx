import { MaterialIcons } from "@expo/vector-icons";
import { Text, TextInput, type TextInputProps, View } from "react-native";
import { commonStyles } from "@/styles";
import { scale } from "@/utils/responsive";

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
		<View style={commonStyles.fieldContainer}>
			<View style={commonStyles.labelContainer}>
				{icon && <MaterialIcons name={icon} size={scale(20)} color="#9CA3AF" />}
				<Text style={commonStyles.label}>{label}</Text>
				{required && <Text style={commonStyles.required}>*</Text>}
			</View>
			<View style={commonStyles.inputContainer}>
				<TextInput
					style={[
						commonStyles.input,
						props.editable === false && commonStyles.disabledInput,
						props.multiline && commonStyles.multilineInput,
						style,
					]}
					placeholderTextColor="#666"
					{...props}
				/>
				{rightIcon && !props.multiline && (
					<MaterialIcons
						name={rightIcon}
						size={scale(20)}
						color="#13EC6A"
						style={commonStyles.inputIcon}
					/>
				)}
			</View>
		</View>
	);
}
