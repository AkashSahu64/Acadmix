import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Search, Filter, UserCheck, X, Mail, User, Book, Laptop, MoreHorizontal, Edit, Trash2, AlertTriangle, Check } from 'lucide-react';
import { adminService } from '../../services/adminService';

const ManageUsers = () => {
  const [activeTab, setActiveTab] = useState('teachers');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    department: '',
    branch: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const [teachersData, studentsData] = await Promise.all([
          adminService.getTeachers(),
          adminService.getStudents()
        ]);
        
        setTeachers(teachersData);
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const filteredUsers = () => {
    let result = activeTab === 'teachers' ? teachers : students;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.department && user.department.toLowerCase().includes(term)) ||
        (user.branch && user.branch.toLowerCase().includes(term))
      );
    }
    
    // Apply other filters
    if (filters.status) {
      result = result.filter(user => user.status === filters.status);
    }
    
    if (activeTab === 'teachers' && filters.department) {
      result = result.filter(user => user.department === filters.department);
    }
    
    if (activeTab === 'students' && filters.branch) {
      result = result.filter(user => user.branch === filters.branch);
    }
    
    return result;
  };

  const handleAddOrEditUser = (user = null) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    // In a real app, this would call an API to delete the user
    console.log(`Delete user: ${userToDelete.name}`);
    setShowConfirmDelete(false);
    setUserToDelete(null);
  };

  const handleUpdateStatus = async (user, newStatus) => {
    // In a real app, this would update the user's status via API
    console.log(`Update ${user.name}'s status to ${newStatus}`);
  };

  const resetFilters = () => {
    setFilters({ status: '', department: '', branch: '' });
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

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="pb-8"
    >
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Manage Users</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Add, edit, and manage teachers and students
        </p>
      </div>

      {/* User Type Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`flex items-center px-4 py-2 rounded-lg ${
            activeTab === 'teachers'
              ? 'bg-indigo-500 text-white font-medium'
              : 'glass hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          onClick={() => setActiveTab('teachers')}
        >
          <Laptop size={18} className="mr-2" />
          Teachers
        </button>
        <button
          className={`flex items-center px-4 py-2 rounded-lg ${
            activeTab === 'students'
              ? 'bg-indigo-500 text-white font-medium'
              : 'glass hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          onClick={() => setActiveTab('students')}
        >
          <Book size={18} className="mr-2" />
          Students
        </button>
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
              onClick={() => handleAddOrEditUser()}
              className="flex items-center bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <UserPlus size={18} className="mr-2" />
              Add {activeTab === 'teachers' ? 'Teacher' : 'Student'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full p-2 glass rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              {activeTab === 'teachers' ? (
                <div>
                  <label className="block text-sm font-medium mb-1">Department</label>
                  <select
                    value={filters.department}
                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                    className="w-full p-2 glass rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">All Departments</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Database Systems">Database Systems</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-1">Branch</label>
                  <select
                    value={filters.branch}
                    onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                    className="w-full p-2 glass rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">All Branches</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                  </select>
                </div>
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

      {/* Users Table */}
      <motion.div
        variants={tableVariants}
        initial="hidden"
        animate="visible"
        className="glass-card p-4 rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                {activeTab === 'teachers' ? (
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Department</th>
                ) : (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Branch</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Year/Semester</th>
                  </>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={activeTab === 'teachers' ? 6 : 7} className="px-6 py-10 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-500 rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers().length > 0 ? (
                filteredUsers().map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-3">
                          {user.name.charAt(0)}
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                    {activeTab === 'teachers' ? (
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{user.department}</td>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{user.branch}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Year {user.year} / Sem {user.semester}</td>
                      </>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{user.joinedDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleAddOrEditUser(user)}
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
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
                              {user.status === 'active' ? (
                                <button
                                  onClick={() => handleUpdateStatus(user, 'inactive')}
                                  className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-red-500"
                                >
                                  <X size={16} className="mr-2" /> Deactivate
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateStatus(user, 'active')}
                                  className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-green-500"
                                >
                                  <Check size={16} className="mr-2" /> Activate
                                </button>
                              )}
                              {activeTab === 'teachers' && (
                                <button
                                  className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                  <Mail size={16} className="mr-2" /> Send Credentials
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={activeTab === 'teachers' ? 6 : 7} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                    <Users size={36} className="mx-auto mb-3 opacity-30" />
                    <p>No users found</p>
                    <p className="text-sm">
                      Try adjusting your filters or{' '}
                      <button
                        onClick={() => handleAddOrEditUser()}
                        className="text-indigo-500 hover:underline"
                      >
                        add a new {activeTab === 'teachers' ? 'teacher' : 'student'}
                      </button>
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-card p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {selectedUser ? `Edit ${activeTab === 'teachers' ? 'Teacher' : 'Student'}` : `Add New ${activeTab === 'teachers' ? 'Teacher' : 'Student'}`}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-slate-400" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter full name"
                      defaultValue={selectedUser?.name || ''}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={16} className="text-slate-400" />
                    </div>
                    <input
                      type="email"
                      className="w-full pl-10 p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter email address"
                      defaultValue={selectedUser?.email || ''}
                    />
                  </div>
                </div>
              </div>
              
              {activeTab === 'teachers' ? (
                <div>
                  <label className="block text-sm font-medium mb-1">Department</label>
                  <select
                    className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    defaultValue={selectedUser?.department || ''}
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Database Systems">Database Systems</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                  </select>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Branch</label>
                      <select
                        className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        defaultValue={selectedUser?.branch || ''}
                      >
                        <option value="">Select Branch</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Mechanical">Mechanical</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">University</label>
                      <input
                        type="text"
                        className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter university"
                        defaultValue={selectedUser?.university || ''}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Year</label>
                      <select
                        className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        defaultValue={selectedUser?.year || ''}
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
                        defaultValue={selectedUser?.semester || ''}
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
                    <label className="block text-sm font-medium mb-1">Roll Number</label>
                    <input
                      type="text"
                      className="w-full p-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter roll number"
                      defaultValue={selectedUser?.rollNo || ''}
                    />
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      defaultChecked={!selectedUser || selectedUser.status === 'active'}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm">Active</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      defaultChecked={selectedUser?.status === 'inactive'}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm">Inactive</span>
                  </label>
                </div>
              </div>
              
              {!selectedUser && activeTab === 'teachers' && (
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center text-indigo-600 dark:text-indigo-400">
                    <UserCheck size={18} className="mr-2" />
                    Credentials
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    A temporary password will be generated and sent to the teacher's email address.
                  </p>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sendCredentials"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                    />
                    <label htmlFor="sendCredentials" className="ml-2 block text-sm">
                      Send login credentials via email
                    </label>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 glass-button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center"
                >
                  {selectedUser ? (
                    <>
                      <Check size={18} className="mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} className="mr-2" />
                      Add {activeTab === 'teachers' ? 'Teacher' : 'Student'}
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
              Are you sure you want to delete <span className="font-semibold">{userToDelete?.name}</span>? This action cannot be undone.
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

export default ManageUsers;