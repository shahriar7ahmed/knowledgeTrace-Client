import React from "react";

const RecentProject = () => {
  // Temporary demo data (replace later with backend response)
  const demoProjects = [
    {
      id: 1,
      title: "AI-Based Garbage Detection System",
      desc: "A machine-learning powered system that identifies garbage in real-time using YOLOv8.",
      image: "https://via.placeholder.com/300x180",
      category: "Artificial Intelligence",
      date: "Jan 2025",
    },
    {
      id: 2,
      title: "Smart Health Monitoring IoT Device",
      desc: "A wearable device that tracks heart rate, oxygen level, and temperature continuously.",
      image: "https://via.placeholder.com/300x180",
      category: "IoT & Electronics",
      date: "Dec 2024",
    },
    {
      id: 3,
      title: "University Bus Tracking Mobile App",
      desc: "A GPS-powered app that helps students track university buses in real-time.",
      image: "https://via.placeholder.com/300x180",
      category: "Mobile App Development",
      date: "Nov 2024",
    },
  ];

  return (
    <div className="px-5 md:px-20 py-16">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">
          Recent <span className="text-green-600">Projects</span>
        </h1>

        <button className="px-5 py-2 border border-green-600 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition">
          View All
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {demoProjects.map((project) => (
          <div
            key={project.id}
            className="rounded-xl shadow-md bg-white hover:shadow-xl transition p-4"
          >
            {/* Project Image */}
            <img
              src={project.image}
              alt="project"
              className="rounded-lg w-full h-[180px] object-cover mb-4"
            />

            {/* Project Info */}
            <h2 className="text-xl font-semibold mb-2">{project.title}</h2>

            <p className="text-gray-600 text-sm mb-3">{project.desc}</p>

            {/* Category + Date */}
            <div className="text-sm flex justify-between text-gray-500 mb-4">
              <span>{project.category}</span>
              <span>{project.date}</span>
            </div>

            {/* View More */}
            <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              View More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentProject;
