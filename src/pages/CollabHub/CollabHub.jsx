import React, { useState, useEffect } from 'react';
import { FaPlus, FaFilter, FaRocket } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { useToast } from '../../components/Toast';
import CollabCard from '../../components/CollabCard';
import CollabPostForm from '../../components/CollabPostForm';
import LoadingSpinner from '../../components/LoadingSpinner';
import SkeletonCard from '../../components/SkeletonCard';

const CollabHub = () => {
    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [filters, setFilters] = useState({
        projectType: 'All',
        skill: ''
    });

    // Fetch collaboration posts
    useEffect(() => {
        fetchPosts();
    }, [filters]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const filterParams = {};
            if (filters.projectType !== 'All') {
                filterParams.projectType = filters.projectType;
            }
            if (filters.skill) {
                filterParams.skill = filters.skill;
            }

            const result = await api.getCollabPosts(filterParams);
            setPosts(result.posts || result || []);
        } catch (error) {
            showToast(error.message || 'Failed to load collaboration posts', 'error');
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = () => {
        if (!isAuthenticated) {
            showToast('Please login to create a collaboration post', 'info');
            return;
        }
        setIsFormOpen(true);
    };

    const handlePostCreated = (newPost) => {
        // Add new post to the top of the list
        setPosts(prev => [newPost, ...prev]);
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/20 pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
                        <FaRocket />
                        <span>Find Your Perfect Teammate</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Collaboration <span className="text-green-600">Hub</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Connect with fellow students, find project partners, and build amazing things together
                    </p>
                </div>

                {/* Action Bar */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Create Post Button */}
                        <button
                            onClick={handleCreatePost}
                            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
                        >
                            <FaPlus />
                            Create Collaboration Post
                        </button>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex items-center gap-2">
                                <FaFilter className="text-gray-400" />
                                <span className="text-sm font-semibold text-gray-700">Filter by:</span>
                            </div>

                            {/* Project Type Filter */}
                            <select
                                value={filters.projectType}
                                onChange={(e) => handleFilterChange('projectType', e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm font-medium"
                            >
                                <option value="All">All Types</option>
                                <option value="Thesis">Thesis</option>
                                <option value="Semester Project">Semester Project</option>
                                <option value="Hackathon">Hackathon</option>
                            </select>

                            {/* Skill Filter (Simple text input for now) */}
                            <input
                                type="text"
                                value={filters.skill}
                                onChange={(e) => handleFilterChange('skill', e.target.value)}
                                placeholder="Filter by skill..."
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Posts Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <SkeletonCard key={n} />
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaRocket className="text-4xl text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Collaboration Posts Found</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            {filters.projectType !== 'All' || filters.skill
                                ? 'Try adjusting your filters to see more results'
                                : 'Be the first to create a collaboration post!'}
                        </p>
                        {isAuthenticated && (
                            <button
                                onClick={handleCreatePost}
                                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 inline-flex items-center gap-2 font-semibold shadow-md hover:shadow-lg"
                            >
                                <FaPlus />
                                Create First Post
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Results Count */}
                        <div className="mb-4">
                            <p className="text-sm text-gray-600">
                                Showing <span className="font-semibold text-gray-900">{posts.length}</span> collaboration {posts.length === 1 ? 'post' : 'posts'}
                            </p>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <CollabCard key={post._id || post.id} post={post} />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Collaboration Post Form Modal */}
            <CollabPostForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={handlePostCreated}
            />
        </div>
    );
};

export default CollabHub;
