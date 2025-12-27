import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroImage from '../assets/hero.jpg';
import { FiUpload } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import Button from './Button';

const Hero = () => {
    return (
        <div className="relative w-full min-h-[85vh] flex items-center overflow-hidden">
            {/* Background Image with Royal Blue Gradient Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${heroImage})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-royal/90 to-primary-600/80" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl"
                >
                    <div className="inline-block mb-4 px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold border border-white/30">
                        🎓 Academic Project Platform
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
                        Discover, Share, & Build on
                        <br />
                        <span className="text-white">
                            University Knowledge.
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl">
                        Search and explore completed theses & projects from students across many disciplines.
                        Gain clarity, gather knowledge, and make confident decisions for your academic journey.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/thesis-finder">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <button className="w-full sm:w-auto px-8 py-4 bg-white text-royal font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center gap-2">
                                    <CiSearch className="text-xl" />
                                    Find a Thesis
                                </button>
                            </motion.div>
                        </Link>

                        <Link to="/my-work">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <button className="w-full sm:w-auto px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white/10 transition-all duration-300 inline-flex items-center justify-center gap-2">
                                    <FiUpload className="text-xl" />
                                    Submit Project
                                </button>
                            </motion.div>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
