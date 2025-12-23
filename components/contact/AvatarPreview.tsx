import { StyleSheet, Text, View } from "react-native";

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
		<View style={styles.avatarPreviewContainer}>
			<View
				style={[
					styles.avatarPreview,
					{ width: size, height: size, borderRadius: size / 2 },
					{ backgroundColor: `${color}20` },
				]}
			>
				<Text style={[styles.avatarPreviewText, { color }]}>{initials}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	avatarPreviewContainer: {
		alignItems: "center",
		marginBottom: 32,
	},
	avatarPreview: {
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 16,
	},
	avatarPreviewText: {
		fontSize: 42,
		fontWeight: "bold",
	},
});
