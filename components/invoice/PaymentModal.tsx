import { MaterialIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	Animated,
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
import { SafeAreaView } from "react-native-safe-area-context";
import { invoiceStyles } from "@/styles";
import {
	centsToDecimal,
	decimalToCents,
	formatCurrency,
} from "@/utils/currency";

interface PaymentModalProps {
	visible: boolean;
	onClose: () => void;
	onSave: (amountInCents: number) => void;
	totalAmountInCents: number;
	currentPaidAmountInCents: number;
}

export function PaymentModal({
	visible,
	onClose,
	onSave,
	totalAmountInCents,
	currentPaidAmountInCents,
}: PaymentModalProps) {
	const [showModal, setShowModal] = useState(visible);
	const [amount, setAmount] = useState(
		currentPaidAmountInCents > 0
			? centsToDecimal(currentPaidAmountInCents).toString()
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
		]).start(() => {
			// Auto focus input after animation on Android/iOS
			setTimeout(() => {
				inputRef.current?.focus();
			}, 100);
		});
	}, [fadeAnim, slideAnim]);

	useEffect(() => {
		if (visible) {
			setShowModal(true);
			setAmount(
				currentPaidAmountInCents > 0
					? centsToDecimal(currentPaidAmountInCents).toString()
					: "",
			);
			animateIn();
		}
	}, [visible, currentPaidAmountInCents, animateIn]);

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
			// Convert rupees to cents
			onSave(decimalToCents(numAmount));
		}
		handleClose();
	};

	const handleFullPayment = () => {
		setAmount(centsToDecimal(totalAmountInCents).toString());
	};

	const handleClear = () => {
		setAmount("");
	};

	// Calculate remaining balance dynamically for display
	const currentInputAmountInCents = decimalToCents(parseFloat(amount) || 0);
	const remainingInCents = Math.max(
		0,
		totalAmountInCents - currentInputAmountInCents,
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
									<Text style={styles.subtitle}>
										Total Due: {formatCurrency(totalAmountInCents)}
									</Text>
								</View>

								{/* Input Field */}
								<View style={invoiceStyles.inputContainer}>
									<Text style={styles.currencyPrefix}>₹</Text>
									<TextInput
										ref={inputRef}
										style={[invoiceStyles.input, { textAlign: "left" }]}
										value={amount}
										onChangeText={setAmount}
										placeholder="0.00"
										placeholderTextColor="#333333"
										keyboardType="decimal-pad"
										selectTextOnFocus
									/>
									{amount.length > 0 && (
										<TouchableOpacity
											onPress={handleClear}
											style={styles.clearButton}
										>
											<MaterialIcons name="close" size={20} color="#666" />
										</TouchableOpacity>
									)}
								</View>

								{/* Quick Actions */}
								<View style={styles.quickActions}>
									<TouchableOpacity
										style={styles.quickChip}
										onPress={handleFullPayment}
									>
										<Text style={styles.quickChipText}>Full Payment</Text>
									</TouchableOpacity>
									<View style={styles.balanceContainer}>
										<Text style={styles.balanceLabel}>Remaining:</Text>
										<Text
											style={[
												styles.balanceValue,
												remainingInCents === 0
													? { color: "#13ec6a" }
													: { color: "#ef4444" },
											]}
										>
											{formatCurrency(remainingInCents)}
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

const styles = StyleSheet.create({
	subtitle: {
		fontSize: 16,
		color: "#9CA3AF",
		marginTop: 4,
		fontWeight: "500",
	},
	currencyPrefix: {
		fontSize: 64,
		fontWeight: "800",
		color: "#13ec6a",
		marginRight: 4,
	},
	clearButton: {
		position: "absolute",
		right: 0,
		top: "50%",
		marginTop: -12,
		backgroundColor: "#2a2a2a",
		borderRadius: 12,
		padding: 2,
	},
	quickActions: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 32,
		paddingHorizontal: 8,
	},
	quickChip: {
		backgroundColor: "rgba(19, 236, 106, 0.1)",
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "rgba(19, 236, 106, 0.3)",
	},
	quickChipText: {
		color: "#13ec6a",
		fontWeight: "700",
		fontSize: 14,
	},
	balanceContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	balanceLabel: {
		color: "#9CA3AF",
		fontSize: 14,
	},
	balanceValue: {
		fontSize: 16,
		fontWeight: "700",
	},
});
