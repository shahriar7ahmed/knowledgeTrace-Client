import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero.jpg';
import { FiUpload } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";

const Hero = () => {
    return (
        <div className="relative w-full min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="max-w-3xl">
                    <div className="inline-block mb-4 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        🎓 Academic Project Platform
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                        Where Your Next{' '}
                        <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            Big Project
                        </span>{' '}
                        Begins
                    </h1>
                    <h3 className="text-lg sm:text-xl text-gray-700 mb-6 leading-relaxed font-medium">
                        তোমাদের মধ্যে যারা ঈমান এনেছে ও যাদেরকে জ্ঞান দেওয়া হয়েছে, আল্লাহ তাদেরকে মর্যাদায় উন্নত করবেন। (সূরা মুজাদাল্লাহ, আয়াত ১১)
                    </h3>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        Search and explore completed theses & projects from students across many disciplines.
                        Gain clarity, gather knowledge, and make confident decisions for your academic journey.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link 
                            to="/thesis-finder" 
                            className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center hover:scale-105"
                        >
                            <CiSearch className="mr-2 text-xl" />
                            Explore Projects
                        </Link>
                        <Link 
                            to="/my-work" 
                            className="group px-8 py-4 bg-white text-green-600 font-semibold rounded-xl shadow-lg hover:shadow-xl border-2 border-green-600 transition-all duration-300 inline-flex items-center justify-center hover:scale-105 hover:bg-green-50"
                        >
                            <FiUpload className="mr-2 text-xl" />
                            Submit Your Work
                        </Link>
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

export default Hero;
