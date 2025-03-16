'use client';

import { Project } from '../lib/database';
import Card from './Card';
import Button from './Button';
import { useState } from 'react';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onViewTasks: (projectId: string) => void;
}

export default function ProjectCard({ project, onEdit, onDelete, onViewTasks }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const statusColors = {
    'planning': 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'on-hold': 'bg-gray-100 text-gray-800',
  };
  
  const typeLabels = {
    'saas': 'SaaS',
    'app': 'App',
    'other': 'Other',
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <Card variant="hover" className="overflow-hidden">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-text">{project.title}</h3>
          <div className="flex gap-2 mt-1">
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[project.status]}`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-mint-light text-text">
              {typeLabels[project.type]}
            </span>
          </div>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-mint-dark"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-3">{project.description}</p>
          
          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
            <div>
              <p className="text-gray-500">Start Date</p>
              <p>{formatDate(project.startDate)}</p>
            </div>
            <div>
              <p className="text-gray-500">End Date</p>
              <p>{formatDate(project.endDate)}</p>
            </div>
            <div>
              <p className="text-gray-500">Tasks</p>
              <p>{project.tasks.length}</p>
            </div>
            <div>
              <p className="text-gray-500">Created</p>
              <p>{formatDate(project.createdAt)}</p>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              variant="primary" 
              size="sm" 
              onClick={() => onViewTasks(project.id)}
            >
              View Tasks
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(project)}
            >
              Edit
            </Button>
            <Button 
              variant="danger" 
              size="sm" 
              onClick={() => onDelete(project.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
} 