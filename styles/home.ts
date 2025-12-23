import { StyleSheet } from "react-native";
import { HOME_CONSTANTS } from "@/constants/home";

export const homeStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: HOME_CONSTANTS.STYLES.BACKGROUND_COLOR,
	},
	header: {
		paddingHorizontal: 24,
		paddingTop: 10,
		paddingBottom: 24,
	},
	headerTop: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	greeting: {
		fontSize: 28,
		fontWeight: "700",
		color: HOME_CONSTANTS.STYLES.TEXT_COLORS.PRIMARY,
		lineHeight: 36,
	},
	backupIcon: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: HOME_CONSTANTS.STYLES.BACKDROP_COLOR,
		justifyContent: "center",
		alignItems: "center",
	},
	backupStatus: {
		fontSize: 18,
		fontWeight: "500",
		color: HOME_CONSTANTS.STYLES.TEXT_COLORS.SECONDARY,
	},
	actionSection: {
		paddingHorizontal: 24,
		paddingVertical: 16,
	},
	createInvoiceButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: HOME_CONSTANTS.STYLES.PRIMARY_COLOR,
		paddingVertical: 20,
		paddingHorizontal: 24,
		borderRadius: 40,
		shadowColor: HOME_CONSTANTS.STYLES.PRIMARY_COLOR,
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.3,
		shadowRadius: 20,
		elevation: 10,
		gap: 12,
	},
	createInvoiceText: {
		fontSize: 20,
		fontWeight: "700",
		color: HOME_CONSTANTS.STYLES.TEXT_COLORS.PRIMARY,
		letterSpacing: 0.5,
	},
	errorText: {
		fontSize: 16,
		color: HOME_CONSTANTS.STYLES.ERROR_COLOR,
		textAlign: "center",
	},

	// RecoverButton styles
	hidden: {
		display: "none",
	},
	devSection: {
		marginTop: 20,
		borderTopWidth: 1,
		borderTopColor: "#222",
		paddingTop: 20,
	},
	recoverButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 12,
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#EF4444",
		backgroundColor: "rgba(239, 68, 68, 0.1)",
	},
	recoverButtonDisabled: {
		borderColor: "#333",
		backgroundColor: "#1A1A1A",
	},
	recoverText: {
		color: "#EF4444",
		fontSize: 16,
		fontWeight: "bold",
	},
	recoverTextDisabled: {
		color: "#555",
	},
	devNote: {
		fontSize: 10,
		color: "#555",
		marginTop: 2,
	},

	// SyncStatusIndicator styles
	syncIndicator: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 8,
		gap: 8,
		backgroundColor: "rgba(19, 236, 106, 0.1)",
	},
	syncText: {
		color: "#13EC6A",
		fontSize: 14,
		fontWeight: "600",
	},
});
