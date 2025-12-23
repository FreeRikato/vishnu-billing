import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import {
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getLocalDateString, useCreateInvoice } from "@/hooks/useCreateInvoice";
import { generateInvoiceNumber } from "@/services/invoiceService";
import PdfService from "@/services/pdfService";
import { useContactStore } from "@/store/contactStore";
import { useInvoiceStore } from "@/store/invoiceStore";
import { generateInvoiceHtml } from "@/utils/pdfTemplate";
import { ContactPickerModal } from "../../components/invoice/ContactPickerModal";
import { DiscountModal } from "../../components/invoice/DiscountModal";
import { ProductPickerModal } from "../../components/invoice/ProductPickerModal";

export default function CreateInvoiceScreen() {
	const addInvoice = useInvoiceStore((state) => state.addInvoice);
	const contacts = useContactStore((state) => state.contacts);

	// Use the custom hook to manage state and handlers
	const {
		invoiceItems,
		summary,
		selectedCustomer,
		globalDiscount,
		isEditingGlobalDiscount,
		discountModalVisible,
		productPickerVisible,
		contactPickerVisible,
		selectedProductId,
		availableProducts,
		customers,
		handleCancel,
		handleSelectCustomer,
		handleCreateNewCustomer,
		handleAddProduct,
		handleContactSelect,
		handleProductSelect,
		handleQuantityChange,
		handleRemoveProduct,
		handleAddDiscount,
		handleAddGlobalDiscount,
		handleRemoveGlobalDiscount,
		handleApplyDiscount,
		handleEditDiscount,
		setDiscountModalVisible,
		setProductPickerVisible,
		setContactPickerVisible,
		toInvoiceProduct,
	} = useCreateInvoice();

	const handlePreviewPDF = async () => {
		if (!selectedCustomer) {
			Alert.alert("Error", "Please select a customer first");
			return;
		}

		if (invoiceItems.length === 0) {
			Alert.alert("Error", "Please add at least one product to the invoice");
			return;
		}

		// Find the full contact object to get phone number
		const contact = contacts.find((c) => c.name === selectedCustomer.name);
		if (!contact) {
			Alert.alert("Error", "Contact not found");
			return;
		}

		try {
			// Generate invoice number once using the service
			const invoiceNumber = generateInvoiceNumber();

			// Generate invoice HTML
			const html = generateInvoiceHtml(
				"Vishnu Billing", // Sender name
				invoiceNumber, // Invoice number
				getLocalDateString(), // Date (local time)
				{
					name: contact.name,
					phone: contact.phone,
				},
				invoiceItems,
				summary,
			);

			// Generate and save PDF using PdfService
			const fileName = PdfService.generateFileName("invoice");
			const result = await PdfService.generateAndSavePdf(html, fileName);

			if (!result) {
				Alert.alert("Error", "Failed to generate PDF");
				return;
			}

			// Create invoice in database
			const newInvoice = await addInvoice({
				invoiceNumber,
				customerId: contact.id,
				customerName: contact.name,
				customerPhone: contact.phone,
				items: invoiceItems,
				summary,
				date: getLocalDateString(),
				pdfPath: result.savedPath ?? result.tempUri,
			});

			if (newInvoice) {
				Alert.alert("Success", "Invoice created successfully and PDF saved!", [
					{
						text: "OK",
						onPress: () => router.back(),
					},
				]);
			} else {
				Alert.alert("Error", "Failed to save invoice to database");
			}
		} catch (error) {
			console.error("Error generating PDF:", error);
			Alert.alert("Error", "Failed to generate PDF");
		}
	};

	return (
		<SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity
					onPress={() => router.back()}
					style={styles.backButton}
				>
					<EvilIcons name="arrow-left" size={28} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Create Invoice</Text>
				<TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
					<Text style={styles.cancelText}>Cancel</Text>
				</TouchableOpacity>
			</View>

			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Customer Selection Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Who is this for?</Text>
					<View style={styles.customerSection}>
						<TouchableOpacity
							onPress={handleSelectCustomer}
							style={styles.customerSelect}
						>
							<Text
								style={
									selectedCustomer
										? styles.customerSelectedText
										: styles.customerSelectText
								}
							>
								{selectedCustomer ? selectedCustomer.name : "Select Customer"}
							</Text>
							<MaterialIcons name="expand-more" size={24} color="#13ec6a" />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={handleCreateNewCustomer}
							style={styles.createCustomerButton}
						>
							<AntDesign name="user-add" size={24} color="#13ec6a" />
							<Text style={styles.createCustomerText}>Create New Customer</Text>
						</TouchableOpacity>
					</View>
				</View>

				{/* Products Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>What are they buying?</Text>
					<View style={styles.productsSection}>
						{invoiceItems.map((product) => (
							<View key={product.id} style={styles.productCard}>
								<View style={styles.productHeader}>
									<View style={styles.productInfo}>
										<Text style={styles.productName}>{product.name}</Text>
										<Text style={styles.productDescription}>
											{product.description}
										</Text>
									</View>
									<TouchableOpacity
										onPress={() => handleRemoveProduct(product.id)}
										style={styles.removeButton}
									>
										<AntDesign name="close-circle" size={20} color="#9ca3af" />
									</TouchableOpacity>
								</View>
								<View style={styles.productFooter}>
									<Text style={styles.productPrice}>
										${product.price.toFixed(2)}
									</Text>
									<View style={styles.stepper}>
										<TouchableOpacity
											onPress={() => handleQuantityChange(product.id, -1)}
											style={styles.stepperButton}
										>
											<Ionicons
												name="remove-circle"
												size={20}
												color="#ffffff"
											/>
										</TouchableOpacity>
										<Text style={styles.stepperValue}>{product.quantity}</Text>
										<TouchableOpacity
											onPress={() => handleQuantityChange(product.id, 1)}
											style={styles.stepperButtonPrimary}
										>
											<Ionicons name="add-circle" size={20} />
										</TouchableOpacity>
									</View>
								</View>
								{!product.discount ? (
									<TouchableOpacity
										onPress={() => handleAddDiscount(product.id)}
										style={styles.addDiscountButton}
									>
										<MaterialIcons name="discount" size={16} color="#13ec6a" />
										<Text style={styles.addDiscountText}>Add Discount</Text>
									</TouchableOpacity>
								) : (
									<TouchableOpacity
										style={styles.discountInfo}
										onPress={() => handleEditDiscount(product.id)}
									>
										<Text style={styles.discountText}>
											-{product.discount.value}
											{product.discount.type === "percent" ? "%" : ""} Off
										</Text>
										<Text style={styles.editText}>Edit</Text>
									</TouchableOpacity>
								)}
							</View>
						))}
						{availableProducts.length > 0 && (
							<TouchableOpacity
								onPress={handleAddProduct}
								style={styles.addProductButton}
							>
								<View style={styles.addProductIcon}>
									<Ionicons name="add-circle" size={28} color="#13ec6a" />
								</View>
								<Text style={styles.addProductText}>Add Product</Text>
							</TouchableOpacity>
						)}
					</View>
				</View>

				{/* Summary Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Summary</Text>
					<View style={styles.summaryCard}>
						{/* Subtotal */}
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>Subtotal</Text>
							<Text style={styles.summaryValue}>
								${summary.subtotal.toFixed(2)}
							</Text>
						</View>

						{/* Global Invoice Discount (Stacked below subtotal) */}
						{!globalDiscount ? (
							<TouchableOpacity
								onPress={handleAddGlobalDiscount}
								style={styles.addDiscountButton}
							>
								<MaterialIcons name="discount" size={16} color="#13ec6a" />
								<Text style={styles.addDiscountText}>Add Discount</Text>
							</TouchableOpacity>
						) : (
							<View style={styles.summaryRow}>
								<TouchableOpacity
									style={styles.discountInfo}
									onPress={handleAddGlobalDiscount}
								>
									<Text style={styles.discountText}>
										Discount ({globalDiscount.value}
										{globalDiscount.type === "percent" ? "%" : ""})
									</Text>
									<Text style={styles.editText}>Edit</Text>
								</TouchableOpacity>
							</View>
						)}

						{/* Total Savings (Informational) */}
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>Total Savings</Text>
							<Text style={styles.summaryValue}>
								-${summary.totalDiscount.toFixed(2)}
							</Text>
						</View>

						{/* Tax */}
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>Tax (5%)</Text>
							<Text style={styles.summaryValue}>${summary.tax.toFixed(2)}</Text>
						</View>

						<View style={styles.divider} />

						{/* Total */}
						<View style={styles.totalRow}>
							<Text style={styles.totalLabel}>Total</Text>
							<Text style={styles.totalValue}>${summary.total.toFixed(2)}</Text>
						</View>
					</View>
				</View>
			</ScrollView>

			{/* Fixed Footer */}
			<View style={styles.footer}>
				<TouchableOpacity
					onPress={handlePreviewPDF}
					style={styles.createButton}
				>
					<MaterialIcons name="description" size={24} />
					<Text style={styles.createButtonText}>Create Invoice</Text>
				</TouchableOpacity>
			</View>

			{/* Discount Modal */}
			<DiscountModal
				visible={discountModalVisible}
				onClose={() => setDiscountModalVisible(false)}
				onApply={handleApplyDiscount}
				initialValue={
					isEditingGlobalDiscount
						? globalDiscount?.value || 0
						: (selectedProductId &&
								invoiceItems.find((p) => p.id === selectedProductId)?.discount
									?.value) ||
							0
				}
				initialType={
					isEditingGlobalDiscount
						? globalDiscount?.type || "percent"
						: (selectedProductId &&
								invoiceItems.find((p) => p.id === selectedProductId)?.discount
									?.type) ||
							"percent"
				}
				productPrice={
					isEditingGlobalDiscount
						? summary.subtotal
						: selectedProductId
							? invoiceItems.find((p) => p.id === selectedProductId)?.price || 0
							: 0
				}
				productQuantity={
					isEditingGlobalDiscount
						? 1
						: selectedProductId
							? invoiceItems.find((p) => p.id === selectedProductId)
									?.quantity || 1
							: 1
				}
			/>

			{/* Contact Picker Modal */}
			<ContactPickerModal
				visible={contactPickerVisible}
				onClose={() => setContactPickerVisible(false)}
				onContactSelect={handleContactSelect}
				customers={customers}
				selectedCustomerId={selectedCustomer?.id}
			/>

			{/* Product Picker Modal */}
			<ProductPickerModal
				visible={productPickerVisible}
				onClose={() => setProductPickerVisible(false)}
				onProductSelect={handleProductSelect}
				products={availableProducts.map(toInvoiceProduct)}
				selectedProductIds={invoiceItems.map((i) => i.id)}
			/>
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
		backgroundColor: "rgba(0, 0, 0, 0.95)",
		borderBottomWidth: 1,
		borderBottomColor: "#374151",
	},
	backButton: {
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: "center",
		justifyContent: "center",
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "800",
		flex: 1,
		textAlign: "center",
		color: "#ffffff",
	},
	cancelButton: {
		paddingHorizontal: 8,
		height: 48,
		alignItems: "center",
		justifyContent: "center",
	},
	cancelText: {
		fontSize: 16,
		fontWeight: "700",
		color: "#9db9a8",
	},
	scrollView: {
		flex: 1,
		paddingHorizontal: 16,
	},
	scrollContent: {
		paddingBottom: 100,
	},
	section: {
		marginTop: 24,
		marginBottom: 12,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#ffffff",
		marginBottom: 12,
		paddingHorizontal: 4,
	},
	customerSection: {
		gap: 12,
	},
	customerSelect: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "#121212",
		borderWidth: 2,
		borderColor: "#374151",
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 20,
	},
	customerSelectText: {
		fontSize: 18,
		fontWeight: "500",
		color: "#9ca3af",
	},
	customerSelectedText: {
		fontSize: 18,
		fontWeight: "500",
		color: "#ffffff",
	},
	createCustomerButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 12,
		borderWidth: 1,
		borderColor: "#374151",
		borderStyle: "dashed",
		borderRadius: 12,
		paddingVertical: 16,
		backgroundColor: "transparent",
	},
	createCustomerText: {
		fontSize: 16,
		fontWeight: "700",
		color: "#13ec6a",
	},
	productsSection: {
		gap: 16,
	},
	productCard: {
		backgroundColor: "#121212",
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: "#374151",
		gap: 16,
	},
	productHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
	},
	productInfo: {
		flex: 1,
	},
	productName: {
		fontSize: 18,
		fontWeight: "700",
		color: "#ffffff",
	},
	productDescription: {
		fontSize: 14,
		color: "#9ca3af",
		marginTop: 2,
	},
	removeButton: {
		padding: 4,
		marginLeft: -4,
	},
	productFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 4,
	},
	productPrice: {
		fontSize: 20,
		fontWeight: "700",
		color: "#ffffff",
	},
	stepper: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#000000",
		borderRadius: 8,
		padding: 4,
		gap: 16,
		borderWidth: 1,
		borderColor: "#374151",
	},
	stepperButton: {
		width: 40,
		height: 40,
		borderRadius: 6,
		backgroundColor: "#1E1E1E",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	stepperButtonPrimary: {
		width: 40,
		height: 40,
		borderRadius: 6,
		backgroundColor: "#13ec6a",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#13ec6a",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.3,
		shadowRadius: 2,
		elevation: 3,
	},
	stepperValue: {
		fontSize: 18,
		fontWeight: "700",
		color: "#ffffff",
		minWidth: 24,
		textAlign: "center",
	},
	addDiscountButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		alignSelf: "flex-start",
		marginTop: 4,
	},
	addDiscountText: {
		fontSize: 14,
		fontWeight: "700",
		color: "#13ec6a",
		textDecorationLine: "underline",
	},
	discountInfo: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		fontSize: 14,
		color: "#9ca3af",
	},
	discountText: {
		color: "#13ec6a",
		fontWeight: "700",
	},
	editText: {
		textDecorationLine: "underline",
		fontSize: 12,
	},
	addProductButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		minHeight: 72,
		borderWidth: 2,
		borderColor: "rgba(19, 236, 106, 0.5)",
		borderStyle: "dashed",
		borderRadius: 12,
		backgroundColor: "rgba(19, 236, 106, 0.1)",
		paddingVertical: 16,
		marginTop: 8,
	},
	addProductIcon: {
		backgroundColor: "rgba(19, 236, 106, 0.2)",
		borderRadius: 24,
		padding: 4,
	},
	addProductText: {
		fontSize: 18,
		fontWeight: "700",
		color: "#13ec6a",
	},
	summaryCard: {
		backgroundColor: "#121212",
		borderRadius: 12,
		padding: 20,
		borderWidth: 1,
		borderColor: "#374151",
		gap: 16,
	},
	summaryRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	summaryLabel: {
		fontSize: 16,
		fontWeight: "500",
		color: "#9ca3af",
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	addDiscountBadge: {
		borderWidth: 1,
		borderColor: "rgba(19, 236, 106, 0.3)",
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 12,
	},
	addDiscountBadgeText: {
		fontSize: 12,
		fontWeight: "700",
		color: "#13ec6a",
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	summaryValue: {
		fontSize: 16,
		fontWeight: "700",
		color: "#ffffff",
	},
	divider: {
		height: 1,
		backgroundColor: "#374151",
		marginVertical: 8,
	},
	totalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-end",
	},
	totalLabel: {
		fontSize: 18,
		fontWeight: "700",
		color: "#ffffff",
		marginBottom: 4,
	},
	totalValue: {
		fontSize: 36,
		fontWeight: "800",
		color: "#13ec6a",
		letterSpacing: -1,
	},
	footer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "#000000",
		borderTopWidth: 1,
		borderTopColor: "#374151",
		paddingHorizontal: 16,
		paddingVertical: 16,
		paddingBottom: 24,
	},
	createButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		backgroundColor: "#13ec6a",
		height: 56,
		borderRadius: 12,
		shadowColor: "#13ec6a",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.4,
		shadowRadius: 8,
		elevation: 8,
	},
	createButtonText: {
		fontSize: 18,
		fontWeight: "800",
		color: "#000000",
	},
});
