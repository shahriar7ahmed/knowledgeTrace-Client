import React from "react";
import { FaSearch, FaUpload, FaLightbulb } from "react-icons/fa";

const WhyUsSection = () => {
  return (
    <div className="py-16 px-5 md:px-20 text-center">
      <h1 className="text-4xl font-bold mb-4">
        Why <span className="text-green-600">KnowledgeTrace?</span>
      </h1>

      <p className="text-gray-600 max-w-2xl mx-auto mb-12">
        Built by students, for students. A modern platform to explore academic projects,
        avoid repeated thesis topics, and grow your knowledge with confidence.
      </p>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 justify-items-center">

        {/* Card Component */}
        {[
          { icon: <FaSearch />, title: "Search Any Thesis", text: "Easily search thousands of academic projects and avoid repeating topics." },
          { icon: <FaUpload />, title: "Upload Your Work", text: "Showcase your thesis and help other students learn from your work." },
          { icon: <FaLightbulb />, title: "Get Project Ideas", text: "Discover new academic ideas and see how others solved research challenges." },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white w-[350px] shadow-md p-7 rounded-xl border border-gray-200
                       transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer"
          >
            <div className="text-green-600 text-5xl mb-4 flex justify-center">
              {item.icon}
            </div>
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="text-gray-600">{item.text}</p>
          </div>
        ))}

      </div>
    </div>
  );
};

export default WhyUsSection;
