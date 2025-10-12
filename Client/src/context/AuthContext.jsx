import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if token exists in localStorage
        const token = authService.getStoredToken();
        const storedUser = authService.getStoredUser();
        
        if (token && storedUser) {
          // Verify token with backend
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        // Clear invalid auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials, role) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials, role);
      setUser(response.user);
      
      // Redirect based on role
      if (response.user.role === 'student') {
        navigate('/student/dashboard');
      } else if (response.user.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else if (response.user.role === 'admin') {
        navigate('/admin/dashboard');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Login failed. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      return { success: true, data: response };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.message || 'Registration failed. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (formData) => {
    try {
      const response = await authService.updateProfile(formData);
      setUser(response.user);
      return { success: true, data: response };
    } catch (error) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        message: error.message || 'Profile update failed. Please try again.' 
      };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await authService.changePassword(passwordData);
      return { success: true, data: response };
    } catch (error) {
      console.error('Password change error:', error);
      return { 
        success: false, 
        message: error.message || 'Password change failed. Please try again.' 
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      navigate('/auth/login');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      updateProfile,
      changePassword,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};