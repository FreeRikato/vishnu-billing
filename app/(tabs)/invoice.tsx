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
import type { Invoice, InvoiceStatus } from '@/types'
import { useDebounce } from '@/hooks/useDebounce'
import { useInvoices } from '@/hooks/useInvoices'
import { useInvoiceStore } from '@/store/invoiceStore'
import { invoiceStyles } from '@/styles/invoice'
import { Colors } from '@/constants/colors'

export default function InvoiceScreen() {
  const { searchQuery, setSearchQuery, statusFilter, setStatusFilter } = useInvoiceStore()

  const debouncedSearch = useDebounce(searchQuery, 500)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useInvoices(debouncedSearch, statusFilter)

  const invoices = useMemo(() => {
    if (!data) return []
    return data.pages.flatMap((page) => page.data)
  }, [data])

  const chips: Array<{ label: string; value: 'all' | InvoiceStatus }> = [
    { label: 'All', value: 'all' },
    { label: 'Unpaid', value: 'unpaid' },
    { label: 'Partial', value: 'partial' },
    { label: 'Paid', value: 'paid' },
  ]

  const handleSelectStatus = (value: 'all' | InvoiceStatus) => {
    // Simple UX: if user switches to a specific status, clear the search box
    // so results are predictable (no composition rules).
    if (value !== 'all') setSearchQuery('')
    setStatusFilter(value)
  }

  const renderInvoiceItem = ({ item }: { item: Invoice }) => (
    <View style={invoiceStyles.invoiceCard}>
      <View style={invoiceStyles.invoiceTopRow}>
        <Text style={invoiceStyles.invoiceNo}>{item.invoice_no}</Text>
        <View style={invoiceStyles.statusPill}>
          <Text style={invoiceStyles.statusText}>{item.status}</Text>
        </View>
      </View>
      {item.customer_name ? (
        <Text style={invoiceStyles.invoiceDetail}>Customer: {item.customer_name}</Text>
      ) : null}
      <Text style={invoiceStyles.invoiceDetail}>Total: ₹{item.amount_total}</Text>
      <Text style={invoiceStyles.invoiceDetail}>Paid: ₹{item.amount_paid}</Text>
    </View>
  )

  return (
    <View style={invoiceStyles.container}>
      <View style={invoiceStyles.headerContainer}>
        <Text style={invoiceStyles.title}>Invoices</Text>
        <Text style={invoiceStyles.subtitle}>Billing and payment history.</Text>

        <View style={invoiceStyles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={20} color={Colors.textSecondary} />
          <TextInput
            placeholder="Search by Invoice No. (Case Sensitive)"
            placeholderTextColor={Colors.textSecondary}
            style={invoiceStyles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={invoiceStyles.chipsContainer}
        contentContainerStyle={invoiceStyles.chipsContent}
      >
        {chips.map((chip) => {
          const isActive = statusFilter === chip.value
          return (
            <TouchableOpacity
              key={chip.value}
              activeOpacity={0.8}
              onPress={() => handleSelectStatus(chip.value)}
              style={[invoiceStyles.chip, isActive && invoiceStyles.chipActive]}
            >
              <Text
                style={[
                  invoiceStyles.chipText,
                  isActive && invoiceStyles.chipTextActive,
                ]}
              >
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
            {searchQuery ? 'No invoices found matching search' : 'No invoices found'}
          </Text>
          <Text style={invoiceStyles.emptyStateSubtext}>
            {statusFilter === 'all' ? 'Try adding an invoice.' : 'Try a different status.'}
          </Text>
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
