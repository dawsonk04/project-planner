// Project Types
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  type: 'saas' | 'app' | 'other';
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  tasks: Task[];
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Database Class
class Database {
  private projects: Project[] = [];

  constructor() {
    this.loadFromLocalStorage();
  }

  // Load data from localStorage
  private loadFromLocalStorage() {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('project-tracker-data');
      if (data) {
        try {
          this.projects = JSON.parse(data);
        } catch (error) {
          console.error('Failed to parse data from localStorage:', error);
          this.projects = [];
        }
      }
    }
  }

  // Save data to localStorage
  private saveToLocalStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('project-tracker-data', JSON.stringify(this.projects));
    }
  }

  // Get all projects
  getAllProjects(): Project[] {
    return [...this.projects];
  }

  // Get project by ID
  getProjectById(id: string): Project | undefined {
    return this.projects.find(project => project.id === id);
  }

  // Add new project
  addProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const now = new Date().toISOString();
    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      tasks: [],
      createdAt: now,
      updatedAt: now,
    };
    
    this.projects.push(newProject);
    this.saveToLocalStorage();
    return newProject;
  }

  // Update project
  updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>): Project | undefined {
    const index = this.projects.findIndex(project => project.id === id);
    if (index === -1) return undefined;

    const updatedProject = {
      ...this.projects[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.projects[index] = updatedProject;
    this.saveToLocalStorage();
    return updatedProject;
  }

  // Delete project
  deleteProject(id: string): boolean {
    const initialLength = this.projects.length;
    this.projects = this.projects.filter(project => project.id !== id);
    
    if (this.projects.length !== initialLength) {
      this.saveToLocalStorage();
      return true;
    }
    
    return false;
  }

  // Add task to project
  addTask(projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task | undefined {
    const project = this.getProjectById(projectId);
    if (!project) return undefined;

    const now = new Date().toISOString();
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    project.tasks.push(newTask);
    project.updatedAt = now;
    this.saveToLocalStorage();
    return newTask;
  }

  // Update task
  updateTask(projectId: string, taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>): Task | undefined {
    const project = this.getProjectById(projectId);
    if (!project) return undefined;

    const taskIndex = project.tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return undefined;

    const now = new Date().toISOString();
    const updatedTask = {
      ...project.tasks[taskIndex],
      ...updates,
      updatedAt: now
    };

    project.tasks[taskIndex] = updatedTask;
    project.updatedAt = now;
    this.saveToLocalStorage();
    return updatedTask;
  }

  // Delete task
  deleteTask(projectId: string, taskId: string): boolean {
    const project = this.getProjectById(projectId);
    if (!project) return false;

    const initialLength = project.tasks.length;
    project.tasks = project.tasks.filter(task => task.id !== taskId);
    
    if (project.tasks.length !== initialLength) {
      project.updatedAt = new Date().toISOString();
      this.saveToLocalStorage();
      return true;
    }
    
    return false;
  }
}

// Create a singleton instance
let databaseInstance: Database | null = null;

export function getDatabase(): Database {
  if (!databaseInstance) {
    databaseInstance = new Database();
  }
  return databaseInstance;
} 