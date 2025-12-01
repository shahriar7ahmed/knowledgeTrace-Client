import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/firebase.init';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  updateProfile
} from 'firebase/auth';

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

  // Fetch user profile from backend (includes admin status)
  const fetchUserProfile = async (uid, email) => {
    try {
      const api = await import('../utils/api');
      const profile = await api.api.getUserProfile();
      
      return {
        uid: profile.uid || uid,
        email: profile.email || email,
        displayName: profile.displayName || profile.name,
        name: profile.name || profile.displayName || email?.split('@')[0] || 'User',
        photoURL: profile.photoURL || null,
        isAdmin: profile.isAdmin || false,
        department: profile.department || '',
        year: profile.year || '',
        skills: profile.skills || [],
        github: profile.github || '',
        linkedin: profile.linkedin || '',
      };
    } catch (error) {
      console.warn('Failed to fetch user profile from backend:', error);
      // Return basic user data if backend call fails
      return {
        uid,
        email,
        displayName: null,
        name: email?.split('@')[0] || 'User',
        photoURL: null,
        isAdmin: false,
      };
    }
  };

  // Monitor Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch full user profile from backend (includes admin status)
        const userData = await fetchUserProfile(firebaseUser.uid, firebaseUser.email);
        
        // Merge with Firebase user data
        userData.displayName = firebaseUser.displayName || userData.displayName;
        userData.photoURL = firebaseUser.photoURL || userData.photoURL;
        
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('knowledgetrace_user', JSON.stringify(userData));
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('knowledgetrace_user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Firebase login function
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Login error:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Login failed. Please check your credentials and try again.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up first.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address. Please check and try again.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      return { success: false, error: errorMessage, code: error.code };
    }
  };

  // Firebase Google OAuth login
  // Using redirect by default to avoid COOP issues
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      // Use redirect method (more reliable, avoids COOP issues)
      await signInWithRedirect(auth, provider);
      // Note: The redirect result will be handled by getRedirectResult
      // This function will return immediately, actual auth happens after redirect
      return { success: true, redirect: true };
    } catch (error) {
      console.error('Google login error:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Google login failed. Please try again.';
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Login was cancelled. Please try again.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked. Please allow popups and try again, or use email/password login.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // Handle redirect result after Google OAuth redirect
  const handleRedirectResult = async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result && result.user) {
        // Create/update user profile in backend
        // Wait a bit for the token to be fully available
        try {
          // Get a fresh token
          const token = await result.user.getIdToken();
          
          const api = await import('../utils/api');
          await api.api.createUserProfile({
            name: result.user.displayName || result.user.email.split('@')[0],
            email: result.user.email,
            photoURL: result.user.photoURL,
          });
        } catch (apiError) {
          console.warn('Failed to sync user profile with backend:', apiError);
          // Don't fail login if backend call fails - user is still authenticated
        }
        return { success: true, user: result.user };
      }
      return { success: false };
    } catch (error) {
      console.error('Redirect result error:', error);
      return { success: false, error: error.message };
    }
  };

  // Firebase signup function
  const signup = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with display name
      if (name && userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name
        });
      }
      
      // Create user profile in backend
      try {
        const api = await import('../utils/api');
        await api.api.createUserProfile({
          name: name || email.split('@')[0],
          email: email,
        });
      } catch (apiError) {
        console.warn('Failed to create user profile in backend:', apiError);
        // Don't fail signup if backend call fails
      }
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Signup error:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Signup failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please sign in instead or use a different email.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use at least 6 characters.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address. Please check and try again.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      return { success: false, error: errorMessage, code: error.code };
    }
  };

  // Firebase createUser function (alias for signup, used by Register component)
  const createUser = async (email, password, name) => {
    return signup(email, password, name);
  };

  // Firebase logout function
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
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
    setLoading,
    login,
    loginWithGoogle,
    handleRedirectResult,
    signup,
    createUser,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

