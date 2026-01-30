import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { AvatarPreview, ColorPicker, DeleteContactButton } from "@/components";
import { FormField, ScreenLayout } from "@/components/common";
import { getContactById } from "@/services/contactService";
import { useContactStore } from "@/store/contactStore";
import type { Contact } from "@/types";
import { generateInitials } from "@/utils/contactUtils";
import { verticalScale } from "@/utils/responsive";

export default function ContactDetailScreen() {
	const router = useRouter();
	const { id } = useLocalSearchParams();

	// State for contact data and loading
	const [contact, setContact] = useState<Contact | null>(null);
	const [loading, setLoading] = useState(true);

	// State for form data
	const [formData, setFormData] = useState({
		name: "",
		phone: "",
		address: "",
		gstin: "",
		dlNo: "",
		initials: "",
		color: "#3B82F6",
	});

	// Load existing contact data
	const loadContact = useCallback(async () => {
		try {
			// Safely parse ID
			const idString = Array.isArray(id) ? id[0] : id;
			const contactId = Number(idString);

			if (contactId && !Number.isNaN(contactId)) {
				const contactData = await getContactById(contactId);
				if (contactData) {
					setContact(contactData);
					setFormData({
						name: contactData.name,
						phone: contactData.phone,
						address: contactData.address ?? "",
						gstin: contactData.gstin ?? "",
						dlNo: contactData.dlNo ?? "",
						initials: contactData.initials,
						color: contactData.color,
					});
				} else {
					Alert.alert("Error", "Contact not found");
					router.back();
				}
			} else {
				Alert.alert("Error", "Invalid contact ID");
				router.back();
			}
		} catch (error) {
			console.error("Error loading contact:", error);
			Alert.alert("Error", "Failed to load contact");
			router.back();
		} finally {
			setLoading(false);
		}
	}, [id, router]);

	useEffect(() => {
		loadContact();
	}, [loadContact]);

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
		if (!contact) return;

		if (!formData.name.trim()) {
			Alert.alert("Error", "Name is required");
			return;
		}

		if (!formData.phone.trim()) {
			Alert.alert("Error", "Phone number is required");
			return;
		}

		if (!formData.address.trim()) {
			Alert.alert("Error", "Address is required");
			return;
		}

		try {
			// Use store method which wraps service and updates state
			const updatedContact = await useContactStore
				.getState()
				.updateContact(contact.id, {
					name: formData.name,
					phone: formData.phone,
					address: formData.address,
					gstin: formData.gstin.trim() || null,
					dlNo: formData.dlNo.trim() || null,
					initials: formData.initials,
					color: formData.color,
				});

			if (updatedContact) {
				Alert.alert("Success", "Contact updated successfully");
				router.back();
			} else {
				Alert.alert("Error", "Failed to update contact");
			}
		} catch (error) {
			console.error("Error updating contact:", error);
			Alert.alert("Error", "Failed to update contact");
		}
	};

	const handleCancel = () => {
		router.back();
	};

	const handleDelete = async () => {
		if (!contact) return;

		Alert.alert(
			"Delete Contact?",
			`Are you sure you want to delete ${contact.name}? This cannot be undone.`,
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						try {
							// Use store method which wraps service and updates state
							const result = await useContactStore
								.getState()
								.deleteContact(contact.id);
							if (result.success) {
								Alert.alert("Success", "Contact deleted successfully");
								router.back();
							} else {
								if (result.reason === "has_invoices") {
									Alert.alert(
										"Cannot Delete Contact",
										"This contact is associated with existing invoices. Please delete the invoices first.",
									);
								} else {
									Alert.alert("Error", "Failed to delete contact");
								}
							}
						} catch (error) {
							console.error("Error deleting contact:", error);
							Alert.alert("Error", "Failed to delete contact");
						}
					},
				},
			],
		);
	};

	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />
			<ScreenLayout
				title="Edit Contact"
				onCancel={handleCancel}
				onSave={handleSave}
				isLoading={loading}
				loadingMessage="Loading contact..."
			>
				<ScrollView showsVerticalScrollIndicator={false}>
					{/* Contact Avatar Preview */}
					<View style={{ alignItems: "center", marginBottom: verticalScale(20) }}>
						<AvatarPreview
							initials={formData.initials}
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
						onColorChange={(color) =>
							setFormData((prev) => ({ ...prev, color }))
						}
					/>

					{/* Delete Button */}
					<DeleteContactButton onPress={handleDelete} />
				</ScrollView>
			</ScreenLayout>
		</>
	);
}
