import { QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import * as SystemUI from 'expo-system-ui' // 1. Import SystemUI
import { useEffect } from 'react'
import { Colors } from '../constants/colors' // Import Colors
import { queryClient } from '../utils/queryClient' // Import the client we just created

export default function RootLayout() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(Colors.background)
  }, [])

  return (
    // 1. Wrap the app
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="contact-modal"
          options={{
            presentation: 'modal',
            headerShown: false,

            animation: 'slide_from_bottom',

            gestureDirection: 'vertical',

            contentStyle: { backgroundColor: Colors.background },
          }}
        />
      </Stack>
    </QueryClientProvider>
  )
}
