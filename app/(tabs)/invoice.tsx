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
import type { Invoice } from '@/types'

export default function InvoiceScreen() {
  const {
    invoices,
    searchText,
    setSearchText,
    statusFilter,
    setStatusFilter,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useInvoices()

  const chips = useMemo(
    () =>
      [
        { label: 'All', value: 'all' },
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Partial', value: 'partial' },
        { label: 'Paid', value: 'paid' },
      ] as const,
    []
  )

  const renderInvoiceItem = ({ item }: { item: Invoice }) => (
    <View style={invoiceStyles.invoiceItem}>
      <View style={invoiceStyles.invoiceTopRow}>
        <Text style={invoiceStyles.invoiceNumber}>{item.invoice_number}</Text>
        <View style={invoiceStyles.statusBadge}>
          <Text style={invoiceStyles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={invoiceStyles.invoiceDetail}>Customer: {item.customer_name}</Text>
      <Text style={invoiceStyles.invoiceDetail}>Total: ₹{item.total_amount}</Text>
      <Text style={invoiceStyles.invoiceDetail}>
        Paid: ₹{item.paid_amount} • Balance: ₹{Math.max(0, item.total_amount - item.paid_amount)}
      </Text>
    </View>
  )

  return (
    <View style={invoiceStyles.container}>
      <View style={invoiceStyles.headerContainer}>
        <Text style={invoiceStyles.title}>Invoices</Text>
        <Text style={invoiceStyles.subtitle}>Billing and payment history.</Text>

        <View style={invoiceStyles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color={Colors.textSecondary} />
          <TextInput
            placeholder="Search by Invoice No."
            placeholderTextColor={Colors.textSecondary}
            style={invoiceStyles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            autoCorrect={false}
            autoCapitalize="none"
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
        style={invoiceStyles.chipsRow}
        contentContainerStyle={invoiceStyles.chipsContent}
        showsHorizontalScrollIndicator={false}
      >
        {chips.map((chip) => {
          const isActive = statusFilter === chip.value
          return (
            <TouchableOpacity
              key={chip.value}
              activeOpacity={0.8}
              style={[invoiceStyles.chip, isActive && invoiceStyles.chipActive]}
              onPress={() => {
                // Simple UX: when switching away from "All", clear search to avoid confusion.
                // This keeps filtering behavior easy to reason about.
                if (chip.value !== 'all' && searchText) {
                  setSearchText('')
                }
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
          <Text style={invoiceStyles.emptyStateText}>
            {searchText ? 'No invoices found matching search' : 'No invoices yet'}
          </Text>
          {!searchText && (
            <Text style={invoiceStyles.emptyStateSubtext}>
              Invoices will appear here once they are created.
            </Text>
          )}
        </View>
      ) : (
        <FlatList
          data={invoices}
          renderItem={renderInvoiceItem}
          keyExtractor={(item) => item.id}
          style={invoiceStyles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching && !isFetchingNextPage}
              onRefresh={refetch}
              tintColor={Colors.primary}
            />
          }
          onEndReached={() => {
            if (hasNextPage) fetchNextPage()
          }}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator size="small" color={Colors.primary} /> : null
          }
        />
      )}
    </View>
  )
}
