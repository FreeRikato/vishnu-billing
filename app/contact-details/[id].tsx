import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { ZodError } from 'zod'
import { Colors } from '../../constants/colors'
import { useContact, useDeleteCustomerSoft, useUpdateCustomer } from '../../hooks/useContacts'
import { contactDetailsStyles } from '../../styles/contact-details'
import type { ContactForm } from '../../types'
import { contactFormSchema } from '../../utils/validation'

export default function ContactDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()

  // 1. Hooks for Data and Mutations
  const { data: contact, isLoading } = useContact(id)
  const updateMutation = useUpdateCustomer()
  const deleteMutation = useDeleteCustomerSoft()

  // 2. Local State
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<ContactForm>({
    customer_id: '',
    name: '',
    address: '',
    gstin: '',
    dl_no: '',
    state_code: '',
    mobile: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({})

  // 3. Sync data when loaded
  useEffect(() => {
    if (contact) {
      setFormData({
        customer_id: contact.customer_id,
        name: contact.name,
        address: contact.address || '',
        gstin: contact.gstin || '',
        dl_no: contact.dl_no || '',
        state_code: contact.state_code || '',
        mobile: contact.mobile,
      })
    }
  }, [contact])

  // 4. Action Handlers
  const handleMenuPress = () => {
    if (isEditing) {
      // If currently editing, the button acts as "Cancel"
      setIsEditing(false)
      setErrors({})
      // Reset form data to original
      if (contact) {
        setFormData({
          customer_id: contact.customer_id,
          name: contact.name,
          address: contact.address || '',
          gstin: contact.gstin || '',
          dl_no: contact.dl_no || '',
          state_code: contact.state_code || '',
          mobile: contact.mobile,
        })
      }
      return
    }

    Alert.alert('Options', 'Choose an action', [
      {
        text: 'Edit Contact',
        onPress: () => setIsEditing(true),
      },
      {
        text: 'Delete Contact',
        style: 'destructive',
        onPress: confirmDelete,
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ])
  }

  const confirmDelete = () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to remove this contact?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          deleteMutation.mutate(id, {
            onSuccess: () => {
              router.back()
            },
            onError: () => {
              Alert.alert('Error', 'Failed to delete contact')
            },
          })
        },
      },
    ])
  }

  // 5. Form Logic
  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSave = () => {
    try {
      contactFormSchema.parse(formData)
      setErrors({})

      updateMutation.mutate(
        { id, data: formData },
        {
          onSuccess: () => {
            setIsEditing(false)
            Alert.alert('Success', 'Contact updated successfully')
          },
          onError: (err) => {
            console.error(err)
            Alert.alert('Error', 'Failed to update contact')
          },
        }
      )
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<Record<keyof ContactForm, string>> = {}
        error.issues.forEach((err) => {
          const path = err.path[0] as keyof ContactForm
          if (path) fieldErrors[path] = err.message
        })
        setErrors(fieldErrors)
      }
    }
  }

  if (isLoading || !contact) {
    return (
      <View style={contactDetailsStyles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  // 6. Helper for rendering Detail Rows
  const InfoRow = ({ icon, label, value }: { icon: string; label: string; value?: string }) => {
    if (!value) return null
    return (
      <View style={contactDetailsStyles.infoRow}>
        <MaterialCommunityIcons
          name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
          size={20}
          color={Colors.primary}
          style={{ marginTop: 2 }}
        />
        <View style={contactDetailsStyles.infoContent}>
          <Text style={contactDetailsStyles.infoLabel}>{label}</Text>
          <Text style={contactDetailsStyles.infoValue}>{value}</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={contactDetailsStyles.container}>
      {/* Configure the Header */}
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: isEditing ? 'Edit Contact' : '',
          headerBackVisible: false, // Hide default back button
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={handleMenuPress} style={contactDetailsStyles.circleButton}>
              {/* Toggle Icon based on state */}
              <MaterialCommunityIcons
                name={isEditing ? 'close' : 'dots-horizontal'}
                size={24}
                color={Colors.text}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            // Only show explicit Back button in View mode on the right for convenience,
            // or rely on a custom back button if desired.
            // Here we just add a close/back button.
            <TouchableOpacity
              onPress={() => router.back()}
              style={[contactDetailsStyles.circleButton, { marginLeft: 10 }]}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={contactDetailsStyles.contentContainer}>
          {isEditing ? (
            // === EDIT MODE ===
            <View>
              <View style={contactDetailsStyles.inputGroup}>
                <Text style={contactDetailsStyles.label}>Name *</Text>
                <TextInput
                  style={[
                    contactDetailsStyles.input,
                    !!errors.name && contactDetailsStyles.errorInput,
                  ]}
                  value={formData.name}
                  onChangeText={(v) => handleInputChange('name', v)}
                />
                {errors.name && <Text style={contactDetailsStyles.errorText}>{errors.name}</Text>}
              </View>

              <View style={contactDetailsStyles.inputGroup}>
                <Text style={contactDetailsStyles.label}>Mobile *</Text>
                <TextInput
                  style={[
                    contactDetailsStyles.input,
                    !!errors.mobile && contactDetailsStyles.errorInput,
                  ]}
                  value={formData.mobile}
                  onChangeText={(v) => handleInputChange('mobile', v)}
                  keyboardType="phone-pad"
                />
                {errors.mobile && (
                  <Text style={contactDetailsStyles.errorText}>{errors.mobile}</Text>
                )}
              </View>

              <View style={contactDetailsStyles.inputGroup}>
                <Text style={contactDetailsStyles.label}>Address</Text>
                <TextInput
                  style={[contactDetailsStyles.input, contactDetailsStyles.textArea]}
                  value={formData.address}
                  onChangeText={(v) => handleInputChange('address', v)}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={contactDetailsStyles.inputGroup}>
                <Text style={contactDetailsStyles.label}>GSTIN</Text>
                <TextInput
                  style={contactDetailsStyles.input}
                  value={formData.gstin}
                  onChangeText={(v) => handleInputChange('gstin', v)}
                  autoCapitalize="characters"
                />
              </View>

              <View style={contactDetailsStyles.inputGroup}>
                <Text style={contactDetailsStyles.label}>DL No</Text>
                <TextInput
                  style={contactDetailsStyles.input}
                  value={formData.dl_no}
                  onChangeText={(v) => handleInputChange('dl_no', v)}
                  autoCapitalize="characters"
                />
              </View>

              <View style={contactDetailsStyles.inputGroup}>
                <Text style={contactDetailsStyles.label}>State Code</Text>
                <TextInput
                  style={contactDetailsStyles.input}
                  value={formData.state_code}
                  onChangeText={(v) => handleInputChange('state_code', v)}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>

              <TouchableOpacity
                style={contactDetailsStyles.saveButton}
                onPress={handleSave}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={contactDetailsStyles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            // === VIEW MODE ===
            <View>
              <View style={contactDetailsStyles.headerSection}>
                <View style={contactDetailsStyles.avatarPlaceholder}>
                  <Text style={{ fontSize: 32, fontWeight: 'bold', color: Colors.textSecondary }}>
                    {contact.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={contactDetailsStyles.nameText}>{contact.name}</Text>
                <View style={contactDetailsStyles.idBadge}>
                  <Text style={contactDetailsStyles.idText}>{contact.customer_id}</Text>
                </View>
              </View>

              <View style={contactDetailsStyles.infoSection}>
                <InfoRow icon="phone" label="Mobile Number" value={contact.mobile} />
                <InfoRow icon="map-marker" label="Address" value={contact.address} />
                <InfoRow icon="file-document-outline" label="GSTIN" value={contact.gstin} />
                <InfoRow
                  icon="card-account-details-outline"
                  label="DL Number"
                  value={contact.dl_no}
                />
                <InfoRow icon="map-marker-radius" label="State Code" value={contact.state_code} />
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}
