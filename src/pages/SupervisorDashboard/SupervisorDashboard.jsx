import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import {
    FaProjectDiagram, FaUsers, FaCheckCircle, FaClock,
    FaChartBar, FaGraduationCap, FaEye, FaCalendar
} from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';
import ProjectCard from '../../components/ProjectCard';

const SupervisorDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [students, setStudents] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedTab, setSelectedTab] = useState('overview'); // overview, students, projects

    useEffect(() => {
        if (!user || user.role !== 'supervisor') {
            navigate('/dashboard');
            return;
        }
        fetchDashboardData();
    }, [user]);

    const fetchDashboardData = async () => {
        if (!user?.uid) return;

        try {
            setLoading(true);

            // Fetch supervisor statistics
            const statsResponse = await api.get(`/supervisors/${user.uid}/stats`);
            setStats(statsResponse.stats);

            // Fetch supervised students
            const studentsResponse = await api.get(`/supervisors/${user.uid}/students`);
            setStudents(studentsResponse.students || []);

            // Fetch supervised projects
            const projectsResponse = await api.get(`/supervisors/${user.uid}/projects?limit=50`);
            setProjects(projectsResponse.projects || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 pt-24 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 pt-24 px-4">
                <div className="max-w-4xl mx-auto text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">No Data Available</h2>
                    <p className="text-gray-600">Unable to load supervisor dashboard data.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                            <FaGraduationCap className="text-white text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Supervisor Dashboard</h1>
                            <p className="text-gray-600">Welcome back, {user?.name}</p>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FaUsers className="text-2xl text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Students</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalStudents || 0}</p>
                        <p className="text-sm text-gray-600 mt-1">Total supervised</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <FaProjectDiagram className="text-2xl text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Projects</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalProjects || 0}</p>
                        <p className="text-sm text-gray-600 mt-1">All time</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <FaClock className="text-2xl text-yellow-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Active</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{stats.activeProjects || 0}</p>
                        <p className="text-sm text-gray-600 mt-1">In progress</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <FaCheckCircle className="text-2xl text-purple-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Completed</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{stats.completedProjects || 0}</p>
                        <p className="text-sm text-gray-600 mt-1">Finished projects</p>
                    </div>
                </div>

                {/* Quick Stats */}
                {stats.pendingReviews > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-3">
                            <FaClock className="text-orange-600 text-xl" />
                            <div>
                                <p className="font-medium text-orange-900">
                                    {stats.pendingReviews} project{stats.pendingReviews > 1 ? 's' : ''} pending review
                                </p>
                                <p className="text-sm text-orange-700">Please review and provide feedback</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex gap-8">
                            <button
                                onClick={() => setSelectedTab('overview')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${selectedTab === 'overview'
                                    ? 'border-green-600 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <FaChartBar />
                                    Overview
                                </div>
                            </button>
                            <button
                                onClick={() => setSelectedTab('students')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${selectedTab === 'students'
                                    ? 'border-green-600 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <FaUsers />
                                    Students ({students.length})
                                </div>
                            </button>
                            <button
                                onClick={() => setSelectedTab('projects')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${selectedTab === 'projects'
                                    ? 'border-green-600 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <FaProjectDiagram />
                                    Projects ({projects.length})
                                </div>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                {selectedTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Projects by Status */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Projects by Status</h2>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {Object.entries(stats.projectsByStatus || {}).map(([status, count]) => (
                                    <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
                                        <p className="text-2xl font-bold text-gray-900">{count}</p>
                                        <p className="text-sm text-gray-600 capitalize mt-1">{status}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Projects by Year */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Projects by Year</h2>
                            <div className="space-y-3">
                                {Object.entries(stats.projectsByYear || {})
                                    .sort(([a], [b]) => b - a)
                                    .map(([year, count]) => (
                                        <div key={year} className="flex items-center gap-4">
                                            <span className="text-sm font-medium text-gray-700 w-16">{year}</span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                                                <div
                                                    className="bg-gradient-to-r from-green-500 to-green-600 h-8 rounded-full flex items-center justify-end pr-3 text-white text-sm font-medium"
                                                    style={{ width: `${(count / stats.totalProjects) * 100}%` }}
                                                >
                                                    {count}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        {stats.recentActivity && stats.recentActivity.length > 0 && (
                            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                                <div className="space-y-3">
                                    {stats.recentActivity.map((activity, index) => (
                                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            <FaProjectDiagram className="text-green-600 mt-1" />
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-900">
                                                    <span className="font-medium">{activity.studentName}</span> submitted{' '}
                                                    <span className="font-medium">{activity.projectTitle}</span>
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(activity.timestamp).toLocaleDateString()} • Status: {activity.status}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {selectedTab === 'students' && (
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Student
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Year
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Projects
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {students.map((student) => (
                                        <tr key={student.uid} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                                                        {student.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900">{student.name}</p>
                                                        <p className="text-sm text-gray-500">{student.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {student.department || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {student.year || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    {student.projectCount} project{student.projectCount > 1 ? 's' : ''}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => navigate(`/profile/student/${student.uid}`)}
                                                    className="text-green-600 hover:text-green-900 font-medium"
                                                >
                                                    View Profile
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {students.length === 0 && (
                            <div className="text-center py-12">
                                <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No students yet</p>
                            </div>
                        )}
                    </div>
                )}

                {selectedTab === 'projects' && (
                    <div>
                        {projects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map((project) => (
                                    <ProjectCard key={project._id || project.id} project={project} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
                                <FaProjectDiagram className="text-6xl text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No supervised projects yet</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupervisorDashboard;
