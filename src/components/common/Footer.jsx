import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Send,
  Heart,
  ExternalLink
} from 'lucide-react';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      animate="visible"
      className="glass-card mt-auto border-t border-slate-200 dark:border-slate-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <BookOpen size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Smart College
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm leading-relaxed">
              Empowering students with comprehensive educational resources, AI-powered learning assistance, and collaborative study environments.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Youtube, href: '#', label: 'YouTube' }
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  aria-label={label}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Dashboard', to: '/student/dashboard' },
                { label: 'Notes Library', to: '/student/notes' },
                { label: 'Video Lectures', to: '/student/videos' },
                { label: 'Course Syllabus', to: '/student/syllabus' },
                { label: 'Previous Papers', to: '/student/pyqs' },
                { label: 'Community', to: '/student/community' }
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm flex items-center group"
                  >
                    <span>{label}</span>
                    <ExternalLink size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Resources</h4>
            <ul className="space-y-2">
              {[
                { label: 'Study Materials', to: '/student/notes' },
                { label: 'Academic Calendar', to: '#' },
                { label: 'Examination Schedule', to: '#' },
                { label: 'Faculty Directory', to: '#' },
                { label: 'Library Resources', to: '#' },
                { label: 'Student Portal', to: '#' }
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm flex items-center group"
                  >
                    <span>{label}</span>
                    <ExternalLink size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Newsletter */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Stay Connected</h4>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-slate-600 dark:text-slate-300 text-sm">
                <Mail size={14} className="mr-2 flex-shrink-0" />
                <span>support@smartcollege.edu</span>
              </div>
              <div className="flex items-center text-slate-600 dark:text-slate-300 text-sm">
                <Phone size={14} className="mr-2 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start text-slate-600 dark:text-slate-300 text-sm">
                <MapPin size={14} className="mr-2 flex-shrink-0 mt-0.5" />
                <span>123 Education Street<br />Learning City, LC 12345</span>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h5 className="font-medium text-slate-900 dark:text-slate-100 mb-2 text-sm">Newsletter</h5>
              <p className="text-slate-600 dark:text-slate-300 text-xs mb-3">
                Get updates on new resources and features
              </p>
              
              {subscribed ? (
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                  <Heart size={14} className="mr-2" />
                  <span>Thank you for subscribing!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 text-sm glass rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-r-0"
                    required
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-r-lg transition-colors"
                  >
                    <Send size={14} />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          variants={itemVariants}
          className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                © {new Date().getFullYear()} Smart College Platform. All rights reserved.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="#"
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="#"
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm"
                >
                  Terms of Service
                </Link>
                <Link
                  to="#"
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
            
            <div className="flex items-center text-slate-600 dark:text-slate-300 text-sm">
              <span>Made with</span>
              <Heart size={14} className="mx-1 text-red-500" />
              <span>for education</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;