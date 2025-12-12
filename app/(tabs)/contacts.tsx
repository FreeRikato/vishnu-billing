import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useEffect, useMemo } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Colors } from '@/constants/colors'
// Imports for our new Architecture
import { useContacts } from '@/hooks/useContacts' // Removed delete hook from here
import { useDebounce } from '@/hooks/useDebounce' // Import our new hook
import { useContactStore } from '@/store/contactStore'
import { contactsStyles } from '@/styles/contacts'
import type { Contact } from '@/types' // Import Contact type
import { isMigrationNeeded, migrateExistingCustomers } from '@/utils/migration'

export default function ContactsScreen() {
  const router = useRouter()

  // 1. Client State (Zustand) - Holds the raw text input
  const { searchQuery, setSearchQuery } = useContactStore()

  // 2. Debounce the search
  // Wait 500ms after typing stops before changing this value
  const debouncedSearch = useDebounce(searchQuery, 500)

  // 3. Server State (React Query)
  // We pass the DEBOUNCED value to the hook.
  // The hook will only refetch when this value changes.
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch, isRefetching } =
    useContacts(debouncedSearch)

  // 4. Migration Check (Keep this as is, but logic inside useEffect)
  useEffect(() => {
    const checkAndRunMigration = async () => {
      try {
        const migrationNeeded = await isMigrationNeeded()
        if (migrationNeeded) {
          Alert.alert('Customer ID Update', 'Update required for IDs.', [
            { text: 'Later', style: 'cancel' },
            {
              text: 'Update Now',
              onPress: async () => {
                await migrateExistingCustomers()
                refetch() // Simplified: just tell Query to re-get data
              },
            },
          ])
        }
      } catch (error) {
        console.error('Migration check failed', error)
      }
    }
    checkAndRunMigration()
  }, [refetch])

  // 5. Flatten Data
  // We removed the client-side filtering logic here.
  // The data coming from 'useContacts' is ALREADY filtered by the server.
  const allContacts = useMemo(() => {
    if (!data) return []
    return data.pages.flatMap((page) => page.data)
  }, [data])

  const handleAddContact = () => {
    router.push('/contact-modal')
  }

  // New function to handle navigation
  const handlePressContact = (contact: Contact) => {
    router.push(`/contact-details/${contact.id}`)
  }

  const renderCustomerItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={contactsStyles.customerItem}
      onPress={() => handlePressContact(item)}
      activeOpacity={0.7}
    >
      <View style={contactsStyles.customerHeader}>
        <View style={contactsStyles.customerInfo}>
          <Text style={contactsStyles.customerName}>{item.name}</Text>
          <Text style={contactsStyles.customerId}>{item.customer_id}</Text>
        </View>
        {/* Delete button removed from here */}
        <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.textSecondary} />
      </View>
      <Text style={contactsStyles.customerDetail}>Mobile: {item.mobile}</Text>
      <Text style={contactsStyles.customerDetail}>Address: {item.address}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={contactsStyles.container}>
      <View style={contactsStyles.headerContainer}>
        <Text style={contactsStyles.title}>Contacts</Text>

        {/* Search Bar */}
        <View
          style={{
            width: '90%',
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.card,
            borderRadius: 8,
            paddingHorizontal: 10,
            borderBottomWidth: 1,
            borderColor: Colors.border,
          }}
        >
          <MaterialCommunityIcons name="magnify" size={20} color={Colors.textSecondary} />
          <TextInput
            placeholder="Search by Name (Case Sensitive)"
            placeholderTextColor={Colors.textSecondary}
            style={{ flex: 1, padding: 10, color: Colors.text }}
            value={searchQuery}
            onChangeText={setSearchQuery} // Updates Zustand immediately
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isLoading ? (
        <View style={contactsStyles.emptyState}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={contactsStyles.emptyStateText}>Loading contacts...</Text>
        </View>
      ) : allContacts.length === 0 ? (
        <View style={contactsStyles.emptyState}>
          <Text style={contactsStyles.emptyStateText}>
            {searchQuery ? 'No contacts found matching search' : 'No customers added yet'}
          </Text>
          {!searchQuery && (
            <Text style={contactsStyles.emptyStateSubtext}>
              Tap the + button to add your first customer
            </Text>
          )}
        </View>
      ) : (
        <FlatList
          data={allContacts}
          renderItem={renderCustomerItem}
          keyExtractor={(item) => item.id}
          style={contactsStyles.customerList}
          showsVerticalScrollIndicator={false}
          // React Query handles the refreshing state logic
          refreshControl={
            <RefreshControl
              refreshing={isRefetching && !isFetchingNextPage}
              onRefresh={refetch}
              tintColor={Colors.primary}
            />
          }
          // Infinite Scroll Logic
          onEndReached={() => {
            if (hasNextPage) fetchNextPage()
          }}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator size="small" color={Colors.primary} /> : null
          }
        />
      )}

      <TouchableOpacity style={contactsStyles.fab} onPress={handleAddContact}>
        <Text style={contactsStyles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  )
}
