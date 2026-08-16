import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CommentsModal from './CommentsModal';
import { shareVideo } from '../utils/share';

export default function SideActions() {
  const router = useRouter();
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <View style={styles.container}>
      {/* زر الإعجاب */}
      <TouchableOpacity style={styles.btn} onPress={() => setLiked(!liked)}>
        <Ionicons name="heart" size={36} color={liked ? '#ff2b54' : 'white'} />
        <Text style={styles.txt}>{liked ? '1' : '0'}</Text>
      </TouchableOpacity>

      {/* زر التعليق */}
      <TouchableOpacity style={styles.btn} onPress={() => setShowComments(true)}>
        <Ionicons name="chatbubble-ellipses" size={34} color="white" />
        <Text style={styles.txt}>تعليق</Text>
      </TouchableOpacity>

      {/* زر المشاركة */}
      <TouchableOpacity style={styles.btn} onPress={() => shareVideo()}>
        <Ionicons name="share-social" size={34} color="white" />
        <Text style={styles.txt}>مشاركة</Text>
      </TouchableOpacity>
      
      {/* زر مكالمات فيديو Tiktom */}
      <TouchableOpacity style={styles.tiktomCallBtn} onPress={() => router.push('/call')}>
        <Ionicons name="videocam" size={26} color="white" />
      </TouchableOpacity>

      {/* نافذة التعليقات */}
      <CommentsModal visible={showComments} onClose={() => setShowComments(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', right: 12, bottom: 90, alignItems: 'center' },
  btn: { alignItems: 'center', marginBottom: 16 },
  txt: { color: 'white', fontSize: 11, marginTop: 2 },
  tiktomCallBtn: { marginTop: 10, backgroundColor: '#ff2b54', padding: 12, borderRadius: 25 }
});
