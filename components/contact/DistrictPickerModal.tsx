import { MaterialIcons } from "@expo/vector-icons";
import { FlatList, Pressable, Text, View } from "react-native";
import { BaseSelectionModal } from "@/components/common";
import { useSearch } from "@/hooks/useSearch";
import { contactsStyles } from "@/styles/contacts";
import { TAMIL_NADU_DISTRICTS } from "@/utils/districtList";

interface DistrictPickerModalProps {
	visible: boolean;
	onClose: () => void;
	onDistrictSelect: (district: string) => void;
	selectedDistrict?: string;
}

export function DistrictPickerModal({
	visible,
	onClose,
	onDistrictSelect,
	selectedDistrict,
}: DistrictPickerModalProps) {
	// Filter function for districts
	const filterDistrict = (district: string, query: string) =>
		district.toLowerCase().includes(query.toLowerCase());

	// Use debounced search hook
	const {
		searchText,
		setSearchText,
		results: filteredDistricts,
	} = useSearch([...TAMIL_NADU_DISTRICTS], filterDistrict);

	const handleDistrictSelect = (district: string) => {
		onDistrictSelect(district);
		onClose();
	};

	const renderDistrictItem = ({ item }: { item: string }) => {
		const isSelected = selectedDistrict === item;

		return (
			<View style={contactsStyles.districtItem}>
				<Pressable
					style={({ pressed }) => [
						contactsStyles.districtContent,
						pressed && contactsStyles.districtContentPressed,
					]}
					onPress={() => handleDistrictSelect(item)}
				>
					<View style={contactsStyles.districtInfo}>
						<MaterialIcons
							name="location-city"
							size={20}
							color="#9ca3af"
							style={contactsStyles.districtIcon}
						/>
						<Text style={contactsStyles.districtName}>{item}</Text>
					</View>
					{isSelected && (
						<MaterialIcons name="check" size={20} color="#13EC6A" />
					)}
				</Pressable>
			</View>
		);
	};

	return (
		<BaseSelectionModal
			visible={visible}
			title="Select District"
			onClose={onClose}
			searchQuery={searchText}
			onSearchChange={setSearchText}
			searchPlaceholder="Search districts..."
		>
			<FlatList
				data={filteredDistricts}
				keyExtractor={(item) => item}
				renderItem={renderDistrictItem}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={contactsStyles.districtListContent}
			/>
		</BaseSelectionModal>
	);
}
export default DistrictPickerModal;
