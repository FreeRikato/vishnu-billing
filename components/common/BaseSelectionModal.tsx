import { Ionicons } from "@expo/vector-icons";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { modalStyles } from "@/styles";

interface BaseSelectionModalProps {
	visible: boolean;
	title: string;
	onClose: () => void;
	searchQuery: string;
	onSearchChange: (text: string) => void;
	searchPlaceholder?: string;
	children: React.ReactNode;
}

export function BaseSelectionModal({
	visible,
	title,
	onClose,
	searchQuery,
	onSearchChange,
	searchPlaceholder = "Search...",
	children,
}: BaseSelectionModalProps) {
	return (
		<Modal
			visible={visible}
			animationType="slide"
			presentationStyle="overFullScreen"
			transparent
			onRequestClose={onClose}
		>
			<View style={modalStyles.overlay}>
				<SafeAreaView style={modalStyles.modalContainer} edges={["top"]}>
					{/* Drag Handle */}
					<View style={modalStyles.dragHandleContainer}>
						<View style={modalStyles.dragHandle} />
					</View>

					{/* Header */}
					<View style={modalStyles.modalHeader}>
						<Text style={modalStyles.modalTitle}>{title}</Text>
						<TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
							<Ionicons name="close" size={28} color="#9ca3af" />
						</TouchableOpacity>
					</View>

					{/* Search Bar */}
					<View style={modalStyles.searchContainer}>
						<View style={modalStyles.searchBar}>
							<Ionicons
								name="search"
								size={20}
								color="#9ca3af"
								style={modalStyles.searchIcon}
							/>
							<TextInput
								style={modalStyles.searchInput}
								placeholder={searchPlaceholder}
								placeholderTextColor="#6b7280"
								value={searchQuery}
								onChangeText={onSearchChange}
							/>
						</View>
					</View>

					{/* Content (List) */}
					<View style={modalStyles.modalContent}>{children}</View>

					{/* Footer */}
					<View style={modalStyles.modalFooter}>
						<TouchableOpacity style={modalStyles.doneButton} onPress={onClose}>
							<Text style={modalStyles.doneButtonText}>Done</Text>
						</TouchableOpacity>
						{/* iOS Home Indicator Spacer */}
						<View style={modalStyles.homeIndicatorSpacer}>
							<View style={modalStyles.homeIndicator} />
						</View>
					</View>
				</SafeAreaView>
			</View>
		</Modal>
	);
}
