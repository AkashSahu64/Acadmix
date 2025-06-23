import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileUp, FileText, Video, Book, BookOpen, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { resourceService } from '../../services/resourceService';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../hooks/useAuth';

const Upload = () => {
  const [activeTab, setActiveTab] = useState('notes');
  const [formData, setFormData] = useState({
    notes: {
      title: '',
      branch: '',
      year: '',
      semester: '',
      subject: '',
      file: null,
      fileName: ''
    },
    syllabus: {
      title: '',
      branch: '',
      subjectCount: '',
      file: null,
      fileName: ''
    },
    videos: {
      title: '',
      branch: '',
      year: '',
      semester: '',
      subject: '',
      videoUrl: '',
      duration: '',
      thumbnail: ''
    },
    pyqs: {
      title: '',
      branch: '',
      year: '',
      semester: '',
      subject: '',
      examType: '',
      examDate: '',
      solved: false,
      file: null,
      fileName: ''
    },
    announcements: {
      title: '',
      content: '',
      pinned: false
    }
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSuccess(false);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setFormData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        file,
        fileName: file.name
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      if (activeTab === 'announcements') {
        await adminService.createAnnouncement({
          ...formData.announcements,
          author: user?.name || 'Jane Teacher'
        });
      } else {
        await resourceService.uploadResource(
          {
            ...formData[activeTab],
            author: user?.name || 'Jane Teacher',
            instructor: user?.name || 'Jane Teacher'
          }, 
          activeTab
        );
      }
      
      setSuccess(true);
      
      // Reset form for the active tab
      setFormData(prev => ({
        ...prev,
        [activeTab]: {
          ...Object.fromEntries(
            Object.keys(prev[activeTab]).map(key => [key, 
              typeof prev[activeTab][key] === 'boolean' ? false : ''
            ])
          ),
          file: null,
          fileName: ''
        }
      }));
    } catch (error) {
      console.error('Error uploading resource:', error);
      setError('Failed to upload content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };
  
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="pb-8"
    >
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Upload Content</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Add new educational resources or make announcements
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`flex items-center px-4 py-2 rounded-lg ${
            activeTab === 'notes'
              ? 'bg-indigo-500 text-white font-medium'
              : 'glass hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          onClick={() => handleTabChange('notes')}
        >
          <FileText size={18} className="mr-2" />
          Notes
        </button>
        <button
          className={`flex items-center px-4 py-2 rounded-lg ${
            activeTab === 'syllabus'
              ? 'bg-indigo-500 text-white font-medium'
              : 'glass hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          onClick={() => handleTabChange('syllabus')}
        >
          <Book size={18} className="mr-2" />
          Syllabus
        </button>
        <button
          className={`flex items-center px-4 py-2 rounded-lg ${
            activeTab === 'videos'
              ? 'bg-indigo-500 text-white font-medium'
              : 'glass hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          onClick={() => handleTabChange('videos')}
        >
          <Video size={18} className="mr-2" />
          Videos
        </button>
        <button
          className={`flex items-center px-4 py-2 rounded-lg ${
            activeTab === 'pyqs'
              ? 'bg-indigo-500 text-white font-medium'
              : 'glass hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          onClick={() => handleTabChange('pyqs')}
        >
          <FileText size={18} className="mr-2" />
          PYQs
        </button>
        <button
          className={`flex items-center px-4 py-2 rounded-lg ${
            activeTab === 'announcements'
              ? 'bg-indigo-500 text-white font-medium'
              : 'glass hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          onClick={() => handleTabChange('announcements')}
        >
          <BookOpen size={18} className="mr-2" />
          Announcements
        </button>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-start">
          <AlertTriangle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Upload Failed</p>
            <p>{error}</p>
          </div>
          <button 
            onClick={() => setError('')}
            className="ml-4 p-1 hover:bg-red-100 dark:hover:bg-red-800/30 rounded-full"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg flex items-start">
          <CheckCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Upload Successful</p>
            <p>Your content has been added successfully.</p>
          </div>
          <button 
            onClick={() => setSuccess(false)}
            className="ml-4 p-1 hover:bg-green-100 dark:hover:bg-green-800/30 rounded-full"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Forms */}
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="glass-card p-6 rounded-xl"
      >
        <form onSubmit={handleSubmit}>
          {/* Notes Form */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.notes.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Introduction to Data Structures"
                  className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Branch</label>
                  <select
                    name="branch"
                    value={formData.notes.branch}
                    onChange={handleInputChange}
                    className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Branch</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electrical">Electrical Engineering</option>
                    <option value="Mechanical">Mechanical Engineering</option>
                    <option value="Civil">Civil Engineering</option>
                    <option value="Electronics">Electronics Engineering</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.notes.subject}
                    onChange={handleInputChange}
                    placeholder="e.g. Data Structures"
                    className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <select
                    name="year"
                    value={formData.notes.year}
                    onChange={handleInputChange}
                    className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Semester</label>
                  <select
                    name="semester"
                    value={formData.notes.semester}
                    onChange={handleInputChange}
                    className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Semester</option>
                    <option value="1">1st Semester</option>
                    <option value="2">2nd Semester</option>
                    <option value="3">3rd Semester</option>
                    <option value="4">4th Semester</option>
                    <option value="5">5th Semester</option>
                    <option value="6">6th Semester</option>
                    <option value="7">7th Semester</option>
                    <option value="8">8th Semester</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Upload PDF File</label>
                <div className="glass rounded-lg p-4 border-2 border-dashed border-slate-300 dark:border-slate-700">
                  {formData.notes.fileName ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText size={24} className="mr-2 text-indigo-500" />
                        <span>{formData.notes.fileName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          notes: { ...prev.notes, file: null, fileName: '' }
                        }))}
                        className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FileUp size={36} className="mx-auto mb-2 text-slate-400" />
                      <p className="text-sm mb-2">Drag and drop your PDF file here or</p>
                      <label className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg cursor-pointer transition-colors inline-block">
                        Browse Files
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Syllabus Form */}
          {activeTab === 'syllabus' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.syllabus.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Computer Science Curriculum 2023"
                  className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Branch</label>
                  <select
                    name="branch"
                    value={formData.syllabus.branch}
                    onChange={handleInputChange}
                    className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Branch</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electrical">Electrical Engineering</option>
                    <option value="Mechanical">Mechanical Engineering</option>
                    <option value="Civil">Civil Engineering</option>
                    <option value="Electronics">Electronics Engineering</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Total Subjects</label>
                  <input
                    type="number"
                    name="subjectCount"
                    value={formData.syllabus.subjectCount}
                    onChange={handleInputChange}
                    placeholder="e.g. 42"
                    className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Upload PDF File</label>
                <div className="glass rounded-lg p-4 border-2 border-dashed border-slate-300 dark:border-slate-700">
                  {formData.syllabus.fileName ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText size={24} className="mr-2 text-indigo-500" />
                        <span>{formData.syllabus.fileName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          syllabus: { ...prev.syllabus, file: null, fileName: '' }
                        }))}
                        className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FileUp size={36} className="mx-auto mb-2 text-slate-400" />
                      <p className="text-sm mb-2">Drag and drop your PDF file here or</p>
                      <label className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg cursor-pointer transition-colors inline-block">
                        Browse Files
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Videos Form */}
          {activeTab === 'videos' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.videos.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Introduction to Python Programming"
                  className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Branch</label>
                  <select
                    name="branch"
                    value={formData.videos.branch}
                    onChange={handleInputChange}
                    className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Branch</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electrical">Electrical Engineering</option>
                    <option value="Mechanical">Mechanical Engineering</option>
                    <option value="Civil">Civil Engineering</option>
                    <option value="Electronics">Electronics Engineering</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.videos.subject}
                    onChange={handleInputChange}
                    placeholder="e.g. Programming Fundamentals"
                    className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <select
                    name="year"
                    value={formData.videos.year}
                    onChange={handleInputChange}
                    className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Semester</label>
                  <select
                    name="semester"
                    value={formData.videos.semester}
                    onChange={handleInputChange}
                    className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Semester</option>
                    <option value="1">1st Semester</option>
                    <option value="2">2nd Semester</option>
                    <option value="3">3rd Semester</option>
                    <option value="4">4th Semester</option>
                    <option value="5">5th Semester</option>
                    <option value="6">6th Semester</option>
                    <option value="7">7th Semester</option>
                    <option value="8">8th Semester</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Video URL</label>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videos.videoUrl}
                  onChange={handleInputChange}
                  placeholder="e.g. https://example.com/videos/python-intro.mp4"
                  className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enter the full URL of the video. Supported formats: MP4, WebM, Ogg
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.videos.duration}
                    onChange={handleInputChange}
                    placeholder="e.g. 45:12"
                    className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
                  <input
                    type="url"
                    name="thumbnail"
                    value={formData.videos.thumbnail}
                    onChange={handleInputChange}
                    placeholder="e.g. https://example.com/thumbnails/python.jpg"
                    className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PYQs Form */}
          {activeTab === 'pyqs' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.pyqs.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Data Structures Mid-Semester Exam 2023"
                  className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Branch</label>
                  <select
                    name="branch"
                    value={formData.pyqs.branch}
                    onChange={handleInputChange}
                    className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Branch</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electrical">Electrical Engineering</option>
                    <option value="Mechanical">Mechanical Engineering</option>
                    <option value="Civil">Civil Engineering</option>
                    <option value="Electronics">Electronics Engineering</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.pyqs.subject}
                    onChange={handleInputChange}
                    placeholder="e.g. Data Structures"
                    className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <select
                    name="year"
                    value={formData.pyqs.year}
                    onChange={handleInputChange}
                    className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Semester</label>
                  <select
                    name="semester"
                    value={formData.pyqs.semester}
                    onChange={handleInputChange}
                    className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Semester</option>
                    <option value="1">1st Semester</option>
                    <option value="2">2nd Semester</option>
                    <option value="3">3rd Semester</option>
                    <option value="4">4th Semester</option>
                    <option value="5">5th Semester</option>
                    <option value="6">6th Semester</option>
                    <option value="7">7th Semester</option>
                    <option value="8">8th Semester</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Exam Type</label>
                  <select
                    name="examType"
                    value={formData.pyqs.examType}
                    onChange={handleInputChange}
                    className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Exam Type</option>
                    <option value="Mid-Semester">Mid-Semester</option>
                    <option value="End-Semester">End-Semester</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Practical">Practical</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Exam Date</label>
                  <input
                    type="date"
                    name="examDate"
                    value={formData.pyqs.examDate}
                    onChange={handleInputChange}
                    className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="solved"
                  name="solved"
                  checked={formData.pyqs.solved}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                />
                <label htmlFor="solved" className="ml-2 block text-sm">
                  This question paper includes solutions
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Upload PDF File</label>
                <div className="glass rounded-lg p-4 border-2 border-dashed border-slate-300 dark:border-slate-700">
                  {formData.pyqs.fileName ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText size={24} className="mr-2 text-indigo-500" />
                        <span>{formData.pyqs.fileName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          pyqs: { ...prev.pyqs, file: null, fileName: '' }
                        }))}
                        className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FileUp size={36} className="mx-auto mb-2 text-slate-400" />
                      <p className="text-sm mb-2">Drag and drop your PDF file here or</p>
                      <label className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg cursor-pointer transition-colors inline-block">
                        Browse Files
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Announcements Form */}
          {activeTab === 'announcements' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.announcements.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Mid-Term Examination Schedule"
                  className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  name="content"
                  value={formData.announcements.content}
                  onChange={handleInputChange}
                  placeholder="Enter announcement details..."
                  rows={5}
                  className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  required
                ></textarea>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pinned"
                  name="pinned"
                  checked={formData.announcements.pinned}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                />
                <label htmlFor="pinned" className="ml-2 block text-sm">
                  Pin this announcement to the top
                </label>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <FileUp size={18} className="mr-2" />
                  {activeTab === 'announcements' ? 'Post Announcement' : 'Upload Content'}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Upload;