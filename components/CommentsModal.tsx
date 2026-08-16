import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const DUMMY_COMMENTS = [
  { id: '1', user: 'أحمد', text: 'فيديو رائع جداً! 🔥' },
  { id: '2', user: 'سارة', text: 'التصميم ممتاز والمكالمات شغالين تمام 👍' },
  { id: '3', user: 'محمد', text: 'تطبيق Tiktom ممتاز!' },
];

export default function CommentsModal({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>التعليقات</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={DUMMY_COMMENTS}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <Text style={styles.username}>{item.user}</Text>
                <Text style={styles.commentText}>{item.text}</Text>
              </View>
            )}
          />

          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="أضف تعليقاً..." placeholderTextColor="#aaa" />
            <TouchableOpacity style={styles.sendBtn}>
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  container: { height: '50%', backgroundColor: '#121212', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  commentItem: { marginBottom: 12 },
  username: { color: '#888', fontSize: 12 },
  commentText: { color: 'white', fontSize: 14, marginTop: 2 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#222', borderRadius: 20, paddingHorizontal: 12 },
  input: { flex: 1, color: 'white', paddingVertical: 8 },
  sendBtn: { marginLeft: 8 }
});
