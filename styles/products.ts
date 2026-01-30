import { StyleSheet } from "react-native";
import { moderateScale, scale, verticalScale } from "@/utils/responsive";

export const productsStyles = StyleSheet.create({
	productItem: {
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
	productInfo: {
		flex: 1,
	},
	productNameContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	productName: {
		fontSize: moderateScale(20),
		fontWeight: "bold",
		color: "#FFFFFF",
	},
	productUnit: {
		fontSize: moderateScale(16),
		fontWeight: "500",
		color: "#9CA3AF",
		marginTop: scale(4),
	},
	productRight: {
		flexDirection: "row",
		alignItems: "center",
	},
	productPrice: {
		fontSize: moderateScale(24),
		fontWeight: "bold",
		color: "#13EC6A",
		marginRight: scale(12),
	},
	editButton: {
		marginRight: scale(8),
		padding: scale(4),
	},

	// ProductDeleteSection styles
	deleteSection: {
		paddingTop: verticalScale(32),
		paddingBottom: verticalScale(16),
	},
	deleteButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: scale(12),
		paddingVertical: scale(20),
		borderRadius: scale(25), // 50/2
		borderWidth: 2,
		borderColor: "rgba(239, 68, 68, 0.3)",
		backgroundColor: "rgba(239, 68, 68, 0.05)",
		marginBottom: scale(16),
	},
	deleteButtonText: {
		color: "#EF4444",
		fontSize: moderateScale(20),
		fontWeight: "bold",
		letterSpacing: 0.5,
	},
	deleteWarning: {
		textAlign: "center",
		color: "#6B7280",
		fontSize: moderateScale(14),
		fontWeight: "500",
	},
});
