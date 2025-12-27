import React from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../context/ProjectContext";
import ProjectCard from "./ProjectCard";

const RecentProject = () => {
  const { projects } = useProjects();
  const navigate = useNavigate();

  // Get recent approved projects, sorted by creation date (newest first)
  const recentProjects = projects
    .filter((p) => p.status === "approved")
    .sort((a, b) => {
      // Sort by createdAt descending (newest first)
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);

  return (
    <div id="recent-projects" className="px-5 md:px-20 py-16">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">
          Recent <span className="text-royal">Projects</span>
        </h1>

        <button
          onClick={() => navigate("/thesis-finder")}
          className="px-5 py-2 border border-royal text-royal rounded-full hover:bg-royal hover:text-white transition"
        >
          View All
        </button>
      </div>

      {/* Cards Grid */}
      {recentProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentProjects.map((project) => (
            <ProjectCard key={project._id || project.id} project={project} />
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
