import { router } from "expo-router";
import { Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getLocalDateString, useCreateInvoice } from "@/hooks/useCreateInvoice";
import { paiseToDecimal } from "@/utils/currency";
import PdfService from "@/services/pdfService";
import { invoiceStyles } from "@/styles";
import { generateInvoiceHtml } from "@/utils/pdfTemplate";
import { ContactPickerModal } from "../../components/invoice/ContactPickerModal";
import { DiscountModal } from "../../components/invoice/DiscountModal";
import { InvoiceCreateCustomerSelection } from "../../components/invoice/InvoiceCreateCustomerSelection";
import { InvoiceCreateFooter } from "../../components/invoice/InvoiceCreateFooter";
import { InvoiceCreateHeader } from "../../components/invoice/InvoiceCreateHeader";
import { InvoiceCreateSummary } from "../../components/invoice/InvoiceCreateSummary";
import { InvoiceProductsSection } from "../../components/invoice/InvoiceProductsSection";
import { ProductPickerModal } from "../../components/invoice/ProductPickerModal";

export default function CreateInvoiceScreen() {
	const createInvoice = useMutation(api.invoices.create);

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

		try {
			// Convert invoice items to match Convex schema
			const items = invoiceItems.map((item) => ({
				productId: item.id, // Already a Convex ID string
				name: item.name,
				description: item.description,
				price: item.price, // Already in paise
				quantity: item.quantity,
				discount: item.discount,
			}));

			// Create invoice in Convex (invoice number is generated server-side)
			const result = await createInvoice({
				customerId: selectedCustomer.id as any, // Convex Id<"contacts">
				customerName: selectedCustomer.name,
				customerPhone: selectedCustomer.phone,
				customerAddress: selectedCustomer.address,
				customerGstin: selectedCustomer.gstin ?? undefined,
				customerDlNo: selectedCustomer.dlNo ?? undefined,
				subtotal: summary.subtotal, // Already in paise
				totalDiscount: summary.totalDiscount, // Already in paise
				tax: summary.tax, // Already in paise
				total: summary.total, // Already in paise
				amountPaid: 0, // New invoice, no payment yet
				date: getLocalDateString(),
				items,
			});

			if (!result) {
				Alert.alert("Error", "Failed to create invoice");
				return;
			}

			// Generate invoice HTML using the server-generated invoice number
			const html = generateInvoiceHtml(
				"Vishnu Billing", // Sender name
				result.invoiceNumber, // Server-generated invoice number
				getLocalDateString(), // Date (local time)
				{
					name: selectedCustomer.name,
					phone: selectedCustomer.phone,
					address: selectedCustomer.address,
					gstin: selectedCustomer.gstin,
					dlNo: selectedCustomer.dlNo,
				},
				invoiceItems,
				summary,
			);

			// Generate and save PDF using PdfService
			const fileName = PdfService.generateFileName("invoice");
			const pdfResult = await PdfService.generateAndSavePdf(html, fileName);

			if (!pdfResult) {
				Alert.alert("Error", "Failed to generate PDF");
				return;
			}

			Alert.alert("Success", "Invoice created successfully and PDF saved!", [
				{
					text: "OK",
					onPress: () => router.back(),
				},
			]);
		} catch (error) {
			console.error("Error generating invoice:", error);
			Alert.alert("Error", "Failed to create invoice");
		}
	};

	return (
		<SafeAreaView
			style={invoiceStyles.container}
			edges={["top", "left", "right"]}
		>
			{/* Header */}
			<InvoiceCreateHeader onCancel={handleCancel} />

			<ScrollView
				style={invoiceStyles.scrollView}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={invoiceStyles.scrollContent}
			>
				{/* Customer Selection Section */}
				<InvoiceCreateCustomerSelection
					selectedCustomer={selectedCustomer}
					onSelectCustomer={handleSelectCustomer}
					onCreateNewCustomer={handleCreateNewCustomer}
				/>

				{/* Products Section */}
				<InvoiceProductsSection
					invoiceItems={invoiceItems}
					availableProducts={availableProducts}
					onQuantityChange={handleQuantityChange}
					onRemoveProduct={handleRemoveProduct}
					onAddDiscount={handleAddDiscount}
					onEditDiscount={handleEditDiscount}
					onAddProduct={handleAddProduct}
				/>

				{/* Summary Section */}
				<InvoiceCreateSummary
					summary={summary}
					globalDiscount={globalDiscount}
					onAddGlobalDiscount={handleAddGlobalDiscount}
				/>
			</ScrollView>

			{/* Fixed Footer */}
			<InvoiceCreateFooter onPress={handlePreviewPDF} />

			{/* Discount Modal */}
			<DiscountModal
				visible={discountModalVisible}
				onClose={() => setDiscountModalVisible(false)}
				onApply={handleApplyDiscount}
				initialValue={
					isEditingGlobalDiscount
						? paiseToDecimal(globalDiscount?.value || 0)
						: (selectedProductId &&
								invoiceItems.find((p) => p.id === selectedProductId)?.discount
									?.value) || 0
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
						? paiseToDecimal(summary.subtotal)
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
