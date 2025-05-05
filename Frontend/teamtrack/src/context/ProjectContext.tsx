'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

// Define Project interface
export interface Call {
  id: number;
  datetime: string;
  duration: string;
  overallemotion: string | null;
  projectid: number;
}

export interface Project {
  id: string | number;
  client_id?: number;
  proj_name?: string;
  proj_description?: string;
  calls?: Call[];
}

interface ProjectContextType {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
  setSelectedProject: (project: Project | null) => void;
  fetchProjects: (userId: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`http://127.0.0.1:5000/employee/projects?user_id=${encodeURIComponent(userId)}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API responded with status ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Projects response:', data);
      
      // Assuming the API returns an array directly
      const projectsData = Array.isArray(data) ? data : [];
      setProjects(projectsData);
      
      // Set the first project as selected by default if there are any
      if (projectsData.length > 0 && !selectedProject) {
        setSelectedProject(projectsData[0]);
      }
      
      setIsLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching projects:', error);
      setError(errorMessage);
      setIsLoading(false);
      setProjects([]);
    }
  };

  // Load user ID from cookie on initial render
  useEffect(() => {
    const userIdFromCookie = Cookies.get('userId');
    
    if (userIdFromCookie) {
      fetchProjects(userIdFromCookie);
    } else {
      console.log('No userId cookie found');
    }
  }, []);

  return (
    <ProjectContext.Provider
      value={{ 
        projects, 
        selectedProject, 
        isLoading, 
        error, 
        setSelectedProject,
        fetchProjects 
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
