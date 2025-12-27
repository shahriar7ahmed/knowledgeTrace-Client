import React from 'react';
import { useProjects } from '../../context/ProjectContext';
import Hero from '../../components/Hero';
import WhyUsSection from '../../components/WhyUsSection';
import RecentProject from '../../components/RecentProject';
import ThesisCard from '../../components/ThesisCard';
import { motion } from 'framer-motion';

const Home = () => {
    const { projects, loading } = useProjects();

    // Get featured projects (first 6)
    const featuredProjects = projects?.slice(0, 6) || [];

    return (
        <div>
            <Hero />

            {/* Featured Theses Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            Featured <span className="text-royal">Theses</span>
                        </h2>
                        <p className="text-gray-600">Explore recent academic work from talented students</p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <div key={n} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 bg-gray-200 rounded-full" />
                                        <div className="h-4 bg-gray-200 rounded w-24" />
                                    </div>
                                    <div className="h-6 bg-gray-200 rounded mb-2" />
                                    <div className="h-4 bg-gray-200 rounded mb-4" />
                                    <div className="flex gap-2 mb-4">
                                        <div className="h-6 w-16 bg-gray-200 rounded-full" />
                                        <div className="h-6 w-16 bg-gray-200 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredProjects.map((project, index) => (
                                <ThesisCard
                                    key={project._id}
                                    project={project}
                                    delay={index * 0.1}
                                />
                            ))}
                        </div>
                    )}

                    {!loading && featuredProjects.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-600">No projects available yet.</p>
                        </div>
                    )}
                </div>
            </section>

            <WhyUsSection />
            <RecentProject />
        </div>
    );
};

export default Home;