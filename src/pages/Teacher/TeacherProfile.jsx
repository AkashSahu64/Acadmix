import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, BookOpen, FileText, Camera, Check, Briefcase } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const TeacherProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Jane Teacher',
    email: user?.email || 'teacher@example.com',
    phone: '123-456-7890',
    department: user?.department || 'Computer Science',
    designation: 'Assistant Professor',
    specialization: 'Machine Learning',
    experience: '5 years',
    bio: 'Experienced educator specializing in Computer Science with a focus on Machine Learning and Data Structures.',
    profileImage: 'https://source.unsplash.com/random/200x200/?professor'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would call an API to update the user profile
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-8"
    >
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage your professional information and preferences
        </p>
      </div>

      <div className="glass-card p-6 rounded-xl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={formData.profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors">
                  <Camera size={16} />
                </button>
              )}
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-10 p-3 glass rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none disabled:opacity-50"
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
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-10 p-3 glass rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={16} className="text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-10 p-3 glass rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BookOpen size={16} className="text-slate-400" />
                  </div>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-10 p-3 glass rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none disabled:opacity-50"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electrical">Electrical Engineering</option>
                    <option value="Mechanical">Mechanical Engineering</option>
                    <option value="Civil">Civil Engineering</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Designation</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase size={16} className="text-slate-400" />
                  </div>
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-10 p-3 glass rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none disabled:opacity-50"
                  >
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Professor">Professor</option>
                    <option value="Head of Department">Head of Department</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-3 glass rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-3 glass rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <div className="relative">
                <div className="absolute top-3 left-3">
                  <FileText size={16} className="text-slate-400" />
                </div>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full pl-10 p-3 glass rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none disabled:opacity-50 resize-none"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 glass-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors flex items-center"
                >
                  <Check size={18} className="mr-2" />
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default TeacherProfile;