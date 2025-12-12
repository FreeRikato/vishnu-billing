import { Text, View } from 'react-native'
import { productsStyles } from '../../styles/products'

export default function ProductsScreen() {
  return (
    <View style={productsStyles.container}>
      <Text style={productsStyles.title}>Products</Text>
      <Text style={productsStyles.text}>Manage your inventory here.</Text>
    </View>
  )
}
