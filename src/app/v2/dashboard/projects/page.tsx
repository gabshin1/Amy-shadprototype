"use client"

import * as React from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectCard, Project } from "@/components/projects/project-card"

// Mock Data
const projects: Project[] = [
  {
    id: "1",
    title: "Acme Health Series B Diligence",
    description: "Complete due diligence for Acme Health's Series B round. Includes technical review, market analysis, and financial modeling.",
    status: "active",
    members: [
      { name: "Sarah Chen", avatar: "", fallback: "SC" },
      { name: "Michael Park", avatar: "", fallback: "MP" },
      { name: "Jessica Lee", avatar: "", fallback: "JL" },
    ],
    stats: { chats: 47, files: 23, reports: 8 },
    created_at: "2024-01-05",
    last_activity: "2 hours ago",
  },
  {
    id: "2",
    title: "Q1 2024 Portfolio Review",
    description: "Quarterly review of all portfolio companies including performance metrics, key risks, and follow-on opportunities.",
    status: "active",
    members: [
      { name: "David Kim", avatar: "", fallback: "DK" },
      { name: "Sarah Chen", avatar: "", fallback: "SC" },
      { name: "Michael Park", avatar: "", fallback: "MP" },
      { name: "Jessica Lee", avatar: "", fallback: "JL" },
    ],
    stats: { chats: 89, files: 45, reports: 15 },
    created_at: "2024-01-01",
    last_activity: "5 hours ago",
  },
  {
    id: "3",
    title: "Healthcare IT Thesis Development",
    description: "Building out comprehensive investment thesis for healthcare IT vertical, including market sizing and competitive landscape analysis.",
    status: "active",
    members: [
      { name: "Sarah Chen", avatar: "", fallback: "SC" },
      { name: "David Kim", avatar: "", fallback: "DK" },
    ],
    stats: { chats: 32, files: 18, reports: 5 },
    created_at: "2023-12-15",
    last_activity: "1 day ago",
  },
  {
    id: "4",
    title: "DataFlow Series C Opportunity",
    description: "Evaluating our follow-on participation in DataFlow's Series C. Internal memo and investment committee preparation.",
    status: "on-hold",
    members: [
      { name: "Sarah Chen", avatar: "", fallback: "SC" },
      { name: "Michael Park", avatar: "", fallback: "MP" },
    ],
    stats: { chats: 15, files: 8, reports: 2 },
    created_at: "2023-12-01",
    last_activity: "2 weeks ago",
  },
]

export default function ProjectsPage() {
  const [filter, setFilter] = React.useState("all")

  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true
    return project.status === filter
  })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="text-sm text-muted-foreground">
            Collaborate with your team on larger pieces of work with shared context and resources.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="h-9">
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
         <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="text" placeholder="Search projects..." className="pl-9 h-9" />
         </div>
         <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setFilter}>
          <TabsList className="grid w-full grid-cols-4 sm:w-[400px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Done</TabsTrigger>
            <TabsTrigger value="on-hold">Hold</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}
