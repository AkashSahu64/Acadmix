import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home, BookOpen, FileText, Video, Book, MessageSquare, Settings, Users, BarChart, Upload } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isOpen, toggle }) => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const { user } = useAuth();
  const userRole = user?.role || 'student';

  // Set sidebar expanded state based on window size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setExpanded(false);
      } else {
        setExpanded(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Define animation variants
  const sidebarVariants = {
    open: { 
      x: 0,
      width: expanded ? '240px' : '80px', 
      transition: { duration: 0.3, ease: "easeInOut" } 
    },
    closed: { 
      x: '-100%',
      width: expanded ? '240px' : '80px', 
      transition: { duration: 0.3, ease: "easeInOut" } 
    }
  };

  // Navigation menus based on user role
  const getNavItems = () => {
    switch (userRole) {
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
          { to: '/admin/manage-notes', label: 'Manage Notes', icon: <FileText size={20} /> },
          { to: '/admin/manage-users', label: 'Manage Users', icon: <Users size={20} /> },
          { to: '/admin/announcements', label: 'Announcements', icon: <MessageSquare size={20} /> },
          { to: '/admin/manage-community', label: 'Manage Community', icon: <MessageSquare size={20} /> }
        ];
      case 'teacher':
        return [
          { to: '/teacher/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
          { to: '/teacher/community', label: 'Community', icon: <MessageSquare size={20} /> },
          { to: '/teacher/upload', label: 'Upload Content', icon: <Upload size={20} /> },
          { to: '/teacher/profile', label: 'Profile', icon: <Users size={20} /> }
        ];
      case 'student':
      default:
        return [
          { to: '/student/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
          { to: '/student/notes', label: 'Notes', icon: <BookOpen size={20} /> },
          { to: '/student/syllabus', label: 'Syllabus', icon: <Book size={20} /> },
          { to: '/student/videos', label: 'Videos', icon: <Video size={20} /> },
          { to: '/student/pyqs', label: 'PYQs', icon: <FileText size={20} /> },
          { to: '/student/community', label: 'Community', icon: <MessageSquare size={20} /> },
          { to: '/student/profile', label: 'Profile', icon: <Users size={20} /> }
        ];
    }
  };

  const navItems = getNavItems();

  // NavLink custom styling
  const getNavLinkClass = ({ isActive }) => {
    return `flex items-center ${expanded ? 'justify-start' : 'justify-center'} p-3 my-1 rounded-lg transition-all duration-300 ${
      isActive 
        ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-medium' 
        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;
  };

  const toggleExpand = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggle}
        />
      )}

      <AnimatePresence>
        {(isOpen || window.innerWidth >= 1024) && (
          <motion.aside
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-[72px] left-0 h-[calc(100vh-72px)] glass-card z-20 lg:relative lg:top-0 lg:h-full overflow-hidden"
            style={{ 
              width: expanded ? '240px' : '80px',
              minWidth: expanded ? '240px' : '80px'
            }}
          >
            <div className="flex flex-col h-full p-3">
              <div className="flex items-center justify-between py-3 mb-4">
                {expanded && (
                  <motion.h1 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xl font-bold text-indigo-600 dark:text-indigo-400"
                  >
                    SmartCollege
                  </motion.h1>
                )}
                <button 
                  onClick={toggleExpand}
                  className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200 lg:block hidden"
                >
                  {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        className={getNavLinkClass}
                        onClick={() => window.innerWidth < 1024 && toggle()}
                      >
                        <span className="flex-shrink-0">{item.icon}</span>
                        {expanded && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="ml-3 whitespace-nowrap overflow-hidden"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-auto">
                <NavLink
                  to={`/${userRole}/settings`}
                  className={getNavLinkClass}
                  onClick={() => window.innerWidth < 1024 && toggle()}
                >
                  <span className="flex-shrink-0"><Settings size={20} /></span>
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="ml-3 whitespace-nowrap overflow-hidden"
                    >
                      Settings
                    </motion.span>
                  )}
                </NavLink>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;