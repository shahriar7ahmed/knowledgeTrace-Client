import React, { useState } from 'react';
import { FaTimes, FaPlus, FaRocket } from 'react-icons/fa';
import { useToast } from './Toast';
import { api } from '../utils/api';

const CollabPostForm = ({ isOpen, onClose, onSuccess }) => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        skillsRequired: [],
        projectType: 'Thesis'
    });
    const [currentSkill, setCurrentSkill] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSkill = (e) => {
        e.preventDefault();
        const skill = currentSkill.trim();
        if (skill && !formData.skillsRequired.includes(skill)) {
            setFormData(prev => ({
                ...prev,
                skillsRequired: [...prev.skillsRequired, skill]
            }));
            setCurrentSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skillsRequired: prev.skillsRequired.filter(s => s !== skillToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title.trim()) {
            showToast('Please enter a project title', 'error');
            return;
        }
        if (!formData.description.trim()) {
            showToast('Please enter a project description', 'error');
            return;
        }
        if (formData.skillsRequired.length === 0) {
            showToast('Please add at least one required skill', 'error');
            return;
        }

        setLoading(true);
        try {
            const result = await api.createCollabPost(formData);
            showToast('Collaboration post created successfully!', 'success');

            // Reset form
            setFormData({
                title: '',
                description: '',
                skillsRequired: [],
                projectType: 'Thesis'
            });

            if (onSuccess) onSuccess(result);
            onClose();
        } catch (error) {
            showToast(error.message || 'Failed to create collaboration post', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 md:p-8 transform transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                <FaRocket className="text-white text-lg" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Create Collaboration Post</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
                            aria-label="Close"
                        >
                            <FaTimes className="text-xl" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                                Project Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                maxLength={100}
                                placeholder="e.g., Machine Learning Research Assistant Needed"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100 characters</p>
                        </div>

                        {/* Project Type */}
                        <div>
                            <label htmlFor="projectType" className="block text-sm font-semibold text-gray-700 mb-2">
                                Project Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="projectType"
                                name="projectType"
                                value={formData.projectType}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm"
                            >
                                <option value="Thesis">Thesis</option>
                                <option value="Semester Project">Semester Project</option>
                                <option value="Hackathon">Hackathon</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                                Project Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                maxLength={1000}
                                rows={5}
                                placeholder="Describe your project, what you're looking for in a collaborator, and any specific requirements..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm resize-none"
                            ></textarea>
                            <p className="text-xs text-gray-500 mt-1">{formData.description.length}/1000 characters</p>
                        </div>

                        {/* Skills Required */}
                        <div>
                            <label htmlFor="skillInput" className="block text-sm font-semibold text-gray-700 mb-2">
                                Skills Required <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    id="skillInput"
                                    value={currentSkill}
                                    onChange={(e) => setCurrentSkill(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleAddSkill(e);
                                        }
                                    }}
                                    placeholder="e.g., Python, React, Machine Learning"
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSkill}
                                    className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-2 font-medium text-sm"
                                >
                                    <FaPlus />
                                    Add
                                </button>
                            </div>

                            {/* Skills Display */}
                            {formData.skillsRequired.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {formData.skillsRequired.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 text-sm rounded-lg font-semibold border border-green-200 flex items-center gap-2"
                                        >
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSkill(skill)}
                                                className="text-green-600 hover:text-red-600 transition-colors duration-200"
                                                aria-label={`Remove ${skill}`}
                                            >
                                                <FaTimes className="text-xs" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic">No skills added yet. Add at least one skill.</p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {loading ? 'Creating...' : 'Create Post'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CollabPostForm;
