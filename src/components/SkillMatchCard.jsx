// SkillMatchCard - Display student match with skill breakdown
import React from 'react';
import MatchLevelBadge from './MatchLevelBadge';
import { FaEnvelope, FaUserGraduate } from 'react-icons/fa';

const SkillMatchCard = ({
    student,
    matchScore,
    matchedSkills = [],
    missingSkills = [],
    matchLevel,
    onInvite,
    isInviting = false
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                        {student.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-gray-800">{student.name || student.displayName}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaEnvelope className="w-3 h-3" />
                            <span>{student.email}</span>
                        </div>
                        {student.department && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <FaUserGraduate className="w-3 h-3" />
                                <span>{student.department}</span>
                            </div>
                        )}
                    </div>
                </div>

                <MatchLevelBadge level={matchLevel} score={matchScore} />
            </div>

            {/* Skills Breakdown */}
            <div className="space-y-3">
                {/* Matched Skills */}
                {matchedSkills.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">✅ Matched Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {matchedSkills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full border border-green-200"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Missing Skills */}
                {missingSkills.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">❌ Missing Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {missingSkills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full border border-red-200"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Student Skills */}
                {student.skills && student.skills.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">💼 All Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {student.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Action Button */}
            {onInvite && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <button
                        onClick={onInvite}
                        disabled={isInviting}
                        className={`
              w-full py-2.5 px-4 rounded-lg font-medium transition-colors
              ${isInviting
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                            }
            `}
                    >
                        {isInviting ? 'Sending Invitation...' : '📧 Send Team Invitation'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SkillMatchCard;
