import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, BookOpen, MessageSquare, TrendingUp, FileUp, Calendar, BarChart, UserCheck, Clock, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { communityService } from '../../services/communityService';
import { adminService } from '../../services/adminService';
import { resourceService } from '../../services/resourceService';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [teacherChats, setTeacherChats] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [uploadedContent, setUploadedContent] = useState({
    notes: [],
    syllabus: [],
    videos: [],
    pyqs: [],
    announcements: []
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 45,
    totalEngagement: 78,
    totalChats: 12,
    totalContent: 24
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch chats and announcements
        const [chats, announcements, notes, syllabus, videos, pyqs] = await Promise.all([
          communityService.getTeacherChats(),
          adminService.getAnnouncements(),
          resourceService.getNotes(),
          resourceService.getSyllabus(),
          resourceService.getVideos(),
          resourceService.getPYQs()
        ]);
        
        setTeacherChats(chats);
        setAnnouncements(announcements);
        
        // Filter content by current teacher
        const teacherName = user?.name || 'Jane Teacher';
        setUploadedContent({
          notes: notes.filter(note => note.author === teacherName),
          syllabus: syllabus.filter(syl => syl.author === teacherName),
          videos: videos.filter(video => video.instructor === teacherName),
          pyqs: pyqs.filter(pyq => pyq.author === teacherName),
          announcements: announcements.filter(ann => ann.author === teacherName)
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  const handleDeleteContent = async (contentId, contentType) => {
    try {
      // In a real app, this would call an API to delete the content
      setUploadedContent(prev => ({
        ...prev,
        [contentType]: prev[contentType].filter(item => item.id !== contentId)
      }));
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  // Mock data for chart with better visualization
  const activityData = [
    { day: 'Mon', count: 12, label: 'Monday' },
    { day: 'Tue', count: 18, label: 'Tuesday' },
    { day: 'Wed', count: 15, label: 'Wednesday' },
    { day: 'Thu', count: 25, label: 'Thursday' },
    { day: 'Fri', count: 20, label: 'Friday' },
    { day: 'Sat', count: 8, label: 'Saturday' },
    { day: 'Sun', count: 5, label: 'Sunday' }
  ];

  // Get max value for chart scaling
  const maxActivity = Math.max(...activityData.map(d => d.count));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  const renderContentSection = (contentType, title, icon) => {
    const content = uploadedContent[contentType];
    
    return (
      <div className="glass-card p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            {icon}
            <span className="ml-2">{title}</span>
          </h3>
          <Link 
            to="/teacher/upload" 
            className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
          >
            Add New
          </Link>
        </div>
        
        {content.length > 0 ? (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {content.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 glass rounded-lg">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {contentType === 'videos' ? `${item.duration} • ${item.views} views` :
                     contentType === 'announcements' ? `Posted on ${item.date}` :
                     `${item.downloads || item.views || 0} ${contentType === 'videos' ? 'views' : 'downloads'}`}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                    title="View"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                    title="Edit"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteContent(item.id, contentType)}
                    className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 dark:text-slate-400">
            <p className="text-sm">No {title.toLowerCase()} uploaded yet</p>
            <Link 
              to="/teacher/upload" 
              className="text-xs text-teal-600 dark:text-teal-400 hover:underline"
            >
              Upload your first {title.toLowerCase()}
            </Link>
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="pb-8"
    >
      {/* Welcome section */}
      <motion.section variants={itemVariants} className="mb-8">
        <div className="glass-card p-6 sm:p-8 rounded-xl bg-gradient-to-r from-teal-500/90 to-indigo-600/90 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Welcome back, {user?.name || 'Teacher'}!
              </h1>
              <p className="text-teal-100">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="glass py-2 px-4 rounded-lg text-sm font-medium">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>
                  {user?.department || 'Computer Science'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Cards */}
      <motion.section variants={itemVariants} className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-4">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Students</p>
                <h3 className="text-2xl font-semibold">{stats.totalStudents}</h3>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center mr-4">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Engagement</p>
                <h3 className="text-2xl font-semibold">{stats.totalEngagement}%</h3>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mr-4">
                <MessageSquare size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Active Chats</p>
                <h3 className="text-2xl font-semibold">{stats.totalChats}</h3>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mr-4">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Content Uploaded</p>
                <h3 className="text-2xl font-semibold">{stats.totalContent}</h3>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <motion.section variants={itemVariants} className="lg:col-span-2">
          <div className="glass-card p-6 rounded-xl h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <BarChart size={20} className="mr-2" /> Weekly Activity
              </h2>
            </div>
            
            <div className="h-64 relative">
              {/* Y-axis labels */}
              <div className="absolute left-0 h-full flex flex-col justify-between text-xs text-slate-500 dark:text-slate-400 py-2">
                <span>{maxActivity}</span>
                <span>{Math.floor(maxActivity * 0.75)}</span>
                <span>{Math.floor(maxActivity * 0.5)}</span>
                <span>{Math.floor(maxActivity * 0.25)}</span>
                <span>0</span>
              </div>
              
              {/* Chart area */}
              <div className="ml-8 h-full flex items-end justify-between">
                {activityData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 mx-1">
                    <div className="w-full flex justify-center mb-2 relative group">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(item.count / maxActivity) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="w-full max-w-[40px] rounded-t-md bg-gradient-to-t from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 transition-colors cursor-pointer"
                        title={`${item.label}: ${item.count} activities`}
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {item.count} activities
                        </div>
                      </motion.div>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
        
        {/* Quick Actions */}
        <motion.section variants={itemVariants} className="space-y-6">
          <div className="glass-card p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            
            <div className="space-y-3">
              <Link 
                to="/teacher/community"
                className="flex items-center p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-3">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="font-medium">Student Consultations</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Answer student queries and provide guidance
                  </p>
                </div>
              </Link>
              
              <Link 
                to="/teacher/upload"
                className="flex items-center p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center mr-3">
                  <FileUp size={20} />
                </div>
                <div>
                  <h3 className="font-medium">Upload Resources</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Share notes, videos, and other learning materials
                  </p>
                </div>
              </Link>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="glass-card p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Clock size={18} className="mr-2" /> Recent Activity
            </h2>
            
            <div className="space-y-4">
              <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-full before:w-0.5 before:bg-indigo-200 dark:before:bg-indigo-900/50">
                <div className="absolute left-[-5px] top-1.5 h-3 w-3 rounded-full bg-indigo-500"></div>
                <h3 className="text-sm font-medium">New consultation request</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Emma Johnson requested help with Database Design</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">2 hours ago</p>
              </div>
              
              <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-full before:w-0.5 before:bg-teal-200 dark:before:bg-teal-900/50">
                <div className="absolute left-[-5px] top-1.5 h-3 w-3 rounded-full bg-teal-500"></div>
                <h3 className="text-sm font-medium">Resource uploaded</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">You uploaded "Introduction to Algorithms" notes</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Yesterday</p>
              </div>
              
              <div className="relative pl-6">
                <div className="absolute left-[-5px] top-1.5 h-3 w-3 rounded-full bg-purple-500"></div>
                <h3 className="text-sm font-medium">Students viewed your content</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">12 students viewed your materials this week</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">3 days ago</p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
      
      {/* Uploaded Content Sections */}
      <motion.section variants={itemVariants} className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">Your Uploaded Content</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {renderContentSection('notes', 'Notes', <BookOpen size={18} />)}
          {renderContentSection('syllabus', 'Syllabus', <FileUp size={18} />)}
          {renderContentSection('videos', 'Videos', <MessageSquare size={18} />)}
          {renderContentSection('pyqs', 'PYQs', <FileUp size={18} />)}
          {renderContentSection('announcements', 'Announcements', <MessageSquare size={18} />)}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default TeacherDashboard;