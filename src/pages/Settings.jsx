import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Bell, Lock, Check } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

const Settings = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    announcements: true,
    messages: true,
    updates: false
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleNotificationChange = (setting) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    // In a real app, this would call an API to update the password
    setSuccess('Password updated successfully');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-8"
    >
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage your account preferences and settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Moon size={20} className="mr-2" /> Theme
          </h2>
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                darkMode ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Bell size={20} className="mr-2" /> Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Announcements</span>
              <button
                onClick={() => handleNotificationChange('announcements')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  notifications.announcements ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.announcements ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>Messages</span>
              <button
                onClick={() => handleNotificationChange('messages')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  notifications.messages ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.messages ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>Updates</span>
              <button
                onClick={() => handleNotificationChange('updates')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  notifications.updates ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.updates ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Password Change */}
        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Lock size={20} className="mr-2" /> Change Password
          </h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg flex items-center">
                <Check size={16} className="mr-2" />
                {success}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="w-full p-3 glass rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="w-full p-3 glass rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full p-3 glass rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;