import { supabase } from './supabase';

export const fetchFeedVideos = async () => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    console.log('Fetch Videos Error:', err.message);
    return { success: false, data: [] };
  }
};
