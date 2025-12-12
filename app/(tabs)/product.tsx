import { StyleSheet, Text, View } from "react-native";

export default function TabFourScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Product</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
	},
});
