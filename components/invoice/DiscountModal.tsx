import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
	Keyboard,
	KeyboardAvoidingView,
	Modal,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import { SCREEN_DIMENSIONS, scale } from "@/utils/responsive";
import { invoiceStyles } from "../../styles/invoice";
import type { Discount, DiscountType } from "../../types/invoice";
import {
	basisPointsToPercent,
	formatCurrency,
	paiseToDecimal,
} from "../../utils/currency";
import { calculateDiscountAmount as coreCalculateDiscountAmount } from "../../utils/invoiceUtils";

const discountModalStyles = StyleSheet.create({
	keyboardAvoidingView: {
		flex: 1,
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	overlay: {
		backgroundColor: "rgba(0,0,0,0.5)",
	},
});

interface DiscountModalProps {
	visible: boolean;
	onClose: () => void;
	onApply: (value: number, type: DiscountType) => void;
	initialValue?: number; // In basis points for percent, or paise for fixed
	initialType?: DiscountType;
	productPrice?: number; // In paise
	productQuantity?: number;
}

export function DiscountModal({
	visible,
	onClose,
	onApply,
	initialValue = 0,
	initialType = "percent",
	productPrice = 0,
	productQuantity = 1,
}: DiscountModalProps) {
	// 1. Internal visibility state allows us to keep the Modal open
	// while the exit animation plays
	const [showModal, setShowModal] = useState(visible);

	const [discountType, setDiscountType] = useState<DiscountType>(initialType);

	// Convert initial value from storage format to display format
	// For percent: basis points -> percent (e.g., 1000 -> 10)
	// For fixed: paise -> rupees (e.g., 1000 -> 10.00)
	function getDisplayValue(val: number, type: DiscountType): string {
		if (val === 0) return "";
		return type === "percent"
			? basisPointsToPercent(val).toString()
			: paiseToDecimal(val).toString();
	}

	const [discountValue, setDiscountValue] = useState(
		getDisplayValue(initialValue, initialType),
	);

	// Reanimated shared values (instead of Animated.Value)
	const translateY = useSharedValue(SCREEN_DIMENSIONS.height);
	const opacity = useSharedValue(0);

	const subtotal = productPrice * productQuantity; // In paise

	// Sync internal state with external prop
	useEffect(() => {
		if (visible) {
			setShowModal(true);
			setDiscountValue(getDisplayValue(initialValue, initialType));
			setDiscountType(initialType);

			// Animate in using Reanimated
			translateY.value = withSpring(0, {
				damping: 20,
				stiffness: 90,
			});
			opacity.value = withTiming(1, { duration: 200 });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [visible, initialValue, initialType, translateY, opacity]);

	// Helper to handle the exit animation BEFORE unmounting
	const handleClose = () => {
		// Animate out using Reanimated
		translateY.value = withTiming(
			SCREEN_DIMENSIONS.height,
			{
				duration: 200,
				easing: Easing.in(Easing.ease),
			},
			() => {
				// Run JS callbacks after animation completes
				scheduleOnRN(setShowModal, false);
				scheduleOnRN(onClose);
			},
		);
		opacity.value = withTiming(0, { duration: 200 });
	};

	// Validation & Preview Logic
	const calculateDiscountAmount = (
		totalInPaise: number,
		val: string,
		type: DiscountType,
	): number => {
		const numValue = parseFloat(val);
		if (Number.isNaN(numValue)) return 0;

		// Build a Discount object and use the shared calculation
		// For percent: convert display value to basis points
		// For fixed: convert display value to paise
		const discount: Discount = {
			value:
				type === "percent"
					? Math.min(numValue, 100) * 100 // Convert percent to basis points
					: Math.round(numValue * 100), // Convert rupees to paise
			type,
		};
		return coreCalculateDiscountAmount(totalInPaise, discount);
	};

	const discountAmount = calculateDiscountAmount(
		subtotal,
		discountValue,
		discountType,
	);

	const handleApply = () => {
		const rawValue = parseFloat(discountValue);

		// If value is empty, NaN, or 0, remove the discount by passing 0
		if (
			discountValue.trim() === "" ||
			Number.isNaN(rawValue) ||
			rawValue <= 0
		) {
			onApply(0, discountType); // Pass 0 to signal discount removal
			handleClose();
			return;
		}

		let finalValue = rawValue;

		// Strict Logic Validation
		if (discountType === "percent") {
			if (rawValue > 100) finalValue = 100;
		} else {
			// For fixed discounts, compare with the subtotal in rupees
			const subtotalInRupees = paiseToDecimal(subtotal);
			if (rawValue > subtotalInRupees) finalValue = subtotalInRupees;
		}

		onApply(finalValue, discountType); // Parent handles conversion to paise/basis points
		handleClose();
	};

	// Input Sanitization
	const handleTextChange = (text: string) => {
		// Only allow numbers and one decimal point
		const cleaned = text.replace(/[^0-9.]/g, "");

		// Prevent multiple decimals
		const parts = cleaned.split(".");
		if (parts.length > 2) return;

		// Limit length based on type to prevent UI overflow
		if (discountType === "percent" && parseFloat(cleaned) > 100) {
			// Optional: Auto-correct to 100? Or just let them type and validate later?
			// Let's strict limit length for UX
			if (cleaned.length > 3 && !cleaned.includes(".")) return;
		}

		setDiscountValue(cleaned);
	};

	const renderToggleOption = (
		type: DiscountType,
		icon: keyof typeof MaterialIcons.glyphMap,
		label: string,
	) => {
		const isActive = discountType === type;
		return (
			<TouchableOpacity
				style={[
					invoiceStyles.toggleOption,
					isActive && invoiceStyles.toggleOptionActive,
				]}
				onPress={() => setDiscountType(type)}
				activeOpacity={0.7}
			>
				<MaterialIcons
					name={icon}
					size={scale(20)}
					color={isActive ? "#000000" : "#777777"}
				/>
				<Text
					style={[
						invoiceStyles.toggleText,
						isActive && invoiceStyles.toggleTextActive,
					]}
				>
					{label}
				</Text>
			</TouchableOpacity>
		);
	};

	// Animated styles using Reanimated
	const overlayStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}));

	const modalStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
		opacity: opacity.value,
	}));

	return (
		<Modal
			visible={showModal}
			transparent
			animationType="none" // We handle animation manually
			statusBarTranslucent
			onRequestClose={handleClose} // Handle Android hardware back button
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<SafeAreaView style={invoiceStyles.modalOverlay}>
					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : "height"}
						style={discountModalStyles.keyboardAvoidingView}
					>
						{/* Click outside to close */}
						<TouchableWithoutFeedback onPress={handleClose}>
							<Animated.View
								style={[
									StyleSheet.absoluteFill,
									discountModalStyles.overlay,
									overlayStyle,
								]}
							/>
						</TouchableWithoutFeedback>

						<Animated.View style={[invoiceStyles.modalContainer, modalStyle]}>
							{/* Header */}
							<View style={invoiceStyles.modalHeader}>
								<Text style={invoiceStyles.modalTitle}>Apply Discount</Text>
							</View>

							{/* Toggle Switch */}
							<View style={invoiceStyles.toggleContainer}>
								{renderToggleOption("percent", "percent", "Percent")}
								{renderToggleOption("flat", "attach-money", "Flat")}
							</View>

							{/* Input Field */}
							<View style={invoiceStyles.inputContainer}>
								<TextInput
									style={invoiceStyles.input}
									value={discountValue}
									onChangeText={handleTextChange}
									placeholder="0"
									placeholderTextColor={invoiceStyles.inputPlaceholder.color}
									keyboardType="decimal-pad"
									autoFocus
									selectTextOnFocus
									numberOfLines={1}
								/>
							</View>

							{/* Live Math Feedback */}
							<View
								style={[
									invoiceStyles.mathFeedback,
									{ opacity: discountValue ? 1 : 0 },
								]}
							>
								<View style={invoiceStyles.mathFeedbackContainer}>
									<MaterialIcons
										name="calculate"
										size={scale(18)}
										color="#13ec6a"
									/>
									<Text style={invoiceStyles.mathFeedbackText}>
										Reduces price by{" "}
										<Text style={invoiceStyles.mathFeedbackValue}>
											{formatCurrency(discountAmount)}
										</Text>
									</Text>
								</View>
							</View>

							{/* Action Buttons */}
							<View style={invoiceStyles.actionButtons}>
								<TouchableOpacity
									style={[
										invoiceStyles.actionButton,
										invoiceStyles.cancelActionButton,
									]}
									onPress={handleClose}
									activeOpacity={0.8}
								>
									<Text style={invoiceStyles.cancelActionButtonText}>
										Cancel
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[
										invoiceStyles.actionButton,
										invoiceStyles.applyButton,
									]}
									onPress={handleApply}
									activeOpacity={0.8}
								>
									<Text style={invoiceStyles.applyButtonText}>Apply</Text>
								</TouchableOpacity>
							</View>
						</Animated.View>
					</KeyboardAvoidingView>
				</SafeAreaView>
			</TouchableWithoutFeedback>
		</Modal>
	);
}
