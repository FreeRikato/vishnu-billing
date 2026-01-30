import { StyleSheet } from "react-native";
import { HOME_CONSTANTS } from "@/constants/home";
import { moderateScale, scale } from "@/utils/responsive";

export const homeStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: HOME_CONSTANTS.STYLES.BACKGROUND_COLOR,
	},
	header: {
		paddingHorizontal: scale(24),
		paddingTop: scale(10),
		paddingBottom: scale(24),
	},
	headerTop: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: scale(8),
	},
	greeting: {
		fontSize: moderateScale(28),
		fontWeight: "700",
		color: HOME_CONSTANTS.STYLES.TEXT_COLORS.PRIMARY,
		lineHeight: moderateScale(36),
	},
	backupIcon: {
		width: scale(40),
		height: scale(40),
		borderRadius: scale(20),
		backgroundColor: HOME_CONSTANTS.STYLES.BACKDROP_COLOR,
		justifyContent: "center",
		alignItems: "center",
	},
	backupStatus: {
		fontSize: moderateScale(18),
		fontWeight: "500",
		color: HOME_CONSTANTS.STYLES.TEXT_COLORS.SECONDARY,
	},
	actionSection: {
		paddingHorizontal: scale(24),
		paddingVertical: scale(16),
	},
	createInvoiceButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: HOME_CONSTANTS.STYLES.PRIMARY_COLOR,
		paddingVertical: scale(20),
		paddingHorizontal: scale(24),
		borderRadius: scale(40),
		shadowColor: HOME_CONSTANTS.STYLES.PRIMARY_COLOR,
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.3,
		shadowRadius: scale(20),
		elevation: 10,
		gap: scale(12),
	},
	createInvoiceText: {
		fontSize: moderateScale(20),
		fontWeight: "700",
		color: HOME_CONSTANTS.STYLES.TEXT_COLORS.PRIMARY,
		letterSpacing: 0.5,
	},
	errorText: {
		fontSize: moderateScale(16),
		color: HOME_CONSTANTS.STYLES.ERROR_COLOR,
		textAlign: "center",
	},

	// RecoverButton styles
	hidden: {
		display: "none",
	},
	devSection: {
		marginTop: scale(20),
		borderTopWidth: 1,
		borderTopColor: "#222",
		paddingTop: scale(20),
	},
	recoverButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: scale(12),
		padding: scale(16),
		borderRadius: scale(12),
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
		fontSize: moderateScale(16),
		fontWeight: "bold",
	},
	recoverTextDisabled: {
		color: "#555",
	},
	devNote: {
		fontSize: moderateScale(10),
		color: "#555",
		marginTop: scale(2),
	},

	// SyncStatusIndicator styles
	syncIndicator: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: scale(8),
		gap: scale(8),
		backgroundColor: "rgba(19, 236, 106, 0.1)",
	},
	syncText: {
		color: "#13EC6A",
		fontSize: moderateScale(14),
		fontWeight: "600",
	},

	// InvoiceStatsChart styles
	chartCard: {
		backgroundColor: "#1C1C1E", // Matches app card style
		borderRadius: scale(24),
		padding: scale(24),
		marginBottom: scale(8), // Spacing above the create button
	},
	chartTitle: {
		color: "#FFFFFF",
		fontSize: moderateScale(20),
		fontWeight: "bold",
		marginBottom: scale(24),
	},
	chartContentContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: scale(20),
	},
	chartContainer: {
		width: scale(140),
		height: scale(140),
		maxWidth: 250, // Cap size for tablets
		maxHeight: 250,
		position: "relative",
	},
	centerTextContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
		padding: scale(10),
	},
	centerLabel: {
		color: "#9CA3AF",
		fontSize: moderateScale(12),
		fontWeight: "500",
		marginBottom: scale(2),
	},
	centerValue: {
		color: "#FFFFFF",
		fontSize: moderateScale(14),
		fontWeight: "bold",
	},
	legendContainer: {
		flex: 1,
		gap: scale(20),
	},
	legendItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: scale(12),
	},
	legendDot: {
		width: scale(10),
		height: scale(10),
		borderRadius: scale(5),
		marginTop: scale(2),
	},
	legendLabel: {
		color: "#9CA3AF",
		fontSize: moderateScale(13),
		fontWeight: "500",
		marginBottom: scale(2),
	},
	legendValuePaid: {
		color: "#13EC6A",
		fontSize: moderateScale(18),
		fontWeight: "bold",
	},
	legendValueUnpaid: {
		color: "#EF4444",
		fontSize: moderateScale(18),
		fontWeight: "bold",
	},
});
