import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createContact } from "@/services/contactService";
import { useContactStore } from "@/store/contactStore";

const COLORS = [
	"#3B82F6",
	"#8B5CF6",
	"#F97316",
	"#10B981",
	"#14B8A6",
	"#F59E0B",
	"#EF4444",
	"#EC4899",
	"#6366F1",
	"#84CC16",
	"#06B6D4",
	"#64748B",
	"#F43F5E",
	"#A855F7",
	"#22C55E",
];

function generateInitials(name: string): string {
	return name
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase())
		.join("")
		.slice(0, 2);
}

function generateRandomColor(): string {
	return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export default function CreateContactScreen() {
	const router = useRouter();

	// State for form data
	const [formData, setFormData] = useState({
		name: "",
		phone: "",
		initials: "",
		color: generateRandomColor(),
	});

	// Update initials when name changes
	const handleNameChange = (text: string) => {
		const newInitials = generateInitials(text);
		setFormData((prev) => ({
			...prev,
			name: text,
			initials: newInitials,
		}));
	};

	const handleSave = async () => {
		if (!formData.name.trim()) {
			Alert.alert("Error", "Name is required");
			return;
		}

		if (!formData.phone.trim()) {
			Alert.alert("Error", "Phone number is required");
			return;
		}

		try {
			const newContact = await createContact({
				name: formData.name,
				phone: formData.phone,
			});

			if (newContact) {
				// Refresh the contact store to reflect the new contact
				await useContactStore.getState().refresh();
				Alert.alert("Success", "Contact created successfully");
				router.back();
			} else {
				Alert.alert("Error", "Failed to create contact");
			}
		} catch (error) {
			console.error("Error creating contact:", error);
			Alert.alert("Error", "Failed to create contact");
		}
	};

	const handleCancel = () => {
		router.back();
	};

	return (
		<SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
			<Stack.Screen
				options={{
					headerShown: false, // We'll use custom header
				}}
			/>

			{/* Custom Header */}
			<View style={styles.header}>
				<View style={styles.headerContent}>
					<TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
						<Text style={styles.cancelText}>Cancel</Text>
					</TouchableOpacity>
					<Text style={styles.headerTitle}>New Contact</Text>
					<TouchableOpacity onPress={handleSave} style={styles.headerButton}>
						<Text style={styles.saveText}>Save</Text>
					</TouchableOpacity>
				</View>
			</View>

			{/* Main Content */}
			<ScrollView
				style={styles.content}
				contentContainerStyle={styles.contentContainer}
				showsVerticalScrollIndicator={false}
			>
				{/* Contact Avatar Preview */}
				<View style={styles.avatarPreviewContainer}>
					<View
						style={[
							styles.avatarPreview,
							{ backgroundColor: `${formData.color}20` },
						]}
					>
						<Text style={[styles.avatarPreviewText, { color: formData.color }]}>
							{formData.initials || "?"}
						</Text>
					</View>
				</View>

				{/* Form Fields */}
				<View style={styles.formContainer}>
					{/* Name Field (Required) */}
					<View style={styles.fieldContainer}>
						<View style={styles.labelContainer}>
							<MaterialIcons name="person" size={20} color="#9CA3AF" />
							<Text style={styles.label}>Full Name</Text>
							<Text style={styles.required}>*</Text>
						</View>
						<View style={styles.inputContainer}>
							<TextInput
								style={styles.input}
								placeholder="e.g. John Smith"
								value={formData.name}
								onChangeText={handleNameChange}
							/>
							<MaterialIcons
								name="edit"
								size={20}
								color="#13EC6A"
								style={styles.inputIcon}
							/>
						</View>
					</View>

					{/* Phone Field (Required) */}
					<View style={styles.fieldContainer}>
						<View style={styles.labelContainer}>
							<MaterialIcons name="call" size={20} color="#9CA3AF" />
							<Text style={styles.label}>Phone Number</Text>
							<Text style={styles.required}>*</Text>
						</View>
						<View style={styles.inputContainer}>
							<TextInput
								style={styles.input}
								placeholder="(555) 123-4567"
								value={formData.phone}
								onChangeText={(text) =>
									setFormData((prev) => ({ ...prev, phone: text }))
								}
								keyboardType="phone-pad"
							/>
						</View>
					</View>

					{/* Initials Field (Auto-generated) */}
					<View style={styles.fieldContainer}>
						<View style={styles.labelContainer}>
							<MaterialIcons name="text-format" size={20} color="#9CA3AF" />
							<Text style={styles.label}>Initials</Text>
						</View>
						<View style={styles.inputContainer}>
							<TextInput
								style={[styles.input, styles.disabledInput]}
								value={formData.initials}
								editable={false}
								placeholder="Auto-generated"
							/>
						</View>
					</View>

					{/* Color Selection */}
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
											borderWidth: formData.color === color ? 3 : 0,
											borderColor:
												formData.color === color ? "#000000" : "transparent",
										},
									]}
									onPress={() => setFormData((prev) => ({ ...prev, color }))}
								>
									{formData.color === color && (
										<MaterialIcons name="check" size={16} color="#FFFFFF" />
									)}
								</TouchableOpacity>
							))}
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000000", // Pure black for OLED
	},
	header: {
		position: "sticky",
		top: 0,
		zIndex: 30,
		backgroundColor: "rgba(0, 0, 0, 0.95)",
		borderBottomWidth: 1,
		borderBottomColor: "rgba(255, 255, 255, 0.1)",
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		height: 64,
	},
	headerButton: {
		minWidth: 60,
		alignItems: "center",
	},
	cancelText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#EF4444",
		letterSpacing: 0.5,
	},
	saveText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#13EC6A",
		letterSpacing: 0.5,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#FFFFFF",
		letterSpacing: -0.5,
		textAlign: "center",
		flex: 1,
	},
	content: {
		flex: 1,
	},
	contentContainer: {
		paddingHorizontal: 20,
		paddingTop: 24,
		paddingBottom: 128,
	},
	avatarPreviewContainer: {
		alignItems: "center",
		marginBottom: 32,
	},
	avatarPreview: {
		width: 120,
		height: 120,
		borderRadius: 60,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 16,
	},
	avatarPreviewText: {
		fontSize: 42,
		fontWeight: "bold",
	},
	formContainer: {
		flex: 1,
	},
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
	required: {
		fontSize: 24,
		color: "#13EC6A",
		position: "relative",
		top: -2,
	},
	inputContainer: {
		position: "relative",
	},
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
	disabledInput: {
		backgroundColor: "#2A2A2A",
		color: "#9CA3AF",
		borderColor: "#333333",
	},
	inputIcon: {
		position: "absolute",
		right: 24,
		top: "50%",
		marginTop: -10,
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
