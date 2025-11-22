import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('knowledgetrace_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('knowledgetrace_user');
      }
    }
    setLoading(false);
  }, []);

  // Placeholder login function (will connect to backend later)
  const login = async (email, password) => {
    try {
      // Placeholder API call
      // const response = await fetch('/api/auth/login', { ... });
      
      // For now, create a mock user
      const mockUser = {
        id: Date.now(),
        email: email || 'user@example.com',
        name: 'John Doe',
        isAdmin: false,
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('knowledgetrace_user', JSON.stringify(mockUser));
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Placeholder Google OAuth login
  const loginWithGoogle = async () => {
    try {
      // Placeholder API call
      // const response = await fetch('/api/auth/google', { ... });
      
      // Mock Google OAuth user
      const mockUser = {
        id: Date.now(),
        email: 'user@gmail.com',
        name: 'Google User',
        isAdmin: false,
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('knowledgetrace_user', JSON.stringify(mockUser));
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Placeholder signup function
  const signup = async (email, password, name) => {
    try {
      // Placeholder API call
      // const response = await fetch('/api/auth/signup', { ... });
      
      const mockUser = {
        id: Date.now(),
        email: email || 'newuser@example.com',
        name: name || 'New User',
        isAdmin: false,
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('knowledgetrace_user', JSON.stringify(mockUser));
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('knowledgetrace_user');
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('knowledgetrace_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    loginWithGoogle,
    signup,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

