// MilestoneCard - Display individual project milestone
import React from 'react';
import { FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const MilestoneCard = ({ milestone, reviewer }) => {
    const statusColors = {
        pending: 'bg-gray-100 border-gray-300 text-gray-700',
        in_progress: 'bg-blue-100 border-blue-300 text-blue-700',
        completed: 'bg-green-100 border-green-300 text-green-700',
        rejected: 'bg-red-100 border-red-300 text-red-700'
    };

    const statusIcons = {
        pending: FaClock,
        in_progress: FaClock,
        completed: FaCheckCircle,
        rejected: FaTimesCircle
    };

    const Icon = statusIcons[milestone.status] || FaClock;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h4 className="font-semibold text-gray-800 capitalize">
                        {milestone.phase.replace('_', ' ')}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                        {new Date(milestone.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </p>
                </div>
                <span className={`
          flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border
          ${statusColors[milestone.status]}
        `}>
                    <Icon className="w-3 h-3" />
                    {milestone.status.replace('_', ' ')}
                </span>
            </div>

            {/* Feedback */}
            {milestone.feedback && (
                <div className="bg-gray-50 rounded-md p-3 mb-3">
                    <p className="text-sm text-gray-700">{milestone.feedback}</p>
                </div>
            )}

            {/* Reviewer Info */}
            {reviewer && milestone.completedAt && (
                <div className="text-xs text-gray-600">
                    Reviewed by <span className="font-medium">{reviewer.name}</span> on{' '}
                    {new Date(milestone.completedAt).toLocaleDateString()}
                </div>
            )}

            {/* Deadline */}
            {milestone.deadline && (
                <div className="text-xs text-gray-600 mt-2">
                    Deadline: {new Date(milestone.deadline).toLocaleDateString()}
                </div>
            )}
        </div>
    );
};

export default MilestoneCard;
