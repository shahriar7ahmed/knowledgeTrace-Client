import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';
import { useActivity } from '../../context/ActivityContext';
import { useToast } from '../../components/Toast';
import ProjectCard from '../../components/ProjectCard';
import { FaUser, FaFileAlt, FaPlus, FaBookmark, FaHistory, FaArrowRight } from 'react-icons/fa';

const Dashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { projects, loading: projectsLoading } = useProjects();
  const { recentProjects, bookmarkedProjects, fetchRecentProjects, fetchBookmarkedProjects } = useActivity();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Check for auth errors from sessionStorage (e.g., from ProtectedRoute)
  useEffect(() => {
    const authError = sessionStorage.getItem('authError');
    if (authError) {
      showToast(authError, 'error');
      sessionStorage.removeItem('authError');
    }
  }, [showToast]);

  // Redirect supervisors to their own dashboard
  useEffect(() => {
    if (user && user.role === 'supervisor') {
      navigate('/supervisor/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Show loading state
  if (authLoading || !isAuthenticated || !user) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Get user's submitted projects
  const userProjects = projects.filter(
    (p) => p.authorId === user.uid || p.author?.toLowerCase() === (user.name || user.displayName)?.toLowerCase()
  );

  // Get approved projects for community section
  const approvedProjects = projects.filter(p => p.status === 'approved');

  // Get full project data for recent and bookmarked
  const getFullProject = (projectId) => {
    return projects.find(p => (p._id || p.id) === projectId);
  };

  const recentProjectsWithData = recentProjects
    .map(rp => {
      const fullProject = getFullProject(rp.projectId);
      return fullProject ? { ...fullProject, viewedAt: rp.viewedAt } : null;
    })
    .filter(Boolean);

  const bookmarkedProjectsWithData = bookmarkedProjects
    .map(bp => {
      const fullProject = getFullProject(bp.projectId);
      return fullProject ? { ...fullProject, bookmarkedAt: bp.bookmarkedAt } : null;
    })
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">👋</span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Welcome back, <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{user.name || 'User'}</span>!
              </h1>
              <p className="text-gray-600 mt-1">Manage your profile and track your submissions</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <button
            onClick={() => navigate('/profile')}
            className="group bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 flex items-center gap-4 border border-gray-100 hover:border-green-200 hover:-translate-y-1"
          >
            <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <FaUser className="text-green-600 text-2xl" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900 text-lg">Edit Profile</h3>
              <p className="text-sm text-gray-600">Update your information</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/my-work')}
            className="group bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 flex items-center gap-4 border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
          >
            <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <FaPlus className="text-blue-600 text-2xl" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900 text-lg">Submit Work</h3>
              <p className="text-sm text-gray-600">Add a new project</p>
            </div>
          </button>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-md p-6 flex items-center gap-4 border border-purple-100">
            <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
              <FaFileAlt className="text-purple-600 text-2xl" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900 text-lg">My Submissions</h3>
              <p className="text-sm text-gray-600">
                <span className="text-2xl font-bold text-purple-600">{userProjects.length}</span> projects
              </p>
            </div>
          </div>
        </div>

        {/* User's Submitted Works */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">My Submitted Works</h2>
              <p className="text-gray-600 mt-1">View and manage your project submissions</p>
            </div>
            <button
              onClick={() => navigate('/my-work')}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold flex items-center gap-2"
            >
              <FaPlus />
              New Submission
            </button>
          </div>

          {projectsLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-600">Loading your projects...</p>
            </div>
          ) : userProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProjects.map((project) => (
                <ProjectCard key={project._id || project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaFileAlt className="text-gray-400 text-4xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No submissions yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start sharing your work with the community
              </p>
              <button
                onClick={() => navigate('/my-work')}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
              >
                Submit Your First Project
              </button>
            </div>
          )}
        </div>

        {/* Recently Viewed Projects */}
        {recentProjectsWithData.length > 0 && (
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
                  <FaHistory className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Recently Viewed</h2>
                  <p className="text-gray-600 mt-1">Papers you've viewed recently</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProjectsWithData.slice(0, 6).map((project) => (
                <ProjectCard key={project._id || project.id} project={project} />
              ))}
            </div>
            {recentProjectsWithData.length > 6 && (
              <div className="text-center mt-6">
                <Link
                  to="/thesis-finder"
                  className="inline-flex items-center gap-2 px-6 py-3 text-green-600 hover:text-green-700 font-semibold"
                >
                  View All Recent <FaArrowRight />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Bookmarked Projects */}
        {bookmarkedProjectsWithData.length > 0 && (
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl">
                  <FaBookmark className="text-yellow-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Bookmarked Papers</h2>
                  <p className="text-gray-600 mt-1">Your saved research papers</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedProjectsWithData.map((project) => (
                <ProjectCard key={project._id || project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* Recent Projects from Community */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Recent Community Projects</h2>
            <p className="text-gray-600">Discover what others are working on</p>
          </div>
          {projectsLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-600">Loading projects...</p>
            </div>
          ) : approvedProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedProjects.slice(0, 3).map((project) => (
                <ProjectCard key={project._id || project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-100">
              <p className="text-gray-600">No community projects available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

