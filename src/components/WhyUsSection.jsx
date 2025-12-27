import React from "react";
import { FaSearch, FaUpload, FaLightbulb } from "react-icons/fa";

const WhyUsSection = () => {
  return (
    <div className="py-20 px-5 md:px-20 text-center bg-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
          Why <span className="bg-gradient-to-r from-royal to-primary-500 bg-clip-text text-transparent">KnowledgeTrace?</span>
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-16">
          Built by students, for students. A modern platform to explore academic projects,
          avoid repeated thesis topics, and grow your knowledge with confidence.
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
          {[
            { icon: <FaSearch />, title: "Search Any Thesis", text: "Easily search thousands of academic projects and avoid repeating topics.", color: "from-green-500 to-emerald-500" },
            { icon: <FaUpload />, title: "Upload Your Work", text: "Showcase your thesis and help other students learn from your work.", color: "from-blue-500 to-cyan-500" },
            { icon: <FaLightbulb />, title: "Get Project Ideas", text: "Discover new academic ideas and see how others solved research challenges.", color: "from-amber-500 to-orange-500" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group bg-white w-full max-w-sm shadow-lg p-8 rounded-2xl border border-gray-100
                         transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <div className="text-white text-2xl">
                  {item.icon}
                </div>
              </div>
              <h2 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h2>
              <p className="text-gray-600 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyUsSection;
