'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useUser } from '@/context/UserContext';
import { useProjects, Call } from '@/context/ProjectContext';
import { Calendar, Phone, Clock, BarChart } from 'lucide-react';

// Mock data
const mockUser = {
  id: "u123",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  role: "Developer",
};

const recentActivity = [
  { id: 1, action: "Completed task", project: "Team Dashboard Redesign", time: "2 hours ago" },
  { id: 2, action: "Added comment", project: "API Integration", time: "Yesterday" },
  { id: 3, action: "Updated document", project: "Mobile App MVP", time: "3 days ago" },
];

// Helper function to format datetime
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('es-MX', { 
    dateStyle: 'medium', 
    timeStyle: 'short' 
  }).format(date);
};

// Helper function to get emotion badge color
const getEmotionColor = (emotion: string | null) => {
  if (!emotion) return "secondary";
  switch(emotion.toLowerCase()) {
    case 'positive': return "success";
    case 'negative': return "destructive";
    case 'neutral': return "secondary";
    default: return "secondary";
  }
};

export default function UserPage() {
  const { firstName } = useUser();
  const { projects, selectedProject, isLoading, error: apiError } = useProjects();
  const [userData, setUserData] = useState(mockUser);
  const [activity, setActivity] = useState(recentActivity);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Get the userId from cookies
    const userIdFromCookie = Cookies.get('userId');
    
    if (userIdFromCookie) {
      setUserId(userIdFromCookie);
      console.log('Retrieved userId from cookie:', userIdFromCookie);
    } else {
      console.log('No userId cookie found');
    }
  }, []); 

  return (
    <main className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        {/* User Profile Section */}
        <div className="flex flex-col ">
          <h2 className="text-2xl font-semibold">Hola, {firstName || 'Usuario'}!</h2>
          <p className="text-muted-foreground">
            Bienvenido a TeamTrack
            {userId && <span className="ml-2 text-xs">(ID: {userId})</span>}
          </p>
        </div>

        {/* Selected Project Section */}
        {selectedProject ? (
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{selectedProject.proj_name || `Project ${selectedProject.id}`}</CardTitle>
                  <CardDescription>
                    {selectedProject.client_id && (
                      <span className="text-xs">Client ID: {selectedProject.client_id}</span>
                    )}
                  </CardDescription>
                </div>
                <Badge variant="outline">Active Project</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {selectedProject.proj_description || "No description available for this project."}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" size="sm">Project Details</Button>
              <Button size="sm">Start New Task</Button>
            </CardFooter>
          </Card>
        ) : null}

        {/* Calls Section - Display for Selected Project */}
        {selectedProject && selectedProject.calls && selectedProject.calls.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone size={18} />
                Project Calls
              </CardTitle>
              <CardDescription>
                Recent calls for {selectedProject.proj_name || `Project ${selectedProject.id}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Emotion</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedProject.calls.map((call: Call) => (
                    <TableRow key={call.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-muted-foreground" />
                          {formatDate(call.datetime)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-muted-foreground" />
                          {call.duration}
                        </div>
                      </TableCell>
                      <TableCell>
                        {call.overallemotion ? (
                          <Badge variant={getEmotionColor(call.overallemotion) as any}>
                            {call.overallemotion}
                          </Badge>
                        ) : (
                          <Badge variant="outline">No data</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <BarChart size={16} className="mr-2" /> View Summary
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" size="sm">View All Calls</Button>
            </CardFooter>
          </Card>
        )}


        {/* Quick Actions Section */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-24 flex flex-col items-center justify-center gap-2">
                <span>New Task</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                <span>Schedule Meeting</span>
              </Button>
              <Button variant="secondary" className="h-24 flex flex-col items-center justify-center gap-2">
                <span>View Calendar</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                <span>Team Chat</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}