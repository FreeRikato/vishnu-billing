import { MaterialCommunityIcons } from '@expo/vector-icons' // using specific icon set
import { BlurView } from 'expo-blur'
import { Tabs } from 'expo-router'
import { Platform } from 'react-native'
import { Colors } from '../../constants/colors'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
          },
          default: {
            backgroundColor: Colors.tabBarBackground,
          },
        }),
        tabBarActiveTintColor: Colors.tabBarActive,
        tabBarInactiveTintColor: Colors.tabBarInactive,
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView intensity={80} tint="light" style={{ flex: 1 }} />
          ) : undefined,
      }}
    >
      {/* 1. Dashboard Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="view-dashboard" size={28} color={color} />
          ),
        }}
      />

      {/* 2. Products Tab */}
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="package-variant" size={28} color={color} />
          ),
        }}
      />

      {/* 3. Contacts Tab */}
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Contacts',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-group" size={28} color={color} />
          ),
        }}
      />

      {/* 4. Invoice Tab */}
      <Tabs.Screen
        name="invoice"
        options={{
          title: 'Invoice',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="file-document-outline" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
