import { createContext, useState } from 'react';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatType, setChatType] = useState('student'); // 'student' or 'teacher'

  const sendMessage = (content) => {
    if (!activeChat) return;
    
    const newMessage = {
      id: Date.now(),
      sender: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate response
    setTimeout(() => {
      const response = {
        id: Date.now() + 1,
        sender: 'receiver',
        content: `This is a response to: "${content}"`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const startNewChat = (chatId, type) => {
    setActiveChat(chatId);
    setChatType(type);
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{ 
      activeChat, 
      messages, 
      chatType,
      sendMessage,
      startNewChat
    }}>
      {children}
    </ChatContext.Provider>
  );
};