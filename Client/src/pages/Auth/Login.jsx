import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, User, BookOpen, AlertCircle } from 'lucide-react';

const Login = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    rollNo: ''
  });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (activeTab === 'student' && !credentials.email && !credentials.rollNo) {
      setError('Please enter either email or roll number');
      return;
    }
    
    if (!credentials.password) {
      setError('Password is required');
      return;
    }
    
    try {
      const result = await login(credentials, activeTab);
      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="glass-card p-5 lg:p-8 rounded-xl"
    >
      <motion.div variants={itemVariants} className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Welcome Back</h1>
        <p className="text-slate-500 dark:text-slate-400">Sign in to continue to your dashboard</p>
      </motion.div>

      {/* Role tabs */}
      <motion.div variants={itemVariants} className="flex rounded-lg glass mb-6">
        <button
          onClick={() => setActiveTab('student')}
          className={`flex-1 py-3 rounded-lg flex items-center justify-center ${
            activeTab === 'student' 
              ? 'bg-indigo-500 text-white font-medium' 
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen size={16} className="mr-2" />
          Student
        </button>
        <button
          onClick={() => setActiveTab('teacher')}
          className={`flex-1 py-3 rounded-lg flex items-center justify-center ${
            activeTab === 'teacher' 
              ? 'bg-indigo-500 text-white font-medium' 
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <User size={16} className="mr-2" />
          Teacher
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex-1 py-3 rounded-lg flex items-center justify-center ${
            activeTab === 'admin' 
              ? 'bg-indigo-500 text-white font-medium' 
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Lock size={16} className="mr-2" />
          Admin
        </button>
      </motion.div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center"
        >
          <AlertCircle size={16} className="mr-2 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-4">
        {activeTab === 'student' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 py-2 glass rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="text-center text-sm my-2">Or</div>
              <label className="block text-sm font-medium mb-1">Roll Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BookOpen size={16} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  name="rollNo"
                  value={credentials.rollNo}
                  onChange={handleChange}
                  placeholder="CS123"
                  className="w-full pl-10 py-2 glass rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </>
        )}

        {(activeTab === 'teacher' || activeTab === 'admin') && (
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={16} className="text-slate-400" />
              </div>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-10 py-2 glass rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium">Password</label>
            <a href="#" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
              Forgot Password?
            </a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={16} className="text-slate-400" />
            </div>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-10 py-2 glass rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <motion.button
          variants={itemVariants}
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Signing in...
            </div>
          ) : (
            'Sign In'
          )}
        </motion.button>

        {activeTab === 'student' && (
          <motion.div variants={itemVariants} className="text-center mt-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Don't have an account? 
              <Link to="/auth/register" className="ml-1 text-indigo-600 dark:text-indigo-400 hover:underline">
                Sign up
              </Link>
            </p>
          </motion.div>
        )}

        {(activeTab === 'teacher' || activeTab === 'admin') && (
          <motion.p variants={itemVariants} className="text-sm text-slate-500 dark:text-slate-400 text-center">
            {activeTab === 'teacher' 
              ? 'Teacher accounts are created by administrators' 
              : 'Contact IT support for admin access'}
          </motion.p>
        )}
      </motion.form>

      {/* Login hints */}
      {/* <motion.div 
        variants={itemVariants}
        className="mt-8 text-xs text-slate-500 dark:text-slate-400 p-3 glass rounded-lg"
      >
        <p className="font-medium mb-1">Demo credentials:</p>
        {activeTab === 'student' && (
          <p>Email: student@example.com / Password: password</p>
        )}
        {activeTab === 'teacher' && (
          <p>Email: teacher@example.com / Password: password</p>
        )}
        {activeTab === 'admin' && (
          <p>Email: admin@example.com / Password: password</p>
        )}
      </motion.div> */}
    </motion.div>
  );
};

export default Login;