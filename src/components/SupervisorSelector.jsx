import { useState, useEffect } from 'react';
import { FaSearch, FaGraduationCap, FaTimes, FaCheck } from 'react-icons/fa';
import { api } from '../utils/api';

/**
 * SupervisorSelector - Dropdown component for selecting supervisors
 * Used in project submission form
 */
const SupervisorSelector = ({
    selectedSupervisorId,
    onSelect,
    department = null,
    required = false
}) => {
    const [supervisors, setSupervisors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSupervisor, setSelectedSupervisor] = useState(null);

    useEffect(() => {
        fetchSupervisors();
    }, []);

    useEffect(() => {
        if (selectedSupervisorId && supervisors.length > 0) {
            const supervisor = supervisors.find(s => s.uid === selectedSupervisorId);
            setSelectedSupervisor(supervisor);
        }
    }, [selectedSupervisorId, supervisors]);

    const fetchSupervisors = async () => {
        try {
            setLoading(true);
            const response = await api.get('/supervisors');
            setSupervisors(response.supervisors || []);
        } catch (error) {
            console.error('Error fetching supervisors:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSupervisors = supervisors.filter(supervisor => {
        const matchesSearch = searchTerm === '' ||
            supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supervisor.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supervisor.researchAreas?.some(area =>
                area.toLowerCase().includes(searchTerm.toLowerCase())
            );

        const matchesDepartment = !department || supervisor.department === department;

        return matchesSearch && matchesDepartment;
    });

    const handleSelect = (supervisor) => {
        setSelectedSupervisor(supervisor);
        onSelect(supervisor.uid);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleClear = () => {
        setSelectedSupervisor(null);
        onSelect('');
    };

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Supervisor {required && <span className="text-red-500">*</span>}
            </label>

            {/* Selected Supervisor Display */}
            {selectedSupervisor ? (
                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                            {selectedSupervisor.photoURL ? (
                                <img
                                    src={selectedSupervisor.photoURL}
                                    alt={selectedSupervisor.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            ) : (
                                <FaGraduationCap className="text-green-600 dark:text-green-400 text-xl" />
                            )}
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {selectedSupervisor.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {selectedSupervisor.designation || 'Supervisor'}
                                {selectedSupervisor.department && ` • ${selectedSupervisor.department}`}
                            </p>
                            {selectedSupervisor.researchAreas && selectedSupervisor.researchAreas.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {selectedSupervisor.researchAreas.slice(0, 3).map((area, idx) => (
                                        <span
                                            key={idx}
                                            className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded"
                                        >
                                            {area}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <FaTimes className="text-gray-500" />
                    </button>
                </div>
            ) : (
                /* Selector Button */
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-400 transition-colors"
                >
                    <span className="text-gray-500 dark:text-gray-400">
                        Select a supervisor...
                    </span>
                    <FaGraduationCap className="text-gray-400" />
                </button>
            )}

            {/* Dropdown */}
            {isOpen && !selectedSupervisor && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl max-h-96 overflow-hidden">
                    {/* Search */}
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, designation, or research area..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Supervisors List */}
                    <div className="max-h-80 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                                <p className="mt-2 text-gray-500">Loading supervisors...</p>
                            </div>
                        ) : filteredSupervisors.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No supervisors found
                            </div>
                        ) : (
                            filteredSupervisors.map((supervisor) => (
                                <button
                                    key={supervisor.uid}
                                    type="button"
                                    onClick={() => handleSelect(supervisor)}
                                    className="w-full p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0 text-left"
                                >
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                                        {supervisor.photoURL ? (
                                            <img
                                                src={supervisor.photoURL}
                                                alt={supervisor.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <FaGraduationCap className="text-green-600 dark:text-green-400 text-xl" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {supervisor.name}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {supervisor.designation || 'Supervisor'}
                                            {supervisor.department && ` • ${supervisor.department}`}
                                        </p>
                                        {supervisor.researchAreas && supervisor.researchAreas.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {supervisor.researchAreas.slice(0, 3).map((area, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded"
                                                    >
                                                        {area}
                                                    </span>
                                                ))}
                                                {supervisor.researchAreas.length > 3 && (
                                                    <span className="text-xs text-gray-500">
                                                        +{supervisor.researchAreas.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        {supervisor.maxStudents && (
                                            <div className="mt-2 text-xs">
                                                {supervisor.availableSlots > 0 ? (
                                                    <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                                                        <FaCheck className="text-xs" />
                                                        {supervisor.availableSlots} slot{supervisor.availableSlots > 1 ? 's' : ''} available
                                                    </span>
                                                ) : (
                                                    <span className="text-red-600 dark:text-red-400">
                                                        No slots available
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default SupervisorSelector;
