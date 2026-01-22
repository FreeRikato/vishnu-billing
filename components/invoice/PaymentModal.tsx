import { MaterialIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	Animated,
	Keyboard,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { invoiceStyles } from "@/styles";
import {
	decimalToPaise,
	formatCurrency,
	paiseToDecimal,
} from "@/utils/currency";

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

	const slideAnim = useRef(new Animated.Value(600)).current;
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const inputRef = useRef<TextInput>(null);

	const animateIn = useCallback(() => {
		slideAnim.setValue(600);
		fadeAnim.setValue(0);

		Animated.parallel([
			Animated.spring(slideAnim, {
				toValue: 0,
				useNativeDriver: true,
				damping: 20,
				stiffness: 90,
			}),
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 200,
				useNativeDriver: true,
			}),
		]).start();
	}, [fadeAnim, slideAnim]);

	useEffect(() => {
		if (visible) {
			setShowModal(true);
			setAmount(
				currentPaidAmountInPaise > 0
					? paiseToDecimal(currentPaidAmountInPaise).toString()
					: "",
			);
			animateIn();
		}
	}, [visible, currentPaidAmountInPaise, animateIn]);

	const handleClose = () => {
		Keyboard.dismiss();
		Animated.parallel([
			Animated.timing(slideAnim, {
				toValue: 600,
				duration: 200,
				useNativeDriver: true,
			}),
			Animated.timing(fadeAnim, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}),
		]).start(() => {
			setShowModal(false);
			onClose();
		});
	};

	const handleSave = () => {
		const numAmount = parseFloat(amount);
		if (Number.isNaN(numAmount) || numAmount < 0) {
			onSave(0);
		} else {
			// Convert rupees to paise
			onSave(decimalToPaise(numAmount));
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
						style={{
							flex: 1,
							width: "100%",
							justifyContent: "flex-end", // Bottom sheet style often looks better for numpads
							paddingBottom: Platform.OS === "ios" ? 0 : 20,
						}}
					>
						<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
							<Animated.View
								style={[
									invoiceStyles.modalContainer,
									{
										transform: [{ translateY: slideAnim }],
										opacity: fadeAnim,
										alignSelf: "center",
									},
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
											<MaterialIcons name="close" size={20} color="#666" />
										</TouchableOpacity>
									)}
								</View>

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
										]}
										onPress={handleSave}
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
