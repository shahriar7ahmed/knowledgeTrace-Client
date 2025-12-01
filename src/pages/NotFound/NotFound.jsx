import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-green-600 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            <FaArrowLeft />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
          >
            <FaHome />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

