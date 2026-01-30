import { useQuery } from "convex/react";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import { api } from "@/convex/_generated/api";
import type { Contact } from "@/types/contact";
import type {
	Customer,
	Discount,
	DiscountType,
	InvoiceProduct,
	InvoiceSummary,
} from "@/types/invoice";
import type { Product, ProductId, ProductUI } from "@/types/product";
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

export interface UseCreateInvoiceReturn {
	invoiceItems: InvoiceProduct[];
	summary: InvoiceSummary;
	selectedCustomer: Customer | null;
	discountModalVisible: boolean;
	productPickerVisible: boolean;
	contactPickerVisible: boolean;
	selectedProductId: string | null;
	availableProducts: ProductUI[];
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
	handleQuantityChange: (productId: string, change: number) => void;
	handleRemoveProduct: (productId: string) => void;
	handleAddDiscount: (productId: string) => void;
	handleAddGlobalDiscount: () => void;
	handleRemoveGlobalDiscount: () => void;
	handleApplyDiscount: (value: number, type: DiscountType) => void;
	handleEditDiscount: (productId: string) => void;
	setDiscountModalVisible: (visible: boolean) => void;
	setProductPickerVisible: (visible: boolean) => void;
	setContactPickerVisible: (visible: boolean) => void;
	setSelectedProductId: (id: string | null) => void;
	// Helper
	toInvoiceProduct: (product: ProductUI) => InvoiceProduct;
}

export function useCreateInvoice(): UseCreateInvoiceReturn {
	// Get real data from Convex
	const contacts = useQuery(api.contacts.list) ?? [];
	const products = useQuery(api.products.list) ?? [];

	// Convert contacts to customers
	const customers: Customer[] = useMemo(
		() =>
			contacts.map((contact: Contact) => ({
				id: contact._id,
				name: contact.name,
				phone: contact.phone,
				address: contact.address ?? "",
				gstin: contact.gstin ?? null,
				dlNo: contact.dlNo ?? null,
			})),
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
	const [selectedProductId, setSelectedProductId] = useState<string | null>(
		null,
	);
	const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
		null,
	);

	// Derived state (Calculations)
	// All calculations are done in paise (integers) to avoid floating-point errors
	const summary = useMemo(() => {
		// 1. Calculate Item-level Subtotal (Net of item discounts) - in paise
		const subtotal = invoiceItems.reduce((sum, product) => {
			const itemTotal = product.price * product.quantity; // price is in paise
			const discount = calculateDiscountAmount(itemTotal, product.discount);
			return sum + itemTotal - discount;
		}, 0);

		// 2. Calculate Total Item Discounts (Informational) - in paise
		const itemDiscounts = invoiceItems.reduce((sum, product) => {
			const itemTotal = product.price * product.quantity;
			return sum + calculateDiscountAmount(itemTotal, product.discount);
		}, 0);

		// 3. Calculate Global Discount - in paise
		const globalDiscountAmount = calculateDiscountAmount(
			subtotal,
			globalDiscount,
		);

		// 4. Calculate Final Totals - all in paise
		const netSubtotal = subtotal - globalDiscountAmount;

		// Calculate tax using basis points (e.g., 5% = 500 basis points)
		const tax = Math.round((netSubtotal * TAX_RATE_BASIS_POINTS) / 10000);
		const total = netSubtotal + tax;

		return {
			subtotal, // Already in paise
			totalDiscount: itemDiscounts + globalDiscountAmount, // Already in paise
			tax, // Already in paise
			total, // Already in paise
		};
	}, [invoiceItems, globalDiscount]);

	// Get all products (filtering is handled in the modal)
	// Map to ProductUI format for components
	const availableProductsUI: ProductUI[] = products.map((product: Product) => ({
		...product,
		id: product._id,
	}));

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
			const exists = prev.some(
				(item) => item.lineItemId === product.lineItemId,
			);
			if (exists) {
				// Remove if already selected (toggle behavior)
				return prev.filter((item) => item.lineItemId !== product.lineItemId);
			}
			// Add new product
			return [...prev, { ...product, quantity: 1 }];
		});
	}, []);

	const handleQuantityChange = useCallback(
		(productId: string, change: number) => {
			setInvoiceItems((prev) =>
				prev.map((item) => {
					if (item.lineItemId === productId) {
						const newQuantity = Math.max(1, item.quantity + change);
						return { ...item, quantity: newQuantity };
					}
					return item;
				}),
			);
		},
		[],
	);

	const handleRemoveProduct = useCallback((productId: string) => {
		Alert.alert("Remove Product", "Remove this product from the invoice?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Remove",
				style: "destructive",
				onPress: () => {
					setInvoiceItems((prev) =>
						prev.filter((item) => item.lineItemId !== productId),
					);
				},
			},
		]);
	}, []);

	const handleAddDiscount = useCallback((productId: string) => {
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
					// For fixed discounts, convert rupees to paise
					const discountValue =
						type === "percent"
							? percentToBasisPoints(value)
							: Math.round(value * 100);
					setGlobalDiscount({ value: discountValue, type });
				}
			} else if (selectedProductId) {
				setInvoiceItems((prev) =>
					prev.map((item) => {
						if (item.lineItemId === selectedProductId) {
							// Remove discount if value is 0, otherwise set it
							if (value === 0) {
								// biome-ignore lint/correctness/noUnusedVariables: We want to remove discount from the object
								const { discount, ...rest } = item;
								return rest;
							}
							// Convert percent to basis points for percent discounts
							// For fixed discounts, convert rupees to paise
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

	const handleEditDiscount = useCallback((productId: string) => {
		setIsEditingGlobalDiscount(false);
		setSelectedProductId(productId);
		setDiscountModalVisible(true);
	}, []);

	// Helper to convert Product to InvoiceProduct
	function toInvoiceProduct(product: ProductUI): InvoiceProduct {
		return {
			lineItemId: product.id,
			productId: product.id as ProductId, // Cast string to Convex ProductId
			name: product.name,
			description: product.unit,
			price: product.price, // Already in paise
			quantity: 1,
		};
	}

	return {
		invoiceItems,
		summary,
		selectedCustomer,
		discountModalVisible,
		productPickerVisible,
		contactPickerVisible,
		selectedProductId,
		availableProducts: availableProductsUI,
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
