# Project Tracker

A simple project tracker application for managing mini SaaS projects and apps from start to finish.

## Features

- **Project Management**: Create, edit, and delete projects
- **Task Management**: Add tasks to projects and track their progress
- **Status Tracking**: Monitor project and task statuses
- **Clean UI**: Simple white and mint green theme
- **Offline Capable**: All data is stored in your browser's localStorage

## Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Data Storage**: LocalStorage (client-side)

## How to Download and Use

### Option 1: Download the Source Code

1. Click the "Code" button on the GitHub repository page
2. Select "Download ZIP"
3. Extract the ZIP file to a location on your computer

### Option 2: Clone the Repository

If you have Git installed, you can clone the repository:

```bash
git clone <repository-url>
cd project-planner
```

## Running the Application

### Easy Installation (Recommended)

This project includes helper scripts to make installation and running the application easier:

#### Windows Users
1. Double-click the `install.bat` file
2. The script will check if Node.js is installed, install dependencies, and start the application

#### macOS/Linux Users
1. Open Terminal in the project directory
2. Make the script executable: `chmod +x install.sh`
3. Run the script: `./install.sh`
4. The script will check if Node.js is installed, install dependencies, and start the application

### Manual Installation

#### Prerequisites

- Node.js 18+ (Download from [nodejs.org](https://nodejs.org/))
- npm (comes with Node.js) or yarn

#### Installation Steps

1. Open a terminal/command prompt
2. Navigate to the project directory:
   ```bash
   cd path/to/project-planner
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

If you want to create a production build:

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Using the Application

1. **Creating a Project**:
   - Click "Add New Project" button
   - Fill in the project details
   - Click "Create Project"

2. **Managing Tasks**:
   - Click "View Tasks" on a project card
   - Add, edit, or delete tasks for that project

3. **Updating Project Status**:
   - Click "Edit" on a project card
   - Update the status and other details
   - Click "Update Project"

## Data Storage

All data is stored in your browser's localStorage. This means:
- Your data persists between sessions
- Your data is only available on the device and browser you used
- Clearing browser data will erase your projects

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
