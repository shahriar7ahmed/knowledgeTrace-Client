import React from 'react';
import heroImage from '../assets/hero.jpg';
import { FiUpload } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";

const Hero = () => {
    return (
        <div
            className="relative w-full h-[600px] bg-cover bg-center"
            style={{
                backgroundImage: `url(${heroImage})`
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30"></div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center lg:justify-start px-5 lg:px-10">
                <div className="text-white max-w-lg text-center lg:text-left">
                    <h1 className="text-green-400 text-4xl sm:text-5xl font-bold mb-5">
                        Where Your Next Big Project Begins
                    </h1>
                    <h3 className="text-orange-200 text-lg sm:text-xl mb-5">
                        তোমাদের মধ্যে যারা ঈমান এনেছে ও যাদেরকে জ্ঞান দেওয়া হয়েছে, আল্লাহ তাদেরকে মর্যাদায় উন্নত করবেন।(সূরা মুজাদাল্লাহ, আয়াত ১১)
                    </h3>
                    <p className="mb-5 text-xl sm:text-base">
                        Search and explore completed theses & projects from students across many disciplines.
                        Gain clarity, gather knowledge, and make confident decisions for your academic journey.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <a href="/thesis-finder" className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 inline-flex items-center justify-center">
                            <CiSearch className="mr-2" />
                            Explore Projects
                        </a>
                        <a href="/my-work" className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 inline-flex items-center justify-center">
                            <FiUpload className="mr-2" />
                            Submit your work
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
