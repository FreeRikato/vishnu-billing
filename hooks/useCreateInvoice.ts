import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useContactStore } from "@/store/contactStore";
import { useProductStore } from "@/store/productStore";
import type { Product as ProductType } from "@/types";
import type {
	Customer,
	DiscountType,
	InvoiceProduct,
	InvoiceSummary,
} from "@/types/invoice";
import { calculateDiscountAmount } from "@/utils/invoiceUtils";

const TAX_RATE = 0.05; // 5%

// Helper to get YYYY-MM-DD in local time
function getLocalDateString(): string {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

// Helper to convert ProductType to InvoiceProduct
function toInvoiceProduct(product: ProductType): InvoiceProduct {
	return {
		id: product.id,
		name: product.name,
		description: product.unit,
		price: product.price,
		quantity: 1,
	};
}

export interface UseCreateInvoiceReturn {
	invoiceItems: InvoiceProduct[];
	summary: InvoiceSummary;
	selectedCustomer: Customer | null;
	discountModalVisible: boolean;
	productPickerVisible: boolean;
	contactPickerVisible: boolean;
	selectedProductId: number | null;
	availableProducts: ProductType[];
	customers: Customer[];
	// Actions
	handleCancel: () => void;
	handleSelectCustomer: () => void;
	handleCreateNewCustomer: () => void;
	handleAddProduct: () => void;
	handleContactSelect: (customer: Customer) => void;
	handleProductSelect: (product: InvoiceProduct) => void;
	handleQuantityChange: (productId: number, change: number) => void;
	handleRemoveProduct: (productId: number) => void;
	handleAddDiscount: (productId: number) => void;
	handleApplyDiscount: (value: number, type: DiscountType) => void;
	handleEditDiscount: (productId: number) => void;
	setDiscountModalVisible: (visible: boolean) => void;
	setProductPickerVisible: (visible: boolean) => void;
	setContactPickerVisible: (visible: boolean) => void;
	setSelectedProductId: (id: number | null) => void;
	// Helper
	toInvoiceProduct: (product: ProductType) => InvoiceProduct;
}

export function useCreateInvoice(): UseCreateInvoiceReturn {
	// Get real data from stores
	const contacts = useContactStore((state) => state.contacts);
	const products = useProductStore((state) => state.products);

	// Convert contacts to customers
	const customers: Customer[] = useMemo(
		() =>
			contacts.map((contact) => ({
				id: contact.id,
				name: contact.name,
			})),
		[contacts],
	);

	// State for invoice items (products added to invoice)
	const [invoiceItems, setInvoiceItems] = useState<InvoiceProduct[]>([]);

	// Modal visibility states
	const [discountModalVisible, setDiscountModalVisible] = useState(false);
	const [productPickerVisible, setProductPickerVisible] = useState(false);
	const [contactPickerVisible, setContactPickerVisible] = useState(false);
	const [selectedProductId, setSelectedProductId] = useState<number | null>(
		null,
	);
	const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
		null,
	);

	// Derived state (Calculations)
	const summary = useMemo(() => {
		const subtotal = invoiceItems.reduce((sum, product) => {
			const itemTotal = product.price * product.quantity;
			const discount = calculateDiscountAmount(itemTotal, product.discount);
			return sum + itemTotal - discount;
		}, 0);

		const totalDiscount = invoiceItems.reduce((sum, product) => {
			const itemTotal = product.price * product.quantity;
			return sum + calculateDiscountAmount(itemTotal, product.discount);
		}, 0);

		// Round calculations to 2 decimal places for currency integrity
		const roundedSubtotal = Math.round(subtotal * 100) / 100;
		const roundedTotalDiscount = Math.round(totalDiscount * 100) / 100;
		const tax = Math.round(roundedSubtotal * TAX_RATE * 100) / 100;
		const total = Math.round((roundedSubtotal + tax) * 100) / 100;

		return {
			subtotal: roundedSubtotal,
			totalDiscount: roundedTotalDiscount,
			tax,
			total,
		};
	}, [invoiceItems]);

	// Get all products (filtering is handled in the modal)
	const availableProducts = products;

	// Handler functions
	const handleCancel = useCallback(() => {
		Alert.alert(
			"Cancel",
			"Are you sure you want to cancel creating this invoice?",
			[
				{ text: "No", style: "cancel" },
				{ text: "Yes", onPress: () => router.back() },
			],
		);
	}, []);

	const handleSelectCustomer = useCallback(() => {
		setContactPickerVisible(true);
	}, []);

	const handleCreateNewCustomer = useCallback(() => {
		router.push("/contact/create");
	}, []);

	const handleAddProduct = useCallback(() => {
		setProductPickerVisible(true);
	}, []);

	const handleContactSelect = useCallback((customer: Customer) => {
		setSelectedCustomer(customer);
		setContactPickerVisible(false);
	}, []);

	const handleProductSelect = useCallback((product: InvoiceProduct) => {
		setInvoiceItems((prev) => {
			const exists = prev.some((item) => item.id === product.id);
			if (exists) {
				// Remove if already selected (toggle behavior)
				return prev.filter((item) => item.id !== product.id);
			}
			// Add new product
			return [...prev, { ...product, quantity: 1 }];
		});
	}, []);

	const handleQuantityChange = useCallback(
		(productId: number, change: number) => {
			setInvoiceItems((prev) =>
				prev.map((item) => {
					if (item.id === productId) {
						const newQuantity = Math.max(1, item.quantity + change);
						return { ...item, quantity: newQuantity };
					}
					return item;
				}),
			);
		},
		[],
	);

	const handleRemoveProduct = useCallback((productId: number) => {
		Alert.alert("Remove Product", "Remove this product from the invoice?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Remove",
				style: "destructive",
				onPress: () => {
					setInvoiceItems((prev) =>
						prev.filter((item) => item.id !== productId),
					);
				},
			},
		]);
	}, []);

	const handleAddDiscount = useCallback((productId: number) => {
		setSelectedProductId(productId);
		setDiscountModalVisible(true);
	}, []);

	const handleApplyDiscount = useCallback(
		(value: number, type: DiscountType) => {
			if (selectedProductId) {
				setInvoiceItems((prev) =>
					prev.map((item) => {
						if (item.id === selectedProductId) {
							return { ...item, discount: { value, type } };
						}
						return item;
					}),
				);
			}
			setSelectedProductId(null);
		},
		[selectedProductId],
	);

	const handleEditDiscount = useCallback((productId: number) => {
		setSelectedProductId(productId);
		setDiscountModalVisible(true);
	}, []);

	return {
		invoiceItems,
		summary,
		selectedCustomer,
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
		handleApplyDiscount,
		handleEditDiscount,
		setDiscountModalVisible,
		setProductPickerVisible,
		setContactPickerVisible,
		setSelectedProductId,
		toInvoiceProduct,
	};
}

// Export helper function for use in screen
export { getLocalDateString };
