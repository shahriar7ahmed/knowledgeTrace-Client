import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-gray-300 p-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* About */}
                <div>
                    <h6 className="text-white font-bold text-lg mb-4">KnowledgeTrace</h6>
                    <p className="text-sm mb-4">
                        A platform for students to explore, share, and discover academic projects and theses.
                    </p>
                    <p className="text-xs text-gray-400">
                        Built by students, for students.
                    </p>
                </div>

                {/* Quick Links */}
                <nav>
                    <h6 className="text-white font-semibold mb-4">Quick Links</h6>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/" className="text-sm hover:text-green-400 transition-colors">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/thesis-finder" className="text-sm hover:text-green-400 transition-colors">
                                Thesis Finder
                            </Link>
                        </li>
                        <li>
                            <Link to="/my-work" className="text-sm hover:text-green-400 transition-colors">
                                Submit Work
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard" className="text-sm hover:text-green-400 transition-colors">
                                Dashboard
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* University Info */}
                <nav>
                    <h6 className="text-white font-semibold mb-4">University</h6>
                    <ul className="space-y-2 text-sm">
                        <li>Department of Computer Science</li>
                        <li>Faculty of Engineering</li>
                        <li className="text-gray-400">University Name</li>
                        <li className="text-gray-400">City, Country</li>
                    </ul>
                </nav>

                {/* Contact */}
                <nav>
                    <h6 className="text-white font-semibold mb-4">Contact</h6>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <a href="mailto:contact@knowledgetrace.edu" className="hover:text-green-400 transition-colors">
                                contact@knowledgetrace.edu
                            </a>
                        </li>
                        <li className="text-gray-400">+1 (555) 123-4567</li>
                        <li className="text-gray-400 mt-4">
                            <a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a>
                        </li>
                        <li className="text-gray-400">
                            <a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a>
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
                <p>&copy; {new Date().getFullYear()} KnowledgeTrace. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;