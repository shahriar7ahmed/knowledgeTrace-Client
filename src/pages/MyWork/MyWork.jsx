import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';
import {
  FaUpload,
  FaFilePdf,
  FaPlus,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaArrowLeft,
  FaFolderOpen
} from 'react-icons/fa';
import showToast from '../../utils/toast';
import RichTextEditor from '../../components/RichTextEditor';
import SupervisorSelector from '../../components/SupervisorSelector';
import { api } from '../../utils/api';

const MyWork = () => {
  const { isAuthenticated, user } = useAuth();
  const { submitProject } = useProjects();
  const navigate = useNavigate();

  // State for view control
  const [showForm, setShowForm] = useState(false);
  const [userProjects, setUserProjects] = useState([]);
  const [fetchingProjects, setFetchingProjects] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    techStack: '',
    supervisorId: '',
    year: new Date().getFullYear().toString(),
    githubLink: '',
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user projects
  const fetchUserProjects = useCallback(async () => {
    if (!user?.uid) return;
    setFetchingProjects(true);
    try {
      const projects = await api.getUserProjects(user.uid);
      setUserProjects(projects || []);
    } catch (error) {
      console.error('Error fetching user projects:', error);
      showToast.error('Failed to load your projects');
    } finally {
      setFetchingProjects(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchUserProjects();
    }
  }, [isAuthenticated, navigate, fetchUserProjects]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const stripHtml = (html) => {
    if (!html || typeof html !== 'string') return '';
    const text = html.replace(/<[^>]*>/g, '');
    return text.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  };

  const getPlainTextLength = (html) => {
    return stripHtml(html).length;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      showToast.success(`File "${file.name}" selected`);
    } else {
      showToast.error('Please upload a PDF file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const abstractPlainText = stripHtml(formData.abstract);
      if (abstractPlainText.length < 50) {
        showToast.error(`Abstract must be at least 50 characters. Current: ${abstractPlainText.length} characters`);
        setLoading(false);
        return;
      }

      const techStackArray = formData.techStack
        .split(',')
        .map((tech) => tech.trim())
        .filter((tech) => tech.length > 0);

      const projectData = {
        ...formData,
        techStack: techStackArray,
        author: user?.name || 'Anonymous',
        pdfFile: pdfFile,
        tags: [],
        githubLink: formData.githubLink || '',
      };

      const result = await submitProject(projectData);

      if (result.success) {
        showToast.success('Project submitted successfully!');
        // Reset form
        setFormData({
          title: '',
          abstract: '',
          techStack: '',
          supervisorId: '',
          year: new Date().getFullYear().toString(),
          githubLink: '',
        });
        setPdfFile(null);
        setShowForm(false);
        // Refresh the list
        fetchUserProjects();
      } else {
        const errorMsg = result.error || 'Error submitting project.';
        showToast.error(errorMsg);
      }
    } catch (error) {
      console.error('Submission error:', error);
      showToast.error(error.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  const StatusBadge = ({ status }) => {
    const configs = {
      pending: { color: 'bg-yellow-100 text-yellow-700', icon: FaClock, label: 'Pending Approval' },
      approved: { color: 'bg-green-100 text-green-700', icon: FaCheckCircle, label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-700', icon: FaTimesCircle, label: 'Rejected' },
      draft: { color: 'bg-gray-100 text-gray-700', icon: FaFolderOpen, label: 'Draft' }
    };
    const config = configs[status] || configs.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${config.color}`}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-emerald-50/20 py-12 px-4 pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My <span className="bg-gradient-to-r from-royal to-emerald-600 bg-clip-text text-transparent">Work</span>
            </h1>
            <p className="text-gray-600">
              {showForm ? 'Submit a new project for review' : 'Manage and track your submitted projects'}
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl ${showForm
                ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                : 'bg-gradient-to-r from-royal to-emerald-600 text-white hover:opacity-90'
              }`}
          >
            {showForm ? (
              <>
                <FaArrowLeft />
                Back to My Work
              </>
            ) : (
              <>
                <FaPlus />
                Submit New Project
              </>
            )}
          </button>
        </div>

        {showForm ? (
          /* Submission Form */
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-royal/10 rounded-xl flex items-center justify-center text-royal">
                <FaUpload size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">New Project Submission</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form fields remain identical for compatibility */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none transition-all"
                  placeholder="e.g., AI-based Knowledge Graph system"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Abstract *</label>
                <RichTextEditor
                  value={formData.abstract}
                  onChange={(value) => setFormData(prev => ({ ...prev, abstract: value }))}
                  placeholder="Describe your project highlights, methodology, and results..."
                  className="w-full"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">Min 50 characters required</p>
                  <p className={`text-xs font-bold ${getPlainTextLength(formData.abstract) >= 50 ? 'text-green-600' : 'text-red-500'}`}>
                    {getPlainTextLength(formData.abstract)} characters
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tech Stack *</label>
                <input
                  type="text"
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none transition-all"
                  placeholder="React, Node.js, TensorFlow (comma separated)"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SupervisorSelector
                  selectedSupervisorId={formData.supervisorId}
                  onSelect={(supervisorId) => setFormData(prev => ({ ...prev, supervisorId }))}
                  department={user?.department}
                />
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Academic Year *</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    min="2020"
                    max={new Date().getFullYear() + 1}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">GitHub Repository URL</label>
                <input
                  type="url"
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none transition-all"
                  placeholder="https://github.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Documentation (PDF)</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                  {pdfFile ? (
                    <div className="flex items-center gap-3 text-emerald-600 font-medium">
                      <FaFilePdf size={24} />
                      <span>{pdfFile.name} (Ready)</span>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <FaUpload className="mx-auto mb-2 opacity-50" size={24} />
                      <p className="text-sm">Click or drag to upload PDF</p>
                    </div>
                  )}
                  <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-royal to-primary-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Submit Final Work'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-8 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Project List View */
          <div className="space-y-6">
            {fetchingProjects ? (
              <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal mb-4"></div>
                <p className="text-gray-500 font-medium tracking-wide">Retrieving your submissions...</p>
              </div>
            ) : userProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
                {userProjects.map((project) => (
                  <div
                    key={project._id || project.id}
                    className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 flex flex-col group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <StatusBadge status={project.status} />
                      <span className="text-xs font-medium text-gray-400">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-royal transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                      {stripHtml(project.abstract).substring(0, 150)}...
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.techStack?.slice(0, 3).map((tech, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-royal/5 text-royal text-[10px] font-bold rounded-md border border-royal/10">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                      <Link
                        to={`/project/${project._id || project.id}`}
                        className="flex items-center gap-2 text-sm font-bold text-royal hover:underline"
                      >
                        <FaEye />
                        View Details
                      </Link>
                      {project.pdfUrl && (
                        <FaFilePdf className="text-red-400 h-5 w-5" title="PDF Attachment Included" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200 shadow-sm max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-royal/5 text-royal rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaFolderOpen size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Projects Found</h3>
                <p className="text-gray-500 mb-8">
                  You haven't submitted any projects yet. Start sharing your work with KnowledgeTrace today!
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-8 py-4 bg-royal text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Submit Your First Project
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyWork;
