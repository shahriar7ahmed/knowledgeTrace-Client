// ProjectStatusBadge - Display project workflow status with color coding
import React from 'react';

const STATUS_CONFIG = {
    draft: {
        label: 'Draft',
        color: 'bg-gray-100 text-gray-700 border-gray-300',
        icon: '📝'
    },
    pending_proposal: {
        label: 'Pending Proposal',
        color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        icon: '⏳'
    },
    supervisor_review: {
        label: 'Under Review',
        color: 'bg-blue-100 text-blue-700 border-blue-300',
        icon: '👁️'
    },
    changes_requested: {
        label: 'Changes Requested',
        color: 'bg-orange-100 text-orange-700 border-orange-300',
        icon: '🔄'
    },
    approved: {
        label: 'Approved',
        color: 'bg-green-100 text-green-700 border-green-300',
        icon: '✅'
    },
    mid_defense: {
        label: 'Mid Defense',
        color: 'bg-purple-100 text-purple-700 border-purple-300',
        icon: '🎯'
    },
    final_submission: {
        label: 'Final Submission',
        color: 'bg-indigo-100 text-indigo-700 border-indigo-300',
        icon: '📋'
    },
    completed: {
        label: 'Completed',
        color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
        icon: '🎉'
    },
    archived: {
        label: 'Archived',
        color: 'bg-slate-100 text-slate-700 border-slate-300',
        icon: '📦'
    }
};

const ProjectStatusBadge = ({ status, size = 'md', showIcon = true }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2'
    };

    return (
        <span className={`
      inline-flex items-center gap-1.5 
      ${sizeClasses[size]} 
      ${config.color} 
      border rounded-full font-medium
    `}>
            {showIcon && <span>{config.icon}</span>}
            <span>{config.label}</span>
        </span>
    );
};

export default ProjectStatusBadge;
