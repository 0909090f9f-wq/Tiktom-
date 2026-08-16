import React, { useRef } from 'react';
import { View, Dimensions, StyleSheet, FlatList } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import CallHeader from '../../components/CallHeader';
import SideActions from '../../components/SideActions';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

// قائمة فيديوهات تجريبية
const DUMMY_VIDEOS = [
  { id: '1', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
  { id: '2', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
  { id: '3', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' }
];

// مكون تشغيل الفيديو المنفصل لكل شريحة
function VideoItem({ item }: { item: typeof DUMMY_VIDEOS[0] }) {
  const player = useVideoPlayer(item.url, player => {
    player.loop = true;
    player.play();
  });

  return (
    <View style={styles.videoCard}>
      <VideoView style={styles.video} player={player} allowsFullscreen nativeControls={false} />
      <CallHeader />
      <SideActions />
    </View>
  );
}

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={DUMMY_VIDEOS}
        renderItem={({ item }) => <VideoItem item={item} />}
        keyExtractor={item => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={WINDOW_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  videoCard: { height: WINDOW_HEIGHT, width: '100%', justifyContent: 'center' },
  video: { ...StyleSheet.absoluteFillObject }
});
