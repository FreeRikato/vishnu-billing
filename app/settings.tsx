import { EvilIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import { useSettings } from "@/hooks/useSettings";
import { scale } from "@/utils/responsive";

const settingsStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000000",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: scale(16),
		paddingVertical: scale(12),
		borderBottomWidth: 1,
		borderBottomColor: "#1C1C1E",
	},
	backButton: {
		padding: scale(8),
	},
	headerTitle: {
		fontSize: scale(20),
		fontWeight: "600",
		color: "#FFFFFF",
		marginLeft: scale(8),
	},
	content: {
		flex: 1,
		paddingHorizontal: scale(16),
		paddingTop: scale(24),
	},
	sectionTitle: {
		fontSize: scale(14),
		fontWeight: "500",
		color: "#777777",
		marginBottom: scale(16),
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	settingItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: scale(16),
		borderBottomWidth: 1,
		borderBottomColor: "#1C1C1E",
	},
	settingLabel: {
		fontSize: scale(16),
		color: "#FFFFFF",
		flex: 1,
	},
	toggleTrack: {
		width: scale(52),
		height: scale(32),
		borderRadius: scale(16),
		backgroundColor: "#3A3A3C",
		paddingHorizontal: scale(2),
		justifyContent: "center",
	},
	toggleThumb: {
		width: scale(28),
		height: scale(28),
		borderRadius: scale(14),
		backgroundColor: "#FFFFFF",
		position: "absolute",
		left: scale(2),
	},
});

// Separate component to properly use hooks at top level
interface ToggleProps {
	isActive: boolean;
	onToggle: () => void;
	testID?: string;
}

function Toggle({ isActive, onToggle, testID }: ToggleProps) {
	// Pre-calculate scaled values on the JS thread
	const activeOffset = scale(20);
	const colorThreshold = scale(10);

	// Track state on UI thread for instant animation
	const isActiveShared = useSharedValue(isActive);
	const translateX = useSharedValue(isActive ? activeOffset : 0);

	// Sync shared value when isActive changes externally (e.g., from store)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		isActiveShared.value = isActive;
		translateX.value = withTiming(isActive ? activeOffset : 0, {
			duration: 200,
		});
	}, [isActive, activeOffset, isActiveShared, translateX]);

	// Tap gesture - runs on UI thread for instant response
	const tapGesture = Gesture.Tap().onEnd(() => {
		"worklet";
		const newValue = !isActiveShared.value;

		// Update state and animate immediately on UI thread
		isActiveShared.value = newValue;
		translateX.value = withTiming(newValue ? activeOffset : 0, {
			duration: 200,
		});

		// Sync with store on React Native thread (non-blocking)
		scheduleOnRN(onToggle);
	});

	// Animated track color based on thumb position
	const trackAnimatedStyle = useAnimatedStyle(() => ({
		backgroundColor: translateX.value > colorThreshold ? "#13EC6A" : "#3A3A3C",
	}));

	const toggleStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateX.value }],
	}));

	return (
		<GestureDetector gesture={tapGesture}>
			<Animated.View
				style={[settingsStyles.toggleTrack, trackAnimatedStyle]}
				testID={testID}
			>
				<Animated.View style={[settingsStyles.toggleThumb, toggleStyle]} />
			</Animated.View>
		</GestureDetector>
	);
}

export default function SettingsScreen() {
	const router = useRouter();
	const {
		showArchivedContacts,
		showArchivedProducts,
		showArchivedInvoices,
		toggleShowArchivedContacts,
		toggleShowArchivedProducts,
		toggleShowArchivedInvoices,
	} = useSettings();

	const handleBack = () => {
		router.back();
	};

	return (
		<SafeAreaView
			style={settingsStyles.container}
			edges={["top", "left", "right", "bottom"]}
		>
			<StatusBar barStyle="light-content" backgroundColor="#000000" />

			{/* Header */}
			<View style={settingsStyles.header}>
				<TouchableOpacity
					onPress={handleBack}
					style={settingsStyles.backButton}
				>
					<EvilIcons name="arrow-left" size={scale(32)} color="#FFFFFF" />
				</TouchableOpacity>
				<Text style={settingsStyles.headerTitle}>Settings</Text>
			</View>

			{/* Content */}
			<View style={settingsStyles.content}>
				<Text style={settingsStyles.sectionTitle}>Archived Items</Text>

				{/* Show Archived Contacts */}
				<View style={settingsStyles.settingItem}>
					<Text style={settingsStyles.settingLabel}>
						Show Archived Contacts
					</Text>
					<Toggle
						isActive={showArchivedContacts}
						onToggle={toggleShowArchivedContacts}
						testID="toggle-archived-contacts"
					/>
				</View>

				{/* Show Archived Products */}
				<View style={settingsStyles.settingItem}>
					<Text style={settingsStyles.settingLabel}>
						Show Archived Products
					</Text>
					<Toggle
						isActive={showArchivedProducts}
						onToggle={toggleShowArchivedProducts}
						testID="toggle-archived-products"
					/>
				</View>

				{/* Show Archived Invoices */}
				<View style={settingsStyles.settingItem}>
					<Text style={settingsStyles.settingLabel}>
						Show Archived Invoices
					</Text>
					<Toggle
						isActive={showArchivedInvoices}
						onToggle={toggleShowArchivedInvoices}
						testID="toggle-archived-invoices"
					/>
				</View>
			</View>
		</SafeAreaView>
	);
}
