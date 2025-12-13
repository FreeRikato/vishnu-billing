import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { invoiceStyles } from "@/styles/invoice";
import type { Product } from "@/types/invoice";
import { ProductItem } from "./ProductItem";

interface ProductListProps {
  products: Product[];
  onQuantityChange: (productId: string, change: number) => void;
  onRemoveProduct: (productId: string) => void;
  onAddDiscount: (productId: string) => void;
  onAddProduct: () => void;
}

export function ProductList({
  products,
  onQuantityChange,
  onRemoveProduct,
  onAddDiscount,
  onAddProduct
}: ProductListProps) {
  return (
    <View style={invoiceStyles.section}>
      <Text style={invoiceStyles.sectionTitle}>What are they buying?</Text>
      <View style={invoiceStyles.productsSection}>
        {products.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            onQuantityChange={onQuantityChange}
            onRemoveProduct={onRemoveProduct}
            onAddDiscount={onAddDiscount}
          />
        ))}
        <TouchableOpacity onPress={onAddProduct} style={invoiceStyles.addProductButton}>
          <View style={invoiceStyles.addProductIcon}>
            <Ionicons name="add-circle" size={28} color="#13ec6a" />
          </View>
          <Text style={invoiceStyles.addProductText}>Add Product</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}