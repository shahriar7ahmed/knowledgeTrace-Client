import React from 'react';
import { FaTimes } from 'react-icons/fa';

/**
 * FilterChips Component
 * Displays active filters as removable chips
 */
const FilterChips = ({ filters, onRemoveFilter, onClearAll }) => {
    const activeFilters = [];

    // Build list of active filters
    if (filters.techStack && filters.techStack.length > 0) {
        filters.techStack.forEach(tech => {
            activeFilters.push({ key: 'techStack', value: tech, label: `Tech: ${tech}` });
        });
    }

    if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach(tag => {
            activeFilters.push({ key: 'tags', value: tag, label: `Tag: ${tag}` });
        });
    }

    if (filters.author) {
        activeFilters.push({ key: 'author', value: filters.author, label: `Author: ${filters.author}` });
    }

    if (filters.supervisor) {
        activeFilters.push({ key: 'supervisor', value: filters.supervisor, label: `Supervisor: ${filters.supervisor}` });
    }

    if (filters.year) {
        activeFilters.push({ key: 'year', value: filters.year, label: `Year: ${filters.year}` });
    }

    if (filters.sortBy) {
        const sortLabels = {
            'date-desc': 'Newest First',
            'date-asc': 'Oldest First',
            'title-asc': 'Title A-Z',
            'title-desc': 'Title Z-A',
        };
        activeFilters.push({
            key: 'sortBy',
            value: filters.sortBy,
            label: `Sort: ${sortLabels[filters.sortBy] || filters.sortBy}`
        });
    }

    if (activeFilters.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700">
                    Active Filters ({activeFilters.length})
                </h4>
                <button
                    onClick={onClearAll}
                    className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
                >
                    Clear All
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                    <div
                        key={`${filter.key}-${filter.value}-${index}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg text-sm font-medium text-green-700 hover:bg-green-100 transition-colors duration-200"
                    >
                        <span>{filter.label}</span>
                        <button
                            onClick={() => onRemoveFilter(filter.key, filter.value)}
                            className="hover:bg-green-200 rounded-full p-0.5 transition-colors duration-200"
                            aria-label={`Remove ${filter.label} filter`}
                        >
                            <FaTimes className="text-xs" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FilterChips;
