import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  FlatList, 
  TouchableOpacity, 
  Linking, 
  Modal, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  Share, 
  RefreshControl, 
  TouchableWithoutFeedback, 
  Animated, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';
import AuthScreen from './auth';
import { useFeedVideos } from '../lib/useFeed';
import { handlePublishVideoCall } from '../lib/publishWrapper';

const { height, width } = Dimensions.get('window');

const SingleVideoItem = ({ videoUrl, isActive, isCommentsVisible, activeTab }: any) => {
  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
    if (isActive && !isCommentsVisible && activeTab === 'home') {
      player.play();
    } else {
      player.pause();
    }
  });

  useEffect(() => {
    if (isActive && !isCommentsVisible && activeTab === 'home') {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, isCommentsVisible, activeTab, player]);

  return (
    <VideoView
      style={styles.video}
      player={player}
      nativeControls={false}
      contentFit="cover"
    />
  );
};

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const { videos, loading: loadingFeed, refreshing, handleRefresh, reload } = useFeedVideos();

  const [activeTab, setActiveTab] = useState('home');
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [videoCaption, setVideoCaption] = useState('');
  const [selectedVideoUri, setSelectedVideoUri] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [likedVideos, setLikedVideos] = useState<{ [key: string]: boolean }>({});

  const heartScale = useRef(new Animated.Value(0)).current;
  const [heartPos, setHeartPos] = useState({ x: 0, y: 0 });
  const [showHeart, setShowHeart] = useState(false);
  const lastTapRef = useRef<number | null>(null);

  const [commentsList, setCommentsList] = useState([
    { id: '1', user: 'أحمد التطوير', text: 'فيديو رائع بالتوفيق! 🔥' },
    { id: '2', user: 'سارة', text: 'تطبيق سريع وممتاز 🚀' },
  ]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const pickVideoFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('تنبيه', 'يلزم السماح بصلاحيات الوصول للمعرض لاختيار فيديو');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedVideoUri(result.assets[0].uri);
    }
  };

  const onPublishPress = async () => {
    await handlePublishVideoCall(
      selectedVideoUri,
      videoCaption,
      setIsPublishing,
      () => {
        setVideoCaption('');
        setSelectedVideoUri(null);
        setIsUploadModalVisible(false);
        reload();
      }
    );
  };

  const triggerHeartAnimation = (x: number, y: number, videoId: string) => {
    setLikedVideos(prev => ({ ...prev, [videoId]: true }));
    setHeartPos({ x: x - 40, y: y - 40 });
    setShowHeart(true);

    heartScale.setValue(0);
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1, useNativeDriver: true }),
      Animated.timing(heartScale, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setShowHeart(false));
  };

  const handleDoubleTap = (event: any, videoId: string) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTapRef.current && (now - lastTapRef.current) < DOUBLE_PRESS_DELAY) {
      const { locationX, locationY } = event.nativeEvent;
      triggerHeartAnimation(locationX, locationY, videoId);
    } else {
      lastTapRef.current = now;
    }
  };

  const handleShare = async (videoDescription: string) => {
    try {
      await Share.share({
        message: `شاهد هذا الفيديو على تطبيق تكتوم (Tiktom)! 🚀\n\n"${videoDescription}"`,
      });
    } catch (error) {
      console.log('Share Error:', error);
    }
  };

  const handleAddComment = () => {
    if (newComment.trim() === '') return;
    setCommentsList([...commentsList, { id: Date.now().toString(), user: 'أنت', text: newComment }]);
    setNewComment('');
  };

  const toggleLike = (videoId: string) => {
    setLikedVideos(prev => ({ ...prev, [videoId]: !prev[videoId] }));
  };

  if (loadingSession) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#fe2c55" />
      </View>
    );
  }

  if (!session) {
    return <AuthScreen onAuthSuccess={() => setLoadingSession(false)} />;
  }

  const renderFeedItem = ({ item, index }: { item: any, index: number }) => {
    const isLiked = likedVideos[item.id] || false;
    const videoSource = item.video_url || require('../../assets/ad_video.mp4');

    return (
      <View style={styles.videoCard}>
        <TouchableWithoutFeedback onPress={(e) => handleDoubleTap(e, item.id)}>
          <View style={{ flex: 1 }}>
            <SingleVideoItem 
              videoUrl={videoSource} 
              isActive={activeVideoIndex === index} 
              isCommentsVisible={isCommentsVisible} 
              activeTab={activeTab} 
            />

            {showHeart && (
              <Animated.View style={[styles.heartOverlay, { left: heartPos.x, top: heartPos.y, transform: [{ scale: heartScale }] }]}>
                <Ionicons name="heart" size={80} color="#fe2c55" />
              </Animated.View>
            )}
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.rightSidebar}>
          <TouchableOpacity style={styles.iconButton} onPress={() => toggleLike(item.id)}>
            <Ionicons name={isLiked ? "heart" : "heart-outline"} size={38} color={isLiked ? "#fe2c55" : "#ffffff"} />
            <Text style={styles.iconText}>{(item.likes || 120) + (isLiked ? 1 : 0)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => setIsCommentsVisible(true)}>
            <Ionicons name="chatbubble-ellipses-outline" size={36} color="#ffffff" />
            <Text style={styles.iconText}>{commentsList.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => handleShare(item.description)}>
            <Ionicons name="share-social-outline" size={36} color="#ffffff" />
            <Text style={styles.iconText}>مشاركة</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomOverlay}>
          <Text style={styles.username}>{item.username || '@tiktom_user'}</Text>
          <Text style={styles.description}>{item.description || 'فيديو على تكتوم 🚀'}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {activeTab === 'home' ? (
        loadingFeed ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#fe2c55" />
          </View>
        ) : (
          <FlatList
            data={videos.length > 0 ? videos : [{ id: 'default', video_url: null, description: 'مرحباً بك في تكتوم!' }]}
            renderItem={renderFeedItem}
            keyExtractor={(item) => item.id.toString()}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            snapToInterval={height}
            decelerationRate="fast"
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#fe2c55" />}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(e.nativeEvent.contentOffset.y / height);
              setActiveVideoIndex(newIndex);
            }}
          />
        )
      ) : null}

      {/* شريط التنقل الأسفل */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('home')}>
          <Ionicons name={activeTab === 'home' ? "home" : "home-outline"} size={24} color={activeTab === 'home' ? "#ffffff" : "#888888"} />
          <Text style={[styles.tabLabel, activeTab === 'home' && styles.activeTabLabel]}>الرئيسية</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadButton} onPress={() => setIsUploadModalVisible(true)}>
          <Ionicons name="add" size={28} color="#000000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color="#fe2c55" />
          <Text style={styles.tabLabel}>خروج</Text>
        </TouchableOpacity>
      </View>

      {/* نافذة رفع الفيديو */}
      <Modal visible={isUploadModalVisible} animationType="slide" transparent={true} onRequestClose={() => setIsUploadModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.uploadContainer}>
            <Text style={styles.modalTitle}>نشر فيديو جديد 🎥</Text>
            
            <TouchableOpacity style={styles.pickButton} onPress={pickVideoFromGallery}>
              <Ionicons name="videocam-outline" size={28} color="#ffffff" />
              <Text style={styles.pickButtonText}>{selectedVideoUri ? 'تم اختيار فيديو ✓' : 'اختر فيديو من الاستوديو'}</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.captionInput}
              placeholder="اكتب وصفاً للفيديو..."
              placeholderTextColor="#888"
              value={videoCaption}
              onChangeText={setVideoCaption}
              multiline
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsUploadModalVisible(false)}>
                <Text style={styles.cancelBtnText}>إلغاء</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.publishBtn} onPress={onPublishPress} disabled={isPublishing}>
                {isPublishing ? <ActivityIndicator color="#fff" /> : <Text style={styles.publishBtnText}>نشر الآن</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* نافذة التعليقات */}
      <Modal visible={isCommentsVisible} animationType="slide" transparent={true} onRequestClose={() => setIsCommentsVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.commentsContainer}>
            <View style={styles.commentsHeader}>
              <Text style={styles.commentsTitle}>{commentsList.length} تعليقات</Text>
              <TouchableOpacity onPress={() => setIsCommentsVisible(false)}>
                <Ionicons name="close" size={26} color="#333" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={commentsList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <Text style={styles.commentUser}>{item.user}</Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                </View>
              )}
            />

            <View style={styles.inputContainer}>
              <TextInput style={styles.input} placeholder="أضف تعليقاً..." placeholderTextColor="#999" value={newComment} onChangeText={setNewComment} />
              <TouchableOpacity onPress={handleAddComment} style={styles.sendButton}>
                <Ionicons name="send" size={20} color="#fe2c55" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#000' },
  videoCard: { width: width, height: height, justifyContent: 'center' },
  video: { width: width, height: height, position: 'absolute', top: 0, left: 0 },
  heartOverlay: { position: 'absolute', zIndex: 10 },
  rightSidebar: { position: 'absolute', right: 15, bottom: 180, alignItems: 'center' },
  iconButton: { alignItems: 'center', marginBottom: 20 },
  iconText: { color: '#ffffff', fontSize: 13, marginTop: 4, fontWeight: '600' },
  bottomOverlay: { position: 'absolute', bottom: 85, left: 15, right: 90 },
  username: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  description: { color: '#ffffff', fontSize: 14, marginBottom: 12, lineHeight: 20 },

  bottomTabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 65, backgroundColor: '#000000', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 0.5, borderTopColor: '#222222', paddingBottom: 5 },
  tabItem: { alignItems: 'center', justifyContent: 'center' },
  tabLabel: { color: '#888888', fontSize: 10, marginTop: 3 },
  activeTabLabel: { color: '#ffffff', fontWeight: 'bold' },
  uploadButton: { width: 45, height: 30, backgroundColor: '#ffffff', borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 3, borderLeftColor: '#69C9D0', borderRightWidth: 3, borderRightColor: '#EE1D52' },

  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  uploadContainer: { backgroundColor: '#1e1e1e', padding: 20, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 15, textAlign: 'center' },
  pickButton: { backgroundColor: '#2a2a2a', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 10, marginBottom: 15, gap: 10 },
  pickButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  captionInput: { backgroundColor: '#2a2a2a', color: '#fff', padding: 12, borderRadius: 10, height: 80, textAlignVertical: 'top', marginBottom: 15 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  cancelBtn: { flex: 1, backgroundColor: '#444', padding: 12, borderRadius: 8, alignItems: 'center' },
  cancelBtnText: { color: '#fff', fontWeight: '600' },
  publishBtn: { flex: 1, backgroundColor: '#fe2c55', padding: 12, borderRadius: 8, alignItems: 'center' },
  publishBtnText: { color: '#fff', fontWeight: 'bold' },

  commentsContainer: { height: height * 0.6, backgroundColor: '#ffffff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 15 },
  commentsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  commentsTitle: { fontSize: 15, fontWeight: 'bold', color: '#111' },
  commentItem: { paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' },
  commentUser: { fontWeight: 'bold', color: '#333', fontSize: 13 },
  commentText: { color: '#555', marginTop: 2, fontSize: 14 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10, marginTop: 5 },
  input: { flex: 1, backgroundColor: '#f1f1f1', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, fontSize: 14, color: '#000' },
  sendButton: { marginLeft: 10, padding: 5 },
});
