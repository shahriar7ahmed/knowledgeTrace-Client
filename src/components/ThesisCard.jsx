import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from './Button';

const ThesisCard = ({ project, delay = 0 }) => {
    const {
        _id,
        title,
        description,
        author,
        tags = [],
        department,
        year,
    } = project;

    // Truncate description to 2 lines (approximately 120 characters)
    const truncatedDescription = description?.length > 120
        ? description.substring(0, 120) + '...'
        : description;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200"
        >
            <div className="p-6">
                {/* Header with Author */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-royal to-primary-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {author?.name?.charAt(0) || author?.displayName?.charAt(0) || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {author?.name || author?.displayName || 'Anonymous'}
                        </p>
                        {(department || year) && (
                            <p className="text-xs text-gray-500">
                                {department} {year && `• ${year}`}
                            </p>
                        )}
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {truncatedDescription}
                </p>

                {/* Tags */}
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                            >
                                #{tag}
                            </span>
                        ))}
                        {tags.length > 3 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                +{tags.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* View Details Button */}
                <Link to={`/project/${_id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                        View Details
                    </Button>
                </Link>
            </div>
        </motion.div>
    );
};

export default ThesisCard;
