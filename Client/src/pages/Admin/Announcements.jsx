import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Edit, Trash2, AlertTriangle, Pin, X, Check, Plus } from 'lucide-react';
import { adminService } from '../../services/adminService';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    pinned: false
  });

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const data = await adminService.getAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = () => {
    if (!searchTerm) return announcements;
    
    const term = searchTerm.toLowerCase();
    return announcements.filter(announcement => 
      announcement.title.toLowerCase().includes(term) ||
      announcement.content.toLowerCase().includes(term) ||
      announcement.author.toLowerCase().includes(term)
    );
  };

  const handleCreateOrEdit = (announcement = null) => {
    if (announcement) {
      setFormData({
        title: announcement.title,
        content: announcement.content,
        pinned: announcement.pinned
      });
      setSelectedAnnouncement(announcement);
    } else {
      setFormData({
        title: '',
        content: '',
        pinned: false
      });
      setSelectedAnnouncement(null);
    }
    
    setShowCreateModal(true);
  };

  const handleDeleteAnnouncement = (announcement) => {
    setAnnouncementToDelete(announcement);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      // In a real app, this would call an API to delete the announcement
      await adminService.deleteAnnouncement(announcementToDelete.id);
      setAnnouncements(prev => prev.filter(a => a.id !== announcementToDelete.id));
      setShowConfirmDelete(false);
      setAnnouncementToDelete(null);
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedAnnouncement) {
        // In a real app, this would call an API to update the announcement
        await adminService.updateAnnouncement(selectedAnnouncement.id, formData);
        setAnnouncements(prev => 
          prev.map(a => a.id === selectedAnnouncement.id ? { ...a, ...formData } : a)
        );
      } else {
        // In a real app, this would call an API to create a new announcement
        const newAnnouncement = await adminService.createAnnouncement({
          ...formData,
          author: 'Admin User', // In a real app, this would be the current user
          date: new Date().toISOString().split('T')[0] // Today's date
        });
        setAnnouncements(prev => [...prev, newAnnouncement]);
      }
      
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error saving announcement:', error);
    }
  };

  const handleTogglePin = async (announcement) => {
    try {
      // In a real app, this would call an API to update the announcement
      await adminService.updateAnnouncement(announcement.id, { pinned: !announcement.pinned });
      setAnnouncements(prev => 
        prev.map(a => a.id === announcement.id ? { ...a, pinned: !a.pinned } : a)
      );
    } catch (error) {
      console.error('Error toggling pin status:', error);
    }
  };

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };
  
  const listVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="pb-8"
    >
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Announcements</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Create and manage announcements for students and teachers
        </p>
      </div>

      {/* Search and Create */}
      <div className="glass-card p-4 mb-6 rounded-xl">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search announcements..."
              className="w-full pl-10 pr-4 py-2 glass rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          
          <button
            onClick={() => handleCreateOrEdit()}
            className="flex items-center bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Create Announcement
          </button>
        </div>
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredAnnouncements().length > 0 ? (
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {filteredAnnouncements().map(announcement => (
            <motion.div
              key={announcement.id}
              variants={itemVariants}
              className={`glass-card p-5 rounded-xl ${
                announcement.pinned 
                  ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800' 
                  : ''
              }`}
            >
              <div className="flex flex-wrap justify-between items-start mb-2">
                <div className="flex items-start">
                  <div className="mr-3 mt-1 text-indigo-500 dark:text-indigo-400">
                    <Bell size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">
                      {announcement.pinned && (
                        <span className="inline-block px-2 py-0.5 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-xs rounded-full mr-2">
                          Pinned
                        </span>
                      )}
                      {announcement.title}
                    </h2>
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                      <span>{announcement.date}</span>
                      <span className="mx-2">•</span>
                      <span>{announcement.author}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => handleTogglePin(announcement)}
                    className={`p-1 rounded ${
                      announcement.pinned
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' 
                        : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                    title={announcement.pinned ? 'Unpin' : 'Pin'}
                  >
                    <Pin size={16} />
                  </button>
                  <button
                    onClick={() => handleCreateOrEdit(announcement)}
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteAnnouncement(announcement)}
                    className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                  {announcement.content}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="glass-card p-10 rounded-xl text-center">
          <Bell size={40} className="mx-auto mb-4 text-slate-400" />
          <h3 className="text-xl font-semibold mb-2">No Announcements Found</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            {searchTerm ? 'No announcements match your search.' : 'Create your first announcement to get started.'}
          </p>
          <button
            onClick={() => handleCreateOrEdit()}
            className="inline-flex items-center bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Create Announcement
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-card p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {selectedAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter announcement title"
                  className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Enter announcement content..."
                  rows={6}
                  className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  required
                ></textarea>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pinned"
                  name="pinned"
                  checked={formData.pinned}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                />
                <label htmlFor="pinned" className="ml-2 block text-sm">
                  Pin this announcement to the top
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 glass-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center"
                >
                  {selectedAnnouncement ? (
                    <>
                      <Check size={18} className="mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Bell size={18} className="mr-2" />
                      Post Announcement
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-card p-6 rounded-xl w-full max-w-md"
          >
            <div className="flex items-center mb-4 text-red-500">
              <AlertTriangle size={24} className="mr-2" />
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            </div>
            
            <p className="mb-6">
              Are you sure you want to delete the announcement <span className="font-semibold">"{announcementToDelete?.title}"</span>? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 glass-button"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Announcements;