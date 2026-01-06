/* @refresh reset */
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  const profileFetchRef = useRef(null); // Track ongoing profile fetch
  const lastProfileFetchRef = useRef(0); // Track last fetch time

  // Fetch user profile from backend (includes admin status)
  // Added caching and debouncing to prevent rate limiting
  const fetchUserProfile = async (uid, email, forceRefresh = false) => {
    const now = Date.now();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cachedUser = localStorage.getItem('knowledgetrace_user');
      const cachedTimestamp = localStorage.getItem('knowledgetrace_user_timestamp');

      if (cachedUser && cachedTimestamp) {
        const cacheAge = now - parseInt(cachedTimestamp, 10);
        if (cacheAge < CACHE_DURATION) {
          try {
            const parsedUser = JSON.parse(cachedUser);
            // Only use cache if it matches current user
            if (parsedUser.uid === uid || parsedUser.email === email) {
              console.log('Using cached user profile');
              return parsedUser;
            }
          } catch (e) {
            // Invalid cache, continue to fetch
          }
        }
      }
    }

    // Prevent concurrent fetches
    if (profileFetchRef.current) {
      return profileFetchRef.current;
    }

    // Debounce: don't fetch if last fetch was less than 2 seconds ago
    if (!forceRefresh && (now - lastProfileFetchRef.current) < 2000) {
      const cachedUser = localStorage.getItem('knowledgetrace_user');
      if (cachedUser) {
        try {
          return JSON.parse(cachedUser);
        } catch (e) {
          // Continue to fetch
        }
      }
    }

    lastProfileFetchRef.current = now;

    // Create fetch promise
    const fetchPromise = (async () => {
      try {
        const api = await import('../utils/api');
        const profile = await api.api.getUserProfile();

        const userData = {
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

        // Cache the result
        localStorage.setItem('knowledgetrace_user', JSON.stringify(userData));
        localStorage.setItem('knowledgetrace_user_timestamp', now.toString());

        return userData;
      } catch (error) {
        console.warn('Failed to fetch user profile from backend:', error);
        // Return basic user data if backend call fails
        const fallbackUser = {
          uid,
          email,
          displayName: null,
          name: email?.split('@')[0] || 'User',
          photoURL: null,
          isAdmin: false,
        };
        // Cache fallback too (with shorter duration)
        localStorage.setItem('knowledgetrace_user', JSON.stringify(fallbackUser));
        localStorage.setItem('knowledgetrace_user_timestamp', (now - CACHE_DURATION + 60000).toString()); // 1 min cache for fallback
        return fallbackUser;
      } finally {
        profileFetchRef.current = null;
      }
    })();

    profileFetchRef.current = fetchPromise;
    return fetchPromise;
  };

  // Monitor Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if we have cached data first
        const cachedUser = localStorage.getItem('knowledgetrace_user');
        let userData;

        if (cachedUser) {
          try {
            const parsed = JSON.parse(cachedUser);
            // Use cache if it matches current user
            if (parsed.uid === firebaseUser.uid || parsed.email === firebaseUser.email) {
              userData = parsed;
              // Fetch fresh data in background (non-blocking)
              fetchUserProfile(firebaseUser.uid, firebaseUser.email, false).then(freshData => {
                if (freshData.uid === firebaseUser.uid) {
                  const mergedData = {
                    ...freshData,
                    displayName: firebaseUser.displayName || freshData.displayName,
                    photoURL: firebaseUser.photoURL || freshData.photoURL,
                  };
                  setUser(mergedData);
                  localStorage.setItem('knowledgetrace_user', JSON.stringify(mergedData));
                }
              }).catch(() => {
                // Ignore background fetch errors
              });
            } else {
              // Different user, fetch fresh
              userData = await fetchUserProfile(firebaseUser.uid, firebaseUser.email, true);
            }
          } catch (e) {
            // Invalid cache, fetch fresh
            userData = await fetchUserProfile(firebaseUser.uid, firebaseUser.email, false);
          }
        } else {
          // No cache, fetch fresh
          userData = await fetchUserProfile(firebaseUser.uid, firebaseUser.email, false);
        }

        // Merge with Firebase user data
        userData.displayName = firebaseUser.displayName || userData.displayName;
        userData.photoURL = firebaseUser.photoURL || userData.photoURL;

        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('knowledgetrace_user', JSON.stringify(userData));
        localStorage.setItem('knowledgetrace_user_timestamp', Date.now().toString());
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('knowledgetrace_user');
        localStorage.removeItem('knowledgetrace_user_timestamp');
        profileFetchRef.current = null;
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
        prompt: 'select_account',
        hd: 'ugrad.iiuc.ac.bd' // Hosted domain hint for university email
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
        // Validate university email after OAuth
        const { validateUniversityEmail } = await import('../utils/emailValidator');
        const validation = validateUniversityEmail(result.user.email);

        if (!validation.isValid) {
          console.warn(`⚠️ Google OAuth blocked for non-university email: ${result.user.email}`);
          // Sign out the user since they don't have a valid email
          await signOut(auth);
          return {
            success: false,
            error: validation.message,
            code: 'INVALID_EMAIL_DOMAIN'
          };
        }

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
      // Validate university email BEFORE creating Firebase account
      const { validateUniversityEmail } = await import('../utils/emailValidator');
      const validation = validateUniversityEmail(email);

      if (!validation.isValid) {
        console.warn(`⚠️ Signup blocked for non-university email: ${email}`);
        return {
          success: false,
          error: validation.message,
          code: 'INVALID_EMAIL_DOMAIN'
        };
      }

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
    // Update cache timestamp to keep it fresh
    localStorage.setItem('knowledgetrace_user_timestamp', Date.now().toString());
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

