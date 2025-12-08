import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../utils/api';

const ActivityContext = createContext();

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};

export const ActivityProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [recentProjects, setRecentProjects] = useState([]);
  const [bookmarkedProjects, setBookmarkedProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch recent projects
  const fetchRecentProjects = useCallback(async () => {
    if (!isAuthenticated) {
      setRecentProjects([]);
      return;
    }

    setLoading(true);
    try {
      const data = await api.getRecentProjects();
      setRecentProjects(data.recentProjects || []);
    } catch (error) {
      console.error('Error fetching recent projects:', error);
      setRecentProjects([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch bookmarked projects
  const fetchBookmarkedProjects = useCallback(async () => {
    if (!isAuthenticated) {
      setBookmarkedProjects([]);
      return;
    }

    setLoading(true);
    try {
      const data = await api.getBookmarkedProjects();
      setBookmarkedProjects(data.bookmarkedProjects || []);
    } catch (error) {
      console.error('Error fetching bookmarked projects:', error);
      setBookmarkedProjects([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Add to recent projects (optimistic update)
  const addRecentProject = useCallback((project) => {
    setRecentProjects(prev => {
      const filtered = prev.filter(p => p.projectId !== project._id);
      return [{ projectId: project._id, projectTitle: project.title, project }, ...filtered].slice(0, 10);
    });
  }, []);

  // Toggle bookmark in local state
  const toggleBookmarkLocal = useCallback((projectId, isBookmarked) => {
    if (isBookmarked) {
      // Remove from bookmarks
      setBookmarkedProjects(prev => prev.filter(p => p.projectId !== projectId));
    }
    // Note: When bookmarking, we'll refresh from server on next fetch
  }, []);

  // Load activities on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchRecentProjects();
      fetchBookmarkedProjects();
    } else {
      setRecentProjects([]);
      setBookmarkedProjects([]);
    }
  }, [isAuthenticated, fetchRecentProjects, fetchBookmarkedProjects]);

  const value = {
    recentProjects,
    bookmarkedProjects,
    loading,
    fetchRecentProjects,
    fetchBookmarkedProjects,
    addRecentProject,
    toggleBookmarkLocal,
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
};

