import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ViewToken,
  Share,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

const { height, width } = Dimensions.get('window');

interface Comment {
  id: string;
  text: string;
  user: string;
  time: string;
}

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');
  const [videos, setVideos] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [likedMap, setLikedMap] = useState<{ [videoId: string]: boolean }>({});
  const [followingUsers, setFollowingUsers] = useState<{ [username: string]: boolean }>({});

  const [isMuted, setIsMuted] = useState(false);
  const [activeVideoForComments, setActiveVideoForComments] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<{ [videoId: string]: Comment[] }>({});
  const [newCommentText, setNewCommentText] = useState('');

  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const heartScale = useRef(new Animated.Value(0)).current;
  const lastTapRef = useRef<number | null>(null);
  const videoRef = useRef<Video>(null);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const storedVideos = await AsyncStorage.getItem('my_videos');
        if (storedVideos) {
          const allVideos = JSON.parse(storedVideos);
          setVideos(allVideos);
          if (allVideos.length > 0 && !activeId) {
            setActiveId(allVideos[0].id);
          }
        }

        const storedComments = await AsyncStorage.getItem('video_comments');
        if (storedComments) {
          setCommentsMap(JSON.parse(storedComments));
        }

        const storedLikes = await AsyncStorage.getItem('video_likes');
        if (storedLikes) {
          setLikedMap(JSON.parse(storedLikes));
        }

        const storedFollowing = await AsyncStorage.getItem('following_users');
        if (storedFollowing) {
          setFollowingUsers(JSON.parse(storedFollowing));
        }
      };
      loadData();
    }, [activeId])
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].item) {
      setActiveId(viewableItems[0].item.id);
      setIsVideoPaused(false);
    }
  }).current;

  const toggleLike = async (id: string) => {
    const updatedLikedMap = {
      ...likedMap,
      [id]: !likedMap[id],
    };
    setLikedMap(updatedLikedMap);
    await AsyncStorage.setItem('video_likes', JSON.stringify(updatedLikedMap));
  };

  const toggleFollow = async (username: string) => {
    const updatedFollowing = {
      ...followingUsers,
      [username]: !followingUsers[username],
    };
    setFollowingUsers(updatedFollowing);
    await AsyncStorage.setItem('following_users', JSON.stringify(updatedFollowing));
  };

  const animateHeart = () => {
    heartScale.setValue(0);
    Animated.sequence([
      Animated.spring(heartScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
        delay: 500,
      }),
    ]).start();
  };

  const handleVideoPress = (id: string) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (lastTapRef.current && now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      if (!likedMap[id]) {
        toggleLike(id);
      }
      animateHeart();
      lastTapRef.current = null;
    } else {
      lastTapRef.current = now;
      setTimeout(() => {
        if (lastTapRef.current === now) {
          if (activeId === id && videoRef.current) {
            if (isVideoPaused) {
              videoRef.current.playAsync();
              setIsVideoPaused(false);
            } else {
              videoRef.current.pauseAsync();
              setIsVideoPaused(true);
            }
          }
        }
      }, DOUBLE_TAP_DELAY);
    }
  };

  const handleShare = async (item: any) => {
    try {
      await Share.share({
        message: `شاهد هذا الفيديو على تطبيق تكتوم: "${item.desc || 'فيديو مميز'}" بواسطة ${item.user || '@faten_dev'}`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const openComments = (videoId: string) => {
    setActiveVideoForComments(videoId);
  };

  const handleAddComment = async () => {
    if (!newCommentText.trim() || !activeVideoForComments) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      text: newCommentText.trim(),
      user: '@faten_dev',
      time: 'الآن',
    };

    const currentComments = commentsMap[activeVideoForComments] || [];
    const updatedComments = [newComment, ...currentComments];

    const updatedMap = {
      ...commentsMap,
      [activeVideoForComments]: updatedComments,
    };

    setCommentsMap(updatedMap);
    setNewCommentText('');

    await AsyncStorage.setItem('video_comments', JSON.stringify(updatedMap));
  };

  const currentCommentsList = activeVideoForComments ? commentsMap[activeVideoForComments] || [] : [];

  const displayedVideos = activeTab === 'following'
    ? videos.filter(v => followingUsers[v.user || '@faten_dev'])
    : videos;

  const renderItem = ({ item }: { item: any }) => {
    const isActive = item.id === activeId;
    const isPlaying = isActive && !isVideoPaused;
    const videoComments = commentsMap[item.id] || [];
    const isLiked = !!likedMap[item.id];
    const username = item.user || '@faten_dev';
    const isFollowing = !!followingUsers[username];

    return (
      <View style={styles.videoCard}>
        <TouchableWithoutFeedback onPress={() => handleVideoPress(item.id)}>
          <View style={styles.videoContainer}>
            <Video
              ref={isActive ? videoRef : null}
              source={{ uri: item.uri }}
              style={styles.video}
              resizeMode={ResizeMode.COVER}
              isLooping
              isMuted={isMuted}
              shouldPlay={isPlaying}
            />

            {isActive && isVideoPaused && (
              <View style={styles.playIconOverlay}>
                <Ionicons name="play" size={60} color="rgba(255,255,255,0.8)" />
              </View>
            )}

            {isActive && (
              <Animated.View style={[styles.heartOverlay, { transform: [{ scale: heartScale }] }]}>
                <Ionicons name="heart" size={100} color="#FF0050" />
              </Animated.View>
            )}
          </View>
        </TouchableWithoutFeedback>

        {/* زر كتم / تشغيل الصوت */}
        <TouchableOpacity
          style={styles.muteButton}
          onPress={() => setIsMuted(!isMuted)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isMuted ? 'volume-mute-sharp' : 'volume-high-sharp'}
            size={20}
            color="#FFF"
          />
        </TouchableOpacity>

        {/* تم رفع منطقة النصوص (bottom: 45) بدلاً من 20 */}
        <View style={styles.overlayBottom}>
          <View style={styles.userRow}>
            <Text style={styles.username}>{username}</Text>
            <TouchableOpacity
              style={[styles.followBtn, isFollowing && styles.followingBtn]}
              onPress={() => toggleFollow(username)}
            >
              <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
                {isFollowing ? 'متابع' : 'متابعة'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.description}>{item.desc}</Text>
        </View>

        {/* تم رفع منطقة الأيقونات الجانبية (bottom: 55) بدلاً من 30 */}
        <View style={styles.overlayRight}>
          <TouchableOpacity style={styles.iconButton} onPress={() => toggleLike(item.id)}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={36}
              color={isLiked ? '#FF0050' : '#FFF'}
            />
            <Text style={styles.iconText}>{isLiked ? '1' : '0'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => openComments(item.id)}>
            <Ionicons name="chatbubble-ellipses-outline" size={32} color="#FFF" />
            <Text style={styles.iconText}>{videoComments.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => handleShare(item)}>
            <Ionicons name="share-social-outline" size={32} color="#FFF" />
            <Text style={styles.iconText}>مشاركة</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setActiveTab('following')}>
          <Text style={[styles.headerText, activeTab === 'following' && styles.headerTextActive]}>
            تابعات
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('foryou')}>
          <Text style={[styles.headerText, activeTab === 'foryou' && styles.headerTextActive]}>
            لك
          </Text>
        </TouchableOpacity>
      </View>

      {displayedVideos.length > 0 ? (
        <FlatList
          data={displayedVideos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
          removeClippedSubviews={true}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {activeTab === 'following'
              ? 'لا توجد فيديوهات للحسابات التي تتابعها، قم بمتابعة بعض الحسابات أولاً!'
              : 'لا توجد فيديوهات حالياً، ارفع فيديو جديد!'}
          </Text>
        </View>
      )}

      <Modal
        visible={activeVideoForComments !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveVideoForComments(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>التعليقات ({currentCommentsList.length})</Text>
              <TouchableOpacity onPress={() => setActiveVideoForComments(null)}>
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={currentCommentsList}
              keyExtractor={(comment) => comment.id}
              style={styles.commentsList}
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <View style={styles.commentAvatar}>
                    <Ionicons name="person" size={16} color="#AAA" />
                  </View>
                  <View style={styles.commentBody}>
                    <Text style={styles.commentUser}>{item.user}</Text>
                    <Text style={styles.commentText}>{item.text}</Text>
                  </View>
                  <Text style={styles.commentTime}>{item.time}</Text>
                </View>
              )}
              ListEmptyComponent={
                <View style={styles.emptyComments}>
                  <Text style={styles.emptyCommentsText}>لا توجد تعليقات بعد، كن أول من يعلق!</Text>
                </View>
              }
            />

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="إضافة تعليق..."
                placeholderTextColor="#666"
                value={newCommentText}
                onChangeText={setNewCommentText}
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
                <Ionicons name="send" size={20} color="#FF0050" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 10,
  },
  headerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 17,
    fontWeight: 'bold',
    paddingHorizontal: 15,
  },
  headerTextActive: {
    color: '#FFF',
  },
  videoCard: { width, height: height - 60, justifyContent: 'center' },
  videoContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  video: { ...StyleSheet.absoluteFillObject },
  heartOverlay: { position: 'absolute', zIndex: 5 },
  playIconOverlay: {
    position: 'absolute',
    zIndex: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    borderRadius: 50,
  },
  muteButton: {
    position: 'absolute',
    top: 55,
    right: 20,
    zIndex: 11,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20,
  },
  // تم رفع الأيقونات الجانبية والنصوص السفلية هنا:
  overlayBottom: { position: 'absolute', bottom: 45, left: 15, right: 80, zIndex: 3 },
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  username: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginRight: 10 },
  followBtn: {
    backgroundColor: '#FF0050',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  followingBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  followBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  followingBtnText: { color: '#DDD' },
  description: { color: '#DDD', fontSize: 14 },
  overlayRight: { position: 'absolute', bottom: 55, right: 15, alignItems: 'center', zIndex: 3 },
  iconButton: { alignItems: 'center', marginBottom: 18 },
  iconText: { color: '#FFF', fontSize: 11, marginTop: 4 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  emptyText: { color: '#777', fontSize: 15, textAlign: 'center', lineHeight: 22 },

  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: {
    height: '60%',
    backgroundColor: '#121212',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  modalTitle: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  commentsList: { flex: 1, marginVertical: 10 },
  commentItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 15 },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  commentBody: { flex: 1 },
  commentUser: { color: '#888', fontSize: 12, fontWeight: '600', marginBottom: 2 },
  commentText: { color: '#FFF', fontSize: 14 },
  commentTime: { color: '#555', fontSize: 10, marginLeft: 5 },
  emptyComments: { alignItems: 'center', marginTop: 40 },
  emptyCommentsText: { color: '#555', fontSize: 13 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingTop: 10,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    color: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 14,
    marginRight: 10,
  },
  sendButton: { padding: 8 },
});
