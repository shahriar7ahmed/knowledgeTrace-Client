import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { useActivity } from '../../context/ActivityContext';
import { useNotifications } from '../../context/NotificationContext';
import { FaGithub, FaFilePdf, FaCalendarAlt, FaUser, FaGraduationCap, FaArrowLeft, FaHeart, FaBookmark, FaTrash, FaEye } from 'react-icons/fa';
import { api } from '../../utils/api';
import { useToast } from '../../components/Toast';
import CommentSection from '../../components/CommentSection';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProjectById } = useProjects();
  const { user, isAuthenticated } = useAuth();
  const { addRecentProject } = useActivity();
  const { addNotification } = useNotifications();
  const { showToast } = useToast();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [views, setViews] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);
      const projectData = await getProjectById(id);
      if (projectData) {
        setProject(projectData);
        setLiked(projectData.likes?.some(like => like.userId === user?.uid) || false);
        setBookmarked(projectData.bookmarks?.some(b => b.userId === user?.uid) || false);
        setLikeCount(projectData.likeCount || projectData.likes?.length || 0);
        setViews(projectData.views || 0);
        
        // Track view
        if (isAuthenticated && user?.uid) {
          try {
            await api.trackView(id);
            addRecentProject(projectData);
            setViews(prev => prev + 1);
          } catch (error) {
            console.error('Error tracking view:', error);
          }
        }
      }
      setLoading(false);
    };

    if (id) {
      loadProject();
    }
  }, [id, getProjectById, user?.uid, isAuthenticated, addRecentProject]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  const handleLike = async () => {
    if (!isAuthenticated) {
      showToast('Please login to like projects', 'info');
      return;
    }

    setActionLoading(true);
    const wasLiked = liked;
    
    // Optimistic update
    setLiked(!liked);
    setLikeCount(prev => wasLiked ? prev - 1 : prev + 1);

    try {
      const result = await api.toggleLike(id);
      if (result.liked !== undefined) {
        setLiked(result.liked);
        setLikeCount(result.likeCount || 0);
        setProject(result.project || project);
      }
    } catch (error) {
      // Revert on error
      setLiked(wasLiked);
      setLikeCount(prev => wasLiked ? prev + 1 : prev - 1);
      showToast(error.message || 'Failed to like project', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      showToast('Please login to bookmark projects', 'info');
      return;
    }

    setActionLoading(true);
    const wasBookmarked = bookmarked;
    
    // Optimistic update
    setBookmarked(!bookmarked);

    try {
      const result = await api.toggleBookmark(id);
      if (result.bookmarked !== undefined) {
        setBookmarked(result.bookmarked);
        setProject(result.project || project);
      }
      showToast(result.bookmarked ? 'Bookmarked!' : 'Removed from bookmarks', 'success');
    } catch (error) {
      // Revert on error
      setBookmarked(wasBookmarked);
      showToast(error.message || 'Failed to bookmark project', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      await api.deleteProject(id);
      showToast('Project deleted successfully', 'success');
      navigate('/dashboard');
    } catch (error) {
      showToast(error.message || 'Failed to delete project', 'error');
      setActionLoading(false);
    }
  };

  const handleProjectUpdate = (updatedProject) => {
    setProject(updatedProject);
    setLikeCount(updatedProject.likeCount || updatedProject.likes?.length || 0);
  };

  const isOwner = project?.authorId === user?.uid || project?.author?.toLowerCase() === user?.name?.toLowerCase();

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/thesis-finder')}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Browse Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition"
          >
            <FaArrowLeft />
            Back
          </button>

          {/* Project Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{project.title}</h1>

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {project.author && (
                <div className="flex items-center gap-3">
                  <FaUser className="text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Author</p>
                    <p className="font-medium text-gray-800">{project.author}</p>
                  </div>
                </div>
              )}

              {project.supervisor && (
                <div className="flex items-center gap-3">
                  <FaGraduationCap className="text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Supervisor</p>
                    <p className="font-medium text-gray-800">{project.supervisor}</p>
                  </div>
                </div>
              )}

              {project.year && (
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="font-medium text-gray-800">{project.year}</p>
                  </div>
                </div>
              )}

              {project.date && (
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Submitted</p>
                    <p className="font-medium text-gray-800">
                      {new Date(project.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Engagement Metrics & Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {isAuthenticated && (
                <>
                  <button
                    onClick={handleLike}
                    disabled={actionLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                      liked
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <FaHeart className={liked ? 'fill-current' : ''} />
                    <span>{likeCount}</span>
                  </button>
                  
                  <button
                    onClick={handleBookmark}
                    disabled={actionLoading}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      bookmarked
                        ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
                  >
                    <FaBookmark className={bookmarked ? 'fill-current' : ''} />
                  </button>

                  {views > 0 && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaEye />
                      <span>{views} views</span>
                    </div>
                  )}
                </>
              )}

              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
                >
                  <FaGithub />
                  View on GitHub
                </a>
              )}
              {project.pdfUrl && (
                <a
                  href={project.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <FaFilePdf />
                  View PDF
                </a>
              )}

              {isOwner && (
                <button
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                >
                  <FaTrash />
                  Delete Project
                </button>
              )}
            </div>

            {/* Tech Stack */}
            {project.techStack && project.techStack.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Abstract */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Abstract</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {project.abstract}
            </p>
          </div>

          {/* Comments Section */}
          <CommentSection 
            project={project} 
            projectOwnerId={project.authorId}
            onUpdate={handleProjectUpdate}
          />
        </div>
      </div>
  );
};

export default ProjectDetails;

