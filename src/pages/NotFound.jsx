import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Home } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Footer from '../components/common/Footer';

const NotFound = () => {
  const { user } = useAuth();
  
  const getDashboardLink = () => {
    if (!user) return '/auth/login';
    
    switch (user.role) {
      case 'student':
        return '/student/dashboard';
      case 'teacher':
        return '/teacher/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/auth/login';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 md:p-12 rounded-2xl max-w-2xl w-full text-center"
        >
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 15 }}
            className="mb-6"
          >
            <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-indigo-500" />
            </div>
            <h1 className="text-6xl font-bold text-indigo-500 mb-2">404</h1>
            <h2 className="text-2xl font-semibold mb-1">Page Not Found</h2>
            <p className="text-slate-500 dark:text-slate-400">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-4"
          >
            <Link
              to={getDashboardLink()}
              className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-6 rounded-lg transition-colors"
            >
              <Home size={18} className="mr-2" />
              Back to Dashboard
            </Link>
            
            <div className="text-sm text-slate-500 dark:text-slate-400">
              If you believe this is an error, please contact support.
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;