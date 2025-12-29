// MatchLevelBadge - Display skill match level indicator
import React from 'react';

const MATCH_LEVELS = {
    best_fit: {
        label: 'Best Fit',
        color: 'bg-green-500 text-white',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: '🌟'
    },
    good_fit: {
        label: 'Good Fit',
        color: 'bg-yellow-500 text-white',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        icon: '✨'
    },
    needs_training: {
        label: 'Needs Training',
        color: 'bg-gray-500 text-white',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        icon: '📚'
    },
    no_requirements: {
        label: 'No Requirements',
        color: 'bg-blue-500 text-white',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: 'ℹ️'
    }
};

const MatchLevelBadge = ({ level, score, showIcon = true, size = 'md' }) => {
    const config = MATCH_LEVELS[level] || MATCH_LEVELS.needs_training;

    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2'
    };

    return (
        <div className="flex items-center gap-2">
            <span className={`
        inline-flex items-center gap-1.5 
        ${sizeClasses[size]} 
        ${config.color} 
        rounded-full font-medium shadow-sm
      `}>
                {showIcon && <span>{config.icon}</span>}
                <span>{config.label}</span>
            </span>
            {score !== undefined && score !== null && (
                <span className="text-lg font-bold text-gray-700">
                    {score}%
                </span>
            )}
        </div>
    );
};

export default MatchLevelBadge;
