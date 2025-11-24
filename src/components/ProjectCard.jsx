import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaFilePdf, FaCalendarAlt, FaUser, FaGraduationCap } from 'react-icons/fa';

const ProjectCard = ({ project, showFullDetails = false }) => {
  const truncateAbstract = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="rounded-xl shadow-md bg-white hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
      {/* Project Title */}
      <h2 className="text-xl font-semibold mb-3 text-gray-800 hover:text-green-600 transition">
        {showFullDetails ? (
          project.title
        ) : (
          <Link to={`/project/${project.id}`} className="hover:underline">
            {project.title}
          </Link>
        )}
      </h2>

      {/* Abstract */}
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {showFullDetails ? project.abstract : truncateAbstract(project.abstract)}
      </p>

      {/* Tech Stack Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.techStack?.slice(0, 4).map((tech, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium"
          >
            {tech}
          </span>
        ))}
        {project.techStack?.length > 4 && (
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            +{project.techStack.length - 4} more
          </span>
        )}
      </div>

      {/* Category Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Project Metadata */}
      <div className="space-y-2 mb-4 text-sm text-gray-500">
        {project.author && (
          <div className="flex items-center gap-2">
            <FaUser className="text-green-600" />
            <span>{project.author}</span>
          </div>
        )}
        {project.supervisor && (
          <div className="flex items-center gap-2">
            <FaGraduationCap className="text-green-600" />
            <span>Supervisor: {project.supervisor}</span>
          </div>
        )}
        {project.year && (
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-green-600" />
            <span>Year: {project.year}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        {project.githubLink && (
          <a
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition text-sm"
          >
            <FaGithub />
            GitHub
          </a>
        )}
        {project.pdfLink && (
          <a
            href={project.pdfLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
          >
            <FaFilePdf />
            PDF
          </a>
        )}
        {!showFullDetails && (
          <Link
            to={`/project/${project.id}`}
            className="flex-1 text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;

