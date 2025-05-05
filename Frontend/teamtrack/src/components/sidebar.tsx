'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  User, 
  Settings, 
  Folder, 
  Calendar, 
  BarChart3, 
  HelpCircle,
  Menu,
  X,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProjects, Project } from "@/context/ProjectContext";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
}

const NavItem = ({ href, icon, title, isActive }: NavItemProps) => {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
        isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'hover:bg-secondary'
      }`}
    >
      {icon}
      <span>{title}</span>
    </Link>
  );
};

export function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { projects, selectedProject, setSelectedProject, isLoading } = useProjects();
  
  const sidebarItems = [
    { href: '/user', icon: <Home size={18} />, title: 'Dashboard' },
    // { href: '/user/profile', icon: <User size={18} />, title: 'My Profile' },
    // { href: '/user/calendar', icon: <Calendar size={18} />, title: 'Calendar' },
    // { href: '/user/analytics', icon: <BarChart3 size={18} />, title: 'Analytics' },
    // { href: '/user/settings', icon: <Settings size={18} />, title: 'Settings' },
    // { href: '/user/help', icon: <HelpCircle size={18} />, title: 'Help & Support' },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    router.push('/user'); // Navigate to dashboard with selected project
  };

  // Only show the sidebar on user/* routes
  if (!pathname.startsWith('/user')) {
    return null;
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-20 flex h-screen flex-col border-r bg-background transition-all duration-300 md:static ${
          isSidebarOpen ? 'w-64' : 'w-0 -translate-x-full md:w-16 md:translate-x-0'
        }`}
      >
        <div className="flex h-14 items-center border-b px-4">
          {isSidebarOpen ? (
            <h2 className="text-lg font-semibold">TeamTrack</h2>
          ) : null}
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-auto md:flex" 
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
        
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="flex flex-col gap-1">
            {sidebarItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                title={isSidebarOpen ? item.title : ''}
                isActive={pathname === item.href}
              />
            ))}
            
            {/* Projects Dropdown */}
            <div className="mt-2">
              <Collapsible 
                open={isProjectsOpen} 
                onOpenChange={setIsProjectsOpen}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <button 
                    className={`flex w-full items-center justify-between px-3 py-2 rounded-md transition-colors hover:bg-secondary ${
                      pathname.includes('/user/project/') ? 'bg-primary text-primary-foreground' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Folder size={18} />
                      {isSidebarOpen && <span>Projects</span>}
                    </div>
                    {isSidebarOpen && (
                      isProjectsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                    )}
                  </button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="pl-6 mt-1">
                  {isLoading ? (
                    <div className="py-2 text-sm text-muted-foreground">Loading projects...</div>
                  ) : projects.length === 0 ? (
                    <div className="py-2 text-sm text-muted-foreground">No projects found</div>
                  ) : (
                    isSidebarOpen && projects.map((project) => (
                      <button
                        key={project.id} 
                        onClick={() => handleProjectSelect(project)}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-left rounded-md transition-colors hover:bg-secondary text-sm ${
                          selectedProject?.id === project.id ? 'bg-secondary/80 font-medium' : ''
                        }`}
                      >
                        <span className="truncate">{project.proj_name || `Project ${project.id}`}</span>
                      </button>
                    ))
                  )}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </nav>
        </ScrollArea>
      </aside>

      {/* Mobile Sidebar Trigger */}
      <div className="fixed top-0 left-0 z-10 flex h-14 items-center border-b bg-background px-4 md:hidden w-full">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu size={18} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-14 items-center border-b px-4">
              <h2 className="text-lg font-semibold">TeamTrack</h2>
            </div>
            <ScrollArea className="h-[calc(100vh-3.5rem)] px-3 py-4">
              <nav className="flex flex-col gap-1">
                {sidebarItems.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    title={item.title}
                    isActive={pathname === item.href}
                  />
                ))}
                
                {/* Projects Dropdown for Mobile */}
                <div className="mt-2">
                  <Collapsible 
                    open={isProjectsOpen} 
                    onOpenChange={setIsProjectsOpen}
                    className="w-full"
                  >
                    <CollapsibleTrigger asChild>
                      <button 
                        className={`flex w-full items-center justify-between px-3 py-2 rounded-md transition-colors hover:bg-secondary ${
                          pathname.includes('/user/project/') ? 'bg-primary text-primary-foreground' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Folder size={18} />
                          <span>Projects</span>
                        </div>
                        {isProjectsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="pl-6 mt-1">
                      {isLoading ? (
                        <div className="py-2 text-sm text-muted-foreground">Loading projects...</div>
                      ) : projects.length === 0 ? (
                        <div className="py-2 text-sm text-muted-foreground">No projects found</div>
                      ) : (
                        projects.map((project) => (
                          <button
                            key={project.id} 
                            onClick={() => handleProjectSelect(project)}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-left rounded-md transition-colors hover:bg-secondary text-sm ${
                              selectedProject?.id === project.id ? 'bg-secondary/80 font-medium' : ''
                            }`}
                          >
                            <span className="truncate">{project.proj_name || `Project ${project.id}`}</span>
                          </button>
                        ))
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </nav>
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <h2 className="ml-4 text-lg font-semibold">TeamTrack</h2>
      </div>
    </>
  );
}
