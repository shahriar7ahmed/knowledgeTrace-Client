// SupervisorDashboard - Dashboard for supervisors to review pending projects
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import ProjectStatusBadge from '../../components/ProjectStatusBadge';
import SupervisorReviewForm from '../../components/SupervisorReviewForm';
import { FaEye, FaCheck, FaTimes, FaUsers, FaClipboardList } from 'react-icons/fa';

const SupervisorDashboard = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [pendingProjects, setPendingProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewing, setReviewing] = useState(false);

    useEffect(() => {
        fetchPendingApprovals();
    }, []);

    const fetchPendingApprovals = async () => {
        try {
            setLoading(true);
            const response = await api.getPendingApprovals();
            setPendingProjects(response.projects || []);
        } catch (error) {
            console.error('Error fetching pending approvals:', error);
            toast.error(error.message || 'Failed to fetch pending approvals');
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (reviewData) => {
        if (!selectedProject) return;

        try {
            setReviewing(true);
            await api.reviewProject(selectedProject._id, reviewData.action, reviewData.feedback);

            const actionLabel = reviewData.action === 'approve' ? 'approved' :
                reviewData.action === 'reject' ? 'rejected' : 'returned for changes';
            toast.success(`Project ${actionLabel} successfully`);

            setShowReviewModal(false);
            setSelectedProject(null);
            fetchPendingApprovals(); // Refresh list
        } catch (error) {
            console.error('Error reviewing project:', error);
            toast.error(error.message || 'Failed to submit review');
        } finally {
            setReviewing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Supervisor Dashboard</h1>
                    <p className="mt-2 text-gray-600">Review and manage pending project approvals</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{pendingProjects.length}</p>
                            </div>
                            <FaClipboardList className="text-4xl text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Students</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {new Set(pendingProjects.flatMap(p => p.students?.map(s => s.uid) || [])).size}
                                </p>
                            </div>
                            <FaUsers className="text-4xl text-green-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Action Required</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {pendingProjects.filter(p => p.status === 'supervisor_review').length}
                                </p>
                            </div>
                            <FaCheck className="text-4xl text-purple-500" />
                        </div>
                    </div>
                </div>

                {/* Pending Projects List */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Pending Approvals</h2>
                    </div>

                    {pendingProjects.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <FaClipboardList className="text-6xl text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No pending approvals</p>
                            <p className="text-gray-400 text-sm mt-2">All projects have been reviewed</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {pendingProjects.map((project) => (
                                <div key={project._id} className="px-6 py-5 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                                                <ProjectStatusBadge status={project.status} size="sm" />
                                            </div>

                                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{project.abstract}</p>

                                            {/* Students */}
                                            {project.students && project.students.length > 0 && (
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-sm font-medium text-gray-700">Students:</span>
                                                    <div className="flex gap-2">
                                                        {project.students.map((student) => (
                                                            <span
                                                                key={student.uid}
                                                                className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-md"
                                                            >
                                                                {student.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Metadata */}
                                            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                                {project.department && (
                                                    <span>📚 {project.department}</span>
                                                )}
                                                <span>📅 {new Date(project.createdAt).toLocaleDateString()}</span>
                                                {project.requiredSkills && project.requiredSkills.length > 0 && (
                                                    <span>💼 {project.requiredSkills.length} skills required</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2 ml-4">
                                            <button
                                                onClick={() => window.location.href = `/project/${project._id}`}
                                                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <FaEye /> View Details
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedProject(project);
                                                    setShowReviewModal(true);
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                                            >
                                                <FaCheck /> Review Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Review Modal */}
            {showReviewModal && selectedProject && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Review Project</h2>
                        </div>
                        <div className="px-6 py-4">
                            <SupervisorReviewForm
                                project={selectedProject}
                                onSubmit={handleReview}
                                onCancel={() => {
                                    setShowReviewModal(false);
                                    setSelectedProject(null);
                                }}
                                isSubmitting={reviewing}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupervisorDashboard;
