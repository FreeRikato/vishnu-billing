import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	deleteContact,
	getContactById,
	updateContact,
} from "@/services/contactService";
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
	const { id } = useLocalSearchParams<{ id: string }>();

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
			const contactId = parseInt(id || "0", 10);
			if (contactId > 0) {
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
			const updatedContact = await updateContact(contact.id, {
				name: formData.name,
				phone: formData.phone,
				initials: formData.initials,
				color: formData.color,
			});

			if (updatedContact) {
				// Refresh the contact store to reflect the updated contact
				await useContactStore.getState().refresh();
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
							const success = await deleteContact(contact.id);
							if (success) {
								// Refresh the contact store to reflect the deleted contact
								await useContactStore.getState().refresh();
								Alert.alert("Success", "Contact deleted successfully");
								router.back();
							} else {
								Alert.alert("Error", "Failed to delete contact");
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

	if (loading) {
		return (
			<SafeAreaView
				style={styles.loadingContainer}
				edges={["top", "left", "right"]}
			>
				<ActivityIndicator size="large" color="#13EC6A" />
				<Text style={styles.loadingText}>Loading contact...</Text>
			</SafeAreaView>
		);
	}

	if (!contact) {
		return (
			<SafeAreaView
				style={styles.errorContainer}
				edges={["top", "left", "right"]}
			>
				<Text style={styles.errorText}>Contact not found</Text>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => router.back()}
				>
					<Text style={styles.backButtonText}>Go Back</Text>
				</TouchableOpacity>
			</SafeAreaView>
		);
	}

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
					<Text style={styles.headerTitle}>Edit Contact</Text>
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
							{formData.initials}
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

					{/* Delete Button */}
					<View style={styles.deleteSection}>
						<TouchableOpacity
							style={styles.deleteButton}
							onPress={handleDelete}
						>
							<MaterialIcons name="delete-forever" size={24} color="#EF4444" />
							<Text style={styles.deleteButtonText}>Delete Contact</Text>
						</TouchableOpacity>
						<Text style={styles.deleteWarning}>
							This action cannot be undone.
						</Text>
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
	loadingContainer: {
		flex: 1,
		backgroundColor: "#000000",
		justifyContent: "center",
		alignItems: "center",
		gap: 16,
	},
	loadingText: {
		fontSize: 18,
		color: "#FFFFFF",
		fontWeight: "500",
	},
	errorContainer: {
		flex: 1,
		backgroundColor: "#000000",
		justifyContent: "center",
		alignItems: "center",
		gap: 20,
		paddingHorizontal: 40,
	},
	errorText: {
		fontSize: 20,
		color: "#FFFFFF",
		fontWeight: "bold",
		textAlign: "center",
	},
	backButton: {
		backgroundColor: "#13EC6A",
		paddingHorizontal: 32,
		paddingVertical: 16,
		borderRadius: 25,
	},
	backButtonText: {
		color: "#000000",
		fontSize: 16,
		fontWeight: "bold",
	},
});
