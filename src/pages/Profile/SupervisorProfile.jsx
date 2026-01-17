import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaGlobe, FaEnvelope, FaGraduationCap, FaProjectDiagram, FaCheckCircle, FaClock, FaUser } from 'react-icons/fa';
import { api } from '../../utils/api';
import ProjectCard from '../../components/ProjectCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const SupervisorProfile = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/supervisors/${id}/profile`);
            setProfile(response.profile);
        } catch (error) {
            console.error('Error fetching supervisor profile:', error);
            setError(error.message || 'Failed to load profile');
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

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 pt-24 px-4">
                <div className="max-w-4xl mx-auto text-center py-12">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link
                        to="/dashboard"
                        className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors inline-block"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        {/* Avatar */}
                        <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-5xl flex-shrink-0 shadow-lg">
                            {profile.photoURL ? (
                                <img
                                    src={profile.photoURL}
                                    alt={profile.name}
                                    className="w-32 h-32 rounded-2xl object-cover"
                                />
                            ) : (
                                <FaGraduationCap />
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full flex items-center gap-1">
                                    <FaGraduationCap className="text-xs" />
                                    Supervisor
                                </span>
                            </div>

                            {profile.designation && (
                                <p className="text-xl text-gray-700 font-medium mb-3">{profile.designation}</p>
                            )}

                            <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                                {profile.email && (
                                    <div className="flex items-center gap-2">
                                        <FaEnvelope className="text-gray-400" />
                                        <span>{profile.email}</span>
                                    </div>
                                )}
                                {profile.department && (
                                    <div className="flex items-center gap-2">
                                        <FaProjectDiagram className="text-gray-400" />
                                        <span>{profile.department}</span>
                                    </div>
                                )}
                                {profile.officeHours && (
                                    <div className="flex items-center gap-2">
                                        <FaClock className="text-gray-400" />
                                        <span>Office Hours: {profile.officeHours}</span>
                                    </div>
                                )}
                            </div>

                            {/* Bio */}
                            {profile.bio && (
                                <p className="text-gray-700 mb-4">{profile.bio}</p>
                            )}

                            {/* Social Links */}
                            {(profile.socialLinks?.github || profile.socialLinks?.linkedin || profile.socialLinks?.website) && (
                                <div className="flex flex-wrap gap-3">
                                    {profile.socialLinks?.github && (
                                        <a
                                            href={profile.socialLinks.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                        >
                                            <FaGithub />
                                            <span>GitHub</span>
                                        </a>
                                    )}
                                    {profile.socialLinks?.linkedin && (
                                        <a
                                            href={profile.socialLinks.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <FaLinkedin />
                                            <span>LinkedIn</span>
                                        </a>
                                    )}
                                    {profile.socialLinks?.website && (
                                        <a
                                            href={profile.socialLinks.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            <FaGlobe />
                                            <span>Website</span>
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Projects Supervised</p>
                                <p className="text-3xl font-bold text-green-600">{profile.stats?.supervisedCount || 0}</p>
                            </div>
                            <FaProjectDiagram className="text-4xl text-green-200" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Active Projects</p>
                                <p className="text-3xl font-bold text-blue-600">{profile.stats?.activeProjects || 0}</p>
                            </div>
                            <FaClock className="text-4xl text-blue-200" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Completed Projects</p>
                                <p className="text-3xl font-bold text-purple-600">{profile.stats?.completedProjects || 0}</p>
                            </div>
                            <FaCheckCircle className="text-4xl text-purple-200" />
                        </div>
                    </div>
                </div>

                {/* Research Areas */}
                {profile.researchAreas && profile.researchAreas.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Research Areas & Interests</h2>
                        <div className="flex flex-wrap gap-2">
                            {profile.researchAreas.map((area, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium"
                                >
                                    {area}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Projects */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Supervised Projects</h2>
                    {profile.recentProjects && profile.recentProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {profile.recentProjects.map((project) => (
                                <ProjectCard key={project._id || project.id} project={project} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📚</div>
                            <p className="text-gray-500">No supervised projects yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupervisorProfile;
