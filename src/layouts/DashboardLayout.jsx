import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Fixed Navbar */}
      <Navbar 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen}
        notifications={[
          { title: 'New announcement', message: 'Mid-Semester Examination Schedule posted', time: '2 hours ago' },
          { title: 'Resource updated', message: 'New notes added for Algorithms', time: '1 day ago' }
        ]}
      />
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          toggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        {/* Main Content */}
        <motion.div 
          className="flex-1 flex flex-col overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
            <Outlet />
          </main>
          
          <Footer />
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardLayout;