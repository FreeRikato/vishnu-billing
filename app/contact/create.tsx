import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FormField, ScreenLayout } from "@/components/common";
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
				// Use efficient state update instead of refresh
				useContactStore.getState().addContact(newContact);
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
		<>
			<Stack.Screen options={{ headerShown: false }} />
			<ScreenLayout
				title="New Contact"
				onCancel={handleCancel}
				onSave={handleSave}
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

				<FormField
					label="Full Name"
					icon="person"
					required
					placeholder="e.g. John Smith"
					value={formData.name}
					onChangeText={handleNameChange}
				/>

				<FormField
					label="Phone Number"
					icon="call"
					required
					placeholder="(555) 123-4567"
					value={formData.phone}
					onChangeText={(text) =>
						setFormData((prev) => ({ ...prev, phone: text }))
					}
					keyboardType="phone-pad"
				/>

				{/* Initials Field (Auto-generated) */}
				<FormField
					label="Initials"
					icon="text-format"
					value={formData.initials}
					editable={false}
					placeholder="Auto-generated"
					rightIcon={undefined}
				/>

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
			</ScreenLayout>
		</>
	);
}

const styles = StyleSheet.create({
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
