'use client';

import { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { Project } from '../lib/database';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import Button from '../components/Button';
import Link from 'next/link';

export default function Home() {
  const { projects, loading, error, addProject, updateProject, deleteProject } = useProjects();
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleAddProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tasks'>) => {
    addProject(projectData);
    setIsAddingProject(false);
  };

  const handleUpdateProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tasks'>) => {
    if (editingProject) {
      updateProject(editingProject.id, projectData);
      setEditingProject(null);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      deleteProject(projectId);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsAddingProject(false);
  };

  const handleViewTasks = (projectId: string) => {
    // Navigate to project details page
    window.location.href = `/project/${projectId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-mint border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-text">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-text">
            <span className="text-mint-dark">Project</span> Tracker
          </h1>
          <Button 
            variant="primary" 
            onClick={() => {
              setIsAddingProject(true);
              setEditingProject(null);
            }}
          >
            Add New Project
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {(isAddingProject || editingProject) ? (
          <div className="max-w-2xl mx-auto">
            <ProjectForm 
              initialData={editingProject || undefined}
              onSubmit={editingProject ? handleUpdateProject : handleAddProject}
              onCancel={() => {
                setIsAddingProject(false);
                setEditingProject(null);
              }}
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <h2 className="text-xl font-semibold text-gray-600 mb-2">No projects yet</h2>
                  <p className="text-gray-500 mb-6">Create your first project to get started</p>
                  <Button 
                    variant="primary" 
                    onClick={() => setIsAddingProject(true)}
                  >
                    Create Project
                  </Button>
                </div>
              ) : (
                projects.map(project => (
                  <ProjectCard 
                    key={project.id}
                    project={project}
                    onEdit={handleEditProject}
                    onDelete={handleDeleteProject}
                    onViewTasks={handleViewTasks}
                  />
                ))
              )}
            </div>
          </>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Project Tracker &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
