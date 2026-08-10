import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function UploadScreen() {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!videoUri) {
      Alert.alert('تنبيه', 'الرجاء اختيار فيديو أولاً');
      return;
    }

    setIsUploading(true);

    // محاكاة رفع الفيديو (حفظ محلي)
    const newVideo = {
      id: Date.now().toString(),
      uri: videoUri,
      desc: description,
      user: '@faten_dev',
    };

    const stored = await AsyncStorage.getItem('my_videos');
    const existingVideos = stored ? JSON.parse(stored) : [];
    await AsyncStorage.setItem('my_videos', JSON.stringify([newVideo, ...existingVideos]));

    setIsUploading(false);
    Alert.alert('تم بنجاح!', 'تم نشر الفيديو الخاص بك.');
    setVideoUri(null);
    setDescription('');
    router.push('/(tabs)/'); // العودة للرئيسية
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>نشر فيديو جديد</Text>

      <TouchableOpacity style={styles.pickerButton} onPress={pickVideo}>
        {videoUri ? (
          <Video
            source={{ uri: videoUri }}
            style={styles.previewVideo}
            resizeMode={ResizeMode.COVER}
            shouldPlay={false}
          />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="cloud-upload-outline" size={50} color="#555" />
            <Text style={styles.placeholderText}>اضغط لاختيار فيديو من المعرض</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="اكتب وصفاً للفيديو..."
        placeholderTextColor="#666"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity 
        style={[styles.uploadButton, isUploading && { backgroundColor: '#444' }]} 
        onPress={handleUpload}
        disabled={isUploading}
      >
        {isUploading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>نشر الفيديو</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20, paddingTop: 60 },
  title: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  pickerButton: {
    width: '100%',
    height: 300,
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  previewVideo: { width: '100%', height: '100%' },
  placeholder: { alignItems: 'center' },
  placeholderText: { color: '#777', marginTop: 10 },
  input: {
    backgroundColor: '#1A1A1A',
    color: '#FFF',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    height: 100,
    textAlignVertical: 'top',
  },
  uploadButton: {
    backgroundColor: '#FF0050',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
