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
            const userData = userResult.user || userResult.profile || userResult;
            setUserData(userData);

            // Use projects from the user profile response if available
            if (userData.projects) {
                setUserProjects(userData.projects);
            } else if (userData.recentProjects) {
                setUserProjects(userData.recentProjects);
            } else {
                // Fallback: fetch user's projects separately
                try {
                    const projectsResult = await api.getUserProjects(id);
                    setUserProjects(projectsResult.projects || projectsResult || []);
                } catch (projError) {
                    console.warn('Could not fetch projects:', projError);
                    setUserProjects([]);
                }
            }

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
                            className="inline-block px-6 py-3 bg-gradient-to-r from-royal to-primary-500 text-white hover:text-white rounded-lg hover:from-royal-dark hover:to-primary-600 transition-all duration-200 font-semibold"
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
                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden mb-12 transition-all duration-500 hover:shadow-primary-500/30">
                    <div className="bg-gradient-to-br from-royal via-primary-600 to-emerald-500 p-8 md:p-14 relative overflow-hidden">
                        {/* Decorative background elements */}
                        <div className="absolute -right-10 -top-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-emerald-400/20 rounded-full blur-2xl"></div>

                        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-14 relative z-10">
                            {/* Profile Picture */}
                            <div className="relative group">
                                <div className="w-44 h-44 md:w-60 md:h-60 rounded-[3rem] border-4 border-white/40 backdrop-blur-md shadow-2xl overflow-hidden bg-white/10 group-hover:scale-105 transition-all duration-500 ring-8 ring-white/5">
                                    <img
                                        src={userData.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || userData.displayName || 'User')}&background=random&size=256`}
                                        alt={userData.name || userData.displayName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/256';
                                        }}
                                    />
                                </div>
                                <div className="absolute bottom-4 right-4 w-10 h-10 bg-emerald-400 border-4 border-white rounded-full shadow-lg"></div>
                            </div>

                            {/* Info Section */}
                            <div className="flex-1 text-center md:text-left text-white mt-4 md:mt-2">
                                <div className="flex flex-col md:flex-row md:items-center gap-5 justify-center md:justify-start">
                                    <h1 className="text-5xl md:text-8xl font-black tracking-tight drop-shadow-2xl">
                                        {userData.name || userData.displayName || 'Anonymous User'}
                                    </h1>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start">
                                    {/* Action Buttons */}
                                    {isOwnProfile && (
                                        <Link
                                            to="/profile"
                                            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-royal font-black rounded-2xl hover:bg-gray-100 transition-all shadow-2xl hover:-translate-y-1 active:scale-95 text-xl"
                                        >
                                            <FaEdit className="text-2xl" />
                                            Edit Profile
                                        </Link>
                                    )}

                                    {/* Social Links */}
                                    <div className="flex flex-wrap gap-4 justify-center">
                                        {(userData.socialLinks?.github || userData.github) && (
                                            <a
                                                href={userData.socialLinks?.github || userData.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-5 bg-white/10 backdrop-blur-lg text-white rounded-2xl hover:bg-white/20 transition-all border border-white/20 shadow-xl hover:-translate-y-1"
                                                title="GitHub"
                                            >
                                                <FaGithub size={32} />
                                            </a>
                                        )}
                                        {(userData.socialLinks?.linkedin || userData.linkedin) && (
                                            <a
                                                href={userData.socialLinks?.linkedin || userData.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-5 bg-white/10 backdrop-blur-lg text-white rounded-2xl hover:bg-white/20 transition-all border border-white/20 shadow-xl hover:-translate-y-1"
                                                title="LinkedIn"
                                            >
                                                <FaLinkedin size={32} />
                                            </a>
                                        )}
                                        {(userData.socialLinks?.website) && (
                                            <a
                                                href={userData.socialLinks.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-5 bg-white/10 backdrop-blur-lg text-white rounded-2xl hover:bg-white/20 transition-all border border-white/20 shadow-xl hover:-translate-y-1"
                                                title="Website"
                                            >
                                                <FaGlobe size={32} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Section */}
                    <div className="bg-gray-50/50 px-8 py-6 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center md:text-left">
                            <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Projects</p>
                            <p className="text-2xl font-black text-gray-900">{userProjects.length}</p>
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Collabs</p>
                            <p className="text-2xl font-black text-gray-900">{userCollabPosts.length}</p>
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Experience</p>
                            <p className="text-2xl font-black text-gray-900">{userData.year || 'N/A'}</p>
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Department</p>
                            <p className="text-2xl font-black text-gray-900 truncate" title={userData.department}>{userData.department || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Bio and Skills Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Bio */}
                    {userData.bio && (
                        <div className="md:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 transition-all hover:shadow-2xl">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-royal rounded-full"></span>
                                About Me
                            </h2>
                            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">{userData.bio}</p>
                        </div>
                    )}

                    {/* Skills */}
                    {userData.skills && userData.skills.length > 0 && (
                        <div className={`bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 transition-all hover:shadow-2xl ${!userData.bio ? 'md:col-span-3' : ''}`}>
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                                Expertise
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {userData.skills.map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="px-5 py-2.5 bg-primary-100 text-primary-700 text-sm rounded-2xl font-bold border border-primary-200 shadow-sm transition-all hover:scale-105"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Tabbed Content */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden transition-all hover:shadow-primary-500/10">
                    {/* Tab Headers */}
                    <div className="border-b border-gray-100 p-2">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('projects')}
                                className={`flex-1 px-8 py-5 text-lg font-black rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 ${activeTab === 'projects'
                                    ? 'text-royal bg-royal/10 shadow-inner'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <FaProjectDiagram className="text-2xl" />
                                Projects ({userProjects.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('collabs')}
                                className={`flex-1 px-8 py-5 text-lg font-black rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 ${activeTab === 'collabs'
                                    ? 'text-emerald-600 bg-emerald-50 shadow-inner'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <FaHandshake className="text-2xl" />
                                Collabs ({userCollabPosts.length})
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8 md:p-12">
                        {activeTab === 'projects' ? (
                            userProjects.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {userProjects.map((project) => (
                                        <ProjectCard key={project._id || project.id} project={project} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                    <div className="text-6xl mb-6">🚀</div>
                                    <p className="text-2xl font-bold text-gray-400 leading-relaxed">
                                        No projects showcased yet.<br />
                                        <span className="text-lg font-medium">The journey begins with the first line of code.</span>
                                    </p>
                                </div>
                            )
                        ) : (
                            userCollabPosts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {userCollabPosts.map((post) => (
                                        <CollabCard key={post._id || post.id} post={post} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                    <div className="text-6xl mb-6">🤝</div>
                                    <p className="text-2xl font-bold text-gray-400 leading-relaxed">
                                        No active collaborations.<br />
                                        <span className="text-lg font-medium">Collaboration is the heart of innovation.</span>
                                    </p>
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
