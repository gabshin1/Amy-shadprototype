"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Database,
  Mail,
  MessageSquare,
  Phone,
  FileText,
  Brain,
  Share2,
  Check,
  Globe,
} from "lucide-react"

interface IntegrationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: string
}

const integrations = [
  {
    id: "crm",
    name: "CRM",
    icon: Database,
    description: "Connect your CRM to sync companies, people, and deals.",
    options: [
      { id: "attio", name: "Attio", connected: false },
      { id: "affinity", name: "Affinity", connected: true },
    ],
  },
  {
    id: "email",
    name: "Email",
    icon: Mail,
    description: "Sync your email to track communication history.",
    options: [{ id: "gmail", name: "Gmail", connected: true }, { id: "outlook", name: "Outlook", connected: false }],
  },
  {
    id: "slack",
    name: "Slack",
    icon: MessageSquare,
    description: "Receive notifications and updates directly in Slack.",
    options: [{ id: "slack_app", name: "Slack App", connected: true }],
  },
  {
    id: "call_notes",
    name: "Call Notes",
    icon: Phone,
    description: "Automatically record and transcribe calls.",
    options: [{ id: "zoom", name: "Zoom", connected: false }, { id: "gmeet", name: "Google Meet", connected: true }],
  },
  {
    id: "data_room",
    name: "Data Room",
    icon: FileText,
    description: "Analyze documents from your data rooms.",
    options: [{ id: "sharefile", name: "ShareFile", connected: false }, { id: "box", name: "Box", connected: true }],
  },
  {
    id: "knowledge_base",
    name: "Knowledge Base",
    icon: Brain,
    description: "Connect internal documentation for context.",
    options: [{ id: "notion", name: "Notion", connected: true }],
  },
  {
    id: "social_media",
    name: "Social Media",
    icon: Share2,
    description: "Monitor social signals and trends.",
    options: [{ id: "linkedin", name: "LinkedIn", connected: true }, { id: "twitter", name: "Twitter", connected: false }],
  },
]

export function IntegrationModal({ open, onOpenChange, defaultTab = "crm" }: IntegrationModalProps) {
  const [activeTab, setActiveTab] = React.useState(defaultTab)

  // Update active tab when defaultTab prop changes or modal opens
  React.useEffect(() => {
    if (open) {
      setActiveTab(defaultTab)
    }
  }, [defaultTab, open])

  const activeIntegration = integrations.find((i) => i.id === activeTab) || integrations[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 gap-0 overflow-hidden h-[500px] flex flex-col">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-lg font-medium">Integrations</DialogTitle>
        </DialogHeader>
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r bg-muted/30 overflow-y-auto p-2">
            <div className="flex flex-col gap-1">
              {integrations.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <activeIntegration.icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{activeIntegration.name} Integration</h2>
                  <p className="text-muted-foreground text-sm">
                    {activeIntegration.description}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                 <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Available Connections</h3>
                 <div className="grid gap-3">
                   {activeIntegration.options.map((option) => (
                     <div key={option.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                       <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            {/* Placeholder for logos */}
                            <Globe className="h-4 w-4 text-muted-foreground" />
                         </div>
                         <span className="font-medium">{option.name}</span>
                       </div>
                       
                       {option.connected ? (
                         <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200 gap-1.5 hover:bg-green-500/20">
                           <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                           Connected
                         </Badge>
                       ) : (
                         <Button size="sm" variant="outline">Connect</Button>
                       )}
                     </div>
                   ))}
                 </div>
              </div>

              <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                <p>
                  Connecting your {activeIntegration.name.toLowerCase()} allows Amy to automatically sync data, keeping your records up-to-date without manual entry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

