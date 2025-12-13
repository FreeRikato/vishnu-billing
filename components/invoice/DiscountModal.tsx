import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { invoiceStyles } from "../../styles/invoice";
import { DiscountType } from "../../types/invoice";

interface DiscountModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (value: number, type: DiscountType) => void;
  initialValue?: number;
  initialType?: DiscountType;
  productPrice?: number;
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
  const [discountType, setDiscountType] = useState<DiscountType>(initialType);
  const [discountValue, setDiscountValue] = useState(initialValue.toString());
  const slideAnim = React.useRef(new Animated.Value(-500)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setDiscountValue(initialValue.toString());
    setDiscountType(initialType);
  }, [initialValue, initialType, visible]);

  useEffect(() => {
    if (visible) {
      // Reset animations before starting
      slideAnim.setValue(-500);
      fadeAnim.setValue(0);

      // Slide in from top with fade
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 40, // Lower tension = slower, more relaxed
          friction: 12, // Higher friction = more damping, slower
          delay: 100,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400, // Slower fade in
          useNativeDriver: true,
          delay: 100,
        }),
      ]).start();
    } else {
      // Slide out to top and fade
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: -500,
          useNativeDriver: true,
          tension: 40, // Lower tension = slower
          friction: 12, // Higher friction = more damping
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300, // Slower fade out
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  const subtotal = productPrice * productQuantity;
  const discountAmount = calculateDiscountAmount(subtotal, discountValue, discountType);

  function calculateDiscountAmount(subtotal: number, value: string, type: DiscountType): number {
    const numValue = parseFloat(value) || 0;
    if (type === "percent") {
      return (subtotal * numValue) / 100;
    } else {
      return Math.min(numValue, subtotal); // Fixed discount can't exceed subtotal
    }
  }

  function handleApply() {
    const value = parseFloat(discountValue) || 0;
    if (value > 0) {
      onApply(value, discountType);
      onClose();
    }
  }

  function handleCancel() {
    setDiscountValue(initialValue.toString());
    setDiscountType(initialType);
    onClose();
  }

  function renderToggleOption(
    type: DiscountType,
    icon: string,
    label: string
  ) {
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
          name={icon as any}
          size={20}
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
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={invoiceStyles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <TouchableWithoutFeedback onPress={() => {}}>
              <Animated.View
                style={[
                  invoiceStyles.modalContainer,
                  {
                    transform: [{ translateY: slideAnim }],
                    opacity: fadeAnim,
                  }
                ]}
              >
                {/* Header */}
                <View style={invoiceStyles.modalHeader}>
                  <Text style={invoiceStyles.modalTitle}>Apply Discount</Text>
                </View>

                {/* Toggle Switch */}
                <View style={invoiceStyles.toggleContainer}>
                  {renderToggleOption("percent", "percent", "Percent")}
                  {renderToggleOption("fixed", "attach-money", "Fixed")}
                </View>

                {/* Input Field */}
                <View style={invoiceStyles.inputContainer}>
                  <TextInput
                    style={invoiceStyles.input}
                    value={discountValue}
                    onChangeText={setDiscountValue}
                    placeholder="0"
                    placeholderTextColor={invoiceStyles.inputPlaceholder.color}
                    keyboardType="decimal-pad"
                    autoFocus
                    selectTextOnFocus
                    maxLength={discountType === "percent" ? 3 : 6}
                  />
                </View>

                {/* Live Math Feedback */}
                {subtotal > 0 && parseFloat(discountValue) > 0 && (
                  <View style={invoiceStyles.mathFeedback}>
                    <View style={invoiceStyles.mathFeedbackContainer}>
                      <MaterialIcons
                        name="calculate"
                        size={18}
                        color="#13ec6a"
                      />
                      <Text style={invoiceStyles.mathFeedbackText}>
                        Reduces price by{" "}
                        <Text style={invoiceStyles.mathFeedbackValue}>
                          ${discountAmount.toFixed(2)}
                        </Text>
                      </Text>
                    </View>
                  </View>
                )}

                {/* Action Buttons */}
                <View style={invoiceStyles.actionButtons}>
                  <TouchableOpacity
                    style={[
                      invoiceStyles.actionButton,
                      invoiceStyles.cancelButton,
                    ]}
                    onPress={handleCancel}
                    activeOpacity={0.8}
                  >
                    <Text style={invoiceStyles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      invoiceStyles.actionButton,
                      invoiceStyles.applyButton,
                    ]}
                    onPress={handleApply}
                    activeOpacity={0.8}
                    disabled={parseFloat(discountValue) <= 0}
                  >
                    <Text style={invoiceStyles.applyButtonText}>Apply</Text>
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