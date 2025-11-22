import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../../context/ProjectContext';
import { FaGithub, FaFilePdf, FaCalendarAlt, FaUser, FaGraduationCap, FaArrowLeft } from 'react-icons/fa';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProjectById } = useProjects();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);
      const projectData = await getProjectById(id);
      setProject(projectData);
      setLoading(false);
    };

    loadProject();
  }, [id, getProjectById]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/thesis-finder')}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Browse Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition"
          >
            <FaArrowLeft />
            Back
          </button>

          {/* Project Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{project.title}</h1>

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {project.author && (
                <div className="flex items-center gap-3">
                  <FaUser className="text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Author</p>
                    <p className="font-medium text-gray-800">{project.author}</p>
                  </div>
                </div>
              )}

              {project.supervisor && (
                <div className="flex items-center gap-3">
                  <FaGraduationCap className="text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Supervisor</p>
                    <p className="font-medium text-gray-800">{project.supervisor}</p>
                  </div>
                </div>
              )}

              {project.year && (
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="font-medium text-gray-800">{project.year}</p>
                  </div>
                </div>
              )}

              {project.date && (
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Submitted</p>
                    <p className="font-medium text-gray-800">
                      {new Date(project.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
                >
                  <FaGithub />
                  View on GitHub
                </a>
              )}
              {project.pdfLink && (
                <a
                  href={project.pdfLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <FaFilePdf />
                  Download PDF
                </a>
              )}
            </div>

            {/* Tech Stack */}
            {project.techStack && project.techStack.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Abstract */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Abstract</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {project.abstract}
            </p>
          </div>
        </div>
      </div>
  );
};

export default ProjectDetails;

