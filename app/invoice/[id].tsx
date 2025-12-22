import EvilIcons from "@expo/vector-icons/EvilIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useMemo, useState } from "react";
import {
	ActivityIndicator,
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
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { InvoicePreviewCard } from "@/components/invoice/InvoicePreviewCard";
import { useInvoiceStore } from "@/store/invoiceStore";
import { generateInvoiceHtml } from "@/utils/pdfTemplate";

export default function InvoicePreviewScreen() {
	const { id } = useLocalSearchParams();
	const router = useRouter();

	// Safely parse ID
	const idString = Array.isArray(id) ? id[0] : id;
	const invoiceId = Number(idString);

	const invoice = useInvoiceStore((state) =>
		state.getInvoiceById(invoiceId),
	);
	const [capturing, setCapturing] = useState(false);

	// Zoom Logic for Android (Pinch to Inspect)
	const scale = useSharedValue(1);
	const savedScale = useSharedValue(1);

	const pinchGesture = useMemo(
		() =>
			Gesture.Pinch()
				.onUpdate((e) => {
					scale.value = savedScale.value * e.scale;
				})
				.onEnd(() => {
					// Snap back to 1 on release for Android to ensure usability
					scale.value = withSpring(1);
					savedScale.value = 1;
				}),
		[scale, savedScale],
	);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
		zIndex: 10, // Ensure it sits on top when zooming
	}));

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
					<Text style={styles.headerTitle}>Invoice Preview</Text>
					<View style={styles.placeholder} />
				</View>
				<View style={styles.errorContainer}>
					<MaterialIcons name="error-outline" size={48} color="#9ca3af" />
					<Text style={styles.errorText}>Invoice not found</Text>
				</View>
			</SafeAreaView>
		);
	}

	// Get PDF URI - checks if saved PDF exists, otherwise generates it
	const getPdfUri = async (): Promise<string> => {
		// Check if stored PDF exists
		if (invoice.pdfPath) {
			const fileInfo = await FileSystem.getInfoAsync(invoice.pdfPath);
			if (fileInfo.exists) {
				return invoice.pdfPath;
			}
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

		const { uri } = await Print.printToFileAsync({ html });
		return uri;
	};

	const handleBack = () => {
		router.back();
	};

	const handleSave = async () => {
		setCapturing(true);
		try {
			// Get PDF URI (uses saved PDF if available)
			const pdfUri = await getPdfUri();

			// Check if sharing is available (iOS Files app, Android Storage)
			const isAvailable = await Sharing.isAvailableAsync();
			if (isAvailable) {
				// On iOS: allows saving to Files app
				// On Android: allows saving via system picker
				await Sharing.shareAsync(pdfUri, {
					mimeType: "application/pdf",
					dialogTitle: `Save Invoice ${invoice.invoiceNumber}`,
					// On iOS, this enables the "Save to Files" option
				});
			} else {
				Alert.alert(
					"Info",
					"PDF generated but sharing is not available on this device.",
				);
			}
		} catch (error) {
			// User cancelled sharing is not an error
			if (error instanceof Error && !error.message.includes("cancelled")) {
				console.error("Error saving invoice:", error);
				Alert.alert("Error", "Failed to save invoice PDF");
			}
		} finally {
			setCapturing(false);
		}
	};

	const handleShare = async () => {
		setCapturing(true);
		try {
			// Get PDF URI (uses saved PDF if available)
			const pdfUri = await getPdfUri();

			// Share the PDF
			const isAvailable = await Sharing.isAvailableAsync();
			if (isAvailable) {
				await Sharing.shareAsync(pdfUri, {
					mimeType: "application/pdf",
					dialogTitle: `Share Invoice ${invoice.invoiceNumber}`,
				});
			} else {
				Alert.alert("Success", "Invoice PDF saved successfully!");
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
				<View style={styles.header}>
					<TouchableOpacity onPress={handleBack} style={styles.backButton}>
						<EvilIcons name="arrow-left" size={32} color="#FFFFFF" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Invoice Preview</Text>
					<View style={styles.placeholder} />
				</View>

				{capturing && (
					<View style={styles.loadingOverlay}>
						<ActivityIndicator size="large" color="#13ec6a" />
						<Text style={styles.loadingText}>Generating PDF...</Text>
					</View>
				)}

				{/* Main Content */}
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
					minimumZoomScale={1}
					maximumZoomScale={3}
				>
					{/* Zoom Hint */}
					<View style={styles.zoomHint}>
						<MaterialIcons name="zoom-in" size={16} color="#9CA3AF" />
						<Text style={styles.zoomHintText}>Pinch to zoom invoice</Text>
					</View>

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
					<View style={styles.pageIndicator}>
						<Text style={styles.pageIndicatorText}>Page 1 of 1</Text>
					</View>

					{/* Spacer for bottom elements */}
					<View style={styles.spacer} />
				</ScrollView>

				{/* Floating Bottom Action Bar */}
				<View style={styles.actionBar}>
					<TouchableOpacity
						onPress={handleSave}
						style={styles.saveButton}
						disabled={capturing}
					>
						<MaterialIcons name="save-alt" size={24} color="#ffffff" />
						<Text style={styles.saveButtonText}>Save</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={handleShare}
						style={styles.shareButton}
						disabled={capturing}
					>
						<MaterialIcons name="share" size={24} color="#000000" />
						<Text style={styles.shareButtonText}>Share</Text>
					</TouchableOpacity>
				</View>
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
	headerTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#FFFFFF",
		textAlign: "center",
	},
	placeholder: {
		width: 64,
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 16,
	},
	errorText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#9ca3af",
	},
	loadingOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.8)",
		justifyContent: "center",
		alignItems: "center",
		gap: 12,
		zIndex: 50,
	},
	loadingText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#ffffff",
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingTop: 24,
		paddingBottom: 200,
		paddingHorizontal: 16,
	},
	zoomHint: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		alignSelf: "center",
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		borderRadius: 9999,
		paddingHorizontal: 16,
		paddingVertical: 6,
		marginBottom: 24,
	},
	zoomHintText: {
		fontSize: 14,
		fontWeight: "500",
		color: "#9CA3AF",
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
	pageIndicator: {
		marginTop: 24,
		alignSelf: "center",
		backgroundColor: "#1C1C1E",
		borderRadius: 9999,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.1)",
		paddingHorizontal: 12,
		paddingVertical: 4,
	},
	pageIndicatorText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#9CA3AF",
	},
	spacer: {
		height: 96,
	},
	actionBar: {
		position: "absolute",
		bottom: 30,
		left: 20,
		right: 20,
		flexDirection: "row",
		gap: 16,
	},
	saveButton: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		height: 64,
		backgroundColor: "#1C1C1E",
		borderRadius: 32,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.1)",
	},
	saveButtonText: {
		fontSize: 18,
		fontWeight: "700",
		color: "#ffffff",
	},
	shareButton: {
		flex: 1.5,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		height: 64,
		backgroundColor: "#13ec6a",
		borderRadius: 32,
		shadowColor: "#13ec6a",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 8,
	},
	shareButtonText: {
		fontSize: 18,
		fontWeight: "700",
		color: "#000000",
	},
});
