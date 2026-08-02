import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// رابط فيديو تجريبي
const videoSource = { uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' };

export default function VideoScreen() {
  return (
    <View style={styles.container}>
      {/* مشغل الفيديو من expo-av */}
      <Video
        style={styles.video}
        source={videoSource}
        shouldPlay
        isLooping
        resizeMode={ResizeMode.COVER}
        useNativeControls={false}
      />

      {/* العناصر التفاعلية فوق الفيديو */}
      <View style={styles.overlay}>
        {/* الأزرار الجانبية */}
        <View style={styles.rightSidebar}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="heart" size={35} color="white" />
            <Text style={styles.iconText}>1.2K</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="chatbubble-ellipses" size={33} color="white" />
            <Text style={styles.iconText}>452</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="share-social" size={33} color="white" />
            <Text style={styles.iconText}>مشاركة</Text>
          </TouchableOpacity>
        </View>

        {/* معلومات المقطع والحساب */}
        <View style={styles.bottomSection}>
          <Text style={styles.username}>@tiktom_official</Text>
          <Text style={styles.description}>
            تطوير تطبيق تكتوم (Tiktom) 🚀 | منصة الفيديوهات القصيرة وتجربة المحتوى
          </Text>
          <View style={styles.musicRow}>
            <Ionicons name="musical-notes" size={16} color="white" />
            <Text style={styles.musicText}>الصوت الأصلي - تطبيق تكتوم</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    width: width,
    height: height,
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  rightSidebar: {
    position: 'absolute',
    right: 15,
    bottom: 100,
    alignItems: 'center',
  },
  iconButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  bottomSection: {
    width: '80%',
    marginBottom: 10,
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  description: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  musicRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  musicText: {
    color: '#fff',
    fontSize: 13,
    marginLeft: 6,
  },
});
