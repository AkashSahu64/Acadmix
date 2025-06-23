import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Video, Book, BookOpen, FileUp, Tag, Trash2, Edit, Search, Plus, Check, Filter, X, Download, MoreHorizontal, Eye } from 'lucide-react';

const ManageNotes = () => {
  const [activeTab, setActiveTab] = useState('notes');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    branch: '',
    year: '',
    semester: ''
  });
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  
  // Mock resources data
  const resources = {
    notes: [
      { id: 1, title: 'Introduction to Algorithms', branch: 'Computer Science', year: '3', semester: '5', subject: 'Algorithms', author: 'Dr. Smith', uploadDate: '2023-09-15', downloads: 78, views: 120 },
      { id: 2, title: 'Data Structures Notes', branch: 'Computer Science', year: '2', semester: '3', subject: 'Data Structures', author: 'Prof. Johnson', uploadDate: '2023-08-22', downloads: 56, views: 95 },
      { id: 3, title: 'Organic Chemistry Lecture Notes', branch: 'Chemistry', year: '2', semester: '4', subject: 'Organic Chemistry', author: 'Dr. Martinez', uploadDate: '2023-07-10', downloads: 42, views: 85 },
      { id: 4, title: 'Linear Algebra Fundamentals', branch: 'Mathematics', year: '1', semester: '2', subject: 'Linear Algebra', author: 'Prof. Davis', uploadDate: '2023-09-20', downloads: 65, views: 110 },
      { id: 5, title: 'Database Management Systems', branch: 'Computer Science', year: '3', semester: '5', subject: 'DBMS', author: 'Dr. Wilson', uploadDate: '2023-08-30', downloads: 89, views: 145 }
    ],
    syllabus: [
      { id: 1, title: 'Computer Science Curriculum', branch: 'Computer Science', year: '1-4', uploadDate: '2023-06-12', downloads: 145, views: 320 },
      { id: 2, title: 'Mechanical Engineering Syllabus', branch: 'Mechanical', year: '1-4', uploadDate: '2023-05-28', downloads: 120, views: 280 },
      { id: 3, title: 'Electrical Engineering Curriculum', branch: 'Electrical', year: '1-4', uploadDate: '2023-06-05', downloads: 105, views: 210 },
      { id: 4, title: 'Civil Engineering Syllabus', branch: 'Civil', year: '1-4', uploadDate: '2023-05-15', downloads: 95, views: 180 }
    ],
    videos: [
      { id: 1, title: 'Introduction to Python Programming', branch: 'Computer Science', year: '1', semester: '1', subject: 'Programming Fundamentals', instructor: 'Prof. Davis', duration: '45:12', uploadDate: '2023-09-01', views: 634, watchCount: 560 },
      { id: 2, title: 'Understanding Machine Learning Basics', branch: 'Computer Science', year: '3', semester: '6', subject: 'Machine Learning', instructor: 'Dr. Garcia', duration: '52:40', uploadDate: '2023-08-15', views: 745, watchCount: 680 },
      { id: 3, title: 'Circuit Design Tutorial', branch: 'Electrical', year: '2', semester: '3', subject: 'Circuit Theory', instructor: 'Prof. Anderson', duration: '38:05', uploadDate: '2023-07-20', views: 520, watchCount: 480 },
      { id: 4, title: 'Structural Analysis Fundamentals', branch: 'Civil', year: '3', semester: '5', subject: 'Structures', instructor: 'Dr. Thompson', duration: '56:30', uploadDate: '2023-08-28', views: 410, watchCount: 385 }
    ],
    pyqs: [
      { id: 1, title: 'Data Structures Mid-Semester Exam 2022', branch: 'Computer Science', year: '2', semester: '3', subject: 'Data Structures', examType: 'Mid-Semester', examDate: '2022-10-15', downloads: 245, views: 380 },
      { id: 2, title: 'Database Management End-Semester Exam 2023', branch: 'Computer Science', year: '3', semester: '5', subject: 'DBMS', examType: 'End-Semester', examDate: '2023-05-10', downloads: 312, views: 420 },
      { id: 3, title: 'Thermodynamics Quiz 2022', branch: 'Mechanical', year: '2', semester: '4', subject: 'Thermodynamics', examType: 'Quiz', examDate: '2022-11-05', downloads: 170, views: 260 },
      { id: 4, title: 'Circuit Analysis End-Semester Exam 2023', branch: 'Electrical', year: '2', semester: '4', subject: 'Circuits', examType: 'End-Semester', examDate: '2023-05-18', downloads: 198, views: 295 },
      { id: 5, title: 'Algorithms Mid-Semester Exam 2023', branch: 'Computer Science', year: '3', semester: '6', subject: 'Algorithms', examType: 'Mid-Semester', examDate: '2023-03-12', downloads: 210, views: 340 }
    ]
  };

  const getIconForTab = (tab) => {
    switch(tab) {
      case 'notes':
        return <FileText size={20} />;
      case 'syllabus':
        return <Book size={20} />;
      case 'videos':
        return <Video size={20} />;
      case 'pyqs':
        return <BookOpen size={20} />;
      default:
        return <FileText size={20} />;
    }
  };

  const filteredResources = () => {
    let result = resources[activeTab] || [];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(resource => 
        resource.title.toLowerCase().includes(term) ||
        resource.branch.toLowerCase().includes(term) ||
        (resource.subject && resource.subject.toLowerCase().includes(term))
      );
    }
    
    // Apply other filters
    if (filters.branch) {
      result = result.filter(resource => resource.branch === filters.branch);
    }
    if (filters.year && activeTab !== 'syllabus') {
      result = result.filter(resource => resource.year === filters.year);
    }
    if (filters.semester && activeTab !== 'syllabus') {
      result = result.filter(resource => resource.semester === filters.semester);
    }
    
    return result;
  };

  const handleEditResource = (resource) => {
    setSelectedResource(resource);
    setShowUploadForm(true);
  };

  const handleDeleteResource = (id) => {
    // In a real app, this would call an API to delete the resource
    console.log(`Delete resource with ID: ${id}`);
  };

  const handleResourceAction = (action, resource) => {
    if (action === 'edit') {
      handleEditResource(resource);
    } else if (action === 'delete') {
      handleDeleteResource(resource.id);
    } else if (action === 'view') {
      console.log(`View resource: ${resource.title}`);
    } else if (action === 'download') {
      console.log(`Download resource: ${resource.title}`);
    }
  };

  const resetFilters = () => {
    setFilters({ branch: '', year: '', semester: '' });
    setSearchTerm('');
  };

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };
  
  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const getTableColumns = () => {
    const baseColumns = [
      { key: 'title', label: 'Title' },
      { key: 'branch', label: 'Branch' }
    ];

    if (activeTab !== 'syllabus') {
      baseColumns.push(
        { key: 'year', label: 'Year' },
        { key: 'semester', label: 'Semester' }
      );

      if (activeTab !== 'videos') {
        baseColumns.push({ key: 'subject', label: 'Subject' });
      }

      if (activeTab === 'videos') {
        baseColumns.push({ key: 'duration', label: 'Duration' });
      }

      if (activeTab === 'pyqs') {
        baseColumns.push({ key: 'examType', label: 'Exam Type' });
      }
    }

    baseColumns.push(
      { key: 'uploadDate', label: 'Upload Date' },
      { key: 'stats', label: 'Stats' },
      { key: 'actions', label: 'Actions' }
    );

    return baseColumns;
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="pb-8"
    >
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Manage Resources</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Upload, edit, and manage educational resources
        </p>
      </div>

      {/* Resource Type Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['notes', 'syllabus', 'videos', 'pyqs'].map((tab) => (
          <button
            key={tab}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === tab
                ? 'bg-indigo-500 text-white font-medium'
                : 'glass hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {getIconForTab(tab)}
            <span className="ml-2 capitalize">{tab}</span>
          </button>
        ))}
      </div>

      {/* Search and Filters */}
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
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-10 pr-4 py-2 glass rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center glass-button"
            >
              <Filter size={18} className="mr-2" />
              Filters
            </button>
            
            <button
              onClick={() => {
                setShowUploadForm(true);
                setSelectedResource(null);
              }}
              className="flex items-center bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={18} className="mr-2" />
              Upload New
            </button>
          </div>
        </div>
        
        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Branch</label>
                <select
                  value={filters.branch}
                  onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                  className="w-full p-2 glass rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">All Branches</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Chemistry">Chemistry</option>
                </select>
              </div>
              
              {activeTab !== 'syllabus' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Year</label>
                    <select
                      value={filters.year}
                      onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                      className="w-full p-2 glass rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="">All Years</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Semester</label>
                    <select
                      value={filters.semester}
                      onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                      className="w-full p-2 glass rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="">All Semesters</option>
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
                </>
              )}
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={resetFilters}
                className="flex items-center text-red-500 hover:text-red-600 px-3 py-1 rounded-lg"
              >
                <X size={16} className="mr-1" />
                Clear Filters
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Resources Table */}
      <motion.div
        variants={tableVariants}
        initial="hidden"
        animate="visible"
        className="glass-card rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                {getTableColumns().map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
              {filteredResources().length > 0 ? (
                filteredResources().map((resource) => (
                  <tr key={resource.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center">
                        <span className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mr-3">
                          {getIconForTab(activeTab)}
                        </span>
                        <span className="line-clamp-1">{resource.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{resource.branch}</td>
                    {activeTab !== 'syllabus' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Year {resource.year}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Semester {resource.semester}</td>
                        {activeTab !== 'videos' && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{resource.subject}</td>
                        )}
                        {activeTab === 'videos' && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{resource.duration}</td>
                        )}
                        {activeTab === 'pyqs' && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{resource.examType}</td>
                        )}
                      </>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{resource.uploadDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center text-slate-500 dark:text-slate-400">
                          <Eye size={16} className="mr-1" /> {resource.views}
                        </span>
                        {(activeTab === 'notes' || activeTab === 'syllabus' || activeTab === 'pyqs') && (
                          <span className="flex items-center text-slate-500 dark:text-slate-400">
                            <Download size={16} className="mr-1" /> {resource.downloads}
                          </span>
                        )}
                        {activeTab === 'videos' && (
                          <span className="flex items-center text-slate-500 dark:text-slate-400">
                            <Tag size={16} className="mr-1" /> {resource.watchCount}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleResourceAction('edit', resource)}
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleResourceAction('delete', resource)}
                          className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="relative group">
                          <button
                            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                            title="More Options"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg glass-card z-10 hidden group-hover:block">
                            <div className="py-1">
                              <button
                                onClick={() => handleResourceAction('view', resource)}
                                className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                <Eye size={16} className="mr-2" /> View
                              </button>
                              <button
                                onClick={() => handleResourceAction('download', resource)}
                                className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                <Download size={16} className="mr-2" /> Download
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={getTableColumns().length} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                    <FileText size={36} className="mx-auto mb-3 opacity-30" />
                    <p>No resources found</p>
                    <p className="text-sm">
                      Try adjusting your filters or{' '}
                      <button
                        onClick={() => {
                          setShowUploadForm(true);
                          setSelectedResource(null);
                        }}
                        className="text-indigo-500 hover:underline"
                      >
                        upload a new one
                      </button>
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-card p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {selectedResource ? `Edit ${activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(0, -1).slice(1)}` : `Upload New ${activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(0, -1).slice(1)}`}
              </h2>
              <button
                onClick={() => setShowUploadForm(false)}
                className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Form content based on activeTab */}
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={`Enter ${activeTab.slice(0, -1)} title`}
                  defaultValue={selectedResource?.title || ''}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Branch/Department</label>
                  <select
                    className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    defaultValue={selectedResource?.branch || ''}
                  >
                    <option value="">Select Branch</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electrical">Electrical Engineering</option>
                    <option value="Mechanical">Mechanical Engineering</option>
                    <option value="Civil">Civil Engineering</option>
                    <option value="Chemistry">Chemistry</option>
                  </select>
                </div>
                
                {activeTab !== 'syllabus' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Subject</label>
                    <input
                      type="text"
                      className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter subject"
                      defaultValue={selectedResource?.subject || ''}
                    />
                  </div>
                )}
              </div>
              
              {activeTab !== 'syllabus' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Year</label>
                    <select
                      className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      defaultValue={selectedResource?.year || ''}
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
                      className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      defaultValue={selectedResource?.semester || ''}
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
              )}
              
              {activeTab === 'videos' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Video URL</label>
                    <input
                      type="url"
                      className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter video URL"
                      defaultValue={selectedResource?.videoUrl || ''}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Duration</label>
                    <input
                      type="text"
                      className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g. 45:12"
                      defaultValue={selectedResource?.duration || ''}
                    />
                  </div>
                </div>
              )}
              
              {activeTab === 'pyqs' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Exam Type</label>
                    <select
                      className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      defaultValue={selectedResource?.examType || ''}
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
                      className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      defaultValue={selectedResource?.examDate || ''}
                    />
                  </div>
                </div>
              )}
              
              {activeTab !== 'videos' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Upload File</label>
                  <div className="glass rounded-lg p-4 border-2 border-dashed border-slate-300 dark:border-slate-700">
                    <div className="text-center">
                      <FileUp size={36} className="mx-auto mb-2 text-slate-400" />
                      <p className="text-sm mb-2">Drag and drop your file here or</p>
                      <label className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg cursor-pointer transition-colors inline-block">
                        Browse Files
                        <input
                          type="file"
                          className="hidden"
                        />
                      </label>
                      {selectedResource && (
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                          Current file: {selectedResource.title}.pdf
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="px-4 py-2 glass-button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center"
                >
                  {selectedResource ? (
                    <>
                      <Check size={18} className="mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <FileUp size={18} className="mr-2" />
                      Upload
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ManageNotes;