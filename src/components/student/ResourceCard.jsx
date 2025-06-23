import { useState } from 'react';
import { BookOpenCheck, Eye, Heart, Bookmark, Download, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Generic ResourceCard component for Notes, Videos, Syllabus, PYQs
const ResourceCard = ({ 
  resource, 
  type, 
  onPreview, 
  onAction 
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    onAction(resource.id, 'like');
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onAction(resource.id, 'bookmark');
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    onAction(resource.id, 'download');
  };

  const handlePreview = (e) => {
    e.stopPropagation();
    onPreview(resource);
  };

  const handleClick = () => {
    onAction(resource.id, 'view');
    onPreview(resource);
  };

  const cardVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
    hover: { y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)', transition: { type: 'spring', stiffness: 300, damping: 20 } }
  };

  const renderTypeSpecificInfo = () => {
    switch(type) {
      case 'notes':
        return (
          <>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              By {resource.author} - {resource.uploadDate}
            </p>
            <div className="mt-2 space-y-1">
              <p className="text-xs flex items-center">
                <span className="w-20 text-slate-500 dark:text-slate-400">Subject:</span> {resource.subject}
              </p>
              <p className="text-xs flex items-center">
                <span className="w-20 text-slate-500 dark:text-slate-400">Branch:</span> {resource.branch}
              </p>
              <p className="text-xs flex items-center">
                <span className="w-20 text-slate-500 dark:text-slate-400">Year/Sem:</span> {resource.year}/{resource.semester}
              </p>
            </div>
          </>
        );
      case 'syllabus':
        return (
          <>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Updated on {resource.lastUpdated}
            </p>
            <div className="mt-2 space-y-1">
              <p className="text-xs flex items-center">
                <span className="w-20 text-slate-500 dark:text-slate-400">Branch:</span> {resource.branch}
              </p>
              <p className="text-xs flex items-center">
                <span className="w-20 text-slate-500 dark:text-slate-400">Year:</span> {resource.year}
              </p>
              <p className="text-xs flex items-center">
                <span className="w-20 text-slate-500 dark:text-slate-400">Subjects:</span> {resource.subjectCount} subjects
              </p>
            </div>
          </>
        );
      case 'videos':
        return (
          <>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              By {resource.instructor} - {resource.duration}
            </p>
            <div className="mt-2 space-y-1">
              <p className="text-xs flex items-center">
                <span className="w-20 text-slate-500 dark:text-slate-400">Subject:</span> {resource.subject}
              </p>
              <p className="text-xs flex items-center">
                <span className="w-20 text-slate-500 dark:text-slate-400">Branch:</span> {resource.branch}
              </p>
              <p className="text-xs flex items-center">
                <span className="w-20 text-slate-500 dark:text-slate-400">Year/Sem:</span> {resource.year}/{resource.semester}
              </p>
            </div>
          </>
        );
      case 'pyqs':
        return (
          <>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {resource.examType} - {resource.examDate}
            </p>
            <div className="mt-2 space-y-1">
              <p className="text-xs flex items-center">
                <span className="w-20 text-slate-500 dark:text-slate-400">Subject:</span> {resource.subject}
              </p>
              <p className="text-xs flex items-center">
                <span className="w-20 text-slate-500 dark:text-slate-400">Branch:</span> {resource.branch}
              </p>
              <p className="text-xs flex items-center">
                <span className="w-20 text-slate-500 dark:text-slate-400">Pages:</span> {resource.pages} {resource.solved && '• Solved'}
              </p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderStats = () => {
    const stats = [];
    
    if (resource.likes !== undefined) {
      stats.push(
        <div key="likes" className="flex items-center text-xs text-slate-500 dark:text-slate-400">
          <Heart size={12} className="mr-1" />
          <span>{resource.likes}</span>
        </div>
      );
    }
    
    if (resource.views !== undefined) {
      stats.push(
        <div key="views" className="flex items-center text-xs text-slate-500 dark:text-slate-400">
          <Eye size={12} className="mr-1" />
          <span>{resource.views}</span>
        </div>
      );
    }
    
    if (resource.bookmarks !== undefined) {
      stats.push(
        <div key="bookmarks" className="flex items-center text-xs text-slate-500 dark:text-slate-400">
          <Bookmark size={12} className="mr-1" />
          <span>{resource.bookmarks}</span>
        </div>
      );
    }
    
    if (resource.downloads !== undefined) {
      stats.push(
        <div key="downloads" className="flex items-center text-xs text-slate-500 dark:text-slate-400">
          <Download size={12} className="mr-1" />
          <span>{resource.downloads}</span>
        </div>
      );
    }
    
    if (resource.watchCount !== undefined) {
      stats.push(
        <div key="watchCount" className="flex items-center text-xs text-slate-500 dark:text-slate-400">
          <BookOpenCheck size={12} className="mr-1" />
          <span>{resource.watchCount}</span>
        </div>
      );
    }
    
    return stats;
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="glass-card overflow-hidden cursor-pointer group"
      onClick={handleClick}
    >
      <div className="h-36 overflow-hidden relative">
        <img 
          src={resource.thumbnail || 'https://source.unsplash.com/random/800x600/?study'} 
          alt={resource.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-3 w-full">
            <div className="flex justify-between items-center">
              {renderStats()}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-sm line-clamp-2 h-10 mb-1">{resource.title}</h3>
        {renderTypeSpecificInfo()}
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex space-x-2">
            <button 
              onClick={handleLike}
              className={`p-2 rounded-full transition-colors ${
                isLiked ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            <button 
              onClick={handleBookmark}
              className={`p-2 rounded-full transition-colors ${
                isBookmarked ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={handleDownload}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Download"
            >
              <Download size={16} />
            </button>
            <button 
              onClick={handlePreview}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-indigo-500"
              title="Preview"
            >
              <ExternalLink size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResourceCard;