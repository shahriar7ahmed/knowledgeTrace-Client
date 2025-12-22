import toast from 'react-hot-toast';

/**
 * Toast notification utility
 * Provides consistent styling and behavior for all toast notifications
 */

// Default options for all toasts
const defaultOptions = {
    duration: 4000,
    position: 'top-right',
    style: {
        borderRadius: '8px',
        background: '#1a1a2e',
        color: '#fff',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        maxWidth: '500px',
    },
};

export const showToast = {
    /**
     * Success toast - green theme
     */
    success: (message, options = {}) => {
        return toast.success(message, {
            ...defaultOptions,
            ...options,
            iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
            },
            style: {
                ...defaultOptions.style,
                border: '1px solid #10b981',
                ...options.style,
            },
        });
    },

    /**
     * Error toast - red theme
     */
    error: (message, options = {}) => {
        return toast.error(message, {
            ...defaultOptions,
            duration: 5000, // Show errors a bit longer
            ...options,
            iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
            },
            style: {
                ...defaultOptions.style,
                border: '1px solid #ef4444',
                ...options.style,
            },
        });
    },

    /**
     * Warning toast - yellow theme
     */
    warning: (message, options = {}) => {
        return toast(message, {
            ...defaultOptions,
            ...options,
            icon: '⚠️',
            style: {
                ...defaultOptions.style,
                border: '1px solid #f59e0b',
                ...options.style,
            },
        });
    },

    /**
     * Info toast - blue theme
     */
    info: (message, options = {}) => {
        return toast(message, {
            ...defaultOptions,
            ...options,
            icon: 'ℹ️',
            style: {
                ...defaultOptions.style,
                border: '1px solid #3b82f6',
                ...options.style,
            },
        });
    },

    /**
     * Loading toast - with promise support
     */
    loading: (message, options = {}) => {
        return toast.loading(message, {
            ...defaultOptions,
            ...options,
        });
    },

    /**
     * Promise toast - automatically shows loading, success, or error
     */
    promise: (promise, messages, options = {}) => {
        return toast.promise(
            promise,
            {
                loading: messages.loading || 'Loading...',
                success: messages.success || 'Success!',
                error: messages.error || 'Error occurred',
            },
            {
                ...defaultOptions,
                ...options,
            }
        );
    },

    /**
     * Custom toast with full control
     */
    custom: (message, options = {}) => {
        return toast(message, {
            ...defaultOptions,
            ...options,
        });
    },

    /**
     * Dismiss a specific toast or all toasts
     */
    dismiss: (toastId) => {
        if (toastId) {
            toast.dismiss(toastId);
        } else {
            toast.dismiss();
        }
    },
};

export default showToast;
