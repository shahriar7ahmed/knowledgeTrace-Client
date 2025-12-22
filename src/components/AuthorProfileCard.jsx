import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaFileAlt } from 'react-icons/fa';

/**
 * AuthorProfileCard Component
 * Displays author information and their other projects
 */
const AuthorProfileCard = ({ project, allProjects }) => {
    const [expanded, setExpanded] = useState(false);

    const authorProjects = useMemo(() => {
        if (!project || !allProjects) return [];

        const currentId = project._id || project.id;
        const authorId = project.authorId;
        const authorName = project.author;

        // Find other projects by the same author
        return allProjects
            .filter(p => {
                const pId = p._id || p.id;
                if (pId === currentId) return false; // Exclude current project
                if (p.status !== 'approved') return false; // Only approved projects

                // Match by authorId or author name
                if (authorId && p.authorId === authorId) return true;
                if (authorName && p.author &&
                    p.author.toLowerCase() === authorName.toLowerCase()) return true;

                return false;
            })
            .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
            .slice(0, 5); // Limit to 5 projects
    }, [project, allProjects]);

    if (!project.author) {
        return null;
    }

    return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-md p-6 border border-green-100">
            <div className="flex items-start gap-4">
                {/* Author Avatar */}
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FaUser className="text-white text-2xl" />
                </div>

                <div className="flex-1">
                    {/* Author Info */}
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{project.author}</h3>
                    {project.email && (
                        <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                            <FaEnvelope className="text-green-600" />
                            <span>{project.email}</span>
                        </div>
                    )}

                    {/* Other Projects */}
                    {authorProjects.length > 0 && (
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <FaFileAlt className="text-green-600" />
                                    Other Projects ({authorProjects.length})
                                </h4>
                                {authorProjects.length > 3 && (
                                    <button
                                        onClick={() => setExpanded(!expanded)}
                                        className="text-xs text-green-600 hover:text-green-700 font-medium transition"
                                    >
                                        {expanded ? 'Show Less' : 'Show All'}
                                    </button>
                                )}
                            </div>
                            <div className="space-y-2">
                                {(expanded ? authorProjects : authorProjects.slice(0, 3)).map(p => (
                                    <Link
                                        key={p._id || p.id}
                                        to={`/project/${p._id || p.id}`}
                                        className="block p-3 bg-white rounded-lg border border-green-200 hover:border-green-400 hover:shadow-md transition-all duration-200"
                                    >
                                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                                            {p.title}
                                        </p>
                                        {p.year && (
                                            <p className="text-xs text-gray-600 mt-1">{p.year}</p>
                                        )}
                                        {p.techStack && p.techStack.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {p.techStack.slice(0, 3).map((tech, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                                {p.techStack.length > 3 && (
                                                    <span className="text-xs text-gray-500">+{p.techStack.length - 3}</span>
                                                )}
                                            </div>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {authorProjects.length === 0 && (
                        <p className="text-sm text-gray-600 mt-2">
                            This is the author's only project on KnowledgeTrace
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthorProfileCard;
