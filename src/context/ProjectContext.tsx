'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, Task, getDatabase } from '../lib/database';

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tasks'>) => void;
  updateProject: (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteProject: (id: string) => void;
  addTask: (projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (projectId: string, taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteTask: (projectId: string, taskId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const db = getDatabase();
      const allProjects = db.getAllProjects();
      setProjects(allProjects);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError('Failed to load projects. Please try again.');
      setLoading(false);
    }
  }, []);

  const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tasks'>) => {
    try {
      const db = getDatabase();
      const projectWithTasks = { ...project, tasks: [] };
      const newProject = db.addProject(projectWithTasks);
      setProjects((prev: Project[]) => [...prev, newProject]);
    } catch (err) {
      console.error('Failed to add project:', err);
      setError('Failed to add project. Please try again.');
    }
  };

  const updateProject = (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const db = getDatabase();
      const updatedProject = db.updateProject(id, updates);
      
      if (updatedProject) {
        setProjects((prev: Project[]) => 
          prev.map((project: Project) => project.id === id ? updatedProject : project)
        );
      }
    } catch (err) {
      console.error('Failed to update project:', err);
      setError('Failed to update project. Please try again.');
    }
  };

  const deleteProject = (id: string) => {
    try {
      const db = getDatabase();
      const success = db.deleteProject(id);
      
      if (success) {
        setProjects((prev: Project[]) => prev.filter((project: Project) => project.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
      setError('Failed to delete project. Please try again.');
    }
  };

  const addTask = (projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const db = getDatabase();
      const newTask = db.addTask(projectId, task);
      
      if (newTask) {
        setProjects((prev: Project[]) => 
          prev.map((project: Project) => {
            if (project.id === projectId) {
              return {
                ...project,
                tasks: [...project.tasks, newTask],
                updatedAt: new Date().toISOString()
              };
            }
            return project;
          })
        );
      }
    } catch (err) {
      console.error('Failed to add task:', err);
      setError('Failed to add task. Please try again.');
    }
  };

  const updateTask = (projectId: string, taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const db = getDatabase();
      const updatedTask = db.updateTask(projectId, taskId, updates);
      
      if (updatedTask) {
        setProjects((prev: Project[]) => 
          prev.map((project: Project) => {
            if (project.id === projectId) {
              return {
                ...project,
                tasks: project.tasks.map(task => 
                  task.id === taskId ? updatedTask : task
                ),
                updatedAt: new Date().toISOString()
              };
            }
            return project;
          })
        );
      }
    } catch (err) {
      console.error('Failed to update task:', err);
      setError('Failed to update task. Please try again.');
    }
  };

  const deleteTask = (projectId: string, taskId: string) => {
    try {
      const db = getDatabase();
      const success = db.deleteTask(projectId, taskId);
      
      if (success) {
        setProjects((prev: Project[]) => 
          prev.map((project: Project) => {
            if (project.id === projectId) {
              return {
                ...project,
                tasks: project.tasks.filter(task => task.id !== taskId),
                updatedAt: new Date().toISOString()
              };
            }
            return project;
          })
        );
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('Failed to delete task. Please try again.');
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        error,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
} 