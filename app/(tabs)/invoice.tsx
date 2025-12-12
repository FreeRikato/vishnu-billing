import { StyleSheet, Text, View } from "react-native";


export default function TabThreeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Invoice</Text>
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
        color: 'white',
    },
});
