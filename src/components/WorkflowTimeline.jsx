// WorkflowTimeline - Visual timeline of project workflow phases
import React from 'react';
import ProjectStatusBadge from './ProjectStatusBadge';

const WORKFLOW_PHASES = [
    { status: 'draft', label: 'Draft' },
    { status: 'pending_proposal', label: 'Proposal' },
    { status: 'supervisor_review', label: 'Review' },
    { status: 'approved', label: 'Approved' },
    { status: 'mid_defense', label: 'Mid Defense' },
    { status: 'final_submission', label: 'Final' },
    { status: 'completed', label: 'Completed' }
];

const WorkflowTimeline = ({ currentStatus, milestones = [], className = '' }) => {
    const currentIndex = WORKFLOW_PHASES.findIndex(p => p.status === currentStatus);

    const getPhaseState = (index) => {
        if (currentStatus === 'changes_requested') {
            // Special case: changes requested means we're going back
            if (index <= 2) return 'completed';
            return 'pending';
        }

        if (index < currentIndex) return 'completed';
        if (index === currentIndex) return 'current';
        return 'pending';
    };

    const PhaseIcon = ({ state }) => {
        switch (state) {
            case 'completed':
                return (
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
            case 'current':
                return (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                );
            case 'pending':
            default:
                return (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    </div>
                );
        }
    };

    return (
        <div className={`${className}`}>
            {/* Current Status Badge */}
            <div className="mb-6 flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-700">Current Status:</h3>
                <ProjectStatusBadge status={currentStatus} size="lg" />
            </div>

            {/* Timeline */}
            <div className="relative">
                {/* Connection Line */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 -z-10"></div>

                {/* Phases */}
                <div className="flex justify-between items-start">
                    {WORKFLOW_PHASES.map((phase, index) => {
                        const state = getPhaseState(index);
                        const milestone = milestones.find(m => m.phase === phase.status);

                        return (
                            <div key={phase.status} className="flex flex-col items-center" style={{ flex: 1 }}>
                                {/* Icon */}
                                <PhaseIcon state={state} />

                                {/* Label */}
                                <div className="mt-2 text-center">
                                    <p className={`text-sm font-medium ${state === 'current' ? 'text-blue-600' :
                                            state === 'completed' ? 'text-green-600' :
                                                'text-gray-400'
                                        }`}>
                                        {phase.label}
                                    </p>

                                    {/* Milestone Info */}
                                    {milestone && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(milestone.completedAt || milestone.createdAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Changes Requested Alert */}
            {currentStatus === 'changes_requested' && (
                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">🔄</span>
                        <div>
                            <h4 className="font-semibold text-orange-800">Changes Requested</h4>
                            <p className="text-sm text-orange-700 mt-1">
                                Your supervisor has requested changes. Please review their feedback and resubmit.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkflowTimeline;
