import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Maximize, Minimize } from 'lucide-react';
import { resourceService } from '../../services/resourceService';
import ResourceViewer from '../../components/common/ResourceViewer';
import ChatBot from '../../components/common/ChatBot';

const PreviewPage = () => {
  const [searchParams] = useSearchParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedPane, setExpandedPane] = useState(null); // 'viewer', 'chat', or null
  const resourceType = searchParams.get('type');
  const resourceId = searchParams.get('id');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResource = async () => {
      if (!resourceType || !resourceId) {
        navigate('/student/dashboard');
        return;
      }
      
      setLoading(true);
      try {
        let data;
        switch(resourceType) {
          case 'notes':
            data = await resourceService.getNotes();
            break;
          case 'syllabus':
            data = await resourceService.getSyllabus();
            break;
          case 'videos':
            data = await resourceService.getVideos();
            break;
          case 'pyqs':
            data = await resourceService.getPYQs();
            break;
          default:
            navigate('/student/dashboard');
            return;
        }
        
        const foundResource = data.find(item => item.id === resourceId);
        if (foundResource) {
          setResource(foundResource);
          // Update view count
          await resourceService.updateResourceStats(resourceId, resourceType, 'view');
        } else {
          navigate(`/student/${resourceType}`);
        }
      } catch (error) {
        console.error('Error fetching resource:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResource();
  }, [resourceType, resourceId, navigate]);

  const goBack = () => {
    navigate(-1);
  };

  const togglePane = (pane) => {
    if (expandedPane === pane) {
      setExpandedPane(null);
    } else {
      setExpandedPane(pane);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-[calc(100vh-7rem)] flex flex-col"
    >
      <div className="flex items-center mb-4">
        <button
          onClick={goBack}
          className="mr-4 p-2 glass rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-2xl font-bold truncate">
            {loading ? 'Loading...' : resource?.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {resourceType === 'notes' && resource && `${resource.subject} - ${resource.author}`}
            {resourceType === 'syllabus' && resource && `${resource.branch} - Updated on ${resource.lastUpdated}`}
            {resourceType === 'videos' && resource && `${resource.subject} - ${resource.instructor}`}
            {resourceType === 'pyqs' && resource && `${resource.subject} - ${resource.examType}, ${resource.examDate}`}
          </p>
        </div>
      </div>
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : resource ? (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
          {/* Left Pane - Resource Viewer */}
          <div className={`relative h-full ${
            expandedPane === 'chat' ? 'hidden md:hidden' : 
            expandedPane === 'viewer' ? 'col-span-1 md:col-span-2' : 
            'col-span-1'
          }`}>
            <div className="absolute top-2 right-2 z-10">
              <button
                onClick={() => togglePane('viewer')}
                className="p-2 glass rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {expandedPane === 'viewer' ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
            </div>
            <div className="h-full">
              <ResourceViewer resource={resource} />
            </div>
          </div>
          
          {/* Right Pane - AI Chatbot */}
          <div className={`relative h-full ${
            expandedPane === 'viewer' ? 'hidden md:hidden' : 
            expandedPane === 'chat' ? 'col-span-1 md:col-span-2' : 
            'col-span-1'
          }`}>
            <div className="absolute top-2 right-2 z-10">
              <button
                onClick={() => togglePane('chat')}
                className="p-2 glass rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {expandedPane === 'chat' ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
            </div>
            <div className="h-full">
              <ChatBot 
                resourceTitle={resource.title} 
                onClose={() => {
                  if (expandedPane === 'chat') {
                    setExpandedPane(null);
                  }
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center">
          <div>
            <h2 className="text-xl font-semibold mb-2">Resource not found</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-4">The requested resource could not be found.</p>
            <button
              onClick={goBack}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PreviewPage;