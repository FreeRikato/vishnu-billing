import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
	FlatList,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useSearch } from "../../hooks/useSearch";
import type { Customer } from "../../types/invoice";
import { BaseSelectionModal } from "../common/BaseSelectionModal";

interface ContactPickerModalProps {
	visible: boolean;
	onClose: () => void;
	onContactSelect: (customer: Customer) => void;
	customers: Customer[];
	selectedCustomerId?: string;
}

export function ContactPickerModal({
	visible,
	onClose,
	onContactSelect,
	customers,
	selectedCustomerId,
}: ContactPickerModalProps) {
	const [selectedId, setSelectedId] = useState<string | null>(
		selectedCustomerId || null,
	);

	// Filter function for customers
	const filterCustomer = useCallback(
		(customer: Customer, query: string) =>
			customer.name.toLowerCase().includes(query.toLowerCase()),
		[],
	);

	// Use debounced search hook
	const {
		searchText,
		setSearchText,
		results: filteredCustomers,
	} = useSearch(customers, filterCustomer);

	const handleContactSelect = (customer: Customer) => {
		setSelectedId(customer.id);
		onContactSelect(customer);
		onClose();
	};

	const renderContactItem = ({ item }: { item: Customer }) => {
		const isSelected = selectedId === item.id;

		return (
			<View style={styles.contactItem}>
				<Pressable
					style={({ pressed }) => [
						styles.contactContent,
						pressed && styles.contactContentPressed,
					]}
					onPress={() => handleContactSelect(item)}
				>
					<View style={styles.contactInfo}>
						<Text style={styles.contactName}>{item.name}</Text>
					</View>
					<TouchableOpacity
						style={[
							styles.selectButton,
							isSelected && styles.selectButtonSelected,
						]}
						onPress={() => handleContactSelect(item)}
					>
						{isSelected ? (
							<View style={styles.selectedButtonContent}>
								<Ionicons name="checkmark" size={16} color="#000000" />
								<Text style={styles.selectedButtonText}>SELECTED</Text>
							</View>
						) : (
							<Text style={styles.selectButtonContent}>SELECT</Text>
						)}
					</TouchableOpacity>
				</Pressable>
			</View>
		);
	};

	return (
		<BaseSelectionModal
			visible={visible}
			title="Select Customer"
			onClose={onClose}
			searchQuery={searchText}
			onSearchChange={setSearchText}
			searchPlaceholder="Search customers..."
		>
			<FlatList
				data={filteredCustomers}
				keyExtractor={(item) => item.id}
				renderItem={renderContactItem}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.contactListContent}
			/>
		</BaseSelectionModal>
	);
}

const styles = StyleSheet.create({
	contactItem: {
		borderBottomWidth: 1,
		borderBottomColor: "rgba(255, 255, 255, 0.1)",
	},
	contactContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 16,
		paddingHorizontal: 8,
		marginHorizontal: -8,
		borderRadius: 12,
	},
	contactContentPressed: {
		backgroundColor: "rgba(255, 255, 255, 0.05)",
	},
	contactInfo: {
		flex: 1,
	},
	contactName: {
		fontSize: 18,
		fontWeight: "600",
		color: "#ffffff",
		lineHeight: 24,
	},
	selectButton: {
		height: 44,
		minWidth: 96,
		borderRadius: 9999,
		borderWidth: 2,
		borderColor: "#13ec6a",
		backgroundColor: "transparent",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "rgba(19, 236, 106, 0.1)",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 1,
		shadowRadius: 10,
		elevation: 3,
	},
	selectButtonSelected: {
		backgroundColor: "#13ec6a",
		shadowColor: "rgba(19, 236, 106, 0.4)",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 1,
		shadowRadius: 15,
		elevation: 5,
	},
	selectButtonContent: {
		fontSize: 14,
		fontWeight: "700",
		color: "#13ec6a",
		letterSpacing: 0.5,
		textTransform: "uppercase",
	},
	selectedButtonContent: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	selectedButtonText: {
		fontSize: 14,
		fontWeight: "700",
		color: "#000000",
		letterSpacing: 0.5,
		textTransform: "uppercase",
	},
	contactListContent: {
		paddingHorizontal: 20,
		paddingBottom: 120,
	},
});
