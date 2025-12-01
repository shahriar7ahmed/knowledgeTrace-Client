import React, { useState, useEffect } from 'react';
import { useProjects } from '../../context/ProjectContext';
import SearchBar from '../../components/SearchBar';
import ProjectCard from '../../components/ProjectCard';
import { FaFilter, FaTimes } from 'react-icons/fa';

const ThesisFinder = () => {
  const { fetchProjects, searchResults, projects } = useProjects();
  const [filters, setFilters] = useState({
    techStack: '',
    author: '',
    year: '',
    supervisor: '',
    keywords: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Load all projects on mount
    fetchProjects({});
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async (searchTerm) => {
    setIsSearching(true);
    const searchFilters = {
      ...filters,
      keywords: searchTerm,
    };
    await fetchProjects(searchFilters);
    setIsSearching(false);
  };

  const handleFilterSearch = async () => {
    setIsSearching(true);
    await fetchProjects(filters);
    setIsSearching(false);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const clearedFilters = {
      techStack: '',
      author: '',
      year: '',
      supervisor: '',
      keywords: '',
    };
    setFilters(clearedFilters);
    fetchProjects({});
  };

  const displayProjects = isSearching || searchResults.length > 0 ? searchResults : projects;

  // Get unique years for filter dropdown
  const years = [...new Set(projects.map((p) => p.year))].sort((a, b) => b - a);

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
              placeholder="Search by title, abstract, or keywords..."
            />
          </div>

          {/* Filter Toggle */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              <FaFilter />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            {(filters.techStack ||
              filters.author ||
              filters.year ||
              filters.supervisor ||
              filters.keywords) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 transition"
              >
                <FaTimes />
                Clear Filters
              </button>
            )}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Advanced Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tech Stack
                  </label>
                  <input
                    type="text"
                    name="techStack"
                    value={filters.techStack}
                    onChange={handleFilterChange}
                    placeholder="e.g., React, Python"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={filters.author}
                    onChange={handleFilterChange}
                    placeholder="Author name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <select
                    name="year"
                    value={filters.year}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  >
                    <option value="">All Years</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supervisor
                  </label>
                  <input
                    type="text"
                    name="supervisor"
                    value={filters.supervisor}
                    onChange={handleFilterChange}
                    placeholder="Supervisor name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleFilterSearch}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold"
                >
                  Clear
                </button>
              </div>
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

