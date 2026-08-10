import AsyncStorage from '@react-native-async-storage/async-storage';

export interface VideoItem {
  id: string;
  title: string;
  user: string;
  likesCount: number;
  commentsCount: number;
  url: string;
}

const STORAGE_KEYS = {
  VIDEOS: 'tiktom_videos_v1',
  COMMENTS: 'tiktom_comments_v1',
  PROFILE: 'tiktom_profile_v1',
};

const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: '1',
    title: 'أعماق المحيط الساحرة 🌊 #تكتوم',
    user: 'عالم_البيئة',
    likesCount: 12500,
    commentsCount: 3,
    url: 'https://vjs.zencdn.net/v/oceans.mp4',
  },
  {
    id: '2',
    title: 'فيديو تجريبي في تكتوم 🚀 #Tiktom',
    user: 'تكتوم_مستخدم',
    likesCount: 8100,
    commentsCount: 1,
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
];

export const TiktomStore = {
  // جلب قائمة الفيديوهات
  getVideos: async (): Promise<VideoItem[]> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.VIDEOS);
      if (data) return JSON.parse(data);
      await AsyncStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(DEFAULT_VIDEOS));
      return DEFAULT_VIDEOS;
    } catch {
      return DEFAULT_VIDEOS;
    }
  },

  // إضافة فيديو جديد للقائمة
  addVideo: async (newVid: Omit<VideoItem, 'id' | 'likesCount' | 'commentsCount'>) => {
    try {
      const current = await TiktomStore.getVideos();
      const videoToAdd: VideoItem = {
        ...newVid,
        id: Date.now().toString(),
        likesCount: 1,
        commentsCount: 0,
      };
      const updated = [videoToAdd, ...current];
      await AsyncStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  // جلب وتحديث التعليقات
  getComments: async (videoId: string): Promise<string[]> => {
    try {
      const data = await AsyncStorage.getItem(`${STORAGE_KEYS.COMMENTS}_${videoId}`);
      if (data) return JSON.parse(data);
      const initial = videoId === '1' ? ['فيديو رائع جداً! 👏', 'سبحان الله 🌊', 'تطبيق تكتوم رهيب!🚀'] : ['بالتوفيق يا مايسترو! 🔥'];
      return initial;
    } catch {
      return [];
    }
  },

  addComment: async (videoId: string, text: string) => {
    try {
      const current = await TiktomStore.getComments(videoId);
      const updated = [...current, text];
      await AsyncStorage.setItem(`${STORAGE_KEYS.COMMENTS}_${videoId}`, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },
};
