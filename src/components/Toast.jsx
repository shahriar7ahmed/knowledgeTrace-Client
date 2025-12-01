import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

/**
 * Toast Notification Component
 * 
 * Displays temporary notification messages
 * 
 * Usage:
 *   const { showToast } = useToast();
 *   showToast('Success message', 'success');
 */
export const ToastContext = React.createContext();

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info', duration = 5000) => {
    setToast({ message, type, duration });
    
    // Auto-dismiss after duration
    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  const hideToast = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
};

const ToastNotification = ({ message, type, onClose }) => {
  const icons = {
    success: <FaCheckCircle className="text-green-500" />,
    error: <FaExclamationCircle className="text-red-500" />,
    warning: <FaExclamationCircle className="text-yellow-500" />,
    info: <FaInfoCircle className="text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const textColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${bgColors[type]} ${textColors[type]} min-w-[300px] max-w-md`}
      >
        <div className="text-xl">{icons[type]}</div>
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

// Add CSS animation (you can add this to your index.css)
const toastStyles = `
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = toastStyles;
  document.head.appendChild(styleSheet);
}

