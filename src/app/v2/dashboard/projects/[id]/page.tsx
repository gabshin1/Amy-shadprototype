"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectHeader } from "@/components/projects/project-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, FileText, BarChart3 } from "lucide-react"
import { RecentActivity } from "@/components/projects/recent-activity"
import { useParams } from "next/navigation"

export default function ProjectDetailPage() {
  const params = useParams()
  // In a real app, fetch project data based on params.id
  
  const projectData = {
    title: "Acme Health Series B Diligence",
    status: "active" as const,
    members: [
      { name: "Sarah Chen", avatar: "", fallback: "SC" },
      { name: "Michael Park", avatar: "", fallback: "MP" },
      { name: "Jessica Lee", avatar: "", fallback: "JL" },
    ],
    stats: {
      chats: 4,
      files: 4,
      reports: 4,
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <ProjectHeader 
         title={projectData.title}
         status={projectData.status}
         members={projectData.members}
       />

       <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
             <TabsTrigger value="overview">Overview</TabsTrigger>
             <TabsTrigger value="chats">Chats & Reports</TabsTrigger>
             <TabsTrigger value="files">Files & Memory</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
             <div className="grid gap-4 md:grid-cols-3">
                <Card>
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Amy Chats</CardTitle>
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                   </CardHeader>
                   <CardContent>
                      <div className="text-2xl font-bold">{projectData.stats.chats}</div>
                      <p className="text-xs text-muted-foreground">
                        +2 from last week
                      </p>
                   </CardContent>
                </Card>
                <Card>
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Files</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                   </CardHeader>
                   <CardContent>
                      <div className="text-2xl font-bold">{projectData.stats.files}</div>
                      <p className="text-xs text-muted-foreground">
                        +1 new file today
                      </p>
                   </CardContent>
                </Card>
                <Card>
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Reports</CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                   </CardHeader>
                   <CardContent>
                      <div className="text-2xl font-bold">{projectData.stats.reports}</div>
                      <p className="text-xs text-muted-foreground">
                        Latest generated 2h ago
                      </p>
                   </CardContent>
                </Card>
             </div>

             <RecentActivity />
          </TabsContent>
          
          <TabsContent value="chats">
             <div className="flex items-center justify-center h-40 text-muted-foreground border rounded-lg border-dashed">
                Chats & Reports content placeholder
             </div>
          </TabsContent>
          
          <TabsContent value="files">
             <div className="flex items-center justify-center h-40 text-muted-foreground border rounded-lg border-dashed">
                Files & Memory content placeholder
             </div>
          </TabsContent>
       </Tabs>
    </div>
  )
}
