import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  Linking,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const [myVideos, setMyVideos] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'videos' | 'likes'>('videos');
  const [likedVideos, setLikedVideos] = useState<any[]>([]);
  const [userPhone, setUserPhone] = useState<string>('0918517505');
  const [mutedGrid, setMutedGrid] = useState<{ [key: string]: boolean }>({});

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [])
  );

  const loadProfileData = async () => {
    const storedPhone = await AsyncStorage.getItem('user_phone');
    if (storedPhone) {
      setUserPhone(storedPhone);
    }

    const storedVideos = await AsyncStorage.getItem('my_videos');
    const allVideos = storedVideos ? JSON.parse(storedVideos) : [];
    setMyVideos(allVideos);

    const storedLikes = await AsyncStorage.getItem('video_likes');
    const likedMap = storedLikes ? JSON.parse(storedLikes) : {};
    
    const filteredLiked = allVideos.filter((v: any) => likedMap[v.id]);
    setLikedVideos(filteredLiked);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('is_logged_in');
    router.replace('/login');
  };

  const toggleGridMute = (videoId: string) => {
    setMutedGrid((prev) => ({
      ...prev,
      [videoId]: prev[videoId] !== undefined ? !prev[videoId] : false, // افتراضياً مكتوم حتى يضغطه المستخدم
    }));
  };

  const handleMakeCall = () => {
    const phoneNumber = `tel:${userPhone}`;
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (supported) Linking.openURL(phoneNumber);
        else Alert.alert('تنبيه', 'الاتصال الصوتي غير مدعوم على هذا الجهاز');
      })
      .catch((err) => console.log(err));
  };

  const handleWhatsApp = () => {
    const cleanPhone = userPhone.replace(/^0/, '249');
    const whatsappUrl = `whatsapp://send?phone=${cleanPhone}&text=مرحباً، أتواصل معك من تطبيق تكتوم!`;
    
    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) Linking.openURL(whatsappUrl);
        else Alert.alert('تنبيه', 'تطبيق واتساب غير مثبت على هاتفك');
      })
      .catch((err) => console.log(err));
  };

  const handleMessenger = () => {
    const messengerUrl = `fb-messenger://user/faten_dev`;
    const webMessengerUrl = `https://m.me/faten_dev`;

    Linking.canOpenURL(messengerUrl)
      .then((supported) => {
        if (supported) Linking.openURL(messengerUrl);
        else Linking.openURL(webMessengerUrl);
      })
      .catch(() => Linking.openURL(webMessengerUrl));
  };

  const handleDeleteVideo = (videoId: string) => {
    Alert.alert(
      'حذف الفيديو',
      'هل أنت تأكد من رغبتك في حذف هذا الفيديو من قناتك؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            const updatedVideos = myVideos.filter((v) => v.id !== videoId);
            setMyVideos(updatedVideos);
            await AsyncStorage.setItem('my_videos', JSON.stringify(updatedVideos));
          },
        },
      ]
    );
  };

  const renderVideoItem = ({ item }: { item: any }) => {
    // افتراضياً الصوت مكتوم في الشبكة لتفادي تداخل الأصوات
    const isMuted = mutedGrid[item.id] !== undefined ? mutedGrid[item.id] : true;

    return (
      <View style={styles.gridItem}>
        <View style={styles.videoCardContainer}>
          {item.uri ? (
            <Video
              source={{ uri: item.uri }}
              style={styles.gridVideo}
              resizeMode={ResizeMode.COVER}
              isLooping
              shouldPlay
              isMuted={isMuted}
            />
          ) : (
            <View style={styles.videoPlaceholder}>
              <Ionicons name="play-outline" size={24} color="#FFF" />
            </View>
          )}

          {/* زر التحكم بالصوت المباشر */}
          <TouchableOpacity
            style={styles.volumeIcon}
            onPress={() => toggleGridMute(item.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isMuted ? 'volume-mute' : 'volume-high'}
              size={14}
              color="#FFF"
            />
          </TouchableOpacity>

          {/* زر الحذف */}
          {activeTab === 'videos' && (
            <TouchableOpacity
              style={styles.deleteIcon}
              onPress={() => handleDeleteVideo(item.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={14} color="#FF0050" />
            </TouchableOpacity>
          )}

          <View style={styles.videoTitleBox}>
            <Text style={styles.videoTitle} numberOfLines={1}>
              {item.desc || 'فيديو'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* رأس الصفحة */}
      <View style={styles.header}>
        <Text style={styles.username}>@faten_dev</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF0050" />
        </TouchableOpacity>
      </View>

      {/* معلومات المستخدم */}
      <View style={styles.profileInfo}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={50} color="#333" />
        </View>
        <Text style={styles.phoneText}>+249 {userPhone}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}><Text style={styles.statNum}>12</Text><Text style={styles.statLabel}>متابعة</Text></View>
          <View style={styles.statBox}><Text style={styles.statNum}>150</Text><Text style={styles.statLabel}>متابع</Text></View>
          <View style={styles.statBox}><Text style={styles.statNum}>{myVideos.length}</Text><Text style={styles.statLabel}>فيديوهاتي</Text></View>
        </View>
      </View>

      {/* أزرار الاتصال والتواصل */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.callButton} onPress={handleMakeCall}>
          <Ionicons name="call" size={16} color="#FFF" />
          <Text style={styles.buttonText}>اتصال</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
          <Ionicons name="logo-whatsapp" size={16} color="#FFF" />
          <Text style={styles.buttonText}>واتساب</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.messengerButton} onPress={handleMessenger}>
          <Ionicons name="logo-facebook" size={16} color="#FFF" />
          <Text style={styles.buttonText}>ماسنجر</Text>
        </TouchableOpacity>
      </View>

      {/* التبويبات */}
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, activeTab === 'videos' && styles.activeTab]} onPress={() => setActiveTab('videos')}>
          <Ionicons name="apps" size={22} color={activeTab === 'videos' ? '#FFF' : '#555'} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'likes' && styles.activeTab]} onPress={() => setActiveTab('likes')}>
          <Ionicons name="heart-outline" size={22} color={activeTab === 'likes' ? '#FFF' : '#555'} />
        </TouchableOpacity>
      </View>

      {/* قائمة الفيديوهات */}
      <FlatList
        data={activeTab === 'videos' ? myVideos : likedVideos}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={renderVideoItem}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>لا توجد فيديوهات في هذا القسم</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 15 },
  username: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  profileInfo: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  phoneText: { color: '#FF0050', fontSize: 13, fontWeight: '600', marginBottom: 15 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  statBox: { alignItems: 'center' },
  statNum: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  statLabel: { color: '#777', fontSize: 12 },
  actionButtons: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 20, paddingHorizontal: 10 },
  callButton: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#25D366', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 },
  whatsappButton: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#075E54', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 },
  messengerButton: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#0084FF', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 },
  buttonText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  tabs: { flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: '#222', marginBottom: 5 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  activeTab: { borderBottomWidth: 1, borderBottomColor: '#FFF' },
  gridItem: { width: width / 3, height: 160, padding: 1.5 },
  videoCardContainer: { flex: 1, borderRadius: 6, overflow: 'hidden', backgroundColor: '#111', position: 'relative' },
  gridVideo: { ...StyleSheet.absoluteFillObject },
  videoPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  volumeIcon: { position: 'absolute', top: 6, left: 6, backgroundColor: 'rgba(0,0,0,0.6)', padding: 5, borderRadius: 12, zIndex: 10 },
  deleteIcon: { position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.6)', padding: 5, borderRadius: 12, zIndex: 10 },
  videoTitleBox: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', paddingVertical: 3, paddingHorizontal: 5 },
  videoTitle: { color: '#FFF', fontSize: 10, textAlign: 'center' },
  emptyBox: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#555', textAlign: 'center' },
});
