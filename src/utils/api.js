// API utility for making backend requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://knowledgetrace-server.onrender.com/api';

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

// Generic API request function with retry logic for rate limiting
const apiRequest = async (endpoint, options = {}, retries = 2) => {
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

    // Handle rate limiting - don't retry, just throw error
    if (response.status === 429) {
      const errorData = await response.json().catch(() => ({}));
      const retryAfter = errorData.retryAfter || 60;
      const error = new Error(errorData.message || 'Too many requests. Please wait a moment and try again.');
      error.retryAfter = retryAfter;
      error.status = 429;
      throw error;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
      const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.code = errorData.code;
      error.details = errorData.error || errorData;
      console.error('API Error Details:', {
        status: response.status,
        code: errorData.code,
        message: errorMessage,
        details: errorData
      });
      throw error;
    }

    return await response.json();
  } catch (error) {
    // Don't log 429 errors as they're expected
    if (error.status !== 429) {
      console.error('API request error:', error);
    }
    throw error;
  }
};

// File upload request (for FormData) with retry logic for rate limiting
const apiUpload = async (endpoint, formData, retries = 2) => {
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

    // Handle rate limiting - don't retry, just throw error
    if (response.status === 429) {
      const errorData = await response.json().catch(() => ({}));
      const retryAfter = errorData.retryAfter || 60;
      const error = new Error(errorData.message || 'Too many requests. Please wait a moment and try again.');
      error.retryAfter = retryAfter;
      error.status = 429;
      throw error;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // Don't log 429 errors as they're expected
    if (error.status !== 429) {
      console.error('API upload error:', error);
    }
    throw error;
  }
};

// API methods
export const api = {
  // User endpoints
  getUserProfile: () => apiRequest('/users/profile'),
  getUserById: (userId) => apiRequest(`/users/${userId}`),
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

  // Engagement endpoints
  toggleLike: (projectId) => apiRequest(`/projects/${projectId}/like`, {
    method: 'POST',
  }),
  toggleBookmark: (projectId) => apiRequest(`/projects/${projectId}/bookmark`, {
    method: 'POST',
  }),
  trackView: (projectId) => apiRequest(`/projects/${projectId}/view`, {
    method: 'POST',
  }),
  deleteProject: (projectId) => apiRequest(`/projects/${projectId}`, {
    method: 'DELETE',
  }),

  // Comment endpoints
  addComment: (projectId, content) => apiRequest(`/projects/${projectId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  }),
  editComment: (projectId, commentId, content) => apiRequest(`/projects/${projectId}/comments/${commentId}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  }),
  deleteComment: (projectId, commentId) => apiRequest(`/projects/${projectId}/comments/${commentId}`, {
    method: 'DELETE',
  }),
  addReply: (projectId, commentId, content) => apiRequest(`/projects/${projectId}/comments/${commentId}/replies`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  }),
  editReply: (projectId, commentId, replyId, content) => apiRequest(`/projects/${projectId}/comments/${commentId}/replies/${replyId}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  }),
  deleteReply: (projectId, commentId, replyId) => apiRequest(`/projects/${projectId}/comments/${commentId}/replies/${replyId}`, {
    method: 'DELETE',
  }),

  // Activity endpoints
  getRecentProjects: () => apiRequest('/activity/recent'),
  getBookmarkedProjects: () => apiRequest('/activity/bookmarks'),

  // Notification endpoints
  getNotifications: (page = 1, limit = 20) => apiRequest(`/notifications?page=${page}&limit=${limit}`),
  markNotificationRead: (notificationId) => apiRequest(`/notifications/${notificationId}/read`, {
    method: 'PUT',
  }),
  markAllNotificationsRead: () => apiRequest('/notifications/read-all', {
    method: 'PUT',
  }),
  getUnreadNotificationCount: () => apiRequest('/notifications/unread-count'),

  // Collaboration endpoints
  getCollabPosts: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/collab${queryParams ? `?${queryParams}` : ''}`);
  },
  getUserCollabPosts: (userId) => apiRequest(`/collab/user/${userId}`),
  createCollabPost: (data) => apiRequest('/collab', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateCollabStatus: (postId, status) => apiRequest(`/collab/${postId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  deleteCollabPost: (postId) => apiRequest(`/collab/${postId}`, {
    method: 'DELETE',
  }),
};

export default api;

