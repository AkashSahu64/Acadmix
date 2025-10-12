import { useState, useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useTheme } from '../../hooks/useTheme';
import { aiAPI } from '../../services/api';

const ChatBot = ({ resourceTitle = '', resourceId = null, onClose }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: resourceTitle 
        ? `Hi there! I'm your AI study assistant. I can help you understand "${resourceTitle}". What would you like to know?`
        : `Hi there! I'm your AI study assistant. I can help you with your academic questions. What would you like to know?`, 
      sender: 'bot',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { darkMode } = useTheme();
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load AI conversation history when component mounts
    loadAIHistory();
  }, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadAIHistory = async () => {
    try {
      const response = await aiAPI.getAIHistory({ limit: 10 });
      if (response.success && response.data.length > 0) {
        const historyMessages = response.data.reverse().flatMap((item, index) => [
          {
            id: `history-user-${index}`,
            text: item.userMessage,
            sender: 'user',
            timestamp: item.timestamp
          },
          {
            id: `history-bot-${index}`,
            text: item.aiResponse,
            sender: 'bot',
            timestamp: item.timestamp
          }
        ]);
        
        setMessages(prev => [prev[0], ...historyMessages]);
      }
    } catch (error) {
      console.error('Error loading AI history:', error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    const userMessage = { 
      id: Date.now(), 
      text: input, 
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);
    
    try {
      const response = await aiAPI.chatWithAI({
        message: currentInput,
        contentId: resourceId,
        context: resourceTitle ? `Discussing: ${resourceTitle}` : undefined
      });

      if (response.success) {
        const botMessage = { 
          id: Date.now() + 1, 
          text: response.data.message, 
          sender: 'bot',
          timestamp: response.data.timestamp
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(response.message || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('AI chat error:', error);
      
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      
      if (error.message.includes('not related to academic content')) {
        errorMessage = 'I can only help with academic questions related to your study materials. Please ask about your coursework or educational content.';
      } else if (error.message.includes('service_unavailable')) {
        errorMessage = 'AI service is temporarily unavailable. Please try again later.';
      } else if (error.message.includes('rate_limit')) {
        errorMessage = 'Please wait a moment before asking another question.';
      }
      
      const errorBotMessage = { 
        id: Date.now() + 1, 
        text: errorMessage, 
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, just show that file was attached
      // In a real implementation, you might want to extract text from PDFs, etc.
      const fileMessage = { 
        id: Date.now(), 
        text: `I've attached a file: ${file.name}. Please ask me specific questions about the content you'd like help with.`, 
        sender: 'user',
        timestamp: new Date().toISOString(),
        file: {
          name: file.name,
          type: file.type,
          size: file.size
        }
      };
      setMessages(prev => [...prev, fileMessage]);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setInput(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const clearHistory = async () => {
    try {
      await aiAPI.clearAIHistory();
      setMessages([messages[0]]); // Keep only the initial greeting
    } catch (error) {
      console.error('Error clearing AI history:', error);
    }
  };
  
  return (
    <div className="flex flex-col h-full glass-card">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="font-medium text-lg">AI Study Assistant</h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={clearHistory}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Clear conversation history"
          >
            <Icons.RotateCcw size={16} />
          </button>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Icons.X size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-indigo-500 ml-2' 
                    : 'bg-emerald-500 mr-2'
                } text-white`}>
                  {message.sender === 'user' ? <Icons.User size={16} /> : <Icons.Bot size={16} />}
                </div>
                <div className={`p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-indigo-500 text-white' 
                    : message.isError
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                    : 'glass'
                }`}>
                  <div className="whitespace-pre-wrap">{message.text}</div>
                  {message.file && (
                    <div className="mt-2 p-2 bg-white/10 rounded flex items-center gap-2">
                      <Icons.Paperclip size={16} />
                      <span className="text-sm">{message.file.name}</span>
                    </div>
                  )}
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-500 mr-2 text-white">
                  <Icons.Bot size={16} />
                </div>
                <div className="p-4 rounded-lg glass">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '600ms' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </AnimatePresence>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Attach file"
          >
            <Icons.Paperclip size={20} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
          />
          
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Icons.Smile size={20} />
            </button>
            
            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-2 z-50">
                <Picker 
                  data={data} 
                  onEmojiSelect={handleEmojiSelect}
                  theme={darkMode ? 'dark' : 'light'}
                />
              </div>
            )}
          </div>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something about this resource..."
            className="flex-1 p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !input.trim()}
          >
            <Icons.Send size={20} />
          </button>
        </div>
        
        {resourceTitle && (
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            💡 I can help you understand concepts from "{resourceTitle}" and answer related questions.
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatBot;