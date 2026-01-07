"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Check,
  X,
  Bell,
  Mail,
  Database,
  Search,
} from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Category = "sourcing" | "monitoring" | "outreach" | "crm"

interface ReviewItem {
  id: string
  category: Category
  title: string
  description: string
  metadata?: string
  date: string
  avatar?: string
  initials?: string
}

const initialItems: ReviewItem[] = [
  // Sourcing
  {
    id: "1",
    category: "sourcing",
    title: "NeuralNet Inc.",
    description: "New AI infrastructure startup matching investment thesis.",
    metadata: "Seed Stage • $5M Cap",
    date: "Today, 9:00 AM",
    initials: "NN",
  },
  {
    id: "2",
    category: "sourcing",
    title: "GreenLeaf Energy",
    description: "Renewable energy storage solution with high growth potential.",
    metadata: "Series A • CleanTech",
    date: "Yesterday, 4:00 PM",
    initials: "GL",
  },
  // Monitoring
  {
    id: "3",
    category: "monitoring",
    title: "Competitor Alert: Stripe",
    description: "Stripe launched a new feature similar to Portfolio Co 'PayFlow'.",
    metadata: "High Priority",
    date: "2 hours ago",
    initials: "S",
  },
  {
    id: "4",
    category: "monitoring",
    title: "Funding News: Competitor X",
    description: "Competitor X raised $50M Series B.",
    metadata: "Market Signal",
    date: "Yesterday, 10:00 AM",
    initials: "CX",
  },
  // Outreach
  {
    id: "5",
    category: "outreach",
    title: "Intro to Founder @ NeuralNet",
    description: "Drafted introduction email to Sarah Chen, CEO.",
    metadata: "Email Draft",
    date: "Today, 9:30 AM",
    initials: "SC",
  },
  {
    id: "6",
    category: "outreach",
    title: "Quarterly Check-in: TechFlow",
    description: "Follow-up email to re-engage with previous lead.",
    metadata: "Email Draft",
    date: "Yesterday, 2:15 PM",
    initials: "TF",
  },
  // CRM Admin
  {
    id: "7",
    category: "crm",
    title: "Update Contact: John Doe",
    description: "Moved from Acme Corp to Google. Update current position?",
    metadata: "Data Enrichment",
    date: "Today, 8:45 AM",
    initials: "JD",
  },
  {
    id: "8",
    category: "crm",
    title: "Merge Duplicate Companies",
    description: "Detected duplicate entries for 'Solaris Systems'.",
    metadata: "Data Hygiene",
    date: "Mon, 1:00 PM",
    initials: "SS",
  },
]

export default function ReviewPage() {
  const [items, setItems] = useState<ReviewItem[]>(initialItems)

  const handleApprove = (id: string, actionName: string) => {
    setItems(items.filter((item) => item.id !== id))
    toast.success(actionName)
  }

  const handleReject = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
    toast.info("Item dismissed")
  }

  const getActionLabel = (category: Category) => {
    switch (category) {
      case "sourcing":
        return "Shortlist"
      case "monitoring":
        return "Acknowledge"
      case "outreach":
        return "Send"
      case "crm":
        return "Update"
    }
  }

  const ReviewTable = ({ category }: { category: Category }) => {
    const categoryItems = items.filter((item) => item.category === category)

    if (categoryItems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Check className="h-12 w-12 mb-4 opacity-20" />
          <p>All caught up! No items to review in {category}.</p>
        </div>
      )
    }

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Metadata</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoryItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={item.avatar} alt={item.title} />
                    <AvatarFallback>{item.initials}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{item.title}</span>
                    <span className="text-xs text-muted-foreground md:hidden">{item.date}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">{item.description}</span>
                    <span className="text-xs text-muted-foreground hidden md:inline-block">
                      {item.date}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {item.metadata && (
                    <Badge variant="secondary" className="font-normal">
                      {item.metadata}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleReject(item.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Reject</span>
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 gap-1"
                      onClick={() => handleApprove(item.id, `${getActionLabel(category)} successful`)}
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{getActionLabel(category)}</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-8 p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Review Actions</h1>
        <p className="text-muted-foreground">
          Manage your AI agent's findings and pending actions across all channels.
        </p>
      </div>

      <Tabs defaultValue="sourcing" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="sourcing" className="gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Sourcing</span>
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Monitoring</span>
          </TabsTrigger>
          <TabsTrigger value="outreach" className="gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Outreach</span>
          </TabsTrigger>
          <TabsTrigger value="crm" className="gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">CRM Admin</span>
          </TabsTrigger>
        </TabsList>
        <div className="mt-6">
          <TabsContent value="sourcing" className="m-0">
            <ReviewTable category="sourcing" />
          </TabsContent>
          <TabsContent value="monitoring" className="m-0">
            <ReviewTable category="monitoring" />
          </TabsContent>
          <TabsContent value="outreach" className="m-0">
            <ReviewTable category="outreach" />
          </TabsContent>
          <TabsContent value="crm" className="m-0">
            <ReviewTable category="crm" />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
