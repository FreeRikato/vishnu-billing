import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useMemo } from 'react'
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Colors } from '@/constants/colors'
import { useInvoices } from '@/hooks/useInvoices'
import { invoiceStyles } from '@/styles/invoice'

export default function InvoiceScreen() {
  const { invoices, isLoading, isRefetching, refetch, searchText, setSearchText, statusFilter, setStatusFilter } =
    useInvoices()

  const chips = useMemo(
    () =>
      [
        { label: 'All', value: 'all' },
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Partial', value: 'partial' },
        { label: 'Paid', value: 'paid' },
      ] as const,
    [],
  )

  return (
    <View style={invoiceStyles.container}>
      <View style={invoiceStyles.header}>
        <Text style={invoiceStyles.title}>Invoices</Text>
        <Text style={invoiceStyles.text}>Billing and payment history.</Text>

        <View style={invoiceStyles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={20} color={Colors.textSecondary} />
          <TextInput
            placeholder="Search by customer or invoice ID"
            placeholderTextColor={Colors.textSecondary}
            style={invoiceStyles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            autoCorrect={false}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <MaterialCommunityIcons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={invoiceStyles.chipsRow}
        contentContainerStyle={invoiceStyles.chipsContent}
      >
        {chips.map((chip) => {
          const isActive = statusFilter === chip.value
          return (
            <TouchableOpacity
              key={chip.value}
              activeOpacity={0.8}
              style={[invoiceStyles.chip, isActive && invoiceStyles.chipActive]}
              onPress={() => {
                // Simple behavior: when switching to a non-"All" status filter,
                // clear the search text to avoid composing filters.
                if (chip.value !== 'all') setSearchText('')
                setStatusFilter(chip.value)
              }}
            >
              <Text style={[invoiceStyles.chipText, isActive && invoiceStyles.chipTextActive]}>
                {chip.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      {isLoading ? (
        <View style={invoiceStyles.emptyState}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={invoiceStyles.emptyStateText}>Loading invoices...</Text>
        </View>
      ) : invoices.length === 0 ? (
        <View style={invoiceStyles.emptyState}>
          <Text style={invoiceStyles.emptyStateText}>No invoices found.</Text>
        </View>
      ) : (
        <FlatList
          data={invoices}
          style={invoiceStyles.list}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.primary} />
          }
          renderItem={({ item }) => (
            <View style={invoiceStyles.invoiceItem}>
              <View style={invoiceStyles.invoiceTopRow}>
                <Text style={invoiceStyles.invoiceId}>{item.id}</Text>
                <Text style={invoiceStyles.invoiceStatus}>{item.status}</Text>
              </View>
              <Text style={invoiceStyles.invoiceMeta}>Customer: {item.customerName}</Text>
              <Text style={invoiceStyles.invoiceMeta}>Issued: {item.issuedAt}</Text>
              <Text style={invoiceStyles.invoiceMeta}>
                Paid: ₹{item.paid} / ₹{item.total}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  )
}
