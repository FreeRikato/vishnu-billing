import { MaterialIcons } from "@expo/vector-icons";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { homeStyles } from "@/styles";

interface RecoverButtonProps {
	onRecover: () => void;
	enabled: boolean;
}

export function RecoverButton({ onRecover, enabled }: RecoverButtonProps) {
	const handlePress = () => {
		if (!enabled) return;

		Alert.alert(
			"⚠️ DANGER ZONE",
			"This will WIPE all local data and replace it with the cloud backup. This cannot be undone. Are you absolutely sure?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Overwrite Local Data",
					style: "destructive",
					onPress: onRecover,
				},
			],
		);
	};

	return (
		<View style={[homeStyles.devSection, !enabled && homeStyles.hidden]}>
			<TouchableOpacity
				style={[
					homeStyles.recoverButton,
					!enabled && homeStyles.recoverButtonDisabled,
				]}
				onPress={handlePress}
				activeOpacity={enabled ? 0.7 : 1}
				disabled={!enabled}
			>
				<MaterialIcons
					name="restore-page"
					size={24}
					color={enabled ? "#EF4444" : "#555"}
				/>
				<View>
					<Text
						style={[
							homeStyles.recoverText,
							!enabled && homeStyles.recoverTextDisabled,
						]}
					>
						Recover from Cloud
					</Text>
					{!enabled && (
						<Text style={homeStyles.devNote}>
							(Disabled: Code Bypass Required)
						</Text>
					)}
				</View>
			</TouchableOpacity>
		</View>
	);
}
