// API utility for making backend requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Helper function to get auth token from Firebase
const getAuthToken = async () => {
  try {
    const { auth } = await import('../firebase/firebase.init');
    
    // First try to get current user synchronously
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken();
        return token;
      } catch (error) {
        console.error('Error getting token from current user:', error);
      }
    }
    
    // Fallback to onAuthStateChanged if currentUser is null
    const { onAuthStateChanged } = await import('firebase/auth');
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe(); // Unsubscribe after first callback
        if (user) {
          user.getIdToken().then(resolve).catch(() => resolve(null));
        } else {
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = await getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// File upload request (for FormData)
const apiUpload = async (endpoint, formData) => {
  const token = await getAuthToken();
  
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API upload error:', error);
    throw error;
  }
};

// API methods
export const api = {
  // User endpoints
  getUserProfile: () => apiRequest('/users/profile'),
  updateUserProfile: (data) => apiRequest('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  createUserProfile: (data) => apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Project endpoints
  getProjects: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/projects${queryParams ? `?${queryParams}` : ''}`);
  },
  getProjectById: (id) => apiRequest(`/projects/${id}`),
  submitProject: (projectData) => {
    const formData = new FormData();
    Object.keys(projectData).forEach((key) => {
      if (key === 'pdfFile' && projectData[key]) {
        formData.append('pdf', projectData[key]);
      } else if (key !== 'pdfFile') {
        if (Array.isArray(projectData[key])) {
          formData.append(key, JSON.stringify(projectData[key]));
        } else {
          formData.append(key, projectData[key]);
        }
      }
    });
    return apiUpload('/projects', formData);
  },
  updateProjectStatus: (projectId, status) => apiRequest(`/projects/${projectId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  getUserProjects: (userId) => apiRequest(`/projects/user/${userId}`),
  
  // Admin endpoints
  getPendingProjects: () => apiRequest('/admin/projects/pending'),
  getAllProjects: () => apiRequest('/admin/projects'),
};

export default api;

