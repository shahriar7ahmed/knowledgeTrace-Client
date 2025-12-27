import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaUser, FaProjectDiagram } from 'react-icons/fa';

const ProfileCard = ({ user, showCounts = true }) => {
    const {
        _id,
        name,
        displayName,
        email,
        bio,
        role,
        skills = [],
        thesesCount = 0,
        collabPostsCount = 0,
        profilePicture,
    } = user || {};

    const userName = displayName || name || 'Anonymous User';
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden max-w-sm w-full"
        >
            {/* Royal Blue Header */}
            <div className="h-24 bg-gradient-to-r from-royal to-primary-500" />

            {/* Profile Picture Overlapping Header */}
            <div className="px-6 pb-6">
                <div className="flex flex-col items-center -mt-16">
                    <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-royal to-primary-400 flex items-center justify-center overflow-hidden">
                        {profilePicture ? (
                            <img
                                src={profilePicture}
                                alt={userName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-white text-4xl font-bold">{userInitial}</span>
                        )}
                    </div>

                    {/* Name and Role */}
                    <h3 className="text-xl font-bold text-gray-900 mt-4 text-center">
                        {userName}
                    </h3>
                    {role && (
                        <p className="text-sm text-royal font-medium mt-1">
                            {role}
                        </p>
                    )}

                    {/* Bio */}
                    {bio && (
                        <p className="text-sm text-gray-600 text-center mt-3 line-clamp-3">
                            {bio}
                        </p>
                    )}

                    {/* Skills */}
                    {skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center mt-4">
                            {skills.slice(0, 5).map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                            {skills.length > 5 && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                    +{skills.length - 5} more
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Stats */}
                {showCounts && (
                    <div className="grid grid-cols-2 gap-1 mt-6 border-t border-gray-200 pt-4">
                        <Link
                            to={`/profile/${_id}?tab=theses`}
                            className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                        >
                            <div className="flex items-center gap-2 text-royal group-hover:text-primary-700">
                                <FaProjectDiagram className="text-lg" />
                                <span className="text-2xl font-bold">{thesesCount}</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 font-medium">My Theses</p>
                        </Link>

                        <Link
                            to={`/profile/${_id}?tab=collabs`}
                            className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group border-l border-gray-200"
                        >
                            <div className="flex items-center gap-2 text-royal group-hover:text-primary-700">
                                <FaUser className="text-lg" />
                                <span className="text-2xl font-bold">{collabPostsCount}</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 font-medium">Collab Posts</p>
                        </Link>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ProfileCard;
