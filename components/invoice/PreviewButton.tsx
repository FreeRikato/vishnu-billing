import { Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { invoiceStyles } from "@/styles/invoice";

interface PreviewButtonProps {
  onPress: () => void;
}

export function PreviewButton({ onPress }: PreviewButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={invoiceStyles.previewButton}>
      <MaterialIcons name="description" size={24} />
      <Text style={invoiceStyles.previewButtonText}>Preview PDF</Text>
    </TouchableOpacity>
  );
}