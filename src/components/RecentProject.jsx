import React from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../context/ProjectContext";
import ProjectCard from "./ProjectCard";

const RecentProject = () => {
  const { projects } = useProjects();
  const navigate = useNavigate();

  // Get recent approved projects
  const recentProjects = projects
    .filter((p) => p.status === "approved")
    .slice(0, 3);

  return (
    <div className="px-5 md:px-20 py-16">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">
          Recent <span className="text-green-600">Projects</span>
        </h1>

        <button
          onClick={() => navigate("/thesis-finder")}
          className="px-5 py-2 border border-green-600 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition"
        >
          View All
        </button>
      </div>

      {/* Cards Grid */}
      {recentProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>No projects available yet. Be the first to submit!</p>
        </div>
      )}
    </div>
  );
};

export default RecentProject;
