import { useState, useEffect } from 'react';
import { fetchFeedVideos } from './fetchVideos';

export const useFeedVideos = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadVideos = async () => {
    const result = await fetchFeedVideos();
    if (result.success && result.data && result.data.length > 0) {
      setVideos(result.data);
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadVideos();
    setRefreshing(false);
  };

  useEffect(() => {
    loadVideos();
  }, []);

  return { videos, loading, refreshing, handleRefresh, reload: loadVideos };
};
