// StudentWorkflowHub - Student view of thesis workflow progress
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import WorkflowTimeline from '../../components/WorkflowTimeline';
import MilestoneCard from '../../components/MilestoneCard';
import ProjectStatusBadge from '../../components/ProjectStatusBadge';
import { FaComments, FaPaperPlane, FaProjectDiagram } from 'react-icons/fa';

const StudentWorkflowHub = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [timeline, setTimeline] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [submittingProposal, setSubmittingProposal] = useState(false);

    useEffect(() => {
        if (currentUser) {
            fetchUserProjects();
        }
    }, [currentUser]);

    useEffect(() => {
        if (selectedProject) {
            fetchProjectTimeline(selectedProject._id);
        }
    }, [selectedProject]);

    const fetchUserProjects = async () => {
        try {
            setLoading(true);
            const response = await api.getUserProjects(currentUser.uid);
            setProjects(response.projects || []);

            if (response.projects && response.projects.length > 0) {
                setSelectedProject(response.projects[0]);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            toast.error('Failed to fetch your projects');
        } finally {
            setLoading(false);
        }
    };

    const fetchProjectTimeline = async (projectId) => {
        try {
            const response = await api.getProjectTimeline(projectId);
            setTimeline(response.timeline);
        } catch (error) {
            console.error('Error fetching timeline:', error);
            toast.error('Failed to fetch project timeline');
        }
    };

    const handleSubmitProposal = async () => {
        if (!selectedProject) return;

        try {
            setSubmittingProposal(true);
            await api.submitProposal(selectedProject._id);
            toast.success('Proposal submitted for supervisor review!');
            fetchUserProjects(); // Refresh
            fetchProjectTimeline(selectedProject._id);
        } catch (error) {
            console.error('Error submitting proposal:', error);
            toast.error(error.message || 'Failed to submit proposal');
        } finally {
            setSubmittingProposal(false);
        }
    };

    const handleAddComment = async () => {
        if (!selectedProject || !newComment.trim()) return;

        try {
            setSubmittingComment(true);
            const phase = selectedProject.status.replace('_', ' ');
            await api.addWorkflowComment(selectedProject._id, selectedProject.status, newComment);
            toast.success('Comment added successfully');
            setNewComment('');
            fetchProjectTimeline(selectedProject._id); // Refresh timeline
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Failed to add comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FaProjectDiagram className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">No Projects Yet</h2>
                    <p className="text-gray-500 mb-6">Create your first thesis project to get started</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
                    >
                        Create Project
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Thesis Workflow</h1>
                    <p className="mt-2 text-gray-600">Track your thesis progress and communicate with your supervisor</p>
                </div>

                {/* Project Selector */}
                {projects.length > 1 && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Project</label>
                        <select
                            value={selectedProject?._id || ''}
                            onChange={(e) => {
                                const project = projects.find(p => p._id === e.target.value);
                                setSelectedProject(project);
                            }}
                            className="w-full md:w-2/3 lg:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            {projects.map(project => (
                                <option key={project._id} value={project._id}>
                                    {project.title}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {selectedProject && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Project Info Card */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h2>
                                        <p className="text-sm text-gray-600 mt-1">{selectedProject.department} • {selectedProject.year}</p>
                                    </div>
                                    <ProjectStatusBadge status={selectedProject.status} size="lg" />
                                </div>
                                <p className="text-gray-700">{selectedProject.abstract}</p>
                            </div>

                            {/* Timeline */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-6">Progress Timeline</h3>
                                <WorkflowTimeline
                                    currentStatus={selectedProject.status}
                                    milestones={timeline?.milestones || []}
                                />
                            </div>

                            {/* Actions */}
                            {selectedProject.status === 'draft' && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to Submit?</h3>
                                    <p className="text-blue-800 mb-4">
                                        Submit your proposal to your supervisor for review
                                    </p>
                                    <button
                                        onClick={handleSubmitProposal}
                                        disabled={submittingProposal}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                                    >
                                        {submittingProposal ? 'Submitting...' : '📤 Submit for Review'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Recent Comments */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <FaComments /> Comments & Feedback
                                </h3>

                                <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                                    {timeline?.comments && timeline.comments.length > 0 ? (
                                        timeline.comments.map((comment) => (
                                            <div key={comment._id} className="pb-4 border-b border-gray-200 last:border-0">
                                                <div className="flex items-start gap-2 mb-2">
                                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                                                        {comment.user?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900">{comment.user?.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(comment.createdAt).toLocaleDateString()} • {comment.phase.replace('_', ' ')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-700 ml-10">{comment.comment}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 text-center py-4">No comments yet</p>
                                    )}
                                </div>

                                {/* Add Comment Form */}
                                <div className="pt-4 border-t border-gray-200">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add a comment or question..."
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                                    />
                                    <button
                                        onClick={handleAddComment}
                                        disabled={!newComment.trim() || submittingComment}
                                        className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                                    >
                                        <FaPaperPlane className="w-3 h-3" />
                                        {submittingComment ? 'Posting...' : 'Post Comment'}
                                    </button>
                                </div>
                            </div>

                            {/* Milestones */}
                            {timeline?.milestones && timeline.milestones.length > 0 && (
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Milestones</h3>
                                    <div className="space-y-3">
                                        {timeline.milestones.map((milestone) => (
                                            <MilestoneCard
                                                key={milestone._id}
                                                milestone={milestone}
                                                reviewer={timeline.milestones.find(m => m.reviewerId)?.reviewer}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentWorkflowHub;
