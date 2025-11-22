import React, { createContext, useContext, useState } from 'react';

const ProjectContext = createContext();

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  // Dummy data for projects
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'AI-Based Garbage Detection System',
      abstract: 'A machine-learning powered system that identifies garbage in real-time using YOLOv8. This project aims to improve waste management through automated detection and classification of different types of waste materials.',
      techStack: ['Python', 'YOLOv8', 'OpenCV', 'TensorFlow'],
      author: 'John Doe',
      year: 2025,
      supervisor: 'Dr. Jane Smith',
      githubLink: 'https://github.com/example/garbage-detection',
      pdfLink: '/pdfs/garbage-detection.pdf',
      tags: ['Artificial Intelligence', 'Computer Vision', 'Machine Learning'],
      status: 'approved',
      date: '2025-01-15',
    },
    {
      id: 2,
      title: 'Smart Health Monitoring IoT Device',
      abstract: 'A wearable device that tracks heart rate, oxygen level, and temperature continuously. The device sends real-time data to a mobile application for health monitoring and alerts.',
      techStack: ['Arduino', 'IoT', 'React Native', 'Node.js'],
      author: 'Alice Johnson',
      year: 2024,
      supervisor: 'Dr. Robert Brown',
      githubLink: 'https://github.com/example/health-monitor',
      pdfLink: '/pdfs/health-monitor.pdf',
      tags: ['IoT & Electronics', 'Healthcare', 'Embedded Systems'],
      status: 'approved',
      date: '2024-12-10',
    },
    {
      id: 3,
      title: 'University Bus Tracking Mobile App',
      abstract: 'A GPS-powered app that helps students track university buses in real-time. Features include route optimization, arrival time predictions, and bus capacity information.',
      techStack: ['React Native', 'Firebase', 'Google Maps API', 'Node.js'],
      author: 'Bob Williams',
      year: 2024,
      supervisor: 'Dr. Sarah Davis',
      githubLink: 'https://github.com/example/bus-tracking',
      pdfLink: '/pdfs/bus-tracking.pdf',
      tags: ['Mobile App Development', 'GPS', 'Real-time Systems'],
      status: 'approved',
      date: '2024-11-20',
    },
    {
      id: 4,
      title: 'Blockchain-Based Voting System',
      abstract: 'A secure and transparent voting system using blockchain technology to ensure vote integrity and prevent fraud in elections.',
      techStack: ['Solidity', 'Ethereum', 'Web3.js', 'React'],
      author: 'Charlie Brown',
      year: 2024,
      supervisor: 'Dr. Michael Wilson',
      githubLink: 'https://github.com/example/blockchain-voting',
      pdfLink: '/pdfs/blockchain-voting.pdf',
      tags: ['Blockchain', 'Security', 'Web Development'],
      status: 'pending',
      date: '2024-10-05',
    },
  ]);

  const [searchResults, setSearchResults] = useState([]);

  // Placeholder API call to fetch projects
  const fetchProjects = async (filters = {}) => {
    try {
      // Placeholder API call
      // const response = await fetch('/api/projects', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(filters),
      // });
      // const data = await response.json();
      
      // For now, filter local projects
      let filtered = [...projects];
      
      if (filters.techStack) {
        filtered = filtered.filter(p => 
          p.techStack.some(tech => 
            tech.toLowerCase().includes(filters.techStack.toLowerCase())
          )
        );
      }
      
      if (filters.author) {
        filtered = filtered.filter(p => 
          p.author.toLowerCase().includes(filters.author.toLowerCase())
        );
      }
      
      if (filters.year) {
        filtered = filtered.filter(p => p.year === parseInt(filters.year));
      }
      
      if (filters.supervisor) {
        filtered = filtered.filter(p => 
          p.supervisor.toLowerCase().includes(filters.supervisor.toLowerCase())
        );
      }
      
      if (filters.keywords) {
        const keywords = filters.keywords.toLowerCase();
        filtered = filtered.filter(p => 
          p.title.toLowerCase().includes(keywords) ||
          p.abstract.toLowerCase().includes(keywords) ||
          p.tags.some(tag => tag.toLowerCase().includes(keywords))
        );
      }
      
      setSearchResults(filtered);
      return filtered;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  };

  // Placeholder API call to submit a project
  const submitProject = async (projectData) => {
    try {
      // Placeholder API call
      // const formData = new FormData();
      // Object.keys(projectData).forEach(key => {
      //   if (key === 'pdfFile' && projectData[key]) {
      //     formData.append('pdf', projectData[key]);
      //   } else {
      //     formData.append(key, projectData[key]);
      //   }
      // });
      // const response = await fetch('/api/projects/submit', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();
      
      // For now, add to local state
      const newProject = {
        id: Date.now(),
        ...projectData,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
      };
      
      setProjects([newProject, ...projects]);
      return { success: true, project: newProject };
    } catch (error) {
      console.error('Error submitting project:', error);
      return { success: false, error: error.message };
    }
  };

  // Placeholder API call to get project by ID
  const getProjectById = async (id) => {
    try {
      // Placeholder API call
      // const response = await fetch(`/api/projects/${id}`);
      // const data = await response.json();
      
      const project = projects.find(p => p.id === parseInt(id));
      return project || null;
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  };

  const value = {
    projects,
    searchResults,
    fetchProjects,
    submitProject,
    getProjectById,
    setProjects,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

