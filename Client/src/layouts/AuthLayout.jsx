import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../components/common/Footer';

const AuthLayout = () => {
  const [currentTime] = useState(new Date());
  
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left side with illustration and greeting */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-5 lg:p-8 flex flex-col justify-center"
        >
          <div className="max-w-md mx-auto">
            <h1 className="text-4xl font-bold mb-2">{getGreeting()}</h1>
            <p className="text-lg text-indigo-100 mb-8">Welcome to your Smart College Resource Platform</p>
            
            <div className="glass p-6 rounded-xl mb-8">
              <h2 className="text-xl font-semibold mb-4">Everything you need in one place</h2>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <span className="text-white">📚</span>
                  </div>
                  <span>Access study materials and notes</span>
                </li>
                <li className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <span className="text-white">📝</span>
                  </div>
                  <span>Previous years' question papers</span>
                </li>
                <li className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <span className="text-white">🎥</span>
                  </div>
                  <span>Video lectures and tutorials</span>
                </li>
                <li className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <span className="text-white">💬</span>
                  </div>
                  <span>Engage with peers and teachers</span>
                </li>
              </ul>
            </div>
            
            <p className="text-sm text-indigo-200">
              © {currentTime.getFullYear()} Acadmix Platform. All rights reserved.
            </p>
          </div>
        </motion.div>
        
        {/* Right side with auth forms */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-5 lg:p-8"
        >
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AuthLayout;