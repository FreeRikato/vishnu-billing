import { Platform, StyleSheet } from "react-native";

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
		paddingVertical: 40,
	},
	loadingText: {
		color: "#FFFFFF",
		fontSize: 16,
		marginTop: 16,
		fontWeight: "500",
	},

	// Empty states
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 40,
	},
	emptyText: {
		color: "#9CA3AF",
		fontSize: 16,
		fontWeight: "500",
	},

	// Floating Action Button (FAB) styles
	fab: {
		position: "absolute",
		bottom: 10,
		right: 20,
		width: 72,
		height: 72,
		borderRadius: 36,
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
		bottom: 30,
		right: 20,
		width: 56,
		height: 56,
		borderRadius: 28,
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
		borderRadius: 16,
		paddingHorizontal: 16,
		paddingVertical: 16,
		marginBottom: 12,
		shadowColor: "#000000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},

	// Common edit button style
	editButton: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: "#000000",
		justifyContent: "center",
		alignItems: "center",
	},

	// Bottom spacer for lists with FAB
	bottomSpacer: {
		height: 32,
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
		paddingBottom: Platform.OS === "ios" ? 20 : 0,
	},
	navContainer: {
		flexDirection: "row",
		height: 64,
		alignItems: "center",
		justifyContent: "space-around",
		paddingHorizontal: 8,
	},
	navItem: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 8,
	},
	navLabel: {
		fontSize: 12,
		fontWeight: "500",
		color: "#9CA3AF",
		marginTop: 4,
	},
	navLabelActive: {
		color: "#13EC6A",
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
