import { Colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: Colors.background,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  screenText: {
    color: Colors.textSecondary,
  },
});