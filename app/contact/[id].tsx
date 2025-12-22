import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FormField, ScreenLayout } from "@/components/common";
import { getContactById } from "@/services/contactService";
import { useContactStore } from "@/store/contactStore";
import type { Contact } from "@/types";

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

		try {
			// Use store method which wraps service and updates state
			const updatedContact = await useContactStore
				.getState()
				.updateContact(contact.id, {
					name: formData.name,
					phone: formData.phone,
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
				{/* Contact Avatar Preview */}
				<View style={styles.avatarPreviewContainer}>
					<View
						style={[
							styles.avatarPreview,
							{ backgroundColor: `${formData.color}20` },
						]}
					>
						<Text style={[styles.avatarPreviewText, { color: formData.color }]}>
							{formData.initials}
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

				{/* Delete Button */}
				<View style={styles.deleteSection}>
					<TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
						<MaterialIcons name="delete-forever" size={24} color="#EF4444" />
						<Text style={styles.deleteButtonText}>Delete Contact</Text>
					</TouchableOpacity>
					<Text style={styles.deleteWarning}>
						This action cannot be undone.
					</Text>
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
	deleteSection: {
		paddingTop: 32,
		paddingBottom: 16,
	},
	deleteButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 12,
		paddingVertical: 20,
		borderRadius: 50,
		borderWidth: 2,
		borderColor: "rgba(239, 68, 68, 0.3)",
		backgroundColor: "rgba(239, 68, 68, 0.05)",
		marginBottom: 16,
	},
	deleteButtonText: {
		color: "#EF4444",
		fontSize: 20,
		fontWeight: "bold",
		letterSpacing: 0.5,
	},
	deleteWarning: {
		textAlign: "center",
		color: "#6B7280",
		fontSize: 14,
		fontWeight: "500",
	},
});
