import { Platform, StyleSheet } from "react-native";
import { moderateScale, scale, verticalScale } from "@/utils/responsive";

/**
 * Common styles shared across multiple screens
 * Import specific styles as needed to keep bundles small
 */

export const commonStyles = StyleSheet.create({
	// Common container styles
	container: {
		flex: 1,
		backgroundColor: "#000000",
	},

	// Loading states
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: verticalScale(40),
	},
	loadingText: {
		color: "#FFFFFF",
		fontSize: moderateScale(16),
		marginTop: verticalScale(16),
		fontWeight: "500",
	},

	// Empty states
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: verticalScale(40),
	},
	emptyText: {
		color: "#9CA3AF",
		fontSize: moderateScale(16),
		fontWeight: "500",
	},

	// Floating Action Button (FAB) styles
	fab: {
		position: "absolute",
		bottom: verticalScale(10),
		right: scale(20),
		width: scale(72),
		height: scale(72),
		borderRadius: scale(36),
		backgroundColor: "#13EC6A",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#13EC6A",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
		zIndex: 20,
	},
	fabSmall: {
		position: "absolute",
		bottom: verticalScale(30),
		right: scale(20),
		width: scale(56),
		height: scale(56),
		borderRadius: scale(28),
		backgroundColor: "#13EC6A",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#13EC6A",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.25,
		shadowRadius: 6,
		elevation: 6,
		zIndex: 20,
	},

	// Common list item card style (shared across contacts and products)
	listItemCard: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "#1C1C1E",
		borderRadius: scale(16),
		paddingHorizontal: scale(16),
		paddingVertical: scale(16),
		marginBottom: scale(12),
		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},

	// Common edit button style
	editButton: {
		width: scale(48),
		height: scale(48),
		borderRadius: scale(24),
		backgroundColor: "#000000",
		justifyContent: "center",
		alignItems: "center",
	},

	// Bottom spacer for lists with FAB
	bottomSpacer: {
		height: verticalScale(32),
	},

	// Bottom navigation styles
	bottomNav: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "#000000",
		borderTopWidth: 1,
		borderTopColor: "#222222",
		paddingBottom: Platform.OS === "ios" ? scale(20) : 0,
	},
	navContainer: {
		flexDirection: "row",
		height: verticalScale(64),
		alignItems: "center",
		justifyContent: "space-around",
		paddingHorizontal: scale(8),
	},
	navItem: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: scale(8),
	},
	navLabel: {
		fontSize: moderateScale(12),
		fontWeight: "500",
		color: "#9CA3AF",
		marginTop: scale(4),
	},
	navLabelActive: {
		color: "#13EC6A",
		fontWeight: "bold",
	},

	// BaseSelectionModal styles
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.8)",
		justifyContent: "flex-end",
	},
	modalContainer: {
		backgroundColor: "#121212",
		borderTopLeftRadius: scale(32),
		borderTopRightRadius: scale(32),
		height: "92%",
		position: "relative",
	},
	dragHandleContainer: {
		alignItems: "center",
		paddingTop: scale(16),
		paddingBottom: scale(8),
	},
	dragHandle: {
		width: scale(48),
		height: scale(6),
		borderRadius: scale(3),
		backgroundColor: "rgba(156, 163, 175, 0.5)",
	},
	modalTitle: {
		fontSize: moderateScale(24),
		fontWeight: "700",
		color: "#ffffff",
		letterSpacing: -0.5,
	},
	closeButton: {
		padding: scale(8),
		marginRight: scale(-8),
		borderRadius: scale(20),
		backgroundColor: "transparent",
	},
	searchContainer: {
		paddingHorizontal: scale(20),
		paddingBottom: scale(16),
	},
	searchBar: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#1c1c1e",
		borderRadius: 9999,
		paddingHorizontal: scale(16),
		paddingVertical: scale(16),
		borderWidth: scale(1),
		borderColor: "rgba(255, 255, 255, 0.05)",
	},
	searchIcon: {
		marginRight: scale(12),
	},
	searchInput: {
		flex: 1,
		fontSize: moderateScale(16),
		color: "#ffffff",
		backgroundColor: "transparent",
		borderWidth: 0,
	},
	doneButton: {
		backgroundColor: "#3b82f6",
		height: verticalScale(56),
		borderRadius: scale(16),
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "rgba(59, 130, 246, 0.4)",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 1,
		shadowRadius: 8,
		elevation: 8,
	},
	doneButtonText: {
		fontSize: moderateScale(18),
		fontWeight: "700",
		color: "#ffffff",
		letterSpacing: 0.5,
	},
	homeIndicatorSpacer: {
		height: verticalScale(16),
		alignItems: "center",
		marginTop: scale(8),
	},
	homeIndicator: {
		width: scale(128),
		height: scale(4),
		borderRadius: scale(2),
		backgroundColor: "rgba(255, 255, 255, 0.2)",
	},
	// Additional modal styles
	modalHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: scale(24),
		paddingTop: scale(8),
		paddingBottom: scale(16),
	},
	modalContent: {
		flex: 1,
	},
	modalFooter: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "transparent",
		padding: scale(20),
	},

	// FormField styles
	fieldContainer: { marginBottom: verticalScale(32) },
	labelContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: scale(8),
		marginBottom: scale(12),
		paddingLeft: scale(8),
	},
	label: {
		fontSize: moderateScale(18),
		fontWeight: "bold",
		color: "#9CA3AF",
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	required: { fontSize: moderateScale(24), color: "#13EC6A", top: scale(-2) },
	inputContainer: { position: "relative" },
	input: {
		width: "100%",
		height: verticalScale(72),
		backgroundColor: "#1A1A1A",
		borderWidth: 2,
		borderColor: "#333333",
		borderRadius: scale(16),
		paddingHorizontal: scale(24),
		fontSize: moderateScale(20),
		color: "#FFFFFF",
		fontWeight: "500",
	},
	multilineInput: {
		height: verticalScale(120),
		textAlignVertical: "top",
	},
	disabledInput: {
		backgroundColor: "#2A2A2A",
		color: "#9CA3AF",
		borderColor: "#333333",
	},
	inputIcon: {
		position: "absolute",
		right: scale(24),
		top: "50%",
		marginTop: scale(-10),
	},

	// LoadingOverlay styles
	loadingOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 100,
	},

	// ScreenLayout styles
	centerContainer: {
		flex: 1,
		backgroundColor: "#000000",
		justifyContent: "center",
		alignItems: "center",
		gap: scale(16),
	},
	header: {
		backgroundColor: "rgba(0, 0, 0, 0.95)",
		borderBottomWidth: 1,
		borderBottomColor: "rgba(255, 255, 255, 0.1)",
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: scale(20),
		height: verticalScale(64),
	},
	headerButton: { minWidth: scale(60), alignItems: "center" },
	headerTitle: {
		fontSize: moderateScale(20),
		fontWeight: "bold",
		color: "#FFFFFF",
		textAlign: "center",
		flex: 1,
	},
	cancelText: {
		fontSize: moderateScale(18),
		fontWeight: "bold",
		color: "#EF4444",
	},
	saveText: {
		fontSize: moderateScale(18),
		fontWeight: "bold",
		color: "#13EC6A",
	},
	content: { flex: 1 },
	contentContainer: {
		paddingHorizontal: scale(20),
		paddingTop: scale(24),
		paddingBottom: verticalScale(128),
	},
	errorText: {
		fontSize: moderateScale(20),
		color: "#FFFFFF",
		fontWeight: "bold",
	},
	backButton: {
		backgroundColor: "#13EC6A",
		paddingHorizontal: scale(32),
		paddingVertical: scale(16),
		borderRadius: scale(25),
	},
	backButtonText: {
		color: "#000000",
		fontSize: moderateScale(16),
		fontWeight: "bold",
	},
});

// Re-export specific style groups for convenience
export const listStyles = StyleSheet.create({
	container: commonStyles.container,
	loadingContainer: commonStyles.loadingContainer,
	loadingText: commonStyles.loadingText,
	emptyContainer: commonStyles.emptyContainer,
	emptyText: commonStyles.emptyText,
	listItemCard: commonStyles.listItemCard,
	editButton: commonStyles.editButton,
	bottomSpacer: commonStyles.bottomSpacer,
});

export const fabStyles = StyleSheet.create({
	fab: commonStyles.fab,
	fabSmall: commonStyles.fabSmall,
});

export const navStyles = StyleSheet.create({
	bottomNav: commonStyles.bottomNav,
	navContainer: commonStyles.navContainer,
	navItem: commonStyles.navItem,
	navLabel: commonStyles.navLabel,
	navLabelActive: commonStyles.navLabelActive,
});

export const modalStyles = StyleSheet.create({
	overlay: commonStyles.overlay,
	modalContainer: commonStyles.modalContainer,
	dragHandleContainer: commonStyles.dragHandleContainer,
	dragHandle: commonStyles.dragHandle,
	modalTitle: commonStyles.modalTitle,
	closeButton: commonStyles.closeButton,
	searchContainer: commonStyles.searchContainer,
	searchBar: commonStyles.searchBar,
	searchIcon: commonStyles.searchIcon,
	searchInput: commonStyles.searchInput,
	doneButton: commonStyles.doneButton,
	doneButtonText: commonStyles.doneButtonText,
	homeIndicatorSpacer: commonStyles.homeIndicatorSpacer,
	homeIndicator: commonStyles.homeIndicator,
	modalHeader: commonStyles.modalHeader,
	modalContent: commonStyles.modalContent,
	modalFooter: commonStyles.modalFooter,
});
