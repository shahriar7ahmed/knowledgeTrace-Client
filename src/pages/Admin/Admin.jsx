import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';
import { useToast } from '../../components/Toast';
import {
  FaCheck,
  FaTimes,
  FaEye,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaChartBar,
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaUser,
  FaFileAlt,
  FaFilePdf,
  FaDownload,
  FaSync
} from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { api } from '../../utils/api';
import SafeHtmlDisplay from '../../components/SafeHtmlDisplay';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Required for fill option in Line charts
);

const Admin = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { setProjects } = useProjects();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState({});
  const [projects, setProjectsLocal] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch all projects for admin (using admin endpoint)
  const fetchAllProjects = async () => {
    setProjectsLoading(true);
    try {
      console.log('🔍 Admin: Fetching all projects from admin endpoint...');
      console.log('👤 Current user:', { uid: user?.uid, email: user?.email, isAdmin: user?.isAdmin });
      const data = await api.getAllProjects();
      console.log('✅ Admin: Received', data.length, 'projects');
      console.log('📊 Projects by status:', {
        pending: data.filter(p => p.status === 'pending').length,
        approved: data.filter(p => p.status === 'approved').length,
        rejected: data.filter(p => p.status === 'rejected').length,
      });
      setProjectsLocal(data);
      // Also update the context for other components
      setProjects(data);
      return data;
    } catch (error) {
      console.error('❌ Admin: Error fetching all projects:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        code: error.code,
        details: error.details
      });

      let errorMessage = 'Failed to load projects';
      if (error.code === 'FORBIDDEN') {
        errorMessage = 'You do not have admin access. Please contact an administrator.';
      } else if (error.code === 'USER_NOT_FOUND') {
        errorMessage = 'User profile not found. Please complete your profile first.';
      } else if (error.code === 'NOT_AUTHENTICATED') {
        errorMessage = 'Please log in to access the admin dashboard.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      showToast(errorMessage, 'error');
      setProjectsLocal([]);
      return [];
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user?.isAdmin)) {
      return;
    }
    // Fetch all projects using admin endpoint
    fetchAllProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated, user?.isAdmin]);

  // Filter projects based on active tab
  const filteredProjects = useMemo(() => {
    console.log('🔍 Filtering projects:', {
      total: projects.length,
      activeTab,
      searchTerm,
      projectsStatuses: projects.map(p => ({ id: p._id || p.id, status: p.status, title: p.title?.substring(0, 30) }))
    });

    let filtered = projects;

    // Filter by status
    if (activeTab !== 'all') {
      const beforeCount = filtered.length;
      filtered = filtered.filter(p => {
        const matches = p.status === activeTab;
        if (!matches && p.status) {
          console.log(`❌ Project ${p._id || p.id} status "${p.status}" doesn't match "${activeTab}"`);
        }
        return matches;
      });
      console.log(`📊 Status filter "${activeTab}": ${beforeCount} → ${filtered.length} projects`);
    }

    // Filter by search term
    if (searchTerm) {
      const beforeCount = filtered.length;
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(term) ||
        p.author?.toLowerCase().includes(term) ||
        p.abstract?.toLowerCase().includes(term) ||
        (Array.isArray(p.techStack) && p.techStack.some(tech => String(tech).toLowerCase().includes(term)))
      );
      console.log(`🔎 Search filter "${searchTerm}": ${beforeCount} → ${filtered.length} projects`);
    }

    const sorted = filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0);
      const dateB = new Date(b.createdAt || b.date || 0);
      return dateB - dateA;
    });

    console.log(`✅ Final filtered projects: ${sorted.length}`);
    return sorted;
  }, [projects, activeTab, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    console.log('📊 Calculating stats from', projects.length, 'projects');
    const pending = projects.filter(p => p.status === 'pending').length;
    const approved = projects.filter(p => p.status === 'approved').length;
    const rejected = projects.filter(p => p.status === 'rejected').length;
    const total = projects.length;

    console.log('📈 Stats calculated:', { pending, approved, rejected, total });

    // Projects by month (last 6 months)
    const monthlyData = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData[key] = 0;
    }

    projects.forEach(project => {
      const date = new Date(project.createdAt || project.date || Date.now());
      const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (monthlyData.hasOwnProperty(key)) {
        monthlyData[key]++;
      }
    });

    // Tech stack distribution (top 10)
    const techStackCount = {};
    projects.forEach(project => {
      if (project.techStack && Array.isArray(project.techStack)) {
        project.techStack.forEach(tech => {
          techStackCount[tech] = (techStackCount[tech] || 0) + 1;
        });
      }
    });
    const topTechStacks = Object.entries(techStackCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    return {
      pending,
      approved,
      rejected,
      total,
      monthlyData,
      topTechStacks,
    };
  }, [projects]);

  // Handle status change
  const handleStatusChange = async (projectId, newStatus) => {
    if (!projectId) {
      console.error('Project ID is missing');
      showToast('Error: Project ID is missing', 'error');
      return;
    }

    setLoading(prev => ({ ...prev, [projectId]: true }));

    try {
      console.log('Updating project status:', { projectId, newStatus });
      const result = await api.updateProjectStatus(projectId, newStatus);

      console.log('Status update result:', result);

      if (result) {
        showToast(
          `Project ${newStatus === 'approved' ? 'approved' : newStatus === 'rejected' ? 'rejected' : 'updated'} successfully!`,
          'success'
        );
        // Refresh projects using admin endpoint
        await fetchAllProjects();
      } else {
        showToast('Failed to update project status', 'error');
      }
    } catch (error) {
      console.error('Error updating project status:', error);
      showToast(
        error.message || 'Error updating project status. Please try again.',
        'error'
      );
    } finally {
      setLoading(prev => ({ ...prev, [projectId]: false }));
    }
  };

  // Chart data
  const statusChartData = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [
      {
        label: 'Projects',
        data: [stats.pending, stats.approved, stats.rejected],
        backgroundColor: [
          'rgba(234, 179, 8, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(234, 179, 8, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const monthlyChartData = {
    labels: Object.keys(stats.monthlyData),
    datasets: [
      {
        label: 'Projects Submitted',
        data: Object.values(stats.monthlyData),
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const techStackChartData = {
    labels: stats.topTechStacks.map(t => t.name),
    datasets: [
      {
        label: 'Usage Count',
        data: stats.topTechStacks.map(t => t.count),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(34, 197, 94, 0.6)',
          'rgba(59, 130, 246, 0.6)',
          'rgba(168, 85, 247, 0.6)',
          'rgba(236, 72, 153, 0.6)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
      },
    },
  };

  if (authLoading || !isAuthenticated || !user?.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'pending', label: 'Pending', count: stats.pending, icon: FaClock, color: 'yellow' },
    { id: 'approved', label: 'Approved', count: stats.approved, icon: FaCheckCircle, color: 'green' },
    { id: 'rejected', label: 'Rejected', count: stats.rejected, icon: FaTimesCircle, color: 'red' },
    { id: 'all', label: 'All Projects', count: stats.total, icon: FaFileAlt, color: 'blue' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-emerald-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Admin <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Dashboard</span>
              </h1>
              <p className="text-gray-600">Manage and monitor all project submissions</p>
            </div>
            <button
              onClick={() => fetchAllProjects()}
              disabled={projectsLoading}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-gray-700 hover:text-green-600 disabled:opacity-50"
            >
              <FaSync className={projectsLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <FaClock className="text-2xl text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                <p className="text-xs text-gray-500 mt-1">Live projects</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <FaCheckCircle className="text-2xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                <p className="text-xs text-gray-500 mt-1">Not approved</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <FaTimesCircle className="text-2xl text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Projects</p>
                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                <p className="text-xs text-gray-500 mt-1">All submissions</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <FaFileAlt className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Status Distribution Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaChartBar className="text-green-600" />
                Status Distribution
              </h3>
            </div>
            <div className="h-64">
              <Doughnut data={statusChartData} options={chartOptions} />
            </div>
          </div>

          {/* Monthly Submissions Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaCalendarAlt className="text-green-600" />
                Monthly Submissions
              </h3>
            </div>
            <div className="h-64">
              <Line data={monthlyChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Tech Stack Chart */}
        {stats.topTechStacks.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaChartBar className="text-green-600" />
              Top Tech Stacks
            </h3>
            <div className="h-64">
              <Bar data={techStackChartData} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Tabs and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const activeColors = {
                  yellow: 'bg-yellow-500 text-white shadow-md',
                  green: 'bg-green-500 text-white shadow-md',
                  red: 'bg-red-500 text-white shadow-md',
                  blue: 'bg-blue-500 text-white shadow-md',
                };
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      console.log('🔄 Tab clicked:', tab.id);
                      setActiveTab(tab.id);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${isActive
                      ? activeColors[tab.color] || 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    <Icon />
                    <span>{tab.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-white/20' : 'bg-gray-200'
                      }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Projects Table */}
          {projectsLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-600">Loading projects...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
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
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProjects.map((project) => {
                    const projectId = project._id || project.id;
                    const statusColors = {
                      pending: 'bg-yellow-100 text-yellow-800',
                      approved: 'bg-green-100 text-green-800',
                      rejected: 'bg-red-100 text-red-800',
                    };

                    return (
                      <tr key={projectId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs">
                            {project.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs mt-1">
                            {project.abstract?.substring(0, 80)}...
                          </div>
                          {project.techStack && project.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {project.techStack.slice(0, 3).map((tech, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full"
                                >
                                  {tech}
                                </span>
                              ))}
                              {project.techStack.length > 3 && (
                                <span className="px-2 py-0.5 text-xs text-gray-500">
                                  +{project.techStack.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FaUser className="text-gray-400" />
                            <span className="text-sm text-gray-900">{project.author || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.year || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.createdAt || project.date
                            ? new Date(project.createdAt || project.date).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[project.status] || 'bg-gray-100 text-gray-800'
                              }`}
                          >
                            {project.status?.charAt(0).toUpperCase() + project.status?.slice(1) || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedProject(project);
                                setShowModal(true);
                              }}
                              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            {project.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(projectId, 'approved')}
                                  disabled={loading[projectId]}
                                  className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Approve"
                                >
                                  <FaCheck />
                                </button>
                                <button
                                  onClick={() => handleStatusChange(projectId, 'rejected')}
                                  disabled={loading[projectId]}
                                  className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Reject"
                                >
                                  <FaTimes />
                                </button>
                              </>
                            )}
                            {(project.status === 'approved' || project.status === 'rejected') && (
                              <button
                                onClick={() => handleStatusChange(projectId, 'pending')}
                                disabled={loading[projectId]}
                                className="p-2 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Reset to Pending"
                              >
                                <FaClock />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaFileAlt className="text-4xl text-gray-400" />
              </div>
              <p className="text-xl font-bold text-gray-900 mb-2">No projects found</p>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? `No projects match "${searchTerm}"`
                  : activeTab !== 'all'
                    ? `No ${activeTab} projects found`
                    : 'No projects in database'}
              </p>
              {projects.length === 0 && (
                <p className="text-sm text-gray-500">
                  Total projects loaded: {projects.length}
                </p>
              )}
              {projects.length > 0 && filteredProjects.length === 0 && (
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Total projects: {projects.length}</p>
                  <p>Active filter: {activeTab}</p>
                  <p>Projects by status: Pending({projects.filter(p => p.status === 'pending').length}),
                    Approved({projects.filter(p => p.status === 'approved').length}),
                    Rejected({projects.filter(p => p.status === 'rejected').length})</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Project Details Modal */}
      {showModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedProject(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Author</p>
                  <p className="font-medium">{selectedProject.author || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Year</p>
                  <p className="font-medium">{selectedProject.year || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Supervisor</p>
                  <p className="font-medium">{selectedProject.supervisor || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${{
                      pending: 'bg-yellow-100 text-yellow-800',
                      approved: 'bg-green-100 text-green-800',
                      rejected: 'bg-red-100 text-red-800',
                    }[selectedProject.status] || 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {selectedProject.status?.charAt(0).toUpperCase() + selectedProject.status?.slice(1)}
                  </span>
                </div>
              </div>

              {selectedProject.techStack && selectedProject.techStack.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Abstract</p>
                <SafeHtmlDisplay
                  htmlContent={selectedProject.abstract || 'No abstract provided'}
                  className="text-gray-700 leading-relaxed"
                />
              </div>

              <div className="flex gap-3">
                {selectedProject.githubLink && (
                  <a
                    href={selectedProject.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors"
                  >
                    <FaDownload />
                    View GitHub
                  </a>
                )}
                {selectedProject.pdfUrl && (
                  <a
                    href={selectedProject.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                    title="View PDF in new tab"
                  >
                    <FaFilePdf />
                    View PDF
                  </a>
                )}
                <button
                  onClick={() => navigate(`/project/${selectedProject._id || selectedProject.id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  <FaEye />
                  View Full Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
