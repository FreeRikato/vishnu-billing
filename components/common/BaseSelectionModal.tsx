import { Ionicons } from "@expo/vector-icons";
import {
	Modal,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
			<View style={styles.overlay}>
				<SafeAreaView style={styles.modalContainer} edges={["top"]}>
					{/* Drag Handle */}
					<View style={styles.dragHandleContainer}>
						<View style={styles.dragHandle} />
					</View>

					{/* Header */}
					<View style={styles.header}>
						<Text style={styles.modalTitle}>{title}</Text>
						<TouchableOpacity onPress={onClose} style={styles.closeButton}>
							<Ionicons name="close" size={28} color="#9ca3af" />
						</TouchableOpacity>
					</View>

					{/* Search Bar */}
					<View style={styles.searchContainer}>
						<View style={styles.searchBar}>
							<Ionicons
								name="search"
								size={20}
								color="#9ca3af"
								style={styles.searchIcon}
							/>
							<TextInput
								style={styles.searchInput}
								placeholder={searchPlaceholder}
								placeholderTextColor="#6b7280"
								value={searchQuery}
								onChangeText={onSearchChange}
							/>
						</View>
					</View>

					{/* Content (List) */}
					<View style={styles.content}>{children}</View>

					{/* Footer */}
					<View style={styles.footer}>
						<TouchableOpacity style={styles.doneButton} onPress={onClose}>
							<Text style={styles.doneButtonText}>Done</Text>
						</TouchableOpacity>
						{/* iOS Home Indicator Spacer */}
						<View style={styles.homeIndicatorSpacer}>
							<View style={styles.homeIndicator} />
						</View>
					</View>
				</SafeAreaView>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.8)",
		justifyContent: "flex-end",
	},
	modalContainer: {
		backgroundColor: "#121212",
		borderTopLeftRadius: 32,
		borderTopRightRadius: 32,
		height: "92%",
		position: "relative",
	},
	dragHandleContainer: {
		alignItems: "center",
		paddingTop: 16,
		paddingBottom: 8,
	},
	dragHandle: {
		width: 48,
		height: 6,
		borderRadius: 3,
		backgroundColor: "rgba(156, 163, 175, 0.5)",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 24,
		paddingTop: 8,
		paddingBottom: 16,
	},
	modalTitle: {
		fontSize: 24,
		fontWeight: "700",
		color: "#ffffff",
		letterSpacing: -0.5,
	},
	closeButton: {
		padding: 8,
		marginRight: -8,
		borderRadius: 20,
		backgroundColor: "transparent",
	},
	searchContainer: {
		paddingHorizontal: 20,
		paddingBottom: 16,
	},
	searchBar: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#1c1c1e",
		borderRadius: 9999,
		paddingHorizontal: 16,
		paddingVertical: 16,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.05)",
	},
	searchIcon: {
		marginRight: 12,
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		color: "#ffffff",
		backgroundColor: "transparent",
		borderWidth: 0,
	},
	content: {
		flex: 1,
	},
	footer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "transparent",
		padding: 20,
	},
	doneButton: {
		backgroundColor: "#3b82f6",
		height: 56,
		borderRadius: 16,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "rgba(59, 130, 246, 0.4)",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 1,
		shadowRadius: 8,
		elevation: 8,
	},
	doneButtonText: {
		fontSize: 18,
		fontWeight: "700",
		color: "#ffffff",
		letterSpacing: 0.5,
	},
	homeIndicatorSpacer: {
		height: 16,
		alignItems: "center",
		marginTop: 8,
	},
	homeIndicator: {
		width: 128,
		height: 4,
		borderRadius: 2,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
	},
});
