import { EvilIcons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
	Alert,
	Platform,
	StatusBar,
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
	PaymentModal,
	ZoomHint,
} from "@/components";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { usePinchToZoom } from "@/hooks/usePinchToZoom";
import { invoiceStyles } from "@/styles";
import PdfService from "@/utils/pdfService";
import { generateInvoiceHtml } from "@/utils/pdfTemplate";
import { scale } from "@/utils/responsive";

export default function InvoicePreviewScreen() {
	const { id } = useLocalSearchParams();
	const router = useRouter();

	// The ID from params is now a string (Convex ID)
	const invoiceId = Array.isArray(id) ? id[0] : id;

	// Fetch invoice using Convex query
	const invoice = useQuery(
		api.invoices.get,
		invoiceId ? { id: invoiceId as Id<"invoices"> } : "skip",
	);
	const isLoading = invoice === undefined;

	// Mutations
	const updatePayment = useMutation(api.invoices.updatePayment);
	const deleteInvoice = useMutation(api.invoices.remove);

	const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);

	// Zoom Logic for Android (Pinch to Inspect)
	const { pinchGesture, animatedStyle } = usePinchToZoom();

	if (isLoading) {
		return (
			<SafeAreaView
				style={invoiceStyles.container}
				edges={["top", "left", "right"]}
			>
				<StatusBar barStyle="light-content" backgroundColor="#000000" />
				<View style={invoiceStyles.header}>
					<TouchableOpacity
						onPress={() => router.back()}
						style={invoiceStyles.backButton}
					>
						<EvilIcons name="arrow-left" size={scale(32)} color="#FFFFFF" />
					</TouchableOpacity>
				</View>
				<InvoiceLoadingOverlay />
			</SafeAreaView>
		);
	}

	if (!invoice) {
		return (
			<SafeAreaView
				style={invoiceStyles.container}
				edges={["top", "left", "right"]}
			>
				<StatusBar barStyle="light-content" backgroundColor="#000000" />
				<View style={invoiceStyles.header}>
					<TouchableOpacity
						onPress={() => router.back()}
						style={invoiceStyles.backButton}
					>
						<EvilIcons name="arrow-left" size={scale(32)} color="#FFFFFF" />
					</TouchableOpacity>
				</View>
				<InvoiceErrorState />
			</SafeAreaView>
		);
	}

	// Get PDF URI - generates it on the fly (Convex doesn't store local PDF paths)
	const getPdfUri = async (): Promise<string> => {
		// Add id field to items if not present (for compatibility)
		const itemsWithIds = invoice.items.map((item, index) => ({
			...item,
			id: item.id || `item-${index}`,
		}));

		const html = generateInvoiceHtml(
			"Vishnu Billing",
			invoice.invoiceNumber,
			invoice.date,
			{
				name: invoice.customerName,
				phone: invoice.customerPhone,
				address: invoice.customerAddress,
				gstin: invoice.customerGstin ?? undefined,
				dlNo: invoice.customerDlNo ?? undefined,
			},
			itemsWithIds,
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
						const result = await deleteInvoice({
							id: invoiceId as Id<"invoices">,
						});
						if (result.success) {
							router.back();
						} else {
							Alert.alert("Error", "Failed to delete invoice");
						}
					},
				},
			],
		);
	};

	const handlePayment = async (amount: number) => {
		const result = await updatePayment({
			id: invoiceId as Id<"invoices">,
			amountPaid: Math.round(amount), // Amount is already in paise
		});

		if (result.success) {
			Alert.alert(
				"Success",
				`Payment updated! Status: ${result.newStatus?.toUpperCase()}`,
			);
		} else {
			Alert.alert("Error", "Failed to update payment");
		}
	};

	const handleShare = async () => {
		try {
			const pdfUri = await getPdfUri();
			await PdfService.sharePdf(pdfUri, `Invoice ${invoice.invoiceNumber}`);
		} catch (error) {
			console.error("Error sharing invoice:", error);
			Alert.alert("Error", "Failed to share invoice");
		}
	};

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaView
				style={invoiceStyles.container}
				edges={["top", "left", "right"]}
			>
				<StatusBar barStyle="light-content" backgroundColor="#000000" />
				<View style={invoiceStyles.header}>
					<TouchableOpacity
						onPress={handleBack}
						style={invoiceStyles.backButton}
					>
						<EvilIcons name="arrow-left" size={scale(32)} color="#FFFFFF" />
					</TouchableOpacity>
				</View>

				{Platform.OS === "android" && (
					<GestureDetector gesture={pinchGesture}>
						<Animated.View style={animatedStyle}>
							<ZoomHint />
						</Animated.View>
					</GestureDetector>
				)}

				<InvoicePreviewCard invoice={invoice} />

				<InvoiceActionBar
					onSave={handleDelete}
					onShare={handleShare}
					onPayment={() => setPaymentModalVisible(true)}
				/>

				<PaymentModal
					visible={isPaymentModalVisible}
					onClose={() => setPaymentModalVisible(false)}
					onSave={handlePayment}
					totalAmountInPaise={invoice.total}
					currentPaidAmountInPaise={invoice.amountPaid}
				/>
			</SafeAreaView>
		</GestureHandlerRootView>
	);
}
