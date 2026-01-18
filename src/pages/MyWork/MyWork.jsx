import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';
import { FaUpload, FaFilePdf } from 'react-icons/fa';
import showToast from '../../utils/toast';
import RichTextEditor from '../../components/RichTextEditor';
import SupervisorSelector from '../../components/SupervisorSelector';

const MyWork = () => {
  const { isAuthenticated, user } = useAuth();
  const { submitProject } = useProjects();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    techStack: '',
    supervisorId: '', // Now stores supervisor ID
    year: new Date().getFullYear().toString(),
    githubLink: '',
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Utility function to strip HTML tags
  const stripHtml = (html) => {
    if (!html || typeof html !== 'string') return '';
    const text = html.replace(/<[^>]*>/g, '');
    return text.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  };

  // Get plain text length from HTML content
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
      // Validate abstract length (strip HTML first)
      const abstractPlainText = stripHtml(formData.abstract);
      if (abstractPlainText.length < 50) {
        showToast.error(`Abstract must be at least 50 characters. Current: ${abstractPlainText.length} characters`);
        setLoading(false);
        return;
      }

      // Convert tech stack string to array
      const techStackArray = formData.techStack
        .split(',')
        .map((tech) => tech.trim())
        .filter((tech) => tech.length > 0);

      const projectData = {
        ...formData,
        techStack: techStackArray,
        author: user?.name || 'Anonymous',
        pdfFile: pdfFile,
        tags: [], // Can be enhanced later
        // Ensure githubLink is empty string if not provided, not undefined
        githubLink: formData.githubLink || '',
        // supervisorId is already in formData
      };

      // DEBUG: Log project data before submission
      console.log('📝 Submitting project with data:', {
        title: projectData.title,
        author: projectData.author,
        supervisorId: projectData.supervisorId || 'NOT SET',
        hasPDF: !!projectData.pdfFile
      });

      const result = await submitProject(projectData);

      if (result.success) {
        showToast.success('Project submitted successfully! It will be reviewed by admins.');
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
        // Reset file input element
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = '';
        }
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        // Show specific error message from server
        const errorMsg = result.error || 'Error submitting project. Please try again.';
        showToast.error(errorMsg);
      }
    } catch (error) {
      console.error('Submission error:', error);
      showToast.error(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-primary-50/30 py-12 px-4 pt-24">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-royal to-primary-500 rounded-xl flex items-center justify-center shadow-lg">
              <FaUpload className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Submit Your Work</h1>
              <p className="text-gray-600 mt-1">
                Share your thesis or project with the KnowledgeTrace community
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  placeholder="Enter your project title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Abstract <span className="text-red-500">*</span>
                </label>
                <RichTextEditor
                  value={formData.abstract}
                  onChange={(value) => setFormData(prev => ({ ...prev, abstract: value }))}
                  placeholder="Provide a detailed abstract of your project..."
                  className="w-full"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    Use the toolbar to format your text (bold, italic, lists, links)
                  </p>
                  <p className={`text-xs font-medium ${getPlainTextLength(formData.abstract) >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                    {getPlainTextLength(formData.abstract)}/50 characters
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tech Stack <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  placeholder="e.g., React, Node.js, Python, MongoDB (comma-separated)"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate technologies with commas
                </p>
              </div>

              {/* Supervisor Selector */}
              <SupervisorSelector
                selectedSupervisorId={formData.supervisorId}
                onSelect={(supervisorId) => setFormData(prev => ({ ...prev, supervisorId }))}
                department={user?.department}
                required={false}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="2020"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub Repository Link
                </label>
                <input
                  type="url"
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  placeholder="https://github.com/username/project"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload PDF Document
                </label>
                <div className="mt-2 flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition">
                    <FaUpload />
                    Choose PDF File
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {pdfFile && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaFilePdf className="text-red-500" />
                      <span>{pdfFile.name}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Upload your thesis or project documentation (PDF format)
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-royal to-primary-500 text-white hover:text-white rounded-xl hover:from-royal-dark hover:to-primary-600 transition-all duration-200 font-semibold disabled:opacity-50 shadow-md hover:shadow-lg"
              >
                {loading ? 'Submitting...' : 'Submit Project'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyWork;

