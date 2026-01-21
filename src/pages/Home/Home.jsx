import React, { useState, useMemo } from 'react';
import { useProjects } from '../../context/ProjectContext';
import Hero from '../../components/Hero';
import WhyUsSection from '../../components/WhyUsSection';
import RecentProject from '../../components/RecentProject';
import ThesisCard from '../../components/ThesisCard';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes } from 'react-icons/fa';

const Home = () => {
    const { projects, loading } = useProjects();
    const [searchTerm, setSearchTerm] = useState('');

    // Optimized filtering using useMemo
    const filteredProjects = useMemo(() => {
        if (!projects) return [];

        const approved = projects.filter(project => project.status === 'approved');

        if (!searchTerm.trim()) {
            return approved.slice(0, 6); // Default view
        }

        const searchLower = searchTerm.toLowerCase().trim();
        return approved.filter(project => {
            const matchTitle = project.title?.toLowerCase().includes(searchLower);
            const matchAbstract = project.abstract?.toLowerCase().includes(searchLower);
            const matchDesc = project.description?.toLowerCase().includes(searchLower);
            const matchTags = project.tags?.some(tag => tag.toLowerCase().includes(searchLower));
            const matchAuthor = project.author?.toLowerCase().includes(searchLower);
            const matchSupervisor = project.supervisor?.toLowerCase().includes(searchLower);

            return matchTitle || matchAbstract || matchDesc || matchTags || matchAuthor || matchSupervisor;
        });
    }, [projects, searchTerm]);

    return (
        <div>
            <Hero />

            {/* Featured Theses Section */}
            <section className="py-20 bg-gray-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
                            >
                                <span className="text-royal">Thesis</span> Hub
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-xl text-gray-600 max-w-xl"
                            >
                                Discover groundbreaking research and innovation from our academic community.
                            </motion.p>
                        </div>

                        {/* Search Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="relative w-full md:w-96"
                        >
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaSearch className="h-5 w-5 text-gray-400 group-focus-within:text-royal transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by title, AI, ML, Author..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-royal/10 focus:border-royal transition-all shadow-sm hover:shadow-md text-lg font-medium"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <FaTimes className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <div key={n} className="bg-white rounded-3xl border border-gray-100 p-8 animate-pulse shadow-sm">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
                                        <div className="h-5 bg-gray-200 rounded w-32" />
                                    </div>
                                    <div className="h-8 bg-gray-200 rounded-xl mb-4" />
                                    <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-8" />
                                    <div className="flex gap-2">
                                        <div className="h-8 w-20 bg-gray-200 rounded-full" />
                                        <div className="h-8 w-20 bg-gray-200 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            <AnimatePresence mode='popLayout'>
                                {filteredProjects.map((project, index) => (
                                    <motion.div
                                        key={project._id || project.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ThesisCard
                                            project={project}
                                            delay={0} // Controlled by parent layout/AnimatePresence
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {!loading && filteredProjects.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100"
                        >
                            <div className="text-6xl mb-6">🔍</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No projects found</h3>
                            <p className="text-gray-600 text-lg">
                                We couldn't find any results for "<span className="font-semibold text-royal-dark">{searchTerm}</span>".
                            </p>
                            <button
                                onClick={() => setSearchTerm('')}
                                className="mt-6 text-royal font-bold hover:underline"
                            >
                                Clear all filters
                            </button>
                        </motion.div>
                    )}
                </div>
            </section>

            <WhyUsSection />
            <RecentProject />
        </div>
    );
};

export default Home;
