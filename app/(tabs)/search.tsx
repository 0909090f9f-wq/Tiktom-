import React from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const COLUMN_SIZE = (width - 36) / 2;

const TRENDING_HASHTAGS = ['#تحدي_تكتوم', '#تقنية', '#تصميم_تطبيقات', '#فيديو'];
const SEARCH_GRID = [
  { id: '1', title: 'تحديات اليوم 🔥' },
  { id: '2', title: 'أحدث مقاطع الفيديو 🎥' },
  { id: '3', title: 'البث المباشر الان 🔴' },
  { id: '4', title: 'المحتوى الشائع 📈' },
];

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      {/* شريط البحث */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="ابحث عن مستخدمين، وسوم، أو فيديوهات..."
          placeholderTextColor="#888"
        />
      </View>

      {/* الوسوم الشائعة */}
      <View style={styles.hashtagsContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={TRENDING_HASHTAGS}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.hashtagBadge}>
              <Text style={styles.hashtagText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* شبكة الاستكشاف */}
      <Text style={styles.sectionTitle}>اكتشف المزيد</Text>
      <FlatList
        data={SEARCH_GRID}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.gridCard}>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 50, paddingHorizontal: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', borderRadius: 10, paddingHorizontal: 10, height: 44, marginBottom: 16 },
  searchIcon: { marginRight: 8 },
  input: { flex: 1, color: 'white', fontSize: 14 },
  hashtagsContainer: { marginBottom: 20 },
  hashtagBadge: { backgroundColor: '#262626', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  hashtagText: { color: '#ff2b54', fontSize: 13, fontWeight: '600' },
  sectionTitle: { color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  gridCard: { width: COLUMN_SIZE, height: 120, backgroundColor: '#181818', borderRadius: 12, padding: 12, justifyContent: 'flex-end', borderWidth: 1, borderColor: '#282828' },
  cardTitle: { color: 'white', fontWeight: 'bold', fontSize: 14 }
});
