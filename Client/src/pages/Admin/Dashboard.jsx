import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, FileText, Video, Book, BarChart, TrendingUp, ArrowUp, ArrowDown, Download, Eye } from 'lucide-react';
import { adminService } from '../../services/adminService';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await adminService.getAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="pb-8"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Overview of platform statistics and user activity
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : analytics ? (
        <>
          {/* Stats Overview */}
          <motion.section variants={itemVariants} className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card p-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-4">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total Students</p>
                    <div className="flex items-center">
                      <h3 className="text-2xl font-semibold">{analytics.totalStudents}</h3>
                      <span className="ml-2 text-xs flex items-center text-green-500">
                        <ArrowUp size={12} className="mr-0.5" />
                        {analytics.newUsersToday}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mr-4">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total Teachers</p>
                    <h3 className="text-2xl font-semibold">{analytics.totalTeachers}</h3>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center mr-4">
                    <FileText size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total Resources</p>
                    <h3 className="text-2xl font-semibold">{analytics.totalResources}</h3>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mr-4">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Downloads</p>
                    <h3 className="text-2xl font-semibold">{analytics.resourcesDownloaded}</h3>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Growth Chart */}
            <motion.section variants={itemVariants} className="lg:col-span-2">
              <div className="glass-card p-6 rounded-xl h-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <BarChart size={20} className="mr-2" /> User Growth
                  </h2>
                </div>
                
                <div className="h-64">
                  <div className="relative h-full">
                    {/* Y axis */}
                    <div className="absolute left-0 h-full w-12 flex flex-col justify-between text-xs text-slate-500 dark:text-slate-400 py-2">
                      <span>500</span>
                      <span>400</span>
                      <span>300</span>
                      <span>200</span>
                      <span>100</span>
                      <span>0</span>
                    </div>
                    
                    {/* Chart */}
                    <div className="ml-12 h-full flex items-end">
                      <div className="flex-1 h-full flex justify-around items-end">
                        {analytics.userGrowth?.map((data, index) => (
                          <div key={index} className="flex flex-col items-center w-full">
                            <div className="relative w-full flex justify-center">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(data.students / 500) * 100}%` }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="w-6 bg-indigo-500 rounded-t-sm"
                              />
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(data.teachers / 500) * 100}%` }}
                                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                                className="w-6 bg-purple-500 rounded-t-sm ml-1"
                              />
                            </div>
                            <span className="mt-2 text-xs text-slate-500 dark:text-slate-400">{data.month}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="absolute bottom-0 right-0 flex items-center space-x-4 text-xs">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-indigo-500 mr-1"></div>
                        <span>Students</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-500 mr-1"></div>
                        <span>Teachers</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
            
            {/* Resources Distribution */}
            <motion.section variants={itemVariants}>
              <div className="glass-card p-6 rounded-xl h-full">
                <h2 className="text-xl font-semibold mb-6">Resource Distribution</h2>
                
                <div className="space-y-6">
                  {analytics.resourceDistribution?.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.type}</span>
                        <span className="font-medium">{item.count}</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.count / analytics.totalResources) * 100}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className={`h-full rounded-full ${
                            index === 0 ? 'bg-indigo-500' : 
                            index === 1 ? 'bg-teal-500' :
                            index === 2 ? 'bg-purple-500' : 
                            'bg-amber-500'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">Popular Resources</h2>
                <div className="space-y-3">
                  {analytics.popularResources?.map((resource, index) => (
                    <div key={index} className="glass p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                            resource.type === 'Notes' ? 'bg-indigo-500' : 
                            resource.type === 'PYQ' ? 'bg-amber-500' : 
                            'bg-purple-500'
                          }`}>
                            {resource.type === 'Notes' ? <FileText size={16} /> : 
                             resource.type === 'PYQ' ? <Book size={16} /> : 
                             <Video size={16} />}
                          </span>
                          <div className="ml-3">
                            <p className="text-sm font-medium line-clamp-1">{resource.title}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{resource.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-xs">
                          {resource.downloads ? (
                            <div className="flex items-center text-slate-500 dark:text-slate-400">
                              <Download size={14} className="mr-1" />
                              <span>{resource.downloads}</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-slate-500 dark:text-slate-400">
                              <Eye size={14} className="mr-1" />
                              <span>{resource.views}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          </div>
          
          {/* Active Users and Recent Activity */}
          <motion.section variants={itemVariants} className="mt-8">
            <div className="glass-card p-6 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Active Users</h2>
                <span className="text-sm text-indigo-600 dark:text-indigo-400">{analytics.activeUsers} online now</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last Activity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs mr-3">JD</div>
                          <span className="font-medium">John Doe</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Student</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Computer Science</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">2 min ago</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">Active</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs mr-3">EJ</div>
                          <span className="font-medium">Emma Johnson</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Student</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Computer Science</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">5 min ago</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">Active</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs mr-3">JT</div>
                          <span className="font-medium">Jane Teacher</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Teacher</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Computer Science</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Just now</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">Active</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs mr-3">AC</div>
                          <span className="font-medium">Alex Chen</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Student</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Electronics</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">15 min ago</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">Idle</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs mr-3">RW</div>
                          <span className="font-medium">Robert Wilson</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Teacher</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Database Systems</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">20 min ago</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">Idle</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>
        </>
      ) : (
        <div className="text-center py-10 glass-card">
          <h3 className="text-xl font-semibold mb-2">Error Loading Data</h3>
          <p className="text-slate-500 dark:text-slate-400">
            Unable to load analytics data. Please try again later.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;