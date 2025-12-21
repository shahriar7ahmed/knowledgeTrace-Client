import React from 'react';

/**
 * LoadingSpinner Component
 * A reusable loading spinner with different sizes
 * 
 * @param {string} size - Size of the spinner: 'sm', 'md', or 'lg'
 * @param {string} className - Additional CSS classes
 * @param {string} color - Color of the spinner (primary, secondary, white, etc.)
 */
const LoadingSpinner = ({ size = 'md', className = '', color = 'primary' }) => {
    // Size classes
    const sizeClasses = {
        sm: 'spinner-sm',
        md: 'spinner-md',
        lg: 'spinner-lg',
    };

    // Color classes
    const colorClasses = {
        primary: 'text-primary-600',
        secondary: 'text-secondary-600',
        white: 'text-white',
        gray: 'text-gray-600',
        success: 'text-success-600',
        error: 'text-error-600',
    };

    return (
        <div className={`spinner ${sizeClasses[size]} ${colorClasses[color]} ${className}`} role="status" aria-label="Loading">
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default LoadingSpinner;
