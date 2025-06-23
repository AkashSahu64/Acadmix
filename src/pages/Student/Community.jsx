import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserCircle, Users, Laptop, Send, ChevronDown, Search, PlusCircle } from 'lucide-react';
import { communityService } from '../../services/communityService';
import { useAuth } from '../../hooks/useAuth';

const Community = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'student');
  const [studentChats, setStudentChats] = useState([]);
  const [teacherChats, setTeacherChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [chatFilter, setChatFilter] = useState('');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const [studentData, teacherData] = await Promise.all([
          communityService.getStudentChats(),
          communityService.getTeacherChats()
        ]);
        
        setStudentChats(studentData);
        setTeacherChats(teacherData);
        
        // Auto-select the first chat if none is selected
        if (!selectedChat && activeTab === 'student' && studentData.length > 0) {
          setSelectedChat(studentData[0]);
          const chatMessages = await communityService.getChatMessages(studentData[0].id, 'student');
          setMessages(chatMessages);
        } else if (!selectedChat && activeTab === 'teacher' && teacherData.length > 0) {
          setSelectedChat(teacherData[0]);
          const chatMessages = await communityService.getChatMessages(teacherData[0].id, 'teacher');
          setMessages(chatMessages);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChats();
  }, [activeTab]);

  useEffect(() => {
    // Update search params when tab changes
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedChat(null);
    setMessages([]);
  };

  const handleChatSelect = async (chat) => {
    setSelectedChat(chat);
    try {
      const chatMessages = await communityService.getChatMessages(
        chat.id, 
        activeTab === 'student' ? 'student' : 'teacher'
      );
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      setMessages([]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !selectedChat) return;
    
    const newMessage = {
      sender: user?.name || 'You',
      content: messageInput,
      timestamp: new Date().toISOString()
    };
    
    setMessageInput('');
    
    try {
      await communityService.sendMessage(
        selectedChat.id,
        activeTab === 'student' ? 'student' : 'teacher',
        newMessage
      );
      
      // Refetch messages to include the new one
      const chatMessages = await communityService.getChatMessages(
        selectedChat.id, 
        activeTab === 'student' ? 'student' : 'teacher'
      );
      
      setMessages(chatMessages);
      
      // Also update the last message in the chat list
      if (activeTab === 'student') {
        setStudentChats(prev => 
          prev.map(chat => {
            if (chat.id === selectedChat.id) {
              return {
                ...chat,
                lastMessage: {
                  sender: newMessage.sender,
                  content: newMessage.content,
                  timestamp: newMessage.timestamp
                }
              };
            }
            return chat;
          })
        );
      } else {
        setTeacherChats(prev => 
          prev.map(chat => {
            if (chat.id === selectedChat.id) {
              return {
                ...chat,
                lastMessage: {
                  sender: newMessage.sender,
                  content: newMessage.content,
                  timestamp: newMessage.timestamp
                }
              };
            }
            return chat;
          })
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleCreateNewChat = async () => {
    if (!newChatTitle.trim()) return;
    
    try {
      const participants = [
        { id: user?.id || 's1', name: user?.name || 'John Student', role: 'student' }
      ];
      
      if (activeTab === 'student') {
        // Add another student for testing
        participants.push({ id: 's2', name: 'Emma Johnson', role: 'student' });
      } else {
        // Add a teacher for testing
        participants.push({ id: 't1', name: 'Jane Teacher', role: 'teacher' });
      }
      
      const newChat = await communityService.createNewChat(
        newChatTitle,
        participants,
        activeTab
      );
      
      // Add the new chat to the appropriate list
      if (activeTab === 'student') {
        setStudentChats(prev => [...prev, newChat]);
      } else {
        setTeacherChats(prev => [...prev, newChat]);
      }
      
      // Select the new chat
      setSelectedChat(newChat);
      setMessages([]);
      setNewChatTitle('');
      setIsNewChatModalOpen(false);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const filteredChats = activeTab === 'student' 
    ? studentChats.filter(chat => 
        chat.title.toLowerCase().includes(chatFilter.toLowerCase()) ||
        chat.participants.some(p => p.name.toLowerCase().includes(chatFilter.toLowerCase()))
      )
    : teacherChats.filter(chat => 
        chat.title.toLowerCase().includes(chatFilter.toLowerCase()) ||
        chat.participants.some(p => p.name.toLowerCase().includes(chatFilter.toLowerCase()))
      );

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };
  
  const chatListVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };
  
  const chatAreaVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };
  
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="pb-4 h-[calc(100vh-8rem)]"
    >
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Community</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Connect with students and teachers for discussions and support
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
          onClick={() => handleTabChange('student')}
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
          onClick={() => handleTabChange('teacher')}
        >
          <Laptop size={18} className="mr-2" />
          Student-Teacher
        </button>
      </div>

      <div className="flex h-[calc(100vh-16rem)] rounded-xl overflow-hidden">
        {/* Chat list */}
        <motion.div
          variants={chatListVariants}
          initial="hidden"
          animate="visible"
          className="w-full md:w-1/3 lg:w-1/4 glass-card overflow-y-auto border-r border-slate-200 dark:border-slate-700"
        >
          <div className="p-3 border-b border-slate-200 dark:border-slate-700">
            <div className="relative mb-3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400" />
              </div>
              <input
                type="text"
                value={chatFilter}
                onChange={(e) => setChatFilter(e.target.value)}
                placeholder="Search chats..."
                className="w-full pl-10 pr-4 py-2 glass rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
              />
            </div>
            <button
              onClick={() => setIsNewChatModalOpen(true)}
              className="w-full flex items-center justify-center space-x-2 p-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
            >
              <PlusCircle size={16} />
              <span className="text-sm">New {activeTab === 'student' ? 'Group' : 'Consultation'}</span>
            </button>
          </div>

          <div className="overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-3 border-indigo-200 dark:border-indigo-900 border-t-indigo-500 rounded-full animate-spin"></div>
              </div>
            ) : filteredChats.length > 0 ? (
              filteredChats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => handleChatSelect(chat)}
                  className={`p-3 border-b border-slate-200 dark:border-slate-700 cursor-pointer ${
                    selectedChat?.id === chat.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/20'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-200 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
                      {activeTab === 'student' ? (
                        <Users size={18} className="text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <UserCircle size={20} className="text-indigo-600 dark:text-indigo-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-sm truncate">{chat.title}</h3>
                        {chat.lastMessage && (
                          <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap ml-2">
                            {formatTime(chat.lastMessage.timestamp)}
                          </span>
                        )}
                      </div>
                      {chat.lastMessage ? (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          <span className="font-medium">{chat.lastMessage.sender}:</span> {chat.lastMessage.content}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                          No messages yet
                        </p>
                      )}
                      <div className="flex items-center mt-1 gap-1">
                        {chat.participants.slice(0, 3).map((participant, index) => (
                          <div 
                            key={index} 
                            className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-[10px]"
                            title={participant.name}
                          >
                            {participant.name.charAt(0)}
                          </div>
                        ))}
                        {chat.participants.length > 3 && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            +{chat.participants.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-slate-500 dark:text-slate-400">
                <p>No chats found</p>
                <button
                  onClick={() => setIsNewChatModalOpen(true)}
                  className="mt-2 text-indigo-600 dark:text-indigo-400 text-sm hover:underline"
                >
                  Create a new {activeTab === 'student' ? 'group' : 'consultation'}
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Chat area */}
        <motion.div
          variants={chatAreaVariants}
          initial="hidden"
          animate="visible"
          className="hidden md:flex flex-col w-2/3 lg:w-3/4 glass-card"
        >
          {selectedChat ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                    {activeTab === 'student' ? (
                      <Users size={18} className="text-indigo-600 dark:text-indigo-400" />
                    ) : (
                      <UserCircle size={20} className="text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedChat.title}</h3>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                      <span>{selectedChat.participants.length} participants</span>
                      <button className="ml-1 flex items-center hover:text-slate-700 dark:hover:text-slate-300">
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length > 0 ? (
                  <>
                    {messages.map((message, index) => {
                      const isCurrentUser = message.sender === user?.name || message.sender === 'You';
                      const showDate = index === 0 || formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);
                      
                      return (
                        <div key={message.id} className="space-y-1">
                          {showDate && (
                            <div className="text-center my-4">
                              <span className="px-3 py-1 glass rounded-full text-xs text-slate-500 dark:text-slate-400">
                                {formatDate(message.timestamp)}
                              </span>
                            </div>
                          )}
                          <motion.div
                            variants={messageVariants}
                            initial="hidden"
                            animate="visible"
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            {!isCurrentUser && (
                              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs mr-2 flex-shrink-0">
                                {message.sender.charAt(0)}
                              </div>
                            )}
                            <div className="max-w-[70%]">
                              <div className={`p-3 rounded-lg ${
                                isCurrentUser 
                                  ? 'bg-indigo-500 text-white ml-2' 
                                  : 'glass'
                              }`}>
                                {message.content}
                              </div>
                              <div className={`flex text-xs mt-1 text-slate-500 dark:text-slate-400 ${
                                isCurrentUser ? 'justify-end' : 'justify-start'
                              }`}>
                                {!isCurrentUser && (
                                  <span className="mr-2">{message.sender}</span>
                                )}
                                <span>{formatTime(message.timestamp)}</span>
                              </div>
                            </div>
                            {isCurrentUser && (
                              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs text-white ml-2 flex-shrink-0">
                                {user?.name?.charAt(0) || 'Y'}
                              </div>
                            )}
                          </motion.div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 dark:text-slate-400">
                    <p className="text-center">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                )}
              </div>

              {/* Message input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-3 glass rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-r-lg transition-colors"
                    disabled={!messageInput.trim()}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 dark:text-slate-400">
              <div className="text-center">
                <Users size={48} className="mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-2">No chat selected</h3>
                <p>Select a chat from the list or create a new one.</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* New Chat Modal */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card p-6 rounded-xl w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">
              Create New {activeTab === 'student' ? 'Group' : 'Consultation'}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
                placeholder={activeTab === 'student' ? 'Study Group Name' : 'Consultation Topic'}
                className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsNewChatModalOpen(false)}
                className="px-4 py-2 glass hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewChat}
                disabled={!newChatTitle.trim()}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Community;