import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { AvatarPreview, ColorPicker, DistrictPickerModal } from "@/components";
import { FormField, ScreenLayout } from "@/components/common";
import { useContacts } from "@/hooks/useContacts";
import { generateInitials, generateRandomColor } from "@/utils/contactUtils";
import { verticalScale } from "@/utils/responsive";
import { validateContact } from "@/utils/validation";

export default function CreateContactScreen() {
	const router = useRouter();
	const { createContact } = useContacts();

	// State for form data
	const [formData, setFormData] = useState({
		name: "",
		phone: "",
		address: "",
		gstin: "",
		dlNo: "",
		district: "",
		initials: "",
		color: generateRandomColor(),
	});

	// District picker modal state
	const [districtPickerVisible, setDistrictPickerVisible] = useState(false);

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
			address: formData.address.trim(),
			gstin: formData.gstin.trim() || undefined,
			dlNo: formData.dlNo.trim() || undefined,
			district: formData.district.trim() || undefined,
		});

		if (!validation.success) {
			Alert.alert("Error", validation.error);
			return;
		}

		try {
			// Use Convex mutation
			const result = await createContact({
				name: validation.data.name,
				phone: validation.data.phone,
				address: validation.data.address,
				gstin: validation.data.gstin,
				dlNo: validation.data.dlNo,
				district: validation.data.district,
			});

			if (result) {
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
				<ScrollView showsVerticalScrollIndicator={false}>
					{/* Contact Avatar Preview - for visual feedback only */}
					<View
						style={{ alignItems: "center", marginBottom: verticalScale(20) }}
					>
						<AvatarPreview
							initials={formData.initials || "?"}
							color={formData.color}
						/>
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

					<FormField
						label="Address"
						icon="location-on"
						required
						placeholder="Enter address"
						value={formData.address}
						onChangeText={(text) =>
							setFormData((prev) => ({ ...prev, address: text }))
						}
						multiline
						numberOfLines={3}
					/>

					<FormField
						label="District"
						icon="location-city"
						placeholder="Select district"
						value={formData.district}
						onPress={() => setDistrictPickerVisible(true)}
						rightIcon="chevron-right"
						editable={false}
					/>

					<FormField
						label="GSTIN No"
						icon="info"
						placeholder="Enter GSTIN number"
						value={formData.gstin}
						onChangeText={(text) =>
							setFormData((prev) => ({ ...prev, gstin: text }))
						}
						autoCapitalize="characters"
					/>

					<FormField
						label="DL No"
						icon="badge"
						placeholder="Enter DL number"
						value={formData.dlNo}
						onChangeText={(text) =>
							setFormData((prev) => ({ ...prev, dlNo: text }))
						}
						autoCapitalize="characters"
					/>

					{/* Initials Field (Auto-generated) - visual feedback only */}
					<FormField
						label="Initials"
						icon="text-format"
						value={formData.initials}
						editable={false}
						placeholder="Auto-generated"
						rightIcon={undefined}
					/>

					{/* Color Selection - visual feedback only, server-side will generate random color */}
					<ColorPicker
						selectedColor={formData.color}
						onColorChange={(color) =>
							setFormData((prev) => ({ ...prev, color }))
						}
					/>
				</ScrollView>

				{/* District Picker Modal */}
				<DistrictPickerModal
					visible={districtPickerVisible}
					onClose={() => setDistrictPickerVisible(false)}
					onDistrictSelect={(district) =>
						setFormData((prev) => ({ ...prev, district }))
					}
					selectedDistrict={formData.district}
				/>
			</ScreenLayout>
		</>
	);
}
