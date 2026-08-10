import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

const { width } = Dimensions.get('window');

const TRENDING_HASHTAGS = [
  '#تكتوم',
  '#برمجة',
  '#السودان',
  '#تطوير',
  '#تصميم',
  '#فيديوهات',
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allVideos, setAllVideos] = useState<any[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<any[]>([]);

  // حالة البحث بواسطة جوجل داخل التطبيق
  const [googleSearchUrl, setGoogleSearchUrl] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadVideos();
    }, [])
  );

  const loadVideos = async () => {
    const storedVideos = await AsyncStorage.getItem('my_videos');
    if (storedVideos) {
      const parsed = JSON.parse(storedVideos);
      setAllVideos(parsed);
      setFilteredVideos(parsed);
    }
  };

  const handleLocalSearch = (text: string) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setFilteredVideos(allVideos);
      return;
    }

    const query = text.toLowerCase().trim();
    const filtered = allVideos.filter(
      (v) =>
        (v.desc && v.desc.toLowerCase().includes(query)) ||
        (v.user && v.user.toLowerCase().includes(query))
    );
    setFilteredVideos(filtered);
  };

  // البحث عن فيديوهات في جوجل داخل التطبيق
  const handleGoogleVideoSearch = () => {
    if (!searchQuery.trim()) return;
    const queryEncoded = encodeURIComponent(searchQuery.trim());
    // توجيه البحث مباشرة إلى قسم الفيديوهات في جوجل
    const googleUrl = `https://www.google.com/search?q=${queryEncoded}&tbm=vid`;
    setGoogleSearchUrl(googleUrl);
  };

  const handleHashtagPress = (hashtag: string) => {
    const cleanTag = hashtag.replace('#', '');
    handleLocalSearch(cleanTag);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredVideos(allVideos);
  };

  const renderVideoCard = ({ item }: { item: any }) => (
    <View style={styles.gridItem}>
      <View style={styles.cardContainer}>
        {item.uri ? (
          <Video
            source={{ uri: item.uri }}
            style={styles.gridVideo}
            resizeMode={ResizeMode.COVER}
            isLooping
            shouldPlay
            isMuted={true}
          />
        ) : (
          <View style={styles.placeholderBox}>
            <Ionicons name="play-outline" size={24} color="#555" />
          </View>
        )}
        <View style={styles.cardOverlay}>
          <Text style={styles.userTag} numberOfLines={1}>
            {item.user || '@faten_dev'}
          </Text>
          <Text style={styles.videoDesc} numberOfLines={1}>
            {item.desc || 'فيديو بدون وصف'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* شريط البحث المزدوج (محلي + جوجل) */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBarContainer}>
          <Ionicons name="logo-google" size={18} color="#4285F4" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="بحث فيديوهات جوجل أو محلي..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={handleLocalSearch}
            onSubmitEditing={handleGoogleVideoSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
              <Ionicons name="close-circle" size={18} color="#888" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.googleSearchBtn} onPress={handleGoogleVideoSearch}>
            <Ionicons name="search" size={16} color="#FFF" />
            <Text style={styles.googleSearchBtnText}>جوجل</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* قائمة الوسوم / الهاشتاقات */}
      <View style={styles.hashtagsContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={TRENDING_HASHTAGS}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.hashtagChip,
                searchQuery.replace('#', '') === item.replace('#', '') && styles.activeChip,
              ]}
              onPress={() => handleHashtagPress(item)}
            >
              <Text style={styles.hashtagText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* نتيجة البحث / شبكة الفيديوهات المحلية */}
      <FlatList
        data={filteredVideos}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={renderVideoCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={50} color="#333" />
            <Text style={styles.emptyTitle}>لا توجد نتائج بحث محلي</Text>
            <TouchableOpacity style={styles.googleBigBtn} onPress={handleGoogleVideoSearch}>
              <Ionicons name="logo-google" size={18} color="#FFF" />
              <Text style={styles.googleBigBtnText}>بحث عن "{searchQuery}" في فيديوهات جوجل</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* نافذة متصفح جوجل الداخلي للفيديوهات دون الخروج من التطبيق */}
      <Modal
        visible={googleSearchUrl !== null}
        animationType="slide"
        onRequestClose={() => setGoogleSearchUrl(null)}
      >
        <View style={styles.browserContainer}>
          <View style={styles.browserHeader}>
            <TouchableOpacity onPress={() => setGoogleSearchUrl(null)} style={styles.closeBrowserBtn}>
              <Ionicons name="arrow-back" size={22} color="#FFF" />
              <Text style={styles.closeBrowserText}>الرجوع لتكتوم</Text>
            </TouchableOpacity>
            <View style={styles.googleBadge}>
              <Ionicons name="logo-google" size={16} color="#4285F4" />
              <Text style={styles.googleBadgeText}>فيديوهات Google</Text>
            </View>
          </View>

          {googleSearchUrl && (
            <WebView
              source={{ uri: googleSearchUrl }}
              style={{ flex: 1 }}
              startInLoadingState={true}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 50 },
  searchHeader: { paddingHorizontal: 15, marginBottom: 10 },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 25,
    paddingLeft: 12,
    paddingRight: 4,
    height: 46,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: '#FFF', fontSize: 13, textAlign: 'right' },
  clearIcon: { marginHorizontal: 5 },
  googleSearchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0050',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 4,
  },
  googleSearchBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  hashtagsContainer: { paddingHorizontal: 10, marginBottom: 15, height: 35 },
  hashtagChip: {
    backgroundColor: '#121212',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#222',
  },
  activeChip: { backgroundColor: '#FF0050', borderColor: '#FF0050' },
  hashtagText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  listContent: { paddingHorizontal: 5 },
  gridItem: { width: width / 2, height: 230, padding: 4 },
  cardContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#111',
    position: 'relative',
  },
  gridVideo: { ...StyleSheet.absoluteFillObject },
  placeholderBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.65)',
    padding: 8,
  },
  userTag: { color: '#FF0050', fontSize: 11, fontWeight: 'bold' },
  videoDesc: { color: '#DDD', fontSize: 11, marginTop: 2 },
  emptyContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 30 },
  emptyTitle: { color: '#888', fontSize: 14, marginBottom: 15 },
  googleBigBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4285F4',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
  },
  googleBigBtnText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },

  // استايلات المتصفح الداخلي
  browserContainer: { flex: 1, backgroundColor: '#000', paddingTop: 45 },
  browserHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  closeBrowserBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  closeBrowserText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  googleBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1A1A1A', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  googleBadgeText: { color: '#AAA', fontSize: 12 },
});
