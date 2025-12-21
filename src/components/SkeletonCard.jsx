import React from 'react';

/**
 * SkeletonCard Component
 * A loading skeleton for card layouts
 * 
 * @param {boolean} withImage - Whether to show image skeleton
 * @param {boolean} withActions - Whether to show action buttons skeleton
 * @param {number} lines - Number of text lines to show (default: 3)
 */
const SkeletonCard = ({ withImage = false, withActions = true, lines = 3 }) => {
    return (
        <div className="card">
            {withImage && (
                <div className="skeleton w-full h-48"></div>
            )}

            <div className="card-body space-y-4">
                {/* Title skeleton */}
                <div className="skeleton-title"></div>

                {/* Text lines skeleton */}
                <div className="space-y-2">
                    {[...Array(lines)].map((_, index) => (
                        <div
                            key={index}
                            className="skeleton-text"
                            style={{ width: index === lines - 1 ? '75%' : '100%' }}
                        ></div>
                    ))}
                </div>

                {withActions && (
                    <div className="flex gap-2 pt-2">
                        <div className="skeleton h-9 w-24 rounded-lg"></div>
                        <div className="skeleton h-9 w-24 rounded-lg"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * SkeletonProjectCard Component
 * Specific skeleton for project cards in the knowledge trace app
 */
export const SkeletonProjectCard = () => {
    return (
        <div className="card-hover">
            <div className="card-body space-y-4">
                {/* Project title */}
                <div className="skeleton h-6 w-3/4"></div>

                {/* Author and meta info */}
                <div className="flex items-center gap-2">
                    <div className="skeleton-avatar"></div>
                    <div className="flex-1 space-y-1.5">
                        <div className="skeleton h-4 w-32"></div>
                        <div className="skeleton h-3 w-24"></div>
                    </div>
                </div>

                {/* Abstract preview */}
                <div className="space-y-2">
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text" style={{ width: '60%' }}></div>
                </div>

                {/* Tech stack tags */}
                <div className="flex gap-2 flex-wrap">
                    <div className="skeleton h-6 w-16 rounded-full"></div>
                    <div className="skeleton h-6 w-20 rounded-full"></div>
                    <div className="skeleton h-6 w-14 rounded-full"></div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex gap-4">
                        <div className="skeleton h-4 w-12"></div>
                        <div className="skeleton h-4 w-12"></div>
                        <div className="skeleton h-4 w-12"></div>
                    </div>
                    <div className="skeleton h-4 w-16"></div>
                </div>
            </div>
        </div>
    );
};

/**
 * SkeletonList Component
 * Renders multiple skeleton cards for list loading states
 * 
 * @param {number} count - Number of skeleton cards to show
 * @param {string} type - Type of skeleton ('card' or 'project')
 */
export const SkeletonList = ({ count = 3, type = 'card' }) => {
    const SkeletonComponent = type === 'project' ? SkeletonProjectCard : SkeletonCard;

    return (
        <div className="grid gap-6">
            {[...Array(count)].map((_, index) => (
                <SkeletonComponent key={index} />
            ))}
        </div>
    );
};

export default SkeletonCard;
