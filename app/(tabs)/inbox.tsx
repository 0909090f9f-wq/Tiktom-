import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// قائمة المحادثات والإشعارات التجريبية
const CHATS_DATA = [
  { id: '1', user: 'علي حسن', message: 'مرحباً، فيديو رائع جداً! 👏', time: '10:30 ص', unread: true },
  { id: '2', user: 'فريق Tiktom', message: 'تم توثيق حسابك بنجاح 🎉', time: 'أمس', unread: false },
  { id: '3', user: 'سارة أحمد', message: 'هل يمكننا بدء مكالمة فيديو؟', time: 'أمس', unread: true },
  { id: '4', user: 'محمد خالد', message: 'قام بالإعجاب بفيديوهاتك.', time: 'منذ يومين', unread: false },
];

export default function InboxScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* شريط العنوان العلوي */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الرسائل والإشعارات</Text>
        <TouchableOpacity style={styles.newChatBtn}>
          <Ionicons name="create-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* قائمة المحادثات */}
      <FlatList
        data={CHATS_DATA}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatCard}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={26} color="#aaa" />
            </View>

            <View style={styles.chatInfo}>
              <View style={styles.chatHeader}>
                <Text style={styles.userName}>{item.user}</Text>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
              <Text style={[styles.messageText, item.unread && styles.unreadText]} numberOfLines={1}>
                {item.message}
              </Text>
            </View>

            {/* زر مكالمة فيديو سريعة مع المستلم */}
            <TouchableOpacity style={styles.callQuickBtn} onPress={() => router.push('/call')}>
              <Ionicons name="videocam" size={20} color="#ff2b54" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 50, paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  newChatBtn: { padding: 4 },
  chatCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#222' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  chatInfo: { flex: 1 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  userName: { color: 'white', fontSize: 15, fontWeight: '600' },
  timeText: { color: '#666', fontSize: 11 },
  messageText: { color: '#888', fontSize: 13 },
  unreadText: { color: 'white', fontWeight: 'bold' },
  callQuickBtn: { padding: 8, marginLeft: 8 }
});
