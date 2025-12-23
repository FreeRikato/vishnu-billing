import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { AvatarPreview, ColorPicker } from "@/components";
import { FormField, ScreenLayout } from "@/components/common";
import { useContactStore } from "@/store/contactStore";
import { generateInitials, generateRandomColor } from "@/utils/contactUtils";
import { validateContact } from "@/utils/validation";

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
		// Validate using Zod schema
		const validation = validateContact({
			name: formData.name.trim(),
			phone: formData.phone.trim(),
		});

		if (!validation.success) {
			Alert.alert("Error", validation.error);
			return;
		}

		try {
			// Use store method which wraps service and updates state
			const newContact = await useContactStore.getState().createContact({
				name: validation.data.name,
				phone: validation.data.phone,
			});

			if (newContact) {
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
				<AvatarPreview
					initials={formData.initials || "?"}
					color={formData.color}
				/>

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
				<ColorPicker
					selectedColor={formData.color}
					onColorChange={(color) => setFormData((prev) => ({ ...prev, color }))}
				/>
			</ScreenLayout>
		</>
	);
}
