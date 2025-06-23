import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, AlertTriangle, MessageSquare, UserX, Check,  X } from 'lucide-react';
import { communityService } from '../../services/communityService';

const ManageCommunity = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmBlock, setShowConfirmBlock] = useState(false);
  const [userToBlock, setUserToBlock] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const data = await (activeTab === 'student' 
          ? communityService.getStudentChats()
          : communityService.getTeacherChats()
        );
        setChats(data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChats();
  }, [activeTab]);

  const handleBlockUser = (user) => {
    setUserToBlock(user);
    setShowConfirmBlock(true);
  };

  const confirmBlock = async () => {
    // In a real app, this would call an API to block the user
    setShowConfirmBlock(false);
    setUserToBlock(null);
  };

  const handleDeleteChat = async (chatId) => {
    // In a real app, this would call an API to delete the chat
    setChats(prev => prev.filter(chat => chat.id !== chatId));
  };

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };
  
  const listVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="pb-8"
    >
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Manage Community</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Monitor and moderate community discussions
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`flex items-center px-4 py-2 rounded-lg ${
            activeTab === 'student'
              ? 'bg-indigo-500 text-white font-medium'
              : 'glass hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          onClick={() => setActiveTab('student')}
        >
          <Users size={18} className="mr-2" />
          Student-Student
        </button>
        <button
          className={`flex items-center px-4 py-2 rounded-lg ${
            activeTab === 'teacher'
              ? 'bg-indigo-500 text-white font-medium'
              : 'glass hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          onClick={() => setActiveTab('teacher')}
        >
          <MessageSquare size={18} className="mr-2" />
          Student-Teacher
        </button>
      </div>

      {/* Search */}
      <div className="glass-card p-4 mb-6 rounded-xl">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search chats or participants..."
            className="w-full pl-10 pr-4 py-2 glass rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Chats List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredChats.length > 0 ? (
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {filteredChats.map(chat => (
            <motion.div
              key={chat.id}
              variants={itemVariants}
              className="glass-card p-4 rounded-xl"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h3 className="font-medium text-lg mb-2">{chat.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {chat.participants.map((participant, index) => (
                      <div
                        key={index}
                        className="flex items-center glass px-2 py-1 rounded-full text-sm"
                      >
                        <span>{participant.name}</span>
                        <button
                          onClick={() => handleBlockUser(participant)}
                          className="ml-2 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full text-red-500"
                          title="Block User"
                        >
                          <UserX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleDeleteChat(chat.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    Delete Chat
                  </button>
                </div>
              </div>
              {chat.lastMessage && (
                <div className="mt-4 p-3 glass rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">{chat.lastMessage.sender}:</span>{' '}
                    {chat.lastMessage.content}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {new Date(chat.lastMessage.timestamp).toLocaleString()}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16 glass-card">
          <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
          <h3 className="text-xl font-semibold mb-2">No Chats Found</h3>
          <p className="text-slate-500 dark:text-slate-400">
            {searchTerm ? 'No chats match your search criteria.' : 'No active chats at the moment.'}
          </p>
        </div>
      )}

      {/* Confirm Block Modal */}
      {showConfirmBlock && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-card p-6 rounded-xl w-full max-w-md"
          >
            <div className="flex items-center mb-4 text-red-500">
              <AlertTriangle size={24} className="mr-2" />
              <h3 className="text-lg font-semibold">Confirm Block User</h3>
            </div>
            
            <p className="mb-6">
              Are you sure you want to block <span className="font-semibold">{userToBlock?.name}</span>? 
              This user will no longer be able to participate in community discussions.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmBlock(false)}
                className="px-4 py-2 glass-button"
              >
                Cancel
              </button>
              <button
                onClick={confirmBlock}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center"
              >
                <Check size={18} className="mr-2" />
                Block User
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ManageCommunity;