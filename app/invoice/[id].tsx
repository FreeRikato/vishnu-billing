import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
	Alert,
	Platform,
	ScrollView,
	StatusBar,
	StyleSheet,
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
	InvoicePreviewHeader,
	PageIndicator,
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
	const [capturing, setCapturing] = useState(false);

	// Zoom Logic for Android (Pinch to Inspect)
	const { pinchGesture, animatedStyle } = usePinchToZoom();

	if (!invoice) {
		return (
			<SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
				<StatusBar barStyle="light-content" backgroundColor="#000000" />
				<InvoicePreviewHeader onBack={() => router.back()} />
				<InvoiceErrorState />
			</SafeAreaView>
		);
	}

	// Get PDF URI - checks if saved PDF exists, otherwise generates it
	const getPdfUri = async (): Promise<string> => {
		// Check if stored PDF exists
		if (invoice.pdfPath && (await PdfService.pdfExists(invoice.pdfPath))) {
			return invoice.pdfPath;
		}

		// Fallback to generating it
		const html = generateInvoiceHtml(
			"Vishnu Billing", // senderName
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

	return (
		<SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<StatusBar barStyle="light-content" backgroundColor="#000000" />

				{/* Header */}
				<InvoicePreviewHeader onBack={handleBack} />

				{capturing && <InvoiceLoadingOverlay />}

				{/* Main Content */}
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
					minimumZoomScale={1}
					maximumZoomScale={3}
				>
					{/* Zoom Hint */}
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

					{/* Page Count */}
					<PageIndicator />

					{/* Spacer for bottom elements */}
					<View style={styles.spacer} />
				</ScrollView>

				{/* Floating Bottom Action Bar */}
				<InvoiceActionBar
					onSave={handleSave}
					onShare={handleShare}
					disabled={capturing}
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
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingTop: 24,
		paddingBottom: 200,
		paddingHorizontal: 16,
	},
	previewContainer: {
		alignSelf: "center",
		backgroundColor: "#ffffff",
		borderRadius: 4,
		// Simple shadow for depth against black bg
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		// overflow: "hidden", // Removed to allow zoom to spill over if needed
	},
	spacer: {
		height: 96,
	},
});
