import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_SIZE = width / 3;

// فيديوهات شبكية تجريبية للملف الشخصي
const PROFILE_VIDEOS = [
  { id: '1', views: '1.2k' },
  { id: '2', views: '500' },
  { id: '3', views: '10.5k' },
  { id: '4', views: '2.1k' },
  { id: '5', views: '890' },
];

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* قسم معلومات المستخدم */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={90} color="#555" />
        </View>
        <Text style={styles.username}>@TiktomUser</Text>
        <Text style={styles.bio}>مطور تطبيقات | Tiktom Developer 🚀</Text>

        {/* إحصائيات المتابعين */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>120</Text>
            <Text style={styles.statLabel}>أتابعهم</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>1.5k</Text>
            <Text style={styles.statLabel}>متابعين</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12.4k</Text>
            <Text style={styles.statLabel}>إعجابات</Text>
          </View>
        </View>

        {/* أزرار التفاعل بالملف */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>تعديل الملف الشخصي</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.callBtn} onPress={() => router.push('/call')}>
            <Ionicons name="videocam" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* شبكة فيديوهات المستخدم */}
      <FlatList
        data={PROFILE_VIDEOS}
        numColumns={3}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <View style={styles.videoPlaceholder}>
              <View style={styles.viewsContainer}>
                <Ionicons name="play-outline" size={12} color="white" />
                <Text style={styles.viewsText}>{item.views}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 50 },
  header: { alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  avatarContainer: { marginBottom: 8 },
  username: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  bio: { color: '#aaa', fontSize: 13, marginTop: 4 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginVertical: 18 },
  statBox: { alignItems: 'center' },
  statNumber: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  statLabel: { color: '#888', fontSize: 12, marginTop: 2 },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  editBtn: { backgroundColor: '#222', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 6 },
  editBtnText: { color: 'white', fontSize: 14, fontWeight: '600' },
  callBtn: { backgroundColor: '#ff2b54', padding: 10, borderRadius: 6 },
  gridItem: { width: COLUMN_SIZE, height: COLUMN_SIZE * 1.3, padding: 1 },
  videoPlaceholder: { flex: 1, backgroundColor: '#1a1a1a', justifyContent: 'flex-end', padding: 6 },
  viewsContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewsText: { color: 'white', fontSize: 11 }
});
