import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';
import ProjectCard from '../../components/ProjectCard';
import { FaUser, FaFileAlt, FaPlus } from 'react-icons/fa';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { projects } = useProjects();
  const navigate = useNavigate();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Get user's submitted projects
  const userProjects = projects.filter(
    (p) => p.author?.toLowerCase() === user.name?.toLowerCase()
  );

  return (
    <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back, {user.name || 'User'}!
            </h1>
            <p className="text-gray-600">Manage your profile and track your submissions</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <button
              onClick={() => navigate('/profile')}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition flex items-center gap-4"
            >
              <div className="p-3 bg-green-100 rounded-lg">
                <FaUser className="text-green-600 text-2xl" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">Edit Profile</h3>
                <p className="text-sm text-gray-600">Update your information</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/my-work')}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition flex items-center gap-4"
            >
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaPlus className="text-blue-600 text-2xl" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">Submit Work</h3>
                <p className="text-sm text-gray-600">Add a new project</p>
              </div>
            </button>

            <div className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaFileAlt className="text-purple-600 text-2xl" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">My Submissions</h3>
                <p className="text-sm text-gray-600">{userProjects.length} projects</p>
              </div>
            </div>
          </div>

          {/* User's Submitted Works */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">My Submitted Works</h2>
              <button
                onClick={() => navigate('/my-work')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <FaPlus className="inline mr-2" />
                New Submission
              </button>
            </div>

            {userProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FaFileAlt className="text-gray-300 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No submissions yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start sharing your work with the community
                </p>
                <button
                  onClick={() => navigate('/my-work')}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Submit Your First Project
                </button>
              </div>
            )}
          </div>

          {/* Recent Projects from Community */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Community Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 3).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;

