import { Text, View } from "react-native";
import { invoiceStyles } from "@/styles";

interface PageIndicatorProps {
	current?: number;
	total?: number;
}

export function PageIndicator({ current = 1, total = 1 }: PageIndicatorProps) {
	return (
		<View style={invoiceStyles.pageIndicator}>
			<Text style={invoiceStyles.pageIndicatorText}>
				Page {current} of {total}
			</Text>
		</View>
	);
}
