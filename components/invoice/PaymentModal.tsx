import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
	Alert,
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
	withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import { invoiceStyles } from "@/styles";
import {
	decimalToPaise,
	formatCurrency,
	paiseToDecimal,
} from "@/utils/currency";
import { SCREEN_DIMENSIONS, scale, verticalScale } from "@/utils/responsive";

const paymentModalStyles = StyleSheet.create({
	keyboardAvoidingView: {
		flex: 1,
		width: "100%",
		justifyContent: "flex-end",
		paddingBottom: Platform.OS === "ios" ? 0 : verticalScale(20),
	},
	errorMessage: {
		color: "#ef4444",
		fontSize: scale(12),
		marginTop: scale(4),
		paddingHorizontal: scale(4),
	},
});

interface PaymentModalProps {
	visible: boolean;
	onClose: () => void;
	onSave: (amountInPaise: number) => void;
	totalAmountInPaise: number;
	currentPaidAmountInPaise: number;
}

export function PaymentModal({
	visible,
	onClose,
	onSave,
	totalAmountInPaise,
	currentPaidAmountInPaise,
}: PaymentModalProps) {
	const [showModal, setShowModal] = useState(visible);
	const [amount, setAmount] = useState(
		currentPaidAmountInPaise > 0
			? paiseToDecimal(currentPaidAmountInPaise).toString()
			: "",
	);
	const [error, setError] = useState<string | null>(null);

	// Reanimated shared values (instead of Animated.Value)
	const translateY = useSharedValue(SCREEN_DIMENSIONS.height);
	const opacity = useSharedValue(0);
	const inputRef = useRef<TextInput>(null);

	// Sync internal state with external prop
	useEffect(() => {
		if (visible) {
			setShowModal(true);
			setAmount(
				currentPaidAmountInPaise > 0
					? paiseToDecimal(currentPaidAmountInPaise).toString()
					: "",
			);
			setError(null);

			// Animate in using Reanimated
			translateY.value = withTiming(0, {
				duration: 200,
				easing: Easing.out(Easing.cubic),
			});
			opacity.value = withTiming(1, { duration: 200 });
		}
	}, [visible, currentPaidAmountInPaise, translateY, opacity]);

	// Validate amount on change
	useEffect(() => {
		if (!amount || amount === ".") {
			setError(null);
			return;
		}

		const numAmount = parseFloat(amount);
		if (Number.isNaN(numAmount)) {
			setError("Invalid amount");
			return;
		}

		const amountInPaise = decimalToPaise(numAmount);
		if (amountInPaise > totalAmountInPaise) {
			setError(`Cannot exceed ${formatCurrency(totalAmountInPaise)}`);
		} else {
			setError(null);
		}
	}, [amount, totalAmountInPaise]);

	const handleClose = () => {
		// Dismiss keyboard on UI thread
		scheduleOnRN(Keyboard.dismiss);

		// Animate out using Reanimated
		translateY.value = withTiming(
			SCREEN_DIMENSIONS.height,
			{
				duration: 200,
				easing: Easing.in(Easing.cubic),
			},
			() => {
				// Run JS callbacks after animation completes
				scheduleOnRN(setShowModal, false);
				scheduleOnRN(onClose);
			},
		);
		opacity.value = withTiming(0, { duration: 200 });
	};

	const handleSave = () => {
		const numAmount = parseFloat(amount);
		if (Number.isNaN(numAmount) || numAmount < 0) {
			onSave(0);
		} else {
			const amountInPaise = decimalToPaise(numAmount);
			// Validate that amount doesn't exceed total
			if (amountInPaise > totalAmountInPaise) {
				Alert.alert(
					"Invalid Amount",
					`Payment amount cannot exceed total due of ${formatCurrency(totalAmountInPaise)}`,
				);
				return;
			}
			onSave(amountInPaise);
		}
		handleClose();
	};

	const handleFullPayment = () => {
		setAmount(paiseToDecimal(totalAmountInPaise).toString());
	};

	const handleClear = () => {
		setAmount("");
	};

	// Calculate remaining balance dynamically for display
	const currentInputAmountInPaise = decimalToPaise(parseFloat(amount) || 0);
	const remainingInPaise = Math.max(
		0,
		totalAmountInPaise - currentInputAmountInPaise,
	);

	// Animated styles using Reanimated
	const modalStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
		opacity: opacity.value,
	}));

	return (
		<Modal
			visible={showModal}
			transparent
			animationType="none"
			statusBarTranslucent
			onRequestClose={handleClose}
		>
			<TouchableWithoutFeedback onPress={handleClose}>
				<SafeAreaView style={invoiceStyles.modalOverlay}>
					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : "height"}
						style={paymentModalStyles.keyboardAvoidingView}
					>
						<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
							<Animated.View
								style={[
									invoiceStyles.modalContainer,
									modalStyle,
									{ alignSelf: "center" },
								]}
							>
								{/* Header */}
								<View style={invoiceStyles.modalHeader}>
									<Text style={invoiceStyles.modalTitle}>Record Payment</Text>
									<Text style={invoiceStyles.subtitle}>
										Total Due: {formatCurrency(totalAmountInPaise)}
									</Text>
								</View>

								{/* Input Field */}
								<View style={invoiceStyles.inputContainer}>
									<Text style={invoiceStyles.currencyPrefix}>₹</Text>
									<TextInput
										ref={inputRef}
										style={[invoiceStyles.input, { textAlign: "left" }]}
										value={amount}
										onChangeText={setAmount}
										placeholder="0.00"
										placeholderTextColor="#333333"
										keyboardType="decimal-pad"
										autoFocus
										selectTextOnFocus
									/>
									{amount.length > 0 && (
										<TouchableOpacity
											onPress={handleClear}
											style={invoiceStyles.clearButton}
										>
											<MaterialIcons
												name="close"
												size={scale(20)}
												color="#666"
											/>
										</TouchableOpacity>
									)}
								</View>

								{/* Error Message */}
								{error && (
									<Text style={paymentModalStyles.errorMessage}>{error}</Text>
								)}

								{/* Quick Actions */}
								<View style={invoiceStyles.quickActions}>
									<TouchableOpacity
										style={invoiceStyles.quickChip}
										onPress={handleFullPayment}
									>
										<Text style={invoiceStyles.quickChipText}>
											Full Payment
										</Text>
									</TouchableOpacity>
									<View style={invoiceStyles.balanceContainer}>
										<Text style={invoiceStyles.balanceLabel}>Remaining:</Text>
										<Text
											style={[
												invoiceStyles.balanceValue,
												remainingInPaise === 0
													? { color: "#13ec6a" }
													: { color: "#ef4444" },
											]}
										>
											{formatCurrency(remainingInPaise)}
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
									>
										<Text style={invoiceStyles.cancelActionButtonText}>
											Cancel
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={[
											invoiceStyles.actionButton,
											invoiceStyles.applyButton,
											error && { opacity: 0.5 },
										]}
										onPress={handleSave}
										disabled={!!error}
									>
										<Text style={invoiceStyles.applyButtonText}>Save</Text>
									</TouchableOpacity>
								</View>
							</Animated.View>
						</TouchableWithoutFeedback>
					</KeyboardAvoidingView>
				</SafeAreaView>
			</TouchableWithoutFeedback>
		</Modal>
	);
}
