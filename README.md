# Project Tracker

A simple project tracker application for managing mini SaaS projects and apps from start to finish.

## Features

- **Project Management**: Create, edit, and delete projects
- **Task Management**: Add tasks to projects and track their progress
- **Status Tracking**: Monitor project and task statuses
- **Clean UI**: Simple white and mint green theme

## Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Data Storage**: LocalStorage (client-side)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project-planner
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `src/app`: Next.js app router pages
- `src/components`: Reusable UI components
- `src/context`: React context for state management
- `src/lib`: Utility functions and database operations

## Key Components

- **ProjectCard**: Displays project information
- **TaskCard**: Displays task information
- **ProjectForm**: Form for creating and editing projects
- **TaskForm**: Form for creating and editing tasks
- **ProjectContext**: Manages project state throughout the application

## Data Model

### Project

```typescript
interface Project {
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
```

### Task

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}
```

## License

This project is licensed under the MIT License.
