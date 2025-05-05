"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  MessageSquare,
  ChevronDown,
  Calendar,
  PieChart,
  ArrowUpRight,
  Users,
  Bell,
  ChevronRight,
  BarChart3,
  Lightbulb,
  Settings,
  ChevronUp,
  HelpCircle,
  LogOut,
} from "lucide-react";

export default function Dashboard() {
  const [organization, setOrganization] = useState("acme");

  return (
    <div className="min-h-screen bg-[#242527]">
      {/* Header */}
      <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/50">
        <div className="flex items-center">
          <div className="font-bold text-xl text-white flex items-center">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 mr-3 flex items-center justify-center">
              <MessageSquare size={16} className="text-white" />
            </div>
            team<span className="text-indigo-500">track</span>
          </div>

          <div className="ml-8 flex items-center space-x-5">
            <Button variant="ghost" className="text-zinc-400 hover:text-white">
              Dashboard
            </Button>
            <Button variant="ghost" className="text-zinc-400 hover:text-white">
              Calls
            </Button>
            <Button variant="ghost" className="text-zinc-400 hover:text-white">
              Reports
            </Button>
            <Button variant="ghost" className="text-zinc-400 hover:text-white">
              Clients
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Select value={organization} onValueChange={setOrganization}>
            <SelectTrigger className="w-44 bg-zinc-800 border-zinc-700 text-white">
              <SelectValue placeholder="Select organization" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
              <SelectItem value="acme">Acme Corp</SelectItem>
              <SelectItem value="globex">Globex</SelectItem>
              <SelectItem value="initech">Initech</SelectItem>
              <SelectItem value="umbrella">Umbrella Corp</SelectItem>
              <SelectItem value="stark">Stark Industries</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-white"
          >
            <Bell size={18} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback className="bg-indigo-600">JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-zinc-800 border-zinc-700 text-white"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-700" />
              <DropdownMenuItem className="cursor-pointer hover:bg-zinc-700">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-zinc-700">
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Documentation
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-700" />
              <DropdownMenuItem className="cursor-pointer hover:bg-zinc-700">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Content Area */}
      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, Jane
            </h1>
            <p className="text-zinc-400 mt-1">
              Here's what's happening with your communication analytics
            </p>
          </div>

          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Clock className="mr-2 h-4 w-4" />
            New Call
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                This Week's Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">24</div>
              <div className="flex items-center mt-1 text-xs text-green-400">
                <ChevronUp className="h-3 w-3 mr-1" />
                12% from last week
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Average Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">32m</div>
              <div className="flex items-center mt-1 text-xs text-red-400">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                5min longer than target
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Client Satisfaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">94%</div>
              <div className="flex items-center mt-1 text-xs text-green-400">
                <ChevronUp className="h-3 w-3 mr-1" />
                2% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Time Saved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">18h</div>
              <div className="flex items-center mt-1 text-xs text-zinc-400">
                This month so far
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity Timeline */}
          <Card className="col-span-2 bg-zinc-800/50 border-zinc-700">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">Recent Activity</CardTitle>
                <Button
                  variant="ghost"
                  className="text-zinc-400 hover:text-white text-xs"
                >
                  View All
                </Button>
              </div>
              <CardDescription className="text-zinc-400">
                Your latest communication activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {[
                  {
                    type: "call",
                    title: "Call with Acme Corp",
                    description: "Website Redesign Project",
                    time: "2 hours ago",
                    insight: "Client satisfaction rating: 9/10",
                    icon: <MessageSquare className="h-4 w-4 text-white" />,
                  },
                  {
                    type: "report",
                    title: "Quarterly Report Generated",
                    description: "For Globex - Product Launch",
                    time: "Yesterday",
                    insight: "85% positive sentiment detected",
                    icon: <BarChart3 className="h-4 w-4 text-white" />,
                  },
                  {
                    type: "insight",
                    title: "New Communication Pattern Detected",
                    description: "Increased technical discussions",
                    time: "2 days ago",
                    insight: "Suggesting more visual aids for technical topics",
                    icon: <Lightbulb className="h-4 w-4 text-white" />,
                  },
                  {
                    type: "call",
                    title: "Support call with Initech",
                    description: "Issue #1293 resolution",
                    time: "3 days ago",
                    insight: "Follow-up needed on server migration",
                    icon: <MessageSquare className="h-4 w-4 text-white" />,
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex group">
                    <div className="mr-4 flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center
                        ${
                          activity.type === "call"
                            ? "bg-indigo-600/20"
                            : activity.type === "report"
                            ? "bg-purple-600/20"
                            : "bg-amber-600/20"
                        }`}
                      >
                        {activity.icon}
                      </div>
                      {index < 3 && (
                        <div className="w-px h-full bg-zinc-700 mt-2"></div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700 transition-colors cursor-pointer">
                        <div className="flex justify-between mb-1">
                          <div className="font-medium text-white">
                            {activity.title}
                          </div>
                          <div className="text-xs text-zinc-500">
                            {activity.time}
                          </div>
                        </div>
                        <div className="text-sm text-zinc-400 mb-2">
                          {activity.description}
                        </div>
                        <div className="text-xs bg-zinc-900/50 text-zinc-300 p-2 rounded">
                          <Lightbulb className="h-3 w-3 text-amber-400 inline mr-1" />
                          {activity.insight}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sidebars */}
          <div className="lg:col-span-1 space-y-6">
            {/* Smart Insights */}
            <Card className="bg-zinc-800/50 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5 text-amber-400" />
                  Smart Insights
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  AI-generated recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-300">
                  Your team uses technical jargon 3x more than clients prefer.
                  Consider simplifying language in future calls.
                </div>
                <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-300">
                  Morning calls (9-11am) show 23% higher positive sentiment than
                  afternoon calls.
                </div>
                <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-300">
                  Client questions increase significantly when presentations
                  exceed 15 minutes without pauses.
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full text-indigo-400 hover:text-indigo-300 hover:bg-zinc-700/50"
                >
                  View All Insights
                </Button>
              </CardFooter>
            </Card>

            {/* Upcoming */}
            <Card className="bg-zinc-800/50 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-indigo-400" />
                  Coming Up
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Next 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800">
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm font-medium text-white">
                        Call with Wayne Enterprises
                      </div>
                      <div className="text-xs text-indigo-400">
                        Today, 10:00 AM
                      </div>
                    </div>
                    <div className="text-xs text-zinc-400">
                      Project kickoff • 45min
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800">
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm font-medium text-white">
                        Oscorp Quarterly Review
                      </div>
                      <div className="text-xs text-indigo-400">
                        Today, 2:30 PM
                      </div>
                    </div>
                    <div className="text-xs text-zinc-400">
                      Budget discussion • 60min
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800">
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm font-medium text-white">
                        Daily Planet Check-in
                      </div>
                      <div className="text-xs text-indigo-400">
                        Tomorrow, 9:15 AM
                      </div>
                    </div>
                    <div className="text-xs text-zinc-400">
                      Status update • 30min
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full text-indigo-400 hover:text-indigo-300 hover:bg-zinc-700/50"
                >
                  View Calendar
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Quick Access */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 transition-colors cursor-pointer">
              <CardContent className="flex items-center p-6">
                <div className="h-12 w-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mr-4">
                  <PieChart className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">
                    Generate Reports
                  </h3>
                  <p className="text-sm text-zinc-400">
                    Create custom analytics reports
                  </p>
                </div>
                <ChevronRight className="ml-auto text-zinc-500" />
              </CardContent>
            </Card>

            <Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 transition-colors cursor-pointer">
              <CardContent className="flex items-center p-6">
                <div className="h-12 w-12 rounded-lg bg-amber-500/20 flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">
                    Manage Clients
                  </h3>
                  <p className="text-sm text-zinc-400">
                    View and edit client information
                  </p>
                </div>
                <ChevronRight className="ml-auto text-zinc-500" />
              </CardContent>
            </Card>

            <Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 transition-colors cursor-pointer">
              <CardContent className="flex items-center p-6">
                <div className="h-12 w-12 rounded-lg bg-purple-500/20 flex items-center justify-center mr-4">
                  <Calendar className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Schedule Call</h3>
                  <p className="text-sm text-zinc-400">
                    Plan and set up new client calls
                  </p>
                </div>
                <ChevronRight className="ml-auto text-zinc-500" />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
