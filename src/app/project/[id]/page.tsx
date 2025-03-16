'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProjects } from '../../../context/ProjectContext';
import { Project, Task } from '../../../lib/database';
import TaskCard from '../../../components/TaskCard';
import TaskForm from '../../../components/TaskForm';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import Link from 'next/link';

export default function ProjectDetails() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const { projects, loading, error, addTask, updateTask, deleteTask, updateProject } = useProjects();
  const [project, setProject] = useState<Project | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  useEffect(() => {
    if (!loading) {
      const foundProject = projects.find(p => p.id === projectId);
      if (foundProject) {
        setProject(foundProject);
      } else {
        // Project not found, redirect to home
        router.push('/');
      }
    }
  }, [projectId, projects, loading, router]);
  
  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (project) {
      addTask(project.id, taskData);
      setIsAddingTask(false);
    }
  };
  
  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (project && editingTask) {
      updateTask(project.id, editingTask.id, taskData);
      setEditingTask(null);
    }
  };
  
  const handleDeleteTask = (taskId: string) => {
    if (project && confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      deleteTask(project.id, taskId);
    }
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsAddingTask(false);
  };
  
  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    if (project) {
      updateTask(project.id, taskId, { status: newStatus });
    }
  };
  
  if (loading || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-mint border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-text">Loading project...</p>
        </div>
      </div>
    );
  }
  
  // Group tasks by status
  const tasksByStatus = {
    'todo': project.tasks.filter(task => task.status === 'todo'),
    'in-progress': project.tasks.filter(task => task.status === 'in-progress'),
    'completed': project.tasks.filter(task => task.status === 'completed'),
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/" className="text-mint-dark hover:underline mb-2 inline-block">
                &larr; Back to Projects
              </Link>
              <h1 className="text-2xl font-bold text-text">{project.title}</h1>
            </div>
            <Button 
              variant="primary" 
              onClick={() => {
                setIsAddingTask(true);
                setEditingTask(null);
              }}
            >
              Add New Task
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* Project Details */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Project Details</h2>
              <p className="text-gray-600 mb-4">{project.description}</p>
              
              <div className="flex gap-2 mb-4">
                <span className="text-xs px-2 py-1 rounded-full bg-mint-light text-text">
                  {project.type === 'saas' ? 'SaaS' : project.type === 'app' ? 'App' : 'Other'}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  project.status === 'planning' ? 'bg-blue-100 text-blue-800' :
                  project.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                  project.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p>{formatDate(project.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p>{formatDate(project.endDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p>{formatDate(project.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p>{formatDate(project.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Task Form */}
        {(isAddingTask || editingTask) && (
          <div className="mb-8">
            <TaskForm 
              initialData={editingTask || undefined}
              onSubmit={editingTask ? handleUpdateTask : handleAddTask}
              onCancel={() => {
                setIsAddingTask(false);
                setEditingTask(null);
              }}
            />
          </div>
        )}
        
        {/* Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* To Do */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
              To Do
              <span className="ml-2 text-sm text-gray-500">({tasksByStatus['todo'].length})</span>
            </h3>
            <div className="space-y-3">
              {tasksByStatus['todo'].length === 0 ? (
                <p className="text-gray-500 text-sm">No tasks to do</p>
              ) : (
                tasksByStatus['todo'].map(task => (
                  <TaskCard 
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </div>
          </div>
          
          {/* In Progress */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
              In Progress
              <span className="ml-2 text-sm text-gray-500">({tasksByStatus['in-progress'].length})</span>
            </h3>
            <div className="space-y-3">
              {tasksByStatus['in-progress'].length === 0 ? (
                <p className="text-gray-500 text-sm">No tasks in progress</p>
              ) : (
                tasksByStatus['in-progress'].map(task => (
                  <TaskCard 
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </div>
          </div>
          
          {/* Completed */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
              Completed
              <span className="ml-2 text-sm text-gray-500">({tasksByStatus['completed'].length})</span>
            </h3>
            <div className="space-y-3">
              {tasksByStatus['completed'].length === 0 ? (
                <p className="text-gray-500 text-sm">No completed tasks</p>
              ) : (
                tasksByStatus['completed'].map(task => (
                  <TaskCard 
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Project Tracker &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
} 