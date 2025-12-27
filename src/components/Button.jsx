import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    icon = null,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    className = '',
    onClick,
    type = 'button',
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-royal text-white hover:bg-royal-dark active:bg-primary-800 focus:ring-royal shadow-md hover:shadow-lg',
        outline: 'border-2 border-royal text-royal hover:bg-primary-50 active:bg-primary-100 focus:ring-royal',
        'outline-white': 'border-2 border-white text-white hover:bg-white/10 active:bg-white/20 focus:ring-white',
        ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-300',
        success: 'bg-success-600 text-white hover:bg-success-700 active:bg-success-800 focus:ring-success-500 shadow-md hover:shadow-lg',
        danger: 'bg-error-600 text-white hover:bg-error-700 active:bg-error-800 focus:ring-error-500 shadow-md hover:shadow-lg',
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return (
        <motion.button
            type={type}
            className={combinedClasses}
            onClick={onClick}
            disabled={disabled || loading}
            whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
            whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
            {...props}
        >
            {loading ? (
                <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {icon && iconPosition === 'left' && <FontAwesomeIcon icon={icon} className="text-sm" />}
                    {children}
                    {icon && iconPosition === 'right' && <FontAwesomeIcon icon={icon} className="text-sm" />}
                </>
            )}
        </motion.button>
    );
};

export default Button;
