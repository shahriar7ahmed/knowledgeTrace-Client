import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useProjects } from '../../context/ProjectContext';
import SearchBar from '../../components/SearchBar';
import ProjectCard from '../../components/ProjectCard';
import AdvancedFilters from '../../components/AdvancedFilters';
import FilterChips from '../../components/FilterChips';
import { FaFilter, FaTimes } from 'react-icons/fa';

// Debounce utility function
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const ThesisFinder = () => {
  const { fetchProjects, projects } = useProjects();
  const [filters, setFilters] = useState({
    techStack: [],
    tags: [],
    author: '',
    year: '',
    supervisor: '',
    keywords: '',
    sortBy: 'date-desc',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    // Load all projects on mount
    fetchProjects({});
  }, []);

  // Update filters when search term changes (debounced)
  useEffect(() => {
    if (debouncedSearchTerm !== filters.keywords) {
      setFilters(prev => ({ ...prev, keywords: debouncedSearchTerm }));
    }
  }, [debouncedSearchTerm, filters.keywords]);

  // Filter and sort projects
  const displayProjects = useMemo(() => {
    let filtered = [...projects];

    // Apply filters
    if (filters.keywords) {
      const searchLower = filters.keywords.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchLower) ||
          p.abstract?.toLowerCase().includes(searchLower) ||
          p.author?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.techStack && filters.techStack.length > 0) {
      filtered = filtered.filter((p) =>
        filters.techStack.some((tech) =>
          p.techStack?.some((pTech) => pTech.toLowerCase() === tech.toLowerCase())
        )
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((p) =>
        filters.tags.some((tag) =>
          p.tags?.some((pTag) => pTag.toLowerCase() === tag.toLowerCase())
        )
      );
    }

    if (filters.author) {
      filtered = filtered.filter((p) =>
        p.author?.toLowerCase().includes(filters.author.toLowerCase())
      );
    }

    if (filters.supervisor) {
      filtered = filtered.filter((p) =>
        p.supervisor?.toLowerCase().includes(filters.supervisor.toLowerCase())
      );
    }

    if (filters.year) {
      filtered = filtered.filter((p) => p.year?.toString() === filters.year.toString());
    }

    // Apply sorting
    const sortBy = filters.sortBy || 'date-desc';
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
        case 'date-asc':
          return new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date);
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'title-desc':
          return (b.title || '').localeCompare(a.title || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [projects, filters]);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setShowFilters(false);
  }, []);

  const handleRemoveFilter = useCallback((key, value) => {
    setFilters(prev => {
      const updated = { ...prev };

      if (key === 'techStack' || key === 'tags') {
        updated[key] = (prev[key] || []).filter(item => item !== value);
      } else {
        updated[key] = '';
      }

      return updated;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      techStack: [],
      tags: [],
      author: '',
      year: '',
      supervisor: '',
      keywords: searchTerm, // Preserve search term
      sortBy: 'date-desc',
    });
  }, [searchTerm]);

  const hasActiveFilters = filters.techStack?.length > 0 ||
    filters.tags?.length > 0 ||
    filters.author ||
    filters.supervisor ||
    filters.year ||
    (filters.sortBy && filters.sortBy !== 'date-desc');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">🔍</span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Thesis <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Finder</span>
              </h1>
              <p className="text-gray-600 mt-1">
                Search and explore completed theses and projects from students
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by title, abstract, author..."
            initialValue={searchTerm}
          />
        </div>

        {/* Filter Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            <FaFilter />
            {showFilters ? 'Hide Filters' : 'Show Advanced Filters'}
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 transition font-medium"
            >
              <FaTimes />
              Clear All Filters
            </button>
          )}
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="mb-6">
            <FilterChips
              filters={filters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={clearAllFilters}
            />
          </div>
        )}

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="mb-6">
            <AdvancedFilters
              projects={projects}
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>
        )}

        {/* Results */}
        <div>
          <div className="mb-4">
            <p className="text-gray-600">
              {isSearching
                ? 'Searching...'
                : `Found ${displayProjects.length} project${displayProjects.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {displayProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProjects.map((project) => (
                <ProjectCard key={project._id || project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <p className="text-xl font-bold text-gray-900">No projects found</p>
              <p className="text-gray-600 mt-2">
                Try adjusting your search criteria or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThesisFinder;
