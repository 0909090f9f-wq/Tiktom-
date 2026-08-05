import { Alert } from 'react-native';
import { uploadVideoFile } from './upload';

export const processVideoPublish = async (
  selectedVideoUri: string | null,
  videoCaption: string,
  setLoading: (loading: boolean) => void,
  resetForm: () => void
) => {
  if (!selectedVideoUri) {
    Alert.alert('تنبيه', 'يرجى اختيار فيديو من المعرض أولاً');
    return;
  }
  if (videoCaption.trim() === '') {
    Alert.alert('تنبيه', 'يرجى كتابة وصف للفيديو قبل النشر');
    return;
  }

  setLoading(true);
  const result = await uploadVideoFile(selectedVideoUri, videoCaption);
  setLoading(false);

  if (result.success) {
    Alert.alert('نجاح 🎉', 'تم رفع ونشر الفيديو بنجاح على تطبيق تكتوم!');
    resetForm();
  } else {
    Alert.alert('خطأ', result.error || 'حدث خطأ أثناء رفع الفيديو');
  }
};
