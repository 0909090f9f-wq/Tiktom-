import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopWidth: 0,
          height: 60,
          marginBottom: 12,
          paddingBottom: 5,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'الرئيسية' }} />
      <Tabs.Screen name="explore" options={{ title: 'استكشف' }} />
      <Tabs.Screen 
        name="call" 
        options={{ 
          title: 'مكالمة 📞',
          tabBarIcon: ({ color }) => <Ionicons name="videocam" size={20} color={color} />
        }} 
      />
      <Tabs.Screen name="upload" options={{ title: 'رفع' }} />
      <Tabs.Screen name="inbox" options={{ title: 'الرسائل' }} />
      <Tabs.Screen name="profile" options={{ title: 'الملف الشخصي' }} />
    </Tabs>
  );
}
