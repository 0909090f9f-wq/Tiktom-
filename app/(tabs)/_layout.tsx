import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#fff', tabBarStyle: { backgroundColor: '#000' }, headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'الرئيسية', tabBarIcon: ({color}) => <Ionicons name="home" size={24} color={color} /> }} />
      <Tabs.Screen name="search" options={{ title: 'بحث', tabBarIcon: ({color}) => <Ionicons name="search" size={24} color={color} /> }} />
      <Tabs.Screen name="add" options={{ title: '', tabBarIcon: ({color}) => <Ionicons name="add-circle" size={40} color="#ff2b54" /> }} />
      <Tabs.Screen name="inbox" options={{ title: 'الرسائل', tabBarIcon: ({color}) => <Ionicons name="chatbubble" size={24} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'الملف', tabBarIcon: ({color}) => <Ionicons name="person" size={24} color={color} /> }} />
    </Tabs>
  );
}
