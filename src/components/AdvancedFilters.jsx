import React, { useState, useEffect } from 'react';
import { FaSearch, FaSort, FaChevronDown } from 'react-icons/fa';

/**
 * AdvancedFilters Component
 * Multi-select tech stack, tags, sort options, and advanced filtering
 */
const AdvancedFilters = ({ projects, filters, onFiltersChange }) => {
    const [localFilters, setLocalFilters] = useState(filters);
    const [showTechStackDropdown, setShowTechStackDropdown] = useState(false);
    const [showTagsDropdown, setShowTagsDropdown] = useState(false);

    // Extract unique tech stacks and tags from all projects
    const allTechStacks = [...new Set(projects.flatMap(p => p.techStack || []))].sort();
    const allTags = [...new Set(projects.flatMap(p => p.tags || []))].sort();
    const allYears = [...new Set(projects.map(p => p.year).filter(Boolean))].sort((a, b) => b - a);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const handleTechStackToggle = (tech) => {
        const currentTechStack = localFilters.techStack || [];
        const newTechStack = currentTechStack.includes(tech)
            ? currentTechStack.filter(t => t !== tech)
            : [...currentTechStack, tech];

        setLocalFilters({ ...localFilters, techStack: newTechStack });
    };

    const handleTagToggle = (tag) => {
        const currentTags = localFilters.tags || [];
        const newTags = currentTags.includes(tag)
            ? currentTags.filter(t => t !== tag)
            : [...currentTags, tag];

        setLocalFilters({ ...localFilters, tags: newTags });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocalFilters({ ...localFilters, [name]: value });
    };

    const handleApply = () => {
        onFiltersChange(localFilters);
    };

    const handleClear = () => {
        const clearedFilters = {
            techStack: [],
            tags: [],
            author: '',
            supervisor: '',
            year: '',
            sortBy: 'date-desc',
            keywords: localFilters.keywords || '', // Preserve search term
        };
        setLocalFilters(clearedFilters);
        onFiltersChange(clearedFilters);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Advanced Filters</h3>

            <div className="space-y-6">
                {/* Tech Stack Multi-Select */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tech Stack {localFilters.techStack?.length > 0 && (
                            <span className="text-green-600">({localFilters.techStack.length} selected)</span>
                        )}
                    </label>
                    <div className="relative">
                        <button
                            onClick={() => setShowTechStackDropdown(!showTechStackDropdown)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-left flex items-center justify-between hover:border-gray-400 transition-all duration-200"
                        >
                            <span className="text-gray-700">
                                {localFilters.techStack?.length > 0
                                    ? `${localFilters.techStack.join(', ')}`
                                    : 'Select technologies...'}
                            </span>
                            <FaChevronDown className={`text-gray-400 transition-transform ${showTechStackDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showTechStackDropdown && (
                            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                {allTechStacks.length > 0 ? (
                                    allTechStacks.map(tech => (
                                        <label
                                            key={tech}
                                            className="flex items-center px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={localFilters.techStack?.includes(tech) || false}
                                                onChange={() => handleTechStackToggle(tech)}
                                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                            />
                                            <span className="ml-3 text-gray-700">{tech}</span>
                                        </label>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm text-gray-500">No tech stacks found</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Tags Multi-Select */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tags/Categories {localFilters.tags?.length > 0 && (
                            <span className="text-green-600">({localFilters.tags.length} selected)</span>
                        )}
                    </label>
                    <div className="relative">
                        <button
                            onClick={() => setShowTagsDropdown(!showTagsDropdown)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-left flex items-center justify-between hover:border-gray-400 transition-all duration-200"
                        >
                            <span className="text-gray-700">
                                {localFilters.tags?.length > 0
                                    ? `${localFilters.tags.join(', ')}`
                                    : 'Select tags...'}
                            </span>
                            <FaChevronDown className={`text-gray-400 transition-transform ${showTagsDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showTagsDropdown && (
                            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                {allTags.length > 0 ? (
                                    allTags.map(tag => (
                                        <label
                                            key={tag}
                                            className="flex items-center px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={localFilters.tags?.includes(tag) || false}
                                                onChange={() => handleTagToggle(tag)}
                                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                            />
                                            <span className="ml-3 text-gray-700">{tag}</span>
                                        </label>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm text-gray-500">No tags found</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Text Filters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Author
                        </label>
                        <input
                            type="text"
                            name="author"
                            value={localFilters.author || ''}
                            onChange={handleInputChange}
                            placeholder="Search by author..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Supervisor
                        </label>
                        <input
                            type="text"
                            name="supervisor"
                            value={localFilters.supervisor || ''}
                            onChange={handleInputChange}
                            placeholder="Search by supervisor..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Year
                        </label>
                        <select
                            name="year"
                            value={localFilters.year || ''}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        >
                            <option value="">All Years</option>
                            {allYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Sort Options */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FaSort /> Sort By
                    </label>
                    <select
                        name="sortBy"
                        value={localFilters.sortBy || 'date-desc'}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    >
                        <option value="date-desc">Newest First</option>
                        <option value="date-asc">Oldest First</option>
                        <option value="title-asc">Title (A-Z)</option>
                        <option value="title-desc">Title (Z-A)</option>
                    </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                    <button
                        onClick={handleApply}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                    >
                        Apply Filters
                    </button>
                    <button
                        onClick={handleClear}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdvancedFilters;
