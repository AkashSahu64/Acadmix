import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ResourceViewer = ({ resource, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = resource.pages || 1;
  
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  // Determine the content type (PDF, video, etc.)
  const isVideo = resource.videoUrl || (resource.fileUrl && resource.fileUrl.includes('.mp4'));
  
  return (
    <div className="flex flex-col h-full glass-card">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="font-medium text-lg line-clamp-1">{resource.title}</h3>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        {isVideo ? (
          // Video player
          <div className="w-full h-full flex items-center justify-center bg-black">
            <div className="w-full px-4 py-8">
              <video
                controls
                className="max-h-full max-w-full mx-auto"
                src={resource.videoUrl || resource.fileUrl}
                poster={resource.thumbnail}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        ) : (
          // PDF viewer (mocked with an iframe and fallback)
          <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src={resource.thumbnail} 
                  alt={resource.title}
                  className="max-h-full max-w-full object-contain"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                  <p className="text-center p-4">
                    PDF Preview for {resource.title}
                    <br />
                    <span className="text-sm opacity-70">Page {currentPage} of {totalPages}</span>
                  </p>
                </div>
              </div>
              
              {totalPages > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-full glass ${
                      currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="flex items-center justify-center glass px-4 py-2 rounded-full">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-full glass ${
                      currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceViewer;