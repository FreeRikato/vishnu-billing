import { router } from "expo-router";
import { Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getLocalDateString, useCreateInvoice } from "@/hooks/useCreateInvoice";
import { generateInvoiceNumber } from "@/services/invoiceService";
import PdfService from "@/services/pdfService";
import { useContactStore } from "@/store/contactStore";
import { useInvoiceStore } from "@/store/invoiceStore";
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
