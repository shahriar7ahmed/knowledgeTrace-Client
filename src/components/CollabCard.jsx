import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaUser, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const CollabCard = ({ post }) => {
    // Format timestamp to relative time (e.g., "2 days ago")
    const getRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    };

    // Truncate description
    const truncateText = (text, maxLength = 120) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    // Get project type color
    const getProjectTypeColor = (type) => {
        const colors = {
            'Thesis': 'bg-green-100 text-green-700 border-green-200',
            'Semester Project': 'bg-blue-100 text-blue-700 border-blue-200',
            'Hackathon': 'bg-purple-100 text-purple-700 border-purple-200'
        };
        return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    return (
        <div className="group rounded-2xl shadow-md bg-white hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-green-200 hover:-translate-y-1">
            {/* Header with Status Badge */}
            <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-200 flex-1 pr-3">
                    {post.title}
                </h3>
                {post.status === 'OPEN' ? (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 text-xs rounded-full font-semibold border border-green-200 whitespace-nowrap">
                        <FaCheckCircle className="text-xs" />
                        OPEN
                    </span>
                ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-full font-semibold border border-gray-200 whitespace-nowrap">
                        <FaTimesCircle className="text-xs" />
                        CLOSED
                    </span>
                )}
            </div>

            {/* Project Type Badge */}
            <div className="mb-3">
                <span className={`inline-block px-3 py-1 text-xs rounded-lg font-semibold border ${getProjectTypeColor(post.projectType)}`}>
                    {post.projectType}
                </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {truncateText(post.description)}
            </p>

            {/* Skills Required */}
            {post.skillsRequired && post.skillsRequired.length > 0 && (
                <div className="mb-4">
                    <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wide">Skills Required:</p>
                    <div className="flex flex-wrap gap-2">
                        {post.skillsRequired.slice(0, 5).map((skill, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 text-xs rounded-lg font-semibold border border-green-200"
                            >
                                {skill}
                            </span>
                        ))}
                        {post.skillsRequired.length > 5 && (
                            <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium">
                                +{post.skillsRequired.length - 5} more
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Footer: Posted By & Timestamp */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaUser className="text-green-600" />
                    <span>Posted by</span>
                    <Link
                        to={`/profile/${post.owner?.uid || post.owner?._id || post.owner}`}
                        className="font-semibold text-green-600 hover:text-green-700 hover:underline transition-colors duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {post.owner?.name || post.owner?.displayName || 'Unknown User'}
                    </Link>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <FaClock />
                    <span>{getRelativeTime(post.createdAt)}</span>
                </div>
            </div>

            {/* Action Button */}
            <div className="mt-4">
                <Link
                    to={`/profile/${post.owner?.uid || post.owner?._id || post.owner}`}
                    className="block w-full text-center px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg"
                >
                    View Profile & Contact
                </Link>
            </div>
        </div>
    );
};

export default CollabCard;
