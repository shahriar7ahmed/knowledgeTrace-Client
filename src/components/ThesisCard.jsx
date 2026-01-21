import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaUser, FaGraduationCap } from 'react-icons/fa';
import Button from './Button';

const ThesisCard = ({ project, delay = 0 }) => {
    const {
        _id,
        title,
        description,
        abstract,
        author,
        authorId,
        supervisor,
        supervisorId,
        tags = [],
        department,
        year,
    } = project;

    // Strip HTML tags from text
    const stripHtml = (html) => {
        if (!html || typeof html !== 'string') return '';
        // Remove HTML tags
        let text = html.replace(/<[^>]*>/g, '');
        // Decode common HTML entities
        text = text.replace(/&nbsp;/g, ' ')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&apos;/g, "'");
        // Remove excessive whitespace and trim
        return text.replace(/\s+/g, ' ').trim();
    };

    // Use abstract if available, fallback to description
    const contentText = abstract || description || '';
    const plainText = stripHtml(contentText);

    // Truncate to approximately 2 lines (120 characters)
    const truncatedText = plainText.length > 120
        ? plainText.substring(0, 120) + '...'
        : plainText;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200"
        >
            <div className="p-6">
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                    {title}
                </h3>

                {/* Abstract Preview */}
                {truncatedText && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                        {truncatedText}
                    </p>
                )}

                {/* Author and Supervisor Info */}
                <div className="space-y-2 mb-4 text-sm">
                    {/* Author */}
                    {author && (
                        <div className="flex items-center gap-2">
                            <FaUser className="text-royal flex-shrink-0" />
                            {authorId ? (
                                <Link
                                    to={`/profile/${authorId}`}
                                    className="text-gray-900 hover:text-royal hover:underline transition-colors font-medium truncate"
                                    title="View author profile"
                                >
                                    {author}
                                </Link>
                            ) : (
                                <span className="text-gray-900 font-medium truncate">{author}</span>
                            )}
                        </div>
                    )}

                    {/* Supervisor */}
                    {supervisor && (
                        <div className="flex items-center gap-2">
                            <FaGraduationCap className="text-royal flex-shrink-0" />
                            <span className="text-gray-600 text-xs">Supervisor:</span>
                            {supervisorId ? (
                                <Link
                                    to={`/profile/${supervisorId}`}
                                    className="text-gray-900 hover:text-royal hover:underline transition-colors font-medium truncate"
                                    title="View supervisor profile"
                                >
                                    {supervisor}
                                </Link>
                            ) : (
                                <span className="text-gray-900 font-medium truncate">{supervisor}</span>
                            )}
                        </div>
                    )}

                    {/* Year */}
                    {year && (
                        <div className="text-xs text-gray-500">
                            Year: {year}
                        </div>
                    )}
                </div>

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
