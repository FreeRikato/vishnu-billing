import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
	FlatList,
	Pressable,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { invoiceStyles } from "@/styles";
import { scale } from "@/utils/responsive";
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
		selectedCustomerId ?? null,
	);

	// Filter function for customers
	const filterCustomer = (customer: Customer, query: string) =>
		customer.name.toLowerCase().includes(query.toLowerCase());

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
			<View style={invoiceStyles.contactItem}>
				<Pressable
					style={({ pressed }) => [
						invoiceStyles.contactContent,
						pressed && invoiceStyles.contactContentPressed,
					]}
					onPress={() => handleContactSelect(item)}
				>
					<View style={invoiceStyles.contactInfo}>
						<Text style={invoiceStyles.contactName}>{item.name}</Text>
					</View>
					<TouchableOpacity
						style={[
							invoiceStyles.selectButton,
							isSelected && invoiceStyles.selectButtonSelected,
						]}
						onPress={() => handleContactSelect(item)}
					>
						{isSelected ? (
							<View style={invoiceStyles.selectedButtonContent}>
								<Ionicons name="checkmark" size={scale(16)} color="#000000" />
								<Text style={invoiceStyles.selectedButtonText}>SELECTED</Text>
							</View>
						) : (
							<Text style={invoiceStyles.selectButtonContent}>SELECT</Text>
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
				contentContainerStyle={invoiceStyles.contactListContent}
			/>
		</BaseSelectionModal>
	);
}
