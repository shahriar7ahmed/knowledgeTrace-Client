import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from './ProjectCard';

/**
 * RelatedProjects Component
 * Shows projects with similar tech stack or tags
 */
const RelatedProjects = ({ currentProject, allProjects }) => {
    const relatedProjects = useMemo(() => {
        if (!currentProject || !allProjects) return [];

        const currentId = currentProject._id || currentProject.id;
        const currentTechStack = currentProject.techStack || [];
        const currentTags = currentProject.tags || [];

        // Find projects with matching tech stack or tags
        const scored = allProjects
            .filter(p => (p._id || p.id) !== currentId && p.status === 'approved') // Exclude current project
            .map(project => {
                let score = 0;
                const projTech = project.techStack || [];
                const projTags = project.tags || [];

                // Score based on matching tech stack (higher weight)
                const techMatches = currentTechStack.filter(tech =>
                    projTech.some(pt => pt.toLowerCase() === tech.toLowerCase())
                ).length;
                score += techMatches * 3;

                // Score based on matching tags
                const tagMatches = currentTags.filter(tag =>
                    projTags.some(pt => pt.toLowerCase() === tag.toLowerCase())
                ).length;
                score += tagMatches * 2;

                // Bonus for same supervisor
                if (project.supervisor && currentProject.supervisor &&
                    project.supervisor.toLowerCase() === currentProject.supervisor.toLowerCase()) {
                    score += 1;
                }

                return { project, score };
            })
            .filter(item => item.score > 0) // Only include projects with some relation
            .sort((a, b) => b.score - a.score) // Sort by relevance
            .slice(0, 3) // Take top 3
            .map(item => item.project);

        return scored;
    }, [currentProject, allProjects]);

    if (relatedProjects.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Related Projects</h2>
                <p className="text-sm text-gray-600">{relatedProjects.length} similar projects</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProjects.map(project => (
                    <ProjectCard key={project._id || project.id} project={project} />
                ))}
            </div>
        </div>
    );
};

export default RelatedProjects;
