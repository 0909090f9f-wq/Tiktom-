import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NotificationItem {
  id: string;
  user: string;
  action: string;
  time: string;
  type: 'like' | 'comment' | 'follow';
  read: boolean;
}

interface MessageItem {
  id: string;
  user: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: '1', user: '@ahmed_tech', action: 'قام بتسجيل إعجاب بالفيديو الخاص بك', time: 'منذ 5 د', type: 'like', read: false },
  { id: '2', user: '@sara_code', action: 'بدأت بمتابعتك الآن', time: 'منذ 20 د', type: 'follow', read: false },
  { id: '3', user: '@dev_sudan', action: 'علق: "تطبيق مميز جداً!"', time: 'منذ ساعة', type: 'comment', read: true },
  { id: '4', user: '@omar_ui', action: 'قام بتسجيل إعجاب بالفيديو الخاص بك', time: 'منذ 3 ساعات', type: 'like', read: true },
  { id: '5', user: '@react_coder', action: 'بدأ بمتابعتك الآن', time: 'منذ يوم', type: 'follow', read: true },
];

const MOCK_MESSAGES: MessageItem[] = [
  { id: '1', user: '@ahmed_tech', lastMessage: 'مرحباً، كيف صنعت تطبيق تكتوم؟', time: '10:30 ص', unreadCount: 2 },
  { id: '2', user: '@sara_code', lastMessage: 'شكراً لك على الدعم!', time: 'أمس', unreadCount: 0 },
  { id: '3', user: '@dev_sudan', lastMessage: 'هل يمكنك مشاركة الكود البرمجي؟', time: 'أمس', unreadCount: 1 },
];

export default function InboxScreen() {
  const [activeTab, setActiveTab] = useState<'notifications' | 'messages'>('notifications');

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'like':
        return <Ionicons name="heart" size={20} color="#FF0050" />;
      case 'comment':
        return <Ionicons name="chatbubble" size={20} color="#00F2FE" />;
      case 'follow':
        return <Ionicons name="person-add" size={20} color="#FE2C55" />;
    }
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity style={[styles.itemContainer, !item.read && styles.unreadItem]}>
      <View style={styles.iconContainer}>
        {getNotificationIcon(item.type)}
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.usernameText}>{item.user}</Text>
        <Text style={styles.actionText}>{item.action}</Text>
      </View>
      <Text style={styles.timeText}>{item.time}</Text>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: MessageItem }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle-outline" size={45} color="#888" />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.usernameText}>{item.user}</Text>
        <Text style={styles.messageText} numberOfLines={1}>{item.lastMessage}</Text>
      </View>
      <View style={styles.timeBadgeContainer}>
        <Text style={styles.timeText}>{item.time}</Text>
        {item.unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* الشريط العلوي Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setActiveTab('notifications')}>
          <Text style={[styles.headerTab, activeTab === 'notifications' && styles.activeHeaderTab]}>
            الأنشطة
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('messages')}>
          <Text style={[styles.headerTab, activeTab === 'messages' && styles.activeHeaderTab]}>
            الرسائل
          </Text>
        </TouchableOpacity>
      </View>

      {/* المحتوى حسب التبويب */}
      {activeTab === 'notifications' ? (
        <FlatList
          data={MOCK_NOTIFICATIONS}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <FlatList
          data={MOCK_MESSAGES}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 50 },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
  },
  headerTab: {
    color: '#888',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  activeHeaderTab: {
    color: '#FFF',
    borderBottomWidth: 2,
    borderBottomColor: '#FF0050',
    paddingBottom: 4,
  },
  listContainer: { paddingVertical: 10 },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 0.3,
    borderBottomColor: '#1A1A1A',
  },
  unreadItem: { backgroundColor: '#0A0A0A' },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarContainer: { marginRight: 12 },
  itemContent: { flex: 1 },
  usernameText: { color: '#FFF', fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
  actionText: { color: '#AAA', fontSize: 12 },
  messageText: { color: '#777', fontSize: 12, marginTop: 2 },
  timeText: { color: '#555', fontSize: 11 },
  timeBadgeContainer: { alignItems: 'flex-end' },
  badge: {
    backgroundColor: '#FF0050',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
});
