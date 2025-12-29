// SupervisorReviewForm - Form for supervisor to approve/reject projects
import React, { useState } from 'react';
import { FaCheck, FaTimes, FaEdit } from 'react-icons/fa';

const SupervisorReviewForm = ({ project, onSubmit, onCancel, isSubmitting = false }) => {
    const [action, setAction] = useState('');
    const [feedback, setFeedback] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!action) return;
        onSubmit({ action, feedback });
    };

    const actions = [
        { value: 'approve', label: 'Approve', icon: FaCheck, color: 'green' },
        { value: 'request_changes', label: 'Request Changes', icon: FaEdit, color: 'orange' },
        { value: 'reject', label: 'Reject', icon: FaTimes, color: 'red' }
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">{project.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{project.abstract}</p>
            </div>

            {/* Action Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Review Decision *
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {actions.map(({ value, label, icon: Icon, color }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setAction(value)}
                            className={`
                p-4 rounded-lg border-2 transition-all
                ${action === value
                                    ? `border-${color}-500 bg-${color}-50`
                                    : 'border-gray-200 hover:border-gray-300'
                                }
              `}
                        >
                            <Icon className={`w-6 h-6 mx-auto mb-2 ${action === value ? `text-${color}-600` : 'text-gray-400'}`} />
                            <p className={`text-sm font-medium ${action === value ? `text-${color}-700` : 'text-gray-600'}`}>
                                {label}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Feedback */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback {(action === 'request_changes' || action === 'reject') && <span className="text-red-500">*</span>}
                </label>
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder={
                        action === 'approve'
                            ? 'Optional: Add approval comments...'
                            : action === 'request_changes'
                                ? 'Specify what changes are needed...'
                                : action === 'reject'
                                    ? 'Explain the reason for rejection...'
                                    : 'Provide feedback for the student...'
                    }
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required={action === 'request_changes' || action === 'reject'}
                />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!action || isSubmitting || ((action === 'request_changes' || action === 'reject') && !feedback.trim())}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </div>
        </form>
    );
};

export default SupervisorReviewForm;
