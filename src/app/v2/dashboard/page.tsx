"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IntegrationModal } from "@/components/integration-modal"
import {
  Activity,
  CheckCircle2,
  Brain,
  AlertCircle,
  Database,
  Mail,
  MessageSquare,
  Phone,
  FileText,
  Share2,
  Loader2,
  Clock,
  ArrowRight,
  RefreshCw,
} from "lucide-react"

interface Task {
  id: string
  title: string
  status: "in-progress" | "completed" | "pending"
  type: "Analysis" | "Outreach" | "Research" | "Scheduling"
  timestamp: string
}

const tasks: Task[] = [
  {
    id: "1",
    title: "Analyzing Q3 financial reports for TechCorp",
    status: "in-progress",
    type: "Analysis",
    timestamp: "Now",
  },
  {
    id: "2",
    title: "Drafting follow-up email to Sarah Jones",
    status: "in-progress",
    type: "Outreach",
    timestamp: "2m ago",
  },
  {
    id: "3",
    title: "Market research on renewable energy trends",
    status: "completed",
    type: "Research",
    timestamp: "15m ago",
  },
  {
    id: "4",
    title: "Schedule meeting with GreenEnergy founders",
    status: "pending",
    type: "Scheduling",
    timestamp: "Today, 2:00 PM",
  },
  {
    id: "5",
    title: "Update CRM with latest funding round data",
    status: "pending",
    type: "Research",
    timestamp: "Tomorrow, 9:00 AM",
  },
]

const scheduledAutomations = [
  {
    id: "a1",
    title: "Website Change Detection",
    target: "Portfolio A",
    nextRun: "Today, 4:00 PM",
    frequency: "Weekly",
  },
  {
    id: "a2",
    title: "News Sentiment Watch",
    target: "Tech Sector",
    nextRun: "Tomorrow, 8:00 AM",
    frequency: "Daily",
  },
  {
    id: "a3",
    title: "LinkedIn Signal Monitor",
    target: "Key Hires",
    nextRun: "Friday, 9:00 AM",
    frequency: "Weekly",
  },
]

export default function Page() {
  const [integrationModalOpen, setIntegrationModalOpen] = useState(false)
  const [activeIntegrationTab, setActiveIntegrationTab] = useState("crm")

  const activeTasks = tasks.filter((t) => t.status === "in-progress" || t.status === "completed")
  const upcomingTasks = tasks.filter((t) => t.status === "pending")

  const openIntegration = (tab: string) => {
    setActiveIntegrationTab(tab)
    setIntegrationModalOpen(true)
  }

  return (
    <div className="flex flex-1 flex-col gap-8 p-8 max-w-7xl mx-auto w-full">
      <IntegrationModal 
        open={integrationModalOpen} 
        onOpenChange={setIntegrationModalOpen} 
        defaultTab={activeIntegrationTab} 
      />

      {/* Header Section with Tech Stack */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <h2 className="text-sm font-medium text-muted-foreground mr-2">
              Tech Stack Integration
            </h2>
            <Badge 
              variant="secondary" 
              className="gap-1.5 py-1 px-3 cursor-pointer hover:bg-secondary/80 transition-colors"
              onClick={() => openIntegration("crm")}
            >
              <Database className="h-3.5 w-3.5 text-muted-foreground" />
              CRM
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 ml-1 shadow-[0_0_4px_rgba(34,197,94,0.5)]"></span>
            </Badge>
            <Badge 
              variant="secondary" 
              className="gap-1.5 py-1 px-3 cursor-pointer hover:bg-secondary/80 transition-colors"
              onClick={() => openIntegration("email")}
            >
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              Email
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 ml-1 shadow-[0_0_4px_rgba(34,197,94,0.5)]"></span>
            </Badge>
            <Badge 
              variant="secondary" 
              className="gap-1.5 py-1 px-3 cursor-pointer hover:bg-secondary/80 transition-colors"
              onClick={() => openIntegration("slack")}
            >
              <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
              Slack
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 ml-1 shadow-[0_0_4px_rgba(34,197,94,0.5)]"></span>
            </Badge>
            <Badge 
              variant="secondary" 
              className="gap-1.5 py-1 px-3 cursor-pointer hover:bg-secondary/80 transition-colors"
              onClick={() => openIntegration("call_notes")}
            >
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              Call Notes
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 ml-1 shadow-[0_0_4px_rgba(34,197,94,0.5)]"></span>
            </Badge>
            <Badge 
              variant="secondary" 
              className="gap-1.5 py-1 px-3 cursor-pointer hover:bg-secondary/80 transition-colors"
              onClick={() => openIntegration("data_room")}
            >
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              Data Room
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 ml-1 shadow-[0_0_4px_rgba(34,197,94,0.5)]"></span>
            </Badge>
            <Badge 
              variant="secondary" 
              className="gap-1.5 py-1 px-3 cursor-pointer hover:bg-secondary/80 transition-colors"
              onClick={() => openIntegration("knowledge_base")}
            >
              <Brain className="h-3.5 w-3.5 text-muted-foreground" />
              Knowledge Base
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 ml-1 shadow-[0_0_4px_rgba(34,197,94,0.5)]"></span>
            </Badge>
            <Badge 
              variant="secondary" 
              className="gap-1.5 py-1 px-3 cursor-pointer hover:bg-secondary/80 transition-colors"
              onClick={() => openIntegration("social_media")}
            >
              <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
              Social Media
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 ml-1 shadow-[0_0_4px_rgba(34,197,94,0.5)]"></span>
            </Badge>
          </div>
          
          <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            All Systems Active
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="h-[200px] flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Workflows
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              Processing in real-time
            </p>
          </CardContent>
        </Card>

        <Card className="h-[200px] flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Today
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tasks finished successfully
            </p>
          </CardContent>
        </Card>

        <Card className="h-[200px] flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Companies Analyzed
            </CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground mt-1">
              Data points processed
            </p>
          </CardContent>
        </Card>

        <Card className="h-[200px] flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Actions
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Task Activity Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Active & Recent Tasks */}
        <Card className="h-[200px] flex flex-col overflow-hidden">
          <CardHeader>
            <CardTitle>Active & Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {activeTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-4 rounded-lg border p-3"
                >
                  <div className="mt-1">
                    {task.status === "in-progress" ? (
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm leading-none">{task.title}</p>
                      <span className="text-xs text-muted-foreground">
                        {task.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px] px-1 py-0 h-5">
                        {task.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Queue */}
        <Card className="h-[200px] flex flex-col overflow-hidden">
          <CardHeader>
            <CardTitle>Upcoming Queue</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-4 rounded-lg border p-3 opacity-80"
                >
                  <div className="mt-1">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm leading-none">{task.title}</p>
                      <span className="text-xs text-muted-foreground">
                        {task.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] px-1 py-0 h-5">
                        {task.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-center pt-2">
                <button className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                  View full queue <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Automations (New) */}
        <Card className="h-[200px] flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-lg">Scheduled Automations</CardTitle>
             <Badge variant="outline" className="text-xs font-normal">Next 24h</Badge>
          </CardHeader>
          <CardContent className="pt-6 flex-1 overflow-y-auto">
            <div className="space-y-4">
              {scheduledAutomations.map((auto) => (
                <div
                  key={auto.id}
                  className="flex items-center gap-4 rounded-lg border bg-muted/40 p-3"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <RefreshCw className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-sm leading-none">{auto.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {auto.target} • {auto.nextRun}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                    {auto.frequency}
                  </Badge>
                </div>
              ))}
              <div className="flex items-center justify-center pt-2">
                <a href="/dashboard/recurring-tasks" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                  Manage recurring <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
