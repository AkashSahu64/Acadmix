import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resourceService } from '../../services/resourceService';
import FilterBar from '../../components/common/FilterBar';
import ResourceCard from '../../components/student/ResourceCard';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    branch: '',
    year: '',
    semester: '',
    subject: '',
    search: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const data = await resourceService.getVideos(filters);
        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResourceAction = async (resourceId, action) => {
    try {
      await resourceService.updateResourceStats(resourceId, 'videos', action);
      // Update local state to reflect the action
      setVideos(prevVideos => 
        prevVideos.map(video => {
          if (video.id === resourceId) {
            const updatedVideo = { ...video };
            if (action === 'like') updatedVideo.likes += 1;
            if (action === 'view') updatedVideo.views += 1;
            if (action === 'bookmark') updatedVideo.bookmarks += 1;
            if (action === 'watch') updatedVideo.watchCount += 1;
            return updatedVideo;
          }
          return video;
        })
      );
    } catch (error) {
      console.error(`Error updating ${action} stats:`, error);
    }
  };

  const handlePreview = (resource) => {
    navigate(`/student/preview?type=videos&id=${resource.id}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-8"
    >
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Video Lectures</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Watch video tutorials and lectures from your professors
        </p>
      </div>

      <FilterBar onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : videos.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="card-container"
        >
          {videos.map(video => (
            <ResourceCard
              key={video.id}
              resource={video}
              type="videos"
              onPreview={handlePreview}
              onAction={handleResourceAction}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16 glass-card">
          <h3 className="text-xl font-semibold mb-2">No Videos Found</h3>
          <p className="text-slate-500 dark:text-slate-400">
            No videos match your current filters. Try changing your filter criteria.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Videos;