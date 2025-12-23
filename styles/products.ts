import { StyleSheet } from "react-native";

export const productsStyles = StyleSheet.create({
	productItem: {
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
	productInfo: {
		flex: 1,
	},
	productNameContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	productName: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#FFFFFF",
	},
	productUnit: {
		fontSize: 16,
		fontWeight: "500",
		color: "#9CA3AF",
		marginTop: 4,
	},
	productRight: {
		flexDirection: "row",
		alignItems: "center",
	},
	productPrice: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#13EC6A",
		marginRight: 12,
	},
	editButton: {
		marginRight: 8,
		padding: 4,
	},

	// ProductDeleteSection styles
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
