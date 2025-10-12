import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Public Pages
import LandingPage from '../pages/LandingPage';

// Auth Pages
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

// Student Pages
import StudentDashboard from '../pages/Student/Dashboard';
import Notes from '../pages/Student/Notes';
import Syllabus from '../pages/Student/Syllabus';
import Videos from '../pages/Student/Videos';
import PYQs from '../pages/Student/PYQs';
import Community from '../pages/Student/Community';
import PreviewPage from '../pages/Student/PreviewPage';
import StudentProfile from '../pages/Student/StudentProfile';

// Teacher Pages
import TeacherDashboard from '../pages/Teacher/Dashboard';
import TeacherCommunity from '../pages/Teacher/Community';
import TeacherUpload from '../pages/Teacher/Upload';
import TeacherProfile from '../pages/Teacher/TeacherProfile';

// Admin Pages
import AdminDashboard from '../pages/Admin/Dashboard';
import ManageNotes from '../pages/Admin/ManageNotes';
import ManageUsers from '../pages/Admin/ManageUsers';
import Announcements from '../pages/Admin/Announcements';
import ManageCommunity from '../pages/Admin/ManageCommunity';

// Common Pages
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'student') {
      return <Navigate to="/student/dashboard" replace />;
    } else if (user.role === 'teacher') {
      return <Navigate to="/teacher/dashboard" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/auth/login" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/landing" element={<LandingPage />} />
      
      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      
      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute allowedRoles={['student']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="notes" element={<Notes />} />
        <Route path="syllabus" element={<Syllabus />} />
        <Route path="videos" element={<Videos />} />
        <Route path="pyqs" element={<PYQs />} />
        <Route path="community" element={<Community />} />
        <Route path="preview" element={<PreviewPage />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      {/* Teacher Routes */}
      <Route path="/teacher" element={
        <ProtectedRoute allowedRoles={['teacher']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="community" element={<TeacherCommunity />} />
        <Route path="upload" element={<TeacherUpload />} />
        <Route path="profile" element={<TeacherProfile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="manage-notes" element={<ManageNotes />} />
        <Route path="manage-users" element={<ManageUsers />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="manage-community" element={<ManageCommunity />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      {/* Home Route - Show landing page for unauthenticated users, redirect authenticated users to their dashboard */}
      <Route path="/" element={
        user ? (
          user.role === 'student' ? (
            <Navigate to="/student/dashboard" replace />
          ) : user.role === 'teacher' ? (
            <Navigate to="/teacher/dashboard" replace />
          ) : (
            <Navigate to="/admin/dashboard" replace />
          )
        ) : (
          <LandingPage />
        )
      } />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;