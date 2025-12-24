import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useContactStore } from "@/store/contactStore";
import { useProductStore } from "@/store/productStore";
import type { Product as ProductType } from "@/types";
import type {
	Customer,
	Discount,
	DiscountType,
	InvoiceProduct,
	InvoiceSummary,
} from "@/types/invoice";
import { percentToBasisPoints } from "@/utils/currency";
import { calculateDiscountAmount } from "@/utils/invoiceUtils";

const TAX_RATE_BASIS_POINTS = 500; // 5% in basis points

// Helper to get YYYY-MM-DD in local time
function getLocalDateString(): string {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

// Helper to convert ProductType to InvoiceProduct
// Product prices are now stored in cents
function toInvoiceProduct(product: ProductType): InvoiceProduct {
	return {
		id: product.id,
		name: product.name,
		description: product.unit,
		price: product.price, // Already in cents
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
	globalDiscount: Discount | undefined;
	isEditingGlobalDiscount: boolean;
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
	handleAddGlobalDiscount: () => void;
	handleRemoveGlobalDiscount: () => void;
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
			contacts.map((contact) => {
				const customer = {
					id: contact.id,
					name: contact.name,
					phone: contact.phone,
					address: contact.address ?? "",
					gstin: contact.gstin ?? null,
					dlNo: contact.dlNo ?? null,
				};
				// Debug: Log conversion
				console.log(`[useCreateInvoice] Converting contact "${contact.name}":`, {
					contactGstin: contact.gstin,
					contactDlNo: contact.dlNo,
					customerGstin: customer.gstin,
					customerDlNo: customer.dlNo,
				});
				return customer;
			}),
		[contacts],
	);

	// State for invoice items (products added to invoice)
	const [invoiceItems, setInvoiceItems] = useState<InvoiceProduct[]>([]);

	const [globalDiscount, setGlobalDiscount] = useState<Discount | undefined>(
		undefined,
	);
	const [isEditingGlobalDiscount, setIsEditingGlobalDiscount] = useState(false);

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
	// All calculations are done in cents (integers) to avoid floating-point errors
	const summary = useMemo(() => {
		// 1. Calculate Item-level Subtotal (Net of item discounts) - in cents
		const subtotal = invoiceItems.reduce((sum, product) => {
			const itemTotal = product.price * product.quantity; // price is in cents
			const discount = calculateDiscountAmount(itemTotal, product.discount);
			return sum + itemTotal - discount;
		}, 0);

		// 2. Calculate Total Item Discounts (Informational) - in cents
		const itemDiscounts = invoiceItems.reduce((sum, product) => {
			const itemTotal = product.price * product.quantity;
			return sum + calculateDiscountAmount(itemTotal, product.discount);
		}, 0);

		// 3. Calculate Global Discount - in cents
		const globalDiscountAmount = calculateDiscountAmount(
			subtotal,
			globalDiscount,
		);

		// 4. Calculate Final Totals - all in cents
		const netSubtotal = subtotal - globalDiscountAmount;

		// Calculate tax using basis points (e.g., 5% = 500 basis points)
		const tax = Math.round((netSubtotal * TAX_RATE_BASIS_POINTS) / 10000);
		const total = netSubtotal + tax;

		return {
			subtotal, // Already in cents
			totalDiscount: itemDiscounts + globalDiscountAmount, // Already in cents
			tax, // Already in cents
			total, // Already in cents
		};
	}, [invoiceItems, globalDiscount]);

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
		setIsEditingGlobalDiscount(false);
		setSelectedProductId(productId);
		setDiscountModalVisible(true);
	}, []);

	const handleAddGlobalDiscount = useCallback(() => {
		setIsEditingGlobalDiscount(true);
		setSelectedProductId(null);
		setDiscountModalVisible(true);
	}, []);

	const handleRemoveGlobalDiscount = useCallback(() => {
		setGlobalDiscount(undefined);
	}, []);

	const handleApplyDiscount = useCallback(
		(value: number, type: DiscountType) => {
			if (isEditingGlobalDiscount) {
				// Remove discount if value is 0, otherwise set it
				if (value === 0) {
					setGlobalDiscount(undefined);
				} else {
					// Convert percent to basis points for percent discounts
					// For fixed discounts, convert rupees to cents
					const discountValue =
						type === "percent"
							? percentToBasisPoints(value)
							: Math.round(value * 100);
					setGlobalDiscount({ value: discountValue, type });
				}
			} else if (selectedProductId) {
				setInvoiceItems((prev) =>
					prev.map((item) => {
						if (item.id === selectedProductId) {
							// Remove discount if value is 0, otherwise set it
							if (value === 0) {
								// biome-ignore lint/correctness/noUnusedVariables: We want to remove discount from the object
								const { discount, ...rest } = item;
								return rest;
							}
							// Convert percent to basis points for percent discounts
							// For fixed discounts, convert rupees to cents
							const discountValue =
								type === "percent"
									? percentToBasisPoints(value)
									: Math.round(value * 100);
							return { ...item, discount: { value: discountValue, type } };
						}
						return item;
					}),
				);
			}
			setSelectedProductId(null);
			setIsEditingGlobalDiscount(false);
		},
		[selectedProductId, isEditingGlobalDiscount],
	);

	const handleEditDiscount = useCallback((productId: number) => {
		setIsEditingGlobalDiscount(false);
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
		globalDiscount,
		isEditingGlobalDiscount,
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
		setSelectedProductId,
		toInvoiceProduct,
	};
}

// Export helper function for use in screen
export { getLocalDateString };
