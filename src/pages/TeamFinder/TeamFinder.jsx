// TeamFinder - Find and invite skill-matched students to your team
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import SkillMatchCard from '../../components/SkillMatchCard';
import { FaSearch, FaUsers } from 'react-icons/fa';

const TeamFinder = () => {
    const { currentUser } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const projectId = searchParams.get('projectId');

    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState(null);
    const [matches, setMatches] = useState([]);
    const [groupedMatches, setGroupedMatches] = useState({});
    const [minScore, setMinScore] = useState(0);
    const [inviting, setInviting] = useState(null);

    useEffect(() => {
        if (projectId) {
            fetchProjectAndMatches();
        } else {
            setLoading(false);
        }
    }, [projectId, minScore]);

    const fetchProjectAndMatches = async () => {
        try {
            setLoading(true);

            // Fetch project details
            const projectResponse = await api.getProjectById(projectId);
            setProject(projectResponse.project);

            // Fetch skill matches
            const matchesResponse = await api.findMatchingStudents(projectId, minScore, 50);
            setMatches(matchesResponse.matches || []);
            setGroupedMatches(matchesResponse.groupedByLevel || {});
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load team matches');
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (student) => {
        try {
            setInviting(student.studentId);
            await api.inviteToTeam(projectId, student.studentId, `Hi ${student.name}, I'd like to invite you to join my project: ${project.title}`);
            toast.success(`Invitation sent to ${student.name}`);
        } catch (error) {
            console.error('Error sending invitation:', error);
            toast.error(error.message || 'Failed to send invitation');
        } finally {
            setInviting(null);
        }
    };

    if (!projectId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">No Project Selected</h2>
                    <p className="text-gray-500 mb-6">Please select a project to find team members</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

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
                    <h1 className="text-3xl font-bold text-gray-900">Find Team Members</h1>
                    <p className="mt-2 text-gray-600">Discover students with skills that match your project needs</p>
                </div>

                {/* Project Info */}
                {project && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h2>
                        <p className="text-gray-600 mb-4">{project.abstract}</p>

                        {project.requiredSkills && project.requiredSkills.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Required Skills:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.requiredSkills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700">Minimum Match Score:</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            value={minScore}
                            onChange={(e) => setMinScore(Number(e.target.value))}
                            className="flex-1 max-w-xs"
                        />
                        <span className="text-sm font-bold text-gray-900">{minScore}%</span>
                    </div>
                </div>

                {/* Results */}
                {matches.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <FaSearch className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Matches Found</h3>
                        <p className="text-gray-500">
                            {project?.requiredSkills?.length === 0
                                ? 'Add required skills to your project to find matching students'
                                : 'Try lowering the minimum match score to see more results'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Best Fit */}
                        {groupedMatches.best_fit && groupedMatches.best_fit.length > 0 && (
                            <div>
                                <h3 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
                                    <span>🌟</span> Best Fit ({groupedMatches.best_fit.length})
                                </h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {groupedMatches.best_fit.map((match) => (
                                        <SkillMatchCard
                                            key={match.studentId}
                                            student={match}
                                            matchScore={match.score}
                                            matchedSkills={match.matchedSkills}
                                            missingSkills={match.missingSkills}
                                            matchLevel={match.matchLevel}
                                            onInvite={() => handleInvite(match)}
                                            isInviting={inviting === match.studentId}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Good Fit */}
                        {groupedMatches.good_fit && groupedMatches.good_fit.length > 0 && (
                            <div>
                                <h3 className="text-2xl font-bold text-yellow-700 mb-4 flex items-center gap-2">
                                    <span>✨</span> Good Fit ({groupedMatches.good_fit.length})
                                </h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {groupedMatches.good_fit.map((match) => (
                                        <SkillMatchCard
                                            key={match.studentId}
                                            student={match}
                                            matchScore={match.score}
                                            matchedSkills={match.matchedSkills}
                                            missingSkills={match.missingSkills}
                                            matchLevel={match.matchLevel}
                                            onInvite={() => handleInvite(match)}
                                            isInviting={inviting === match.studentId}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Needs Training */}
                        {groupedMatches.needs_training && groupedMatches.needs_training.length > 0 && minScore === 0 && (
                            <div>
                                <h3 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                                    <span>📚</span> Needs Training ({groupedMatches.needs_training.length})
                                </h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {groupedMatches.needs_training.slice(0, 6).map((match) => (
                                        <SkillMatchCard
                                            key={match.studentId}
                                            student={match}
                                            matchScore={match.score}
                                            matchedSkills={match.matchedSkills}
                                            missingSkills={match.missingSkills}
                                            matchLevel={match.matchLevel}
                                            onInvite={() => handleInvite(match)}
                                            isInviting={inviting === match.studentId}
                                        />
                                    ))}
                                </div>
                                {groupedMatches.needs_training.length > 6 && (
                                    <p className="text-center text-gray-500 mt-4">
                                        Showing 6 of {groupedMatches.needs_training.length} results. Adjust filters to see more.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamFinder;
