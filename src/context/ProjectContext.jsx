/* @refresh reset */
import React, { createContext, useContext, useState, useEffect } from 'react';

const ProjectContext = createContext();

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  // Projects state - Initialize with empty array, fetch from API only
  const [projects, setProjects] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects({});
  }, []);

  // Fetch projects from API
  const fetchProjects = async (filters = {}) => {
    setLoading(true);
    try {
      const api = await import('../utils/api');
      const data = await api.api.getProjects(filters);

      setProjects(data);
      setSearchResults(data);
      return data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Set empty arrays if API fails to prevent showing stale data
      setProjects([]);
      setSearchResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Submit a project to API
  const submitProject = async (projectData) => {
    try {
      const api = await import('../utils/api');
      const result = await api.api.submitProject(projectData);

      if (result.project) {
        // Refresh projects list
        await fetchProjects({});
      }

      return { success: true, project: result.project };
    } catch (error) {
      console.error('Error submitting project:', error);

      // Extract detailed error message
      let errorMessage = 'Failed to submit project';

      if (error.message) {
        errorMessage = error.message;
      } else if (error.details?.message) {
        errorMessage = error.details.message;
      } else if (error.details?.errors) {
        // Handle validation errors
        const validationErrors = error.details.errors
          .map(err => err.message)
          .join(', ');
        errorMessage = validationErrors;
      }

      return { success: false, error: errorMessage };
    }
  };

  // Get project by ID from API
  const getProjectById = async (id) => {
    try {
      const api = await import('../utils/api');
      const project = await api.api.getProjectById(id);
      return project || null;
    } catch (error) {
      console.error('Error fetching project:', error);
      // Return null if API fails - don't fallback to potentially stale local data
      return null;
    }
  };

  const value = {
    projects,
    searchResults,
    loading,
    fetchProjects,
    submitProject,
    getProjectById,
    setProjects,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

