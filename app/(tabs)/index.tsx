import { Text, View } from 'react-native'
import { dashboardStyles } from '../../styles/dashboard'

export default function DashboardScreen() {
  return (
    <View style={dashboardStyles.container}>
      <Text style={dashboardStyles.title}>Dashboard</Text>
      <Text style={dashboardStyles.text}>Welcome to the main overview.</Text>
    </View>
  )
}
