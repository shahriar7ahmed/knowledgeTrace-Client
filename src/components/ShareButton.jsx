import React, { useState } from 'react';
import { FaShare, FaLink, FaCheck } from 'react-icons/fa';
import showToast from '../utils/toast';

/**
 * ShareButton Component
 * Provides share functionality with copy-to-clipboard
 */
const ShareButton = ({ project }) => {
    const [copied, setCopied] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const projectUrl = `${window.location.origin}/project/${project._id || project.id}`;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(projectUrl);
            setCopied(true);
            showToast.success('Link copied to clipboard!');

            setTimeout(() => {
                setCopied(false);
                setShowDropdown(false);
            }, 2000);
        } catch (error) {
            showToast.error('Failed to copy link');
        }
    };

    const shareToTwitter = () => {
        const text = `Check out this project: ${project.title}`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(projectUrl)}`;
        window.open(url, '_blank', 'width=550,height=420');
        setShowDropdown(false);
    };

    const shareToLinkedIn = () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(projectUrl)}`;
        window.open(url, '_blank', 'width=550,height=420');
        setShowDropdown(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
            >
                <FaShare />
                Share
            </button>

            {showDropdown && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                    />

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
                        <button
                            onClick={copyToClipboard}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 border-b border-gray-100"
                        >
                            {copied ? (
                                <>
                                    <FaCheck className="text-green-600" />
                                    <span className="text-green-600 font-medium">Link Copied!</span>
                                </>
                            ) : (
                                <>
                                    <FaLink className="text-gray-600" />
                                    <span className="text-gray-700">Copy Link</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={shareToTwitter}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 border-b border-gray-100"
                        >
                            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            </svg>
                            <span className="text-gray-700">Share on Twitter</span>
                        </button>

                        <button
                            onClick={shareToLinkedIn}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3"
                        >
                            <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                            <span className="text-gray-700">Share on LinkedIn</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ShareButton;
