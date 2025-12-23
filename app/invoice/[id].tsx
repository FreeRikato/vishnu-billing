import { EvilIcons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
	Alert,
	Platform,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import {
	GestureDetector,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	InvoiceActionBar,
	InvoiceErrorState,
	InvoiceLoadingOverlay,
	InvoicePreviewCard,
	PageIndicator,
	PaymentModal,
	ZoomHint,
} from "@/components";
import { usePinchToZoom } from "@/hooks/usePinchToZoom";
import PdfService from "@/services/pdfService";
import { useInvoiceStore } from "@/store/invoiceStore";
import { generateInvoiceHtml } from "@/utils/pdfTemplate";

export default function InvoicePreviewScreen() {
	const { id } = useLocalSearchParams();
	const router = useRouter();

	// Safely parse ID
	const idString = Array.isArray(id) ? id[0] : id;
	const invoiceId = Number(idString);

	const invoice = useInvoiceStore((state) => state.getInvoiceById(invoiceId));
	const updatePayment = useInvoiceStore((state) => state.updatePayment);
	const deleteInvoice = useInvoiceStore((state) => state.deleteInvoice);

	const [capturing, setCapturing] = useState(false);
	const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);

	// Zoom Logic for Android (Pinch to Inspect)
	const { pinchGesture, animatedStyle } = usePinchToZoom();

	if (!invoice) {
		return (
			<SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
				<StatusBar barStyle="light-content" backgroundColor="#000000" />
				<View style={styles.header}>
					<TouchableOpacity
						onPress={() => router.back()}
						style={styles.backButton}
					>
						<EvilIcons name="arrow-left" size={32} color="#FFFFFF" />
					</TouchableOpacity>
				</View>
				<InvoiceErrorState />
			</SafeAreaView>
		);
	}

	// Get PDF URI - checks if saved PDF exists, otherwise generates it
	const getPdfUri = async (): Promise<string> => {
		if (invoice.pdfPath && (await PdfService.pdfExists(invoice.pdfPath))) {
			return invoice.pdfPath;
		}

		// Fallback to generating it
		const html = generateInvoiceHtml(
			"Vishnu Billing",
			invoice.invoiceNumber,
			invoice.date,
			{ name: invoice.customerName, phone: invoice.customerPhone },
			invoice.items,
			{
				subtotal: invoice.subtotal,
				totalDiscount: invoice.totalDiscount,
				tax: invoice.tax,
				total: invoice.total,
			},
		);

		return await PdfService.generatePdf(html);
	};

	const handleBack = () => {
		router.back();
	};

	const handleDelete = () => {
		Alert.alert(
			"Delete Invoice",
			"Are you sure you want to delete this invoice? This action cannot be undone.",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						const success = await deleteInvoice(invoiceId);
						if (success) {
							router.back();
						} else {
							Alert.alert("Error", "Failed to delete invoice");
						}
					},
				},
			],
		);
	};

	const handleSave = async () => {
		setCapturing(true);
		try {
			const pdfUri = await getPdfUri();
			const result = await PdfService.sharePdf(
				pdfUri,
				`Save Invoice ${invoice.invoiceNumber}`,
			);

			if (!result.success && !result.cancelled) {
				Alert.alert(
					"Info",
					"PDF generated but sharing is not available on this device.",
				);
			}
		} catch (error) {
			console.error("Error saving invoice:", error);
			Alert.alert("Error", "Failed to save invoice PDF");
		} finally {
			setCapturing(false);
		}
	};

	const handleShare = async () => {
		setCapturing(true);
		try {
			const pdfUri = await getPdfUri();
			const result = await PdfService.sharePdf(
				pdfUri,
				`Share Invoice ${invoice.invoiceNumber}`,
			);

			if (!result.success && !result.cancelled) {
				Alert.alert("Error", "Failed to share invoice PDF");
			}
		} catch (error) {
			console.error("Error sharing invoice:", error);
			Alert.alert("Error", "Failed to share invoice PDF");
		} finally {
			setCapturing(false);
		}
	};

	const handlePaymentUpdate = async (amount: number) => {
		const success = await updatePayment(invoiceId, amount);
		if (!success) {
			Alert.alert("Error", "Failed to update payment");
		}
	};

	return (
		<SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<StatusBar barStyle="light-content" backgroundColor="#000000" />

				{/* Header with Delete Button */}
				<View style={styles.header}>
					<TouchableOpacity onPress={handleBack} style={styles.backButton}>
						<EvilIcons name="arrow-left" size={32} color="#FFFFFF" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Invoice Preview</Text>
					<TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
						<MaterialIcons name="delete-outline" size={28} color="#EF4444" />
					</TouchableOpacity>
				</View>

				{capturing && <InvoiceLoadingOverlay />}

				{/* Main Content */}
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
					minimumZoomScale={1}
					maximumZoomScale={3}
				>
					<ZoomHint />

					{/* Invoice Preview Card */}
					<View style={styles.previewContainer}>
						{Platform.OS === "android" ? (
							<GestureDetector gesture={pinchGesture}>
								<Animated.View style={animatedStyle}>
									<InvoicePreviewCard invoice={invoice} />
								</Animated.View>
							</GestureDetector>
						) : (
							<InvoicePreviewCard invoice={invoice} />
						)}
					</View>

					<PageIndicator />

					{/* Spacer for bottom elements */}
					<View style={styles.spacer} />
				</ScrollView>

				{/* Floating Bottom Action Bar */}
				<InvoiceActionBar
					onSave={handleSave}
					onShare={handleShare}
					onPayment={() => setPaymentModalVisible(true)}
					disabled={capturing}
				/>

				{/* Payment Modal */}
				<PaymentModal
					visible={isPaymentModalVisible}
					onClose={() => setPaymentModalVisible(false)}
					onSave={handlePaymentUpdate}
					totalAmount={invoice.total}
					currentPaidAmount={invoice.amountPaid || 0}
				/>
			</GestureHandlerRootView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000000",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 12,
		height: 64,
		backgroundColor: "#000000",
		borderBottomWidth: 1,
		borderBottomColor: "rgba(255, 255, 255, 0.1)",
	},
	backButton: {
		width: 48,
		height: 48,
		justifyContent: "center",
		alignItems: "flex-start",
	},
	deleteButton: {
		width: 48,
		height: 48,
		justifyContent: "center",
		alignItems: "flex-end",
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#FFFFFF",
		textAlign: "center",
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingTop: 16,
		paddingBottom: 200,
		paddingHorizontal: 16,
	},
	previewContainer: {
		alignSelf: "center",
		backgroundColor: "#ffffff",
		borderRadius: 4,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	spacer: {
		height: 96,
	},
});
