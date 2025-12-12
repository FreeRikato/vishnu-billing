import { ScrollView, View } from "react-native";
import type { Product } from "@/types";
import { contactsStyles } from "../styles/contacts";
import ProductItem from "./ProductItem";

interface ProductListProps {
	products: Product[];
	onPressProduct: (product: Product) => void;
}

export default function ProductList({
	products,
	onPressProduct,
}: ProductListProps) {
	const handleProductPress = (product: Product) => {
		onPressProduct(product);
	};

	return (
		<ScrollView
			style={contactsStyles.contactList}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={contactsStyles.contactListContent}
		>
			{products.map((product) => (
				<ProductItem
					key={product.id}
					product={product}
					onPress={handleProductPress}
				/>
			))}

			<View style={contactsStyles.bottomSpacer} />
		</ScrollView>
	);
}
