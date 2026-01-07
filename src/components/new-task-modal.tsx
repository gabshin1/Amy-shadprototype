"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  Building2,
  Calendar,
  ShieldAlert,
  Swords,
  Link as LinkIcon,
  Presentation,
  Smile,
  TrendingUp,
  Target,
  Users,
  AlertTriangle,
} from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const tasks = [
  {
    name: "Company 360",
    icon: Building2,
    description: "Get a complete 360-degree overview of a company, including financials, news, and market standing.",
  },
  {
    name: "Competitor Analysis",
    icon: Swords,
    description: "Analyze competitors' strategies, strengths, and weaknesses to identify market opportunities.",
  },
  {
    name: "Meeting Prepper",
    icon: Calendar,
    description: "Prepare for upcoming meetings with briefings, agenda suggestions, and participant insights.",
  },
  {
    name: "Regulatory Risk Assessment",
    icon: ShieldAlert,
    description: "Assess potential regulatory risks and compliance requirements for specific regions or industries.",
  },
  {
    name: "Deck Analyser",
    icon: Presentation,
    description: "Analyze pitch decks or presentation slides for structure, content, and potential improvements.",
  },
  {
    name: "Sentiment Analysis",
    icon: Smile,
    description: "Evaluate public sentiment towards a brand, product, or topic from social media and news sources.",
  },
  {
    name: "IPO Rumour Mill",
    icon: TrendingUp,
    description: "Track and analyze rumors and news regarding potential Initial Public Offerings.",
  },
  {
    name: "PMF Assessment",
    icon: Target,
    description: "Assess Product-Market Fit by analyzing customer feedback, market demand, and product metrics.",
  },
  {
    name: "Management Team Analysis",
    icon: Users,
    description: "Evaluate the background, track record, and strengths of a company's leadership team.",
  },
  {
    name: "Risk Assessment",
    icon: AlertTriangle,
    description: "Identify and evaluate potential risks across operational, financial, and strategic areas.",
  },
]

interface NewTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewTaskModal({ open, onOpenChange }: NewTaskModalProps) {
  const [selectedTask, setSelectedTask] = React.useState(tasks[0])
  const [url, setUrl] = React.useState("")

  const handleStartTask = () => {
    // In a real app, you would start the task here
    console.log("Starting task:", selectedTask.name, "URL:", url)
    
    // Close the modal
    onOpenChange(false)
    
    // Reset URL
    setUrl("")

    // Show toast notification
    toast("Amy started working on your request", {
      action: {
        label: "View progress",
        onClick: () => {
          // Navigate to chat or relevant page
          console.log("View progress clicked")
        },
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">New Task</DialogTitle>
        <DialogDescription className="sr-only">
          Select a task type to start.
        </DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex w-60 border-r">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {tasks.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          isActive={selectedTask.name === item.name}
                          onClick={() => setSelectedTask(item)}
                        >
                          <item.icon />
                          <span>{item.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">New Task</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{selectedTask.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
              <div>
                <h3 className="text-lg font-medium">Task Details</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedTask.description}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url">Target URL</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="url"
                      placeholder="https://example.com"
                      className="pl-9"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleStartTask} disabled={!url}>Start Task</Button>
                </div>
              </div>
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
