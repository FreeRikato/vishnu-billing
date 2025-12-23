import { Text, View } from "react-native";
import { contactsStyles } from "@/styles";

interface AvatarPreviewProps {
	initials: string;
	color: string;
	size?: number;
}

export default function AvatarPreview({
	initials,
	color,
	size = 120,
}: AvatarPreviewProps) {
	return (
		<View style={contactsStyles.avatarPreviewContainer}>
			<View
				style={[
					contactsStyles.avatarPreview,
					{ width: size, height: size, borderRadius: size / 2 },
					{ backgroundColor: `${color}20` },
				]}
			>
				<Text style={[contactsStyles.avatarPreviewText, { color }]}>
					{initials}
				</Text>
			</View>
		</View>
	);
}
