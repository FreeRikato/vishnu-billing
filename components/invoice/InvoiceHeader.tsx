import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { EvilIcons } from "@expo/vector-icons/EvilIcons";
import { invoiceStyles } from "@/styles/invoice";

interface InvoiceHeaderProps {
  onCancel: () => void;
}

export function InvoiceHeader({ onCancel }: InvoiceHeaderProps) {
  return (
    <View style={invoiceStyles.header}>
      <TouchableOpacity onPress={() => router.back()} style={invoiceStyles.backButton}>
        <EvilIcons name="arrow-left" size={28} />
      </TouchableOpacity>
      <Text style={invoiceStyles.headerTitle}>Create Invoice</Text>
      <TouchableOpacity onPress={onCancel} style={invoiceStyles.cancelButton}>
        <Text style={invoiceStyles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}