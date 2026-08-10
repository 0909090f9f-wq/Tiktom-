import { supabase } from './supabase';

export const uploadVideoFile = async (uri: string, caption: string) => {
  try {
    const filename = `video_${Date.now()}.mp4`;
    const formData = new FormData();
    
    formData.append('file', {
      uri,
      name: filename,
      type: 'video/mp4',
    } as any);

    // رفع الفيديو للتخزين السحابي
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(filename, formData);

    if (error) throw error;

    // الحصول على الرابط المباشر
    const { data: publicUrlData } = supabase.storage
      .from('videos')
      .getPublicUrl(filename);

    // إضافة بيانات الفيديو إلى جدول الفيديوهات
    const { error: dbError } = await supabase
      .from('posts')
      .insert([
        { 
          video_url: publicUrlData.publicUrl, 
          description: caption,
          created_at: new Date()
        }
      ]);

    if (dbError) throw dbError;

    return { success: true, url: publicUrlData.publicUrl };
  } catch (err: any) {
    console.log('Upload Error:', err);
    return { success: false, error: err.message };
  }
};
