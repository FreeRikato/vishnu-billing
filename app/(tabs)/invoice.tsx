import { Text, View } from 'react-native'
import { invoiceStyles } from '@/styles/invoice'

export default function InvoiceScreen() {
  return (
    <View style={invoiceStyles.container}>
      <Text style={invoiceStyles.title}>Invoices</Text>
      <Text style={invoiceStyles.text}>Billing and payment history.</Text>
    </View>
  )
}
