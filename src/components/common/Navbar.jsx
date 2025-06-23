import { useState, useEffect, useRef } from "react";
import { Bell, Sun, Moon, User, LogOut, Menu, X, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";

const Navbar = ({ toggleSidebar, isSidebarOpen, notifications = [] }) => {
  const { darkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Refs for dropdowns
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }

      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownClick = (e, setter) => {
    e.stopPropagation();
    setter((prev) => !prev);
  };

  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const navbarVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  };

  return (
    <motion.nav
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
      className="glass-card sticky top-0 z-40 p-4 flex justify-between items-center h-[72px]"
    >
      {/* Left Side: Brand + Menu Toggle */}
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 mr-4 lg:hidden transition-colors duration-200"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="flex items-center space-x-2">
          {/* Icon visible only on md and above */}
          <div className="hidden md:flex w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 items-center justify-center">
            <BookOpen size={20} className="text-white" />
          </div>
          <h1 className="text-lg md:text-xl font-semibold text-indigo-600 dark:text-indigo-400">
            Acadmix
          </h1>
        </div>
      </div>

      {/* Right Side: Notifications, Theme, Profile */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={(e) => handleDropdownClick(e, setShowNotifications)}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200 relative"
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-lg shadow-lg glass z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="font-medium">Notifications</h3>
                </div>
                <div className="p-2">
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg mb-1"
                      >
                        <p className="text-sm font-medium">
                          {notification.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-slate-500 dark:text-slate-400">
                      No notifications
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={(e) => handleDropdownClick(e, setShowProfileMenu)}
            className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
              {user?.name ? user.name.charAt(0) : <User size={16} />}
            </div>
            <span className="hidden md:block text-sm font-medium">
              {user?.name || "User"}
            </span>
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg glass z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                  <p className="font-medium">{user?.name || "User"}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
                <div className="p-2">
                  <button
                    onClick={logout}
                    className="flex w-full items-center space-x-2 p-2 text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
