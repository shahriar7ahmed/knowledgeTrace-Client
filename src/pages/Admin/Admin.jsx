import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';
import { useToast } from '../../components/Toast';
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';

const Admin = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { projects, setProjects } = useProjects();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState({});

  // ProtectedRoute handles authentication and admin checks
  // This component only renders if user is authenticated and is admin
  // But we'll keep a safety check just in case
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user?.isAdmin)) {
      // This shouldn't happen due to ProtectedRoute, but safety check
      return;
    }
  }, [isAuthenticated, user, authLoading]);

  // Placeholder API call to approve/reject project
  const handleStatusChange = async (projectId, newStatus) => {
    setLoading({ ...loading, [projectId]: true });

    try {
      // Placeholder API call
      // const response = await fetch(`/api/projects/${projectId}/status`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus }),
      // });
      // const data = await response.json();

      // For now, update local state
      setProjects((prevProjects) =>
        prevProjects.map((p) =>
          p.id === projectId ? { ...p, status: newStatus } : p
        )
      );
    } catch (error) {
      console.error('Error updating project status:', error);
      alert('Error updating project status. Please try again.');
    } finally {
      setLoading({ ...loading, [projectId]: false });
    }
  };

  // ProtectedRoute ensures we only get here if authenticated and admin
  // But add safety check for loading state
  if (authLoading || !isAuthenticated || !user?.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Get pending projects
  const pendingProjects = projects.filter((p) => p.status === 'pending');
  const approvedProjects = projects.filter((p) => p.status === 'approved');
  const rejectedProjects = projects.filter((p) => p.status === 'rejected');

  return (
    <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 mb-8">Review and manage project submissions</p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending</h3>
              <p className="text-3xl font-bold text-yellow-600">{pendingProjects.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Approved</h3>
              <p className="text-3xl font-bold text-green-600">{approvedProjects.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Rejected</h3>
              <p className="text-3xl font-bold text-red-600">{rejectedProjects.length}</p>
            </div>
          </div>

          {/* Pending Projects Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Pending Submissions</h2>
            </div>
            {pendingProjects.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Year
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {project.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {project.abstract?.substring(0, 60)}...
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.author}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.date
                            ? new Date(project.date).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/project/${project.id}`)}
                              className="text-blue-600 hover:text-blue-900 p-2"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => handleStatusChange(project.id, 'approved')}
                              disabled={loading[project.id]}
                              className="text-green-600 hover:text-green-900 p-2 disabled:opacity-50"
                              title="Approve"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => handleStatusChange(project.id, 'rejected')}
                              disabled={loading[project.id]}
                              className="text-red-600 hover:text-red-900 p-2 disabled:opacity-50"
                              title="Reject"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-12 text-center text-gray-500">
                No pending submissions
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default Admin;

