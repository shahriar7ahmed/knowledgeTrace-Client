import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';
import { FaUpload, FaFilePdf } from 'react-icons/fa';

const MyWork = () => {
  const { isAuthenticated, user } = useAuth();
  const { submitProject } = useProjects();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    techStack: '',
    supervisor: '',
    year: new Date().getFullYear().toString(),
    githubLink: '',
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
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
      };

      const result = await submitProject(projectData);

      if (result.success) {
        setMessage('Project submitted successfully! It will be reviewed by admins.');
        // Reset form
        setFormData({
          title: '',
          abstract: '',
          techStack: '',
          supervisor: '',
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
        setMessage('Error submitting project. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/30 py-12 px-4 pt-24">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaUpload className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Submit Your Work</h1>
                <p className="text-gray-600 mt-1">
                  Share your thesis or project with the KnowledgeTrace community
                </p>
              </div>
            </div>

            {message && (
              <div
                className={`mb-6 p-4 rounded-xl border ${
                  message.includes('successfully')
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}
              >
                {message}
              </div>
            )}

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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Abstract <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="abstract"
                    value={formData.abstract}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
                    placeholder="Provide a detailed abstract of your project..."
                    required
                  />
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supervisor Name
                    </label>
                    <input
                      type="text"
                      name="supervisor"
                      value={formData.supervisor}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      placeholder="e.g., Dr. Jane Smith"
                    />
                  </div>

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
                  className="flex-1 px-6 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold disabled:opacity-50 shadow-md hover:shadow-lg"
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

