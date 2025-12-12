import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
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
import { Colors } from '@/constants/colors'
// Import the Mutation Hook
import { useAddCustomer } from '@/hooks/useContacts'
import { contactModalStyles } from '@/styles/contact-modal'
import type { ContactForm } from '@/types'
import { contactFormSchema } from '@/utils/validation'

export default function ContactModal() {
  const router = useRouter()

  // 1. Setup Mutation
  const addCustomerMutation = useAddCustomer()

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

  // We don't need local 'isSubmitting' state anymore, the mutation provides it
  // But we can keep the alias for clarity in UI
  const isSubmitting = addCustomerMutation.isPending

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const validateForm = (): boolean => {
    try {
      contactFormSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<Record<keyof ContactForm, string>> = {}
        error.issues.forEach((err) => {
          // Zod paths can be numbers or strings, ensure we map correctly
          const path = err.path[0] as keyof ContactForm
          if (path) {
            fieldErrors[path] = err.message
          }
        })
        setErrors(fieldErrors)
      }
      return false
    }
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form')
      return
    }

    // 2. Execute Mutation
    addCustomerMutation.mutate(formData, {
      onSuccess: (result) => {
        // React Query handles the invalidation automatically via the hook setup
        // We just handle UI feedback here
        if (result) {
          Alert.alert('Success', `Contact has been added successfully\nID: ${result}`, [
            { text: 'OK', onPress: () => router.back() },
          ])
        } else {
          // Fallback error (should rarely happen if onError captures it)
          Alert.alert('Error', 'Failed to save. Try again.')
        }
      },
      onError: (error) => {
        console.error('Error saving contact:', error)
        Alert.alert('Error', 'Failed to save contact. Please try again.')
      },
    })
  }

  const handleClose = () => {
    router.back()
  }

  return (
    <KeyboardAvoidingView
      style={contactModalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={contactModalStyles.header}>
        <Text style={contactModalStyles.title}>Add New Contact</Text>
        <TouchableOpacity onPress={handleClose} style={contactModalStyles.closeButton}>
          <MaterialCommunityIcons name="close" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={contactModalStyles.formContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={contactModalStyles.inputGroup}>
          <Text style={contactModalStyles.label}>Name *</Text>
          <TextInput
            style={[contactModalStyles.input, !!errors.name && contactModalStyles.errorInput]}
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder="Enter customer name"
            placeholderTextColor="#999"
          />
          {errors.name && <Text style={contactModalStyles.errorText}>{errors.name}</Text>}
        </View>

        <View style={contactModalStyles.inputGroup}>
          <Text style={contactModalStyles.label}>Mobile *</Text>
          <TextInput
            style={[contactModalStyles.input, !!errors.mobile && contactModalStyles.errorInput]}
            value={formData.mobile}
            onChangeText={(value) => handleInputChange('mobile', value)}
            placeholder="Enter mobile number"
            keyboardType="phone-pad"
            placeholderTextColor="#999"
          />
          {errors.mobile && <Text style={contactModalStyles.errorText}>{errors.mobile}</Text>}
        </View>

        <View style={contactModalStyles.inputGroup}>
          <Text style={contactModalStyles.label}>Address (Optional)</Text>
          <TextInput
            style={[contactModalStyles.input, contactModalStyles.textArea]}
            value={formData.address}
            onChangeText={(value) => handleInputChange('address', value)}
            placeholder="Enter address"
            multiline
            numberOfLines={3}
            placeholderTextColor="#999"
          />
        </View>

        <View style={contactModalStyles.inputGroup}>
          <Text style={contactModalStyles.label}>GSTIN (Optional)</Text>
          <TextInput
            style={contactModalStyles.input}
            value={formData.gstin}
            onChangeText={(value) => handleInputChange('gstin', value)}
            placeholder="Enter GSTIN number"
            autoCapitalize="characters"
            placeholderTextColor="#999"
          />
        </View>

        <View style={contactModalStyles.inputGroup}>
          <Text style={contactModalStyles.label}>DL No. (Optional)</Text>
          <TextInput
            style={contactModalStyles.input}
            value={formData.dl_no}
            onChangeText={(value) => handleInputChange('dl_no', value)}
            placeholder="Enter drug license number"
            autoCapitalize="characters"
            placeholderTextColor="#999"
          />
        </View>

        <View style={contactModalStyles.inputGroup}>
          <Text style={contactModalStyles.label}>State Code (Optional)</Text>
          <TextInput
            style={contactModalStyles.input}
            value={formData.state_code}
            onChangeText={(value) => handleInputChange('state_code', value)}
            placeholder="Enter state code (e.g., 33)"
            keyboardType="numeric"
            maxLength={2}
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
          style={[
            contactModalStyles.submitButton,
            isSubmitting && contactModalStyles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={contactModalStyles.submitButtonText}>
            {isSubmitting ? 'Saving...' : 'Save Contact'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
