"use client"

import Link from "next/link"
import { ArrowLeft, Settings, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface ProjectHeaderProps {
  title: string
  status: "active" | "completed" | "on-hold"
  members: { name: string; avatar: string; fallback: string }[]
}

export function ProjectHeader({ title, status, members }: ProjectHeaderProps) {
  return (
    <div className="flex flex-col gap-6 pb-6 border-b">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/projects">Projects</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" className="h-8">
              <Settings className="mr-2 h-3.5 w-3.5" /> Settings
           </Button>
           <Button size="sm" className="h-8">
              <UserPlus className="mr-2 h-3.5 w-3.5" /> Add Member
           </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-1.5">
           <div className="flex items-center gap-3">
             <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
             <Badge variant={status === "active" ? "default" : "secondary"} className="capitalize">
               {status}
             </Badge>
           </div>
           <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
              Complete due diligence for Acme Health's Series B round. Includes technical review, market analysis, and financial modeling.
           </p>
        </div>
        
        <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground">Team</span>
            <div className="flex -space-x-2">
              {members.map((member, i) => (
                <Avatar key={i} className="border-2 border-background h-7 w-7">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">{member.fallback}</AvatarFallback>
                </Avatar>
              ))}
            </div>
        </div>
      </div>
    </div>
  )
}
