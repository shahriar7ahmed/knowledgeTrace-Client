import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaGlobe, FaEdit, FaProjectDiagram, FaHandshake } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { useToast } from '../../components/Toast';
import ProjectCard from '../../components/ProjectCard';
import CollabCard from '../../components/CollabCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import SkeletonCard from '../../components/SkeletonCard';

const UserProfile = () => {
    const { id } = useParams(); // User ID from URL
    const { user: currentUser, isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [userProjects, setUserProjects] = useState([]);
    const [userCollabPosts, setUserCollabPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('projects'); // 'projects' or 'collabs'
    const [error, setError] = useState(null);

    const isOwnProfile = isAuthenticated && currentUser && (currentUser.uid === id || currentUser._id === id);

    useEffect(() => {
        fetchUserProfile();
    }, [id]);

    const fetchUserProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch user data
            const userResult = await api.getUserById(id);
            setUserData(userResult.user || userResult);

            // Fetch user's projects
            const projectsResult = await api.getUserProjects(id);
            setUserProjects(projectsResult.projects || projectsResult || []);

            // Fetch user's collaboration posts
            try {
                const collabResult = await api.getUserCollabPosts(id);
                setUserCollabPosts(collabResult.posts || collabResult || []);
            } catch (collabError) {
                // Collaboration posts might not be available yet if backend isn't ready
                console.warn('Could not fetch collab posts:', collabError);
                setUserCollabPosts([]);
            }
        } catch (err) {
            setError(err.message || 'Failed to load user profile');
            showToast(err.message || 'Failed to load user profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/20 pt-24 pb-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (error || !userData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/20 pt-24 pb-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">User Not Found</h2>
                        <p className="text-gray-600 mb-6">The user profile you're looking for doesn't exist.</p>
                        <Link
                            to="/"
                            className="inline-block px-6 py-3 bg-gradient-to-r from-royal to-primary-500 text-white rounded-lg hover:from-royal-dark hover:to-primary-600 transition-all duration-200 font-semibold"
                        >
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-primary-50/20 pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-royal to-primary-500 h-32"></div>
                    <div className="px-6 md:px-8 pb-8">
                        <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">
                            {/* Profile Picture */}
                            <div className="relative">
                                <img
                                    src={userData.photoURL || 'https://via.placeholder.com/150'}
                                    alt={userData.name || userData.displayName}
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover bg-white"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/150';
                                    }}
                                />
                            </div>

                            {/* Name and Headline */}
                            <div className="flex-1">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                    {userData.name || userData.displayName || 'Anonymous User'}
                                </h1>
                                <p className="text-lg text-gray-600 mb-4">
                                    {userData.headline || `${userData.department || 'Student'} at ${userData.year || 'University'}`}
                                </p>

                                {/* Social Links */}
                                <div className="flex flex-wrap gap-3">
                                    {(userData.socialLinks?.github || userData.github) && (
                                        <a
                                            href={userData.socialLinks?.github || userData.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 text-sm font-medium"
                                        >
                                            <FaGithub />
                                            GitHub
                                        </a>
                                    )}
                                    {(userData.socialLinks?.linkedin || userData.linkedin) && (
                                        <a
                                            href={userData.socialLinks?.linkedin || userData.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium"
                                        >
                                            <FaLinkedin />
                                            LinkedIn
                                        </a>
                                    )}
                                    {userData.socialLinks?.website && (
                                        <a
                                            href={userData.socialLinks.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-royal text-white rounded-lg hover:bg-royal-dark transition-all duration-200 text-sm font-medium"
                                        >
                                            <FaGlobe />
                                            Website
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Edit Button (only for own profile) */}
                            {isOwnProfile && (
                                <Link
                                    to="/profile"
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 font-medium text-sm"
                                >
                                    <FaEdit />
                                    Edit Profile
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bio and Skills Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Bio */}
                    {userData.bio && (
                        <div className="md:col-span-2 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{userData.bio}</p>
                        </div>
                    )}

                    {/* Skills */}
                    {userData.skills && userData.skills.length > 0 && (
                        <div className={`bg-white rounded-2xl shadow-md border border-gray-100 p-6 ${!userData.bio ? 'md:col-span-3' : ''}`}>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {userData.skills.map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1.5 bg-primary-100 text-primary-700 text-sm rounded-full font-semibold border border-primary-200"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Tabbed Content */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                    {/* Tab Headers */}
                    <div className="border-b border-gray-200">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('projects')}
                                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'projects'
                                    ? 'text-royal border-b-2 border-royal bg-primary-50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <FaProjectDiagram />
                                My Projects ({userProjects.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('collabs')}
                                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'collabs'
                                    ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <FaHandshake />
                                Collaboration Requests ({userCollabPosts.length})
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'projects' ? (
                            userProjects.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {userProjects.map((project) => (
                                        <ProjectCard key={project._id || project.id} project={project} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No projects submitted yet.</p>
                                </div>
                            )
                        ) : (
                            userCollabPosts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {userCollabPosts.map((post) => (
                                        <CollabCard key={post._id || post.id} post={post} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No collaboration requests posted yet.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
