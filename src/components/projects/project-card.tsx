"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageSquare, FileText, BarChart3, ArrowRight } from "lucide-react"
import Link from "next/link"

export interface Project {
  id: string
  title: string
  description: string
  status: "active" | "completed" | "on-hold"
  members: { name: string; avatar: string; fallback: string }[]
  stats: {
    chats: number
    files: number
    reports: number
  }
  created_at: string
  last_activity: string
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="flex flex-col h-[200px] hover:shadow-md transition-all duration-200">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1.5">
          <CardTitle className="text-base font-semibold leading-none tracking-tight">
            {project.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-sm">
            {project.description}
          </CardDescription>
        </div>
        <Link href={`/dashboard/projects/${project.id}`}>
           <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2">
              <ArrowRight className="h-4 w-4" />
           </Button>
        </Link>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex -space-x-2 overflow-hidden">
            {project.members.map((member, i) => (
              <Avatar key={i} className="inline-block border-2 border-background h-6 w-6">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">{member.fallback}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {project.members.length} members
          </span>
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{project.stats.chats} chats</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            <span>{project.stats.files} files</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>{project.stats.reports} reports</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/5 p-3 px-6 text-xs text-muted-foreground flex justify-between">
        <span>Created {project.created_at}</span>
        <span>Last activity: {project.last_activity}</span>
      </CardFooter>
    </Card>
  )
}
