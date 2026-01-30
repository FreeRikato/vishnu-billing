import { useMutation, useQuery } from "convex/react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { AvatarPreview, ColorPicker, DeleteContactButton } from "@/components";
import { FormField, ScreenLayout } from "@/components/common";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { generateInitials } from "@/utils/contactUtils";
import { verticalScale } from "@/utils/responsive";

export default function ContactDetailScreen() {
	const router = useRouter();
	const { id } = useLocalSearchParams();

	// The ID from params is now a string (Convex ID)
	const contactId = Array.isArray(id) ? id[0] : id;

	// Fetch contact using Convex query
	const contact = useQuery(
		api.contacts.get,
		contactId ? { id: contactId as Id<"contacts"> } : "skip",
	);
	const isLoading = contact === undefined;

	// Mutations
	const updateContact = useMutation(api.contacts.update);
	const deleteContact = useMutation(api.contacts.remove);

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

	// Update form data when contact loads
	useEffect(() => {
		if (contact) {
			setFormData({
				name: contact.name,
				phone: contact.phone,
				address: contact.address,
				gstin: contact.gstin ?? "",
				dlNo: contact.dlNo ?? "",
				initials: contact.initials,
				color: contact.color,
			});
		}
	}, [contact]);

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
		if (!contactId || !contact) return;

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
			const result = await updateContact({
				id: contactId as Id<"contacts">,
				name: formData.name,
				phone: formData.phone,
				address: formData.address,
				gstin: formData.gstin.trim() || undefined,
				dlNo: formData.dlNo.trim() || undefined,
				color: formData.color,
			});

			if (result) {
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
		if (!contactId || !contact) return;

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
							const result = await deleteContact({
								id: contactId as Id<"contacts">,
							});
							if (result.success) {
								Alert.alert("Success", "Contact deleted successfully");
								router.back();
							} else {
								if (result.reason === "has_invoices") {
									Alert.alert(
										"Cannot Delete",
										"This contact has invoices associated with it. Delete those invoices first.",
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

	if (isLoading) {
		return (
			<>
				<Stack.Screen options={{ headerShown: false }} />
				<ScreenLayout title="" onCancel={handleCancel}>
					<View
						style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
					>
						<View
							style={{
								width: 32,
								height: 32,
								borderRadius: 16,
								backgroundColor: "#13ec6a",
							}}
						/>
					</View>
				</ScreenLayout>
			</>
		);
	}

	if (!contact) {
		return (
			<>
				<Stack.Screen options={{ headerShown: false }} />
				<ScreenLayout title="" onCancel={handleCancel}>
					<View
						style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
					>
						<Text>Contact not found</Text>
					</View>
				</ScreenLayout>
			</>
		);
	}

	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />
			<ScreenLayout
				title="Edit Contact"
				onCancel={handleCancel}
				onSave={handleSave}
			>
				<ScrollView showsVerticalScrollIndicator={false}>
					{/* Contact Avatar Preview */}
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

					{/* Delete Section */}
					<DeleteContactButton onPress={handleDelete} />
				</ScrollView>
			</ScreenLayout>
		</>
	);
}
