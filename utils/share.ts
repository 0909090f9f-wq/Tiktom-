import { Share, Alert } from 'react-native';

export const shareVideo = async (videoUrl?: string) => {
  try {
    await Share.share({
      title: 'تطبيق Tiktom',
      message: 'شاهد هذا الفيديو الرائع على تطبيق Tiktom! 🎥✨',
      url: videoUrl || 'https://tiktom.app',
    });
  } catch (error: any) {
    Alert.alert('خطأ', error.message);
  }
};
