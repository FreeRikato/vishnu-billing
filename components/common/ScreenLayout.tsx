import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenLayoutProps {
	title: string;
	onCancel: () => void;
	onSave?: () => void;
	isLoading?: boolean;
	loadingMessage?: string;
	isError?: boolean;
	errorMessage?: string;
	children: React.ReactNode;
}

export function ScreenLayout({
	title,
	onCancel,
	onSave,
	isLoading,
	loadingMessage = "Loading...",
	isError,
	errorMessage = "An error occurred",
	children,
}: ScreenLayoutProps) {
	if (isLoading) {
		return (
			<SafeAreaView
				style={styles.centerContainer}
				edges={["top", "left", "right"]}
			>
				<ActivityIndicator size="large" color="#13EC6A" />
				<Text style={styles.loadingText}>{loadingMessage}</Text>
			</SafeAreaView>
		);
	}

	if (isError) {
		return (
			<SafeAreaView
				style={styles.centerContainer}
				edges={["top", "left", "right"]}
			>
				<Text style={styles.errorText}>{errorMessage}</Text>
				<TouchableOpacity style={styles.backButton} onPress={onCancel}>
					<Text style={styles.backButtonText}>Go Back</Text>
				</TouchableOpacity>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.headerContent}>
					<TouchableOpacity onPress={onCancel} style={styles.headerButton}>
						<Text style={styles.cancelText}>Cancel</Text>
					</TouchableOpacity>
					<Text style={styles.headerTitle}>{title}</Text>
					{onSave && (
						<TouchableOpacity onPress={onSave} style={styles.headerButton}>
							<Text style={styles.saveText}>Save</Text>
						</TouchableOpacity>
					)}
				</View>
			</View>

			{/* Content with Keyboard Handling */}
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.content}
				keyboardVerticalOffset={100} // Adjust for header height
			>
				<ScrollView
					contentContainerStyle={styles.contentContainer}
					showsVerticalScrollIndicator={false}
				>
					{children}
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#000000" },
	centerContainer: {
		flex: 1,
		backgroundColor: "#000000",
		justifyContent: "center",
		alignItems: "center",
		gap: 16,
	},
	header: {
		backgroundColor: "rgba(0, 0, 0, 0.95)",
		borderBottomWidth: 1,
		borderBottomColor: "rgba(255, 255, 255, 0.1)",
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		height: 64,
	},
	headerButton: { minWidth: 60, alignItems: "center" },
	headerTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#FFFFFF",
		textAlign: "center",
		flex: 1,
	},
	cancelText: { fontSize: 18, fontWeight: "bold", color: "#EF4444" },
	saveText: { fontSize: 18, fontWeight: "bold", color: "#13EC6A" },
	content: { flex: 1 },
	contentContainer: {
		paddingHorizontal: 20,
		paddingTop: 24,
		paddingBottom: 128,
	},
	loadingText: { fontSize: 18, color: "#FFFFFF", fontWeight: "500" },
	errorText: { fontSize: 20, color: "#FFFFFF", fontWeight: "bold" },
	backButton: {
		backgroundColor: "#13EC6A",
		paddingHorizontal: 32,
		paddingVertical: 16,
		borderRadius: 25,
	},
	backButtonText: { color: "#000000", fontSize: 16, fontWeight: "bold" },
});
