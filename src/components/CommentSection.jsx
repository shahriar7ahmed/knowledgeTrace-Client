import React, { useState } from 'react';
import { FaEdit, FaTrash, FaReply, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { useToast } from './Toast';

const CommentSection = ({ project, projectOwnerId, onUpdate }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [comments, setComments] = useState(project?.comments || []);

  // Update comments when project changes
  React.useEffect(() => {
    if (project?.comments) {
      setComments(project.comments);
    }
  }, [project?.comments]);
  const [editingComment, setEditingComment] = useState(null);
  const [editingReply, setEditingReply] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!isAuthenticated) {
      showToast('Please login to comment', 'info');
      return;
    }

    setLoading(true);
    try {
      const result = await api.addComment(project?._id || project?.id, newComment.trim());
      setComments(prev => [...prev, result.comment]);
      setNewComment('');
      showToast('Comment added successfully', 'success');
      if (onUpdate && result.project) {
        onUpdate(result.project);
      }
    } catch (error) {
      showToast(error.message || 'Failed to add comment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    setLoading(true);
    try {
      const result = await api.editComment(project?._id || project?.id, commentId, newContent);
      setComments(prev =>
        prev.map(c => c._id === commentId ? result.comment : c)
      );
      setEditingComment(null);
      showToast('Comment updated successfully', 'success');
      if (onUpdate && result.project) {
        onUpdate(result.project);
      }
    } catch (error) {
      showToast(error.message || 'Failed to update comment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    setLoading(true);
    try {
      await api.deleteComment(project?._id || project?.id, commentId);
      setComments(prev => prev.filter(c => c._id !== commentId));
      showToast('Comment deleted successfully', 'success');
      if (onUpdate) {
        const updatedProject = { ...project, comments: comments.filter(c => c._id !== commentId), commentCount: (project.commentCount || comments.length) - 1 };
        onUpdate(updatedProject);
      }
    } catch (error) {
      showToast(error.message || 'Failed to delete comment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddReply = async (commentId) => {
    if (!replyText.trim()) return;

    setLoading(true);
    try {
      const result = await api.addReply(project?._id || project?.id, commentId, replyText.trim());
      setComments(prev =>
        prev.map(c =>
          c._id === commentId
            ? { ...c, replies: [...(c.replies || []), result.reply] }
            : c
        )
      );
      setReplyText('');
      setReplyingTo(null);
      showToast('Reply added successfully', 'success');
      if (onUpdate && result.project) {
        onUpdate(result.project);
      }
    } catch (error) {
      showToast(error.message || 'Failed to add reply', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditReply = async (commentId, replyId, newContent) => {
    setLoading(true);
    try {
      const result = await api.editReply(project?._id || project?.id, commentId, replyId, newContent);
      setComments(prev =>
        prev.map(c =>
          c._id === commentId
            ? {
                ...c,
                replies: c.replies.map(r =>
                  r._id === replyId ? result.reply : r
                ),
              }
            : c
        )
      );
      setEditingReply(null);
      showToast('Reply updated successfully', 'success');
      if (onUpdate && result.project) {
        onUpdate(result.project);
      }
    } catch (error) {
      showToast(error.message || 'Failed to update reply', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    if (!window.confirm('Are you sure you want to delete this reply?')) return;

    setLoading(true);
    try {
      await api.deleteReply(project?._id || project?.id, commentId, replyId);
      setComments(prev =>
        prev.map(c =>
          c._id === commentId
            ? { ...c, replies: c.replies.filter(r => r._id !== replyId) }
            : c
        )
      );
      showToast('Reply deleted successfully', 'success');
      if (onUpdate) {
        const updatedComments = comments.map(c =>
          c._id === commentId
            ? { ...c, replies: c.replies.filter(r => r._id !== replyId) }
            : c
        );
        const updatedProject = { ...project, comments: updatedComments };
        onUpdate(updatedProject);
      }
    } catch (error) {
      showToast(error.message || 'Failed to delete reply', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const canEditOrDelete = (itemUserId) => {
    return isAuthenticated && (user?.uid === itemUserId || user?.uid === projectOwnerId || user?.isAdmin);
  };

  if (!project) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Comments ({comments.length})
      </h2>

      {/* Add Comment Form */}
      {isAuthenticated ? (
        <div className="mb-6">
          <div className="flex gap-3 mb-3">
            <div className="flex-shrink-0">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <FaUserCircle className="text-3xl text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows="3"
                disabled={loading}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleAddComment}
                  disabled={loading || !newComment.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center text-gray-600">
          Please <a href="/login" className="text-green-600 hover:underline">login</a> to comment
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="border-b border-gray-100 pb-4 last:border-0">
              {/* Comment */}
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  {comment.userPhotoURL ? (
                    <img
                      src={comment.userPhotoURL}
                      alt={comment.userName}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <FaUserCircle className="text-3xl text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-semibold text-gray-900">
                          {comment.userName}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {formatTime(comment.createdAt)}
                        </span>
                      </div>
                      {canEditOrDelete(comment.userId) && (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setEditingComment(
                                editingComment === comment._id ? null : comment._id
                              )
                            }
                            className="text-gray-500 hover:text-green-600"
                          >
                            <FaEdit className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-gray-500 hover:text-red-600"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      )}
                    </div>
                    {editingComment === comment._id ? (
                      <EditForm
                        initialValue={comment.content}
                        onSave={(content) => handleEditComment(comment._id, content)}
                        onCancel={() => setEditingComment(null)}
                      />
                    ) : (
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    )}
                  </div>

                  {/* Reply Button */}
                  {isAuthenticated && editingComment !== comment._id && (
                    <button
                      onClick={() =>
                        setReplyingTo(replyingTo === comment._id ? null : comment._id)
                      }
                      className="mt-2 text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                    >
                      <FaReply />
                      Reply
                    </button>
                  )}

                  {/* Reply Form */}
                  {replyingTo === comment._id && (
                    <div className="mt-3 ml-8">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && replyText.trim()) {
                              handleAddReply(comment._id);
                            }
                          }}
                          disabled={loading}
                        />
                        <button
                          onClick={() => handleAddReply(comment._id)}
                          disabled={loading || !replyText.trim()}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText('');
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 ml-8 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply._id} className="flex gap-2">
                          <div className="flex-shrink-0">
                            {reply.userPhotoURL ? (
                              <img
                                src={reply.userPhotoURL}
                                alt={reply.userName}
                                className="w-8 h-8 rounded-full"
                              />
                            ) : (
                              <FaUserCircle className="text-2xl text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <div>
                                <span className="font-semibold text-sm text-gray-900">
                                  {reply.userName}
                                </span>
                                <span className="text-xs text-gray-500 ml-2">
                                  {formatTime(reply.createdAt)}
                                </span>
                              </div>
                              {canEditOrDelete(reply.userId) && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      setEditingReply(
                                        editingReply === reply._id ? null : reply._id
                                      )
                                    }
                                    className="text-gray-500 hover:text-green-600"
                                  >
                                    <FaEdit className="text-xs" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteReply(comment._id, reply._id)
                                    }
                                    className="text-gray-500 hover:text-red-600"
                                  >
                                    <FaTrash className="text-xs" />
                                  </button>
                                </div>
                              )}
                            </div>
                            {editingReply === reply._id ? (
                              <EditForm
                                initialValue={reply.content}
                                onSave={(content) =>
                                  handleEditReply(comment._id, reply._id, content)
                                }
                                onCancel={() => setEditingReply(null)}
                              />
                            ) : (
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {reply.content}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Edit Form Component
const EditForm = ({ initialValue, onSave, onCancel }) => {
  const [value, setValue] = useState(initialValue);

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
        rows="2"
      />
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onSave(value)}
          className="px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CommentSection;

