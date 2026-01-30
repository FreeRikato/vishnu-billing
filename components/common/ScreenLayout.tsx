import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { commonStyles } from "@/styles";
import { verticalScale } from "@/utils/responsive";

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
				style={commonStyles.centerContainer}
				edges={["top", "left", "right"]}
			>
				<ActivityIndicator size="large" color="#13EC6A" />
				<Text style={commonStyles.loadingText}>{loadingMessage}</Text>
			</SafeAreaView>
		);
	}

	if (isError) {
		return (
			<SafeAreaView
				style={commonStyles.centerContainer}
				edges={["top", "left", "right"]}
			>
				<Text style={commonStyles.errorText}>{errorMessage}</Text>
				<TouchableOpacity style={commonStyles.backButton} onPress={onCancel}>
					<Text style={commonStyles.backButtonText}>Go Back</Text>
				</TouchableOpacity>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView
			style={commonStyles.container}
			edges={["top", "left", "right"]}
		>
			{/* Header */}
			<View style={commonStyles.header}>
				<View style={commonStyles.headerContent}>
					<TouchableOpacity
						onPress={onCancel}
						style={commonStyles.headerButton}
					>
						<Text style={commonStyles.cancelText}>Cancel</Text>
					</TouchableOpacity>
					<Text style={commonStyles.headerTitle}>{title}</Text>
					{onSave && (
						<TouchableOpacity
							onPress={onSave}
							style={commonStyles.headerButton}
						>
							<Text style={commonStyles.saveText}>Save</Text>
						</TouchableOpacity>
					)}
				</View>
			</View>

			{/* Content with Keyboard Handling */}
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={commonStyles.content}
				keyboardVerticalOffset={verticalScale(100)} // Adjust for header height
			>
				<ScrollView
					contentContainerStyle={commonStyles.contentContainer}
					showsVerticalScrollIndicator={false}
				>
					{children}
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
