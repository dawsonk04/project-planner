'use client';

import { Task } from '../lib/database';
import Card from './Card';
import Button from './Button';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const statusColors = {
    'todo': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <Card variant="hover" padding="sm" className="mb-3">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-text">{task.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          
          <div className="flex items-center gap-3 mt-3">
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[task.status]}`}>
              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </span>
            {task.dueDate && (
              <span className="text-xs text-gray-500">
                Due: {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(task)}
          >
            Edit
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => onDelete(task.id)}
          >
            Delete
          </Button>
        </div>
      </div>
      
      {task.status !== 'completed' && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex gap-2">
            {task.status === 'todo' && (
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => onStatusChange(task.id, 'in-progress')}
              >
                Start Task
              </Button>
            )}
            
            {task.status === 'in-progress' && (
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => onStatusChange(task.id, 'completed')}
              >
                Complete Task
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
} 