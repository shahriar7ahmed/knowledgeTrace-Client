import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaFilePdf, FaCalendarAlt, FaUser, FaGraduationCap, FaHeart, FaBookmark, FaEye } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useActivity } from '../context/ActivityContext';
import { api } from '../utils/api';
import { useToast } from './Toast';

const ProjectCard = ({ project, showFullDetails = false, onUpdate }) => {
  const { isAuthenticated, user } = useAuth();
  const { toggleBookmarkLocal } = useActivity();
  const { showToast } = useToast();
  const [liked, setLiked] = useState(
    project.likes?.some(like => like.userId === user?.uid) || false
  );
  const [bookmarked, setBookmarked] = useState(
    project.bookmarks?.some(bookmark => bookmark.userId === user?.uid) || false
  );
  const [likeCount, setLikeCount] = useState(project.likeCount || project.likes?.length || 0);
  const [loading, setLoading] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast('Please login to like projects', 'info');
      return;
    }

    setLoading(true);
    const wasLiked = liked;

    // Optimistic update
    setLiked(!liked);
    setLikeCount(prev => wasLiked ? prev - 1 : prev + 1);

    try {
      const result = await api.toggleLike(project._id || project.id);
      if (result.liked !== undefined) {
        setLiked(result.liked);
        setLikeCount(result.likeCount || 0);
        if (onUpdate) onUpdate(result.project || project);
      }
    } catch (error) {
      // Revert on error
      setLiked(wasLiked);
      setLikeCount(prev => wasLiked ? prev + 1 : prev - 1);
      showToast(error.message || 'Failed to like project', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast('Please login to bookmark projects', 'info');
      return;
    }

    setLoading(true);
    const wasBookmarked = bookmarked;

    // Optimistic update
    setBookmarked(!bookmarked);
    toggleBookmarkLocal(project._id || project.id, wasBookmarked);

    try {
      const result = await api.toggleBookmark(project._id || project.id);
      if (result.bookmarked !== undefined) {
        setBookmarked(result.bookmarked);
        if (onUpdate) onUpdate(result.project || project);
      }
      showToast(result.bookmarked ? 'Bookmarked!' : 'Removed from bookmarks', 'success');
    } catch (error) {
      // Revert on error
      setBookmarked(wasBookmarked);
      toggleBookmarkLocal(project._id || project.id, !wasBookmarked);
      showToast(error.message || 'Failed to bookmark project', 'error');
    } finally {
      setLoading(false);
    }
  };
  const truncateAbstract = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="group rounded-2xl shadow-md bg-white hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-royal hover:-translate-y-1">
      {/* Project Title */}
      <h2 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-royal transition-colors duration-200">
        {showFullDetails ? (
          project.title
        ) : (
          <Link to={`/project/${project._id || project.id}`} className="hover:underline">
            {project.title}
          </Link>
        )}
      </h2>

      {/* Abstract */}
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {showFullDetails ? project.abstract : truncateAbstract(project.abstract)}
      </p>

      {/* Tech Stack Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.techStack?.slice(0, 4).map((tech, idx) => (
          <span
            key={idx}
            className="px-3 py-1.5 bg-primary-100 text-primary-700 text-xs rounded-full font-semibold border border-primary-200"
          >
            {tech}
          </span>
        ))}
        {project.techStack?.length > 4 && (
          <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium">
            +{project.techStack.length - 4} more
          </span>
        )}
      </div>

      {/* Category Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Project Metadata */}
      <div className="space-y-2 mb-4 text-sm text-gray-500">
        {project.author && (
          <div className="flex items-center gap-2">
            <FaUser className="text-royal" />
            <span>{project.author}</span>
          </div>
        )}
        {project.supervisor && (
          <div className="flex items-center gap-2">
            <FaGraduationCap className="text-royal" />
            <span>Supervisor: {project.supervisor}</span>
          </div>
        )}
        {project.year && (
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-royal" />
            <span>Year: {project.year}</span>
          </div>
        )}
      </div>

      {/* Engagement Metrics */}
      {isAuthenticated && (
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 text-sm font-medium ${liked
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={liked ? 'Unlike' : 'Like'}
          >
            <FaHeart className={liked ? 'fill-current' : ''} />
            <span>{likeCount}</span>
          </button>

          <button
            onClick={handleBookmark}
            disabled={loading}
            className={`p-1.5 rounded-lg transition-all duration-200 ${bookmarked
                ? 'text-yellow-500 hover:bg-yellow-50'
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
          >
            <FaBookmark className={bookmarked ? 'fill-current' : ''} />
          </button>

          {project.views > 0 && (
            <div className="flex items-center gap-1 text-gray-500 text-sm ml-auto">
              <FaEye />
              <span>{project.views}</span>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-5">
        {project.githubLink && (
          <a
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
          >
            <FaGithub />
            GitHub
          </a>
        )}
        {project.pdfUrl && (
          <a
            href={project.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
          >
            <FaFilePdf />
            PDF
          </a>
        )}
        {!showFullDetails && (
          <Link
            to={`/project/${project._id || project.id}`}
            className="flex-1 text-center px-4 py-2.5 bg-gradient-to-r from-royal to-primary-500 text-white rounded-lg hover:from-royal-dark hover:to-primary-600 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;

