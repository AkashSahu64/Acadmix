import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, User, BookOpen, School, AlertCircle, Check } from 'lucide-react';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNo: '',
    university: '',
    branch: '',
    year: '',
    semester: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.rollNo) newErrors.rollNo = 'Roll number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.university) newErrors.university = 'University is required';
    if (!formData.branch) newErrors.branch = 'Branch is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.semester) newErrors.semester = 'Semester is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateStep3()) {
      try {
        const { confirmPassword, ...cleanedData } = formData;
        const result = await register({ ...cleanedData, role: 'student' });

        if (result.success) {
          setIsSuccess(true);
          // Redirect to login after 2 seconds
          setTimeout(() => {
            navigate('/auth/login');
          }, 2000);
        } else {
          setErrors({ form: result.message });
        }
      } catch (err) {
        setErrors({ form: 'Registration failed. Please try again.' });
      }
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

  // Different form steps
  const renderStep1 = () => (
    <>
      <motion.div variants={itemVariants} className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Create Account</h1>
        <p className="text-slate-500 dark:text-slate-400">Step 1: Personal Information</p>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
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
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full pl-10 py-2 glass rounded-lg focus:ring-2 focus:outline-none ${
                errors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500'
              }`}
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
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
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full pl-10 py-2 glass rounded-lg focus:ring-2 focus:outline-none ${
                errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500'
              }`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Roll Number</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BookOpen size={16} className="text-slate-400" />
            </div>
            <input
              type="text"
              name="rollNo"
              value={formData.rollNo}
              onChange={handleChange}
              placeholder="CS123"
              className={`w-full pl-10 py-2 glass rounded-lg focus:ring-2 focus:outline-none ${
                errors.rollNo ? 'border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500'
              }`}
            />
          </div>
          {errors.rollNo && <p className="text-red-500 text-xs mt-1">{errors.rollNo}</p>}
        </div>

        <motion.button
          variants={itemVariants}
          type="button"
          onClick={nextStep}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors duration-300"
        >
          Continue
        </motion.button>
      </motion.div>
    </>
  );

  const renderStep2 = () => (
    <>
      <motion.div variants={itemVariants} className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Academic Information</h1>
        <p className="text-slate-500 dark:text-slate-400">Step 2: University & Course Details</p>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">University/College</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <School size={16} className="text-slate-400" />
            </div>
            <input
              type="text"
              name="university"
              value={formData.university}
              onChange={handleChange}
              placeholder="Example University"
              className={`w-full pl-10 py-2 glass rounded-lg focus:ring-2 focus:outline-none ${
                errors.university ? 'border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500'
              }`}
            />
          </div>
          {errors.university && <p className="text-red-500 text-xs mt-1">{errors.university}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Branch/Department</label>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className={`w-full py-2 glass rounded-lg focus:ring-2 focus:outline-none ${
              errors.branch ? 'border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500'
            }`}
          >
            <option value="">Select Branch</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electrical">Electrical Engineering</option>
            <option value="Mechanical">Mechanical Engineering</option>
            <option value="Civil">Civil Engineering</option>
            <option value="Electronics">Electronics Engineering</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Economics">Economics</option>
          </select>
          {errors.branch && <p className="text-red-500 text-xs mt-1">{errors.branch}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Year</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={`w-full py-2 glass rounded-lg focus:ring-2 focus:outline-none ${
                errors.year ? 'border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500'
              }`}
            >
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
            {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Semester</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className={`w-full py-2 glass rounded-lg focus:ring-2 focus:outline-none ${
                errors.semester ? 'border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500'
              }`}
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
            {errors.semester && <p className="text-red-500 text-xs mt-1">{errors.semester}</p>}
          </div>
        </div>

        <div className="flex space-x-4">
          <motion.button
            variants={itemVariants}
            type="button"
            onClick={prevStep}
            className="w-1/2 py-3 border border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 rounded-lg font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-300"
          >
            Back
          </motion.button>
          
          <motion.button
            variants={itemVariants}
            type="button"
            onClick={nextStep}
            className="w-1/2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors duration-300"
          >
            Continue
          </motion.button>
        </div>
      </motion.div>
    </>
  );

  const renderStep3 = () => (
    <>
      <motion.div variants={itemVariants} className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Set Password</h1>
        <p className="text-slate-500 dark:text-slate-400">Step 3: Secure Your Account</p>
      </motion.div>

      {errors.form && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center"
        >
          <AlertCircle size={16} className="mr-2 flex-shrink-0" />
          <span>{errors.form}</span>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={16} className="text-slate-400" />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full pl-10 py-2 glass rounded-lg focus:ring-2 focus:outline-none ${
                errors.password ? 'border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500'
              }`}
            />
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={16} className="text-slate-400" />
            </div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full pl-10 py-2 glass rounded-lg focus:ring-2 focus:outline-none ${
                errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500'
              }`}
            />
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>

        <div className="flex space-x-4">
          <motion.button
            variants={itemVariants}
            type="button"
            onClick={prevStep}
            className="w-1/2 py-3 border border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 rounded-lg font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-300"
          >
            Back
          </motion.button>
          
          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={loading}
            className="w-1/2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Registering...
              </div>
            ) : (
              'Create Account'
            )}
          </motion.button>
        </div>
      </motion.div>
    </>
  );

  const renderSuccess = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
        <Check size={32} className="text-green-600 dark:text-green-400" />
      </div>
      <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-2">Registration Successful!</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6">
        Your account has been created. Redirecting you to login...
      </p>
      <div className="w-12 h-1 bg-green-200 dark:bg-green-800 mx-auto rounded-full">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2 }}
          className="h-full bg-green-600 dark:bg-green-400 rounded-full"
        />
      </div>
    </motion.div>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="glass-card p-8 rounded-xl"
    >
      {isSuccess ? (
        renderSuccess()
      ) : (
        <form onSubmit={handleSubmit}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          
          <motion.div variants={itemVariants} className="text-center mt-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Already have an account? 
              <Link to="/auth/login" className="ml-1 text-indigo-600 dark:text-indigo-400 hover:underline">
                Sign in
              </Link>
            </p>
          </motion.div>
        </form>
      )}
    </motion.div>
  );
};

export default Register;