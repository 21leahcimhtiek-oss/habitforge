import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: Colors.surface, borderTopColor: Colors.border, height: 88, paddingBottom: 28, paddingTop: 8 }, tabBarActiveTintColor: Colors.primary, tabBarInactiveTintColor: Colors.textMuted, tabBarLabelStyle: { fontSize: 11, fontWeight: '600' } }}>
      <Tabs.Screen name="index" options={{ title: 'Today', tabBarIcon: ({ color, size }) => <Ionicons name="today" size={size} color={color} /> }} />
      <Tabs.Screen name="habits" options={{ title: 'Habits', tabBarIcon: ({ color, size }) => <Ionicons name="checkmark-circle" size={size} color={color} /> }} />
      <Tabs.Screen name="tasks" options={{ title: 'Tasks', tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} /> }} />
      <Tabs.Screen name="stats" options={{ title: 'Stats', tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart" size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }} />
    </Tabs>
  );
}
