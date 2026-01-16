"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Building2,
  Globe,
  MapPin,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Minus,
  Users,
  Briefcase,
  DollarSign,
  Package,
  Mail,
  Phone,
  FileText,
  Upload,
  Plus,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Database,
  Link2,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface Company {
  id: string
  name: string
  website: string
  location: string
  incorporationDate: Date
  industry: string
  description: string
}

interface Signal {
  id: string
  category: "hiring" | "management" | "product" | "financial" | "general"
  signalType: "positive" | "negative" | "neutral" | "alert"
  changeType: string
  description: string
  detectedAt: Date
  source: "data-source" | "email" | "call-note" | "pitch-deck" | "manual"
  sourceDetails?: string
}

interface PrivateData {
  id: string
  type: "email" | "call-note" | "pitch-deck" | "crm-note" | "file"
  title: string
  content: string
  syncedAt: Date
  source: "integration" | "manual"
  integrationType?: "email" | "crm" | "call-notes" | "file-management"
  integrationName?: string
  syncedBy?: string
  originalUrl?: string
}

interface HiringTrend {
  id: string
  date: Date
  role: string
  department: string
  level: string
  change: "hired" | "departed"
}

interface ManagementMember {
  id: string
  name: string
  title: string
  joinedDate: Date
  previousCompany?: string
  linkedinUrl?: string
}

interface ProductUpdate {
  id: string
  date: Date
  type: "launch" | "update" | "announcement"
  title: string
  description: string
}

interface FinancialMetric {
  id: string
  period: string
  revenue?: number
  funding?: number
  valuation?: number
  employees?: number
}

interface TimelineEvent {
  id: string
  date: Date
  category: "hiring" | "management" | "product" | "financial"
  title: string
  description: string
  type: "positive" | "negative" | "neutral" | "alert"
}

// Mock data - in a real app, this would be fetched based on the company ID
const mockCompany: Company = {
  id: "openai",
  name: "OpenAI",
  website: "https://openai.com",
  location: "San Francisco, CA",
  incorporationDate: new Date("2015-12-11"),
  industry: "Artificial Intelligence",
  description: "OpenAI is an AI research and deployment company dedicated to ensuring that artificial general intelligence benefits all of humanity.",
}

const mockSignals: Signal[] = [
  {
    id: "1",
    category: "financial",
    signalType: "positive",
    changeType: "New funding round",
    description: "OpenAI announced a new $10B funding round led by Microsoft",
    detectedAt: new Date(),
    source: "data-source",
    sourceDetails: "Crunchbase API",
  },
  {
    id: "2",
    category: "management",
    signalType: "alert",
    changeType: "Key executive departure",
    description: "CTO Dario Amodei has left the company",
    detectedAt: new Date(Date.now() - 86400000),
    source: "email",
    sourceDetails: "Gmail - Auto-synced email from internal team",
  },
  {
    id: "3",
    category: "product",
    signalType: "positive",
    changeType: "Product launch",
    description: "Launched new GPT-4 Turbo model with improved performance",
    detectedAt: new Date(Date.now() - 172800000),
    source: "data-source",
    sourceDetails: "Company website",
  },
  {
    id: "4",
    category: "hiring",
    signalType: "positive",
    changeType: "Hiring surge",
    description: "15 new engineering roles posted in the last week",
    detectedAt: new Date(Date.now() - 259200000),
    source: "data-source",
    sourceDetails: "LinkedIn API",
  },
]

interface ConnectedIntegration {
  id: string
  name: string
  type: "email" | "crm" | "call-notes" | "file-management"
  status: "connected" | "syncing" | "error"
  lastSyncAt?: Date
  itemCount?: number
}

const mockConnectedIntegrations: ConnectedIntegration[] = [
  {
    id: "1",
    name: "Gmail",
    type: "email",
    status: "connected",
    lastSyncAt: new Date(Date.now() - 3600000),
    itemCount: 12,
  },
  {
    id: "2",
    name: "Attio CRM",
    type: "crm",
    status: "connected",
    lastSyncAt: new Date(Date.now() - 7200000),
    itemCount: 8,
  },
  {
    id: "3",
    name: "Google Meet",
    type: "call-notes",
    status: "connected",
    lastSyncAt: new Date(Date.now() - 1800000),
    itemCount: 5,
  },
  {
    id: "4",
    name: "Box",
    type: "file-management",
    status: "connected",
    lastSyncAt: new Date(Date.now() - 5400000),
    itemCount: 3,
  },
]

const mockPrivateData: PrivateData[] = [
  {
    id: "1",
    type: "email",
    title: "Follow-up on partnership discussion",
    content: "Discussed potential partnership opportunities and integration possibilities. OpenAI is interested in exploring deeper collaboration on enterprise solutions...",
    syncedAt: new Date(Date.now() - 345600000),
    source: "integration",
    integrationType: "email",
    integrationName: "Gmail",
    syncedBy: "Auto-sync",
    originalUrl: "https://mail.google.com/mail/u/0/#inbox/...",
  },
  {
    id: "2",
    type: "call-note",
    title: "Q4 Strategy Call",
    content: "Discussed roadmap for 2024, focus on enterprise customers, expansion plans. Key points: launching new API features, expanding sales team, targeting Fortune 500 companies...",
    syncedAt: new Date(Date.now() - 432000000),
    source: "integration",
    integrationType: "call-notes",
    integrationName: "Google Meet",
    syncedBy: "Auto-sync",
  },
  {
    id: "3",
    type: "pitch-deck",
    title: "Series C Pitch Deck - 2024",
    content: "Latest pitch deck shared by CEO, includes updated financial projections, growth metrics, and product roadmap. Valuation target: $100B...",
    syncedAt: new Date(Date.now() - 518400000),
    source: "integration",
    integrationType: "file-management",
    integrationName: "Box",
    syncedBy: "Auto-sync",
    originalUrl: "https://app.box.com/file/...",
  },
  {
    id: "4",
    type: "crm-note",
    title: "Meeting Notes - Product Discussion",
    content: "Met with product team to discuss upcoming features. They're planning to launch GPT-5 in Q2 2024 with significant improvements...",
    syncedAt: new Date(Date.now() - 604800000),
    source: "integration",
    integrationType: "crm",
    integrationName: "Attio CRM",
    syncedBy: "Auto-sync",
    originalUrl: "https://app.attio.com/...",
  },
  {
    id: "5",
    type: "email",
    title: "Partnership Proposal",
    content: "Received partnership proposal from OpenAI regarding enterprise integration. They're looking for strategic partners...",
    syncedAt: new Date(Date.now() - 691200000),
    source: "manual",
    syncedBy: "Sarah Chen",
  },
]

const mockHiringTrends: HiringTrend[] = [
  { id: "1", date: new Date(), role: "Senior ML Engineer", department: "Engineering", level: "Senior", change: "hired" },
  { id: "2", date: new Date(Date.now() - 86400000), role: "Product Manager", department: "Product", level: "Mid", change: "hired" },
  { id: "3", date: new Date(Date.now() - 172800000), role: "Head of Sales", department: "Sales", level: "Executive", change: "departed" },
]

const mockManagement: ManagementMember[] = [
  { id: "1", name: "Sam Altman", title: "CEO", joinedDate: new Date("2019-03-11"), previousCompany: "Y Combinator" },
  { id: "2", name: "Greg Brockman", title: "President & Co-Founder", joinedDate: new Date("2015-12-11"), previousCompany: "Stripe" },
  { id: "3", name: "Ilya Sutskever", title: "Chief Scientist", joinedDate: new Date("2015-12-11"), previousCompany: "Google" },
]

const mockProductUpdates: ProductUpdate[] = [
  { id: "1", date: new Date(), type: "launch", title: "GPT-4 Turbo", description: "New model with improved performance and lower costs" },
  { id: "2", date: new Date(Date.now() - 259200000), type: "update", title: "API Improvements", description: "Enhanced rate limits and new endpoints" },
]

const mockFinancials: FinancialMetric[] = [
  { id: "1", period: "2024 Q1", revenue: 2000000000, employees: 750 },
  { id: "2", period: "2023 Q4", revenue: 1500000000, employees: 650 },
  { id: "3", period: "2023 Q3", revenue: 1200000000, employees: 600 },
]

// Combined timeline events from all categories
const mockTimelineEvents: TimelineEvent[] = [
  // Financial
  {
    id: "t1",
    date: new Date(),
    category: "financial",
    title: "New $10B Funding Round",
    description: "Led by Microsoft",
    type: "positive",
  },
  {
    id: "t2",
    date: new Date(Date.now() - 259200000),
    category: "financial",
    title: "Q4 Revenue Report",
    description: "$1.5B revenue, 750 employees",
    type: "positive",
  },
  // Product
  {
    id: "t3",
    date: new Date(Date.now() - 172800000),
    category: "product",
    title: "GPT-4 Turbo Launch",
    description: "New model with improved performance",
    type: "positive",
  },
  {
    id: "t4",
    date: new Date(Date.now() - 518400000),
    category: "product",
    title: "API Improvements",
    description: "Enhanced rate limits and new endpoints",
    type: "positive",
  },
  // Hiring
  {
    id: "t5",
    date: new Date(Date.now() - 86400000),
    category: "hiring",
    title: "15 New Engineering Roles",
    description: "Expanding ML and infrastructure teams",
    type: "positive",
  },
  {
    id: "t6",
    date: new Date(Date.now() - 345600000),
    category: "hiring",
    title: "Head of Sales Departure",
    description: "Key executive left the company",
    type: "alert",
  },
  // Management
  {
    id: "t7",
    date: new Date(Date.now() - 432000000),
    category: "management",
    title: "CTO Departure",
    description: "Dario Amodei has left the company",
    type: "alert",
  },
  {
    id: "t8",
    date: new Date(Date.now() - 604800000),
    category: "management",
    title: "New VP of Engineering",
    description: "Hired from Google",
    type: "positive",
  },
  {
    id: "t9",
    date: new Date(Date.now() - 691200000),
    category: "financial",
    title: "Series C Valuation",
    description: "Company valued at $80B",
    type: "positive",
  },
  {
    id: "t10",
    date: new Date(Date.now() - 777600000),
    category: "product",
    title: "Enterprise API Launch",
    description: "New enterprise-focused features",
    type: "positive",
  },
]

// Timeline Graph Component
function TimelineGraph({ events }: { events: TimelineEvent[] }) {
  const sortedEvents = [...events].sort((a, b) => b.date.getTime() - a.date.getTime())
  const now = new Date()
  const oldestDate = sortedEvents.length > 0 
    ? sortedEvents[sortedEvents.length - 1].date 
    : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Default to 90 days ago
  const timeRange = now.getTime() - oldestDate.getTime()
  
  const categoryConfig = {
    hiring: { icon: Users, color: "bg-blue-500", border: "border-blue-500", text: "text-blue-600" },
    management: { icon: Briefcase, color: "bg-purple-500", border: "border-purple-500", text: "text-purple-600" },
    product: { icon: Package, color: "bg-green-500", border: "border-green-500", text: "text-green-600" },
    financial: { icon: DollarSign, color: "bg-amber-500", border: "border-amber-500", text: "text-amber-600" },
  }

  const getEventPosition = (date: Date) => {
    const eventTime = date.getTime()
    const position = ((eventTime - oldestDate.getTime()) / timeRange) * 100
    return Math.max(0, Math.min(100, position))
  }

  const getTypeColor = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "positive":
        return "bg-green-500"
      case "negative":
        return "bg-red-500"
      case "alert":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="relative">
      {/* Category Legend */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b">
        {Object.entries(categoryConfig).map(([category, config]) => {
          const Icon = config.icon
          return (
            <div key={category} className="flex items-center gap-2">
              <div className={cn("h-3 w-3 rounded-full", config.color)} />
              <span className="text-sm text-muted-foreground capitalize">{category}</span>
            </div>
          )
        })}
      </div>

      {/* Timeline */}
      <div className="relative h-64 overflow-x-auto">
        {/* Time axis */}
        <div className="absolute top-0 left-0 right-0 h-px bg-border" />
        
        {/* Events */}
        <div className="relative h-full">
          {sortedEvents.map((event) => {
            const config = categoryConfig[event.category]
            const Icon = config.icon
            const position = getEventPosition(event.date)
            const isRecent = (now.getTime() - event.date.getTime()) < 7 * 24 * 60 * 60 * 1000 // Last 7 days
            
            return (
              <div
                key={event.id}
                className="absolute top-8"
                style={{ left: `${position}%`, transform: "translateX(-50%)" }}
              >
                {/* Event line */}
                <div className="absolute top-0 left-1/2 w-px h-8 bg-border" style={{ transform: "translateX(-50%)" }} />
                
                {/* Event dot */}
                <div className="relative">
                  <div className={cn(
                    "absolute left-1/2 top-0 h-3 w-3 rounded-full border-2 border-background transform -translate-x-1/2 -translate-y-1/2",
                    config.border,
                    getTypeColor(event.type)
                  )} />
                  
                  {/* Event card */}
                  <div className={cn(
                    "absolute top-4 left-1/2 transform -translate-x-1/2 w-48",
                    position < 10 ? "left-0 translate-x-0" : position > 90 ? "right-0 translate-x-0" : ""
                  )}>
                    <Card className={cn(
                      "shadow-md hover:shadow-lg transition-shadow",
                      isRecent && "ring-2 ring-primary/20"
                    )}>
                      <CardContent className="p-3">
                        <div className="flex items-start gap-2">
                          <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", config.color + "/10")}>
                            <Icon className={cn("h-4 w-4", config.text)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm line-clamp-1">{event.title}</span>
                              <Badge 
                                variant={event.type === "alert" ? "destructive" : "secondary"}
                                className="text-xs shrink-0"
                              >
                                {event.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1">{event.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {event.date.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Time labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground pt-2">
          <span>{oldestDate.toLocaleDateString()}</span>
          <span>Today</span>
        </div>
      </div>
    </div>
  )
}

export default function CompanyDetailPage() {
  const router = useRouter()
  const params = useParams()
  const companyId = params.id as string

  // In a real app, fetch company data based on companyId
  const company = mockCompany
  const signals = mockSignals
  const privateData = mockPrivateData
  const hiringTrends = mockHiringTrends
  const management = mockManagement
  const productUpdates = mockProductUpdates
  const financials = mockFinancials

  const getStatusConfig = (status: Signal["signalType"]) => {
    const configs = {
      positive: { icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
      negative: { icon: TrendingDown, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
      neutral: { icon: Minus, color: "text-muted-foreground", bg: "bg-muted", border: "border-border" },
      alert: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
    }
    return configs[status]
  }

  const getSourceIcon = (source: Signal["source"]) => {
    switch (source) {
      case "email":
        return Mail
      case "call-note":
        return Phone
      case "pitch-deck":
        return FileText
      default:
        return CheckCircle2
    }
  }

  const getSourceLabel = (source: Signal["source"]) => {
    switch (source) {
      case "data-source":
        return "Data Source"
      case "email":
        return "Email"
      case "call-note":
        return "Call Note"
      case "pitch-deck":
        return "Pitch Deck"
      case "manual":
        return "Manual Entry"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-8 max-w-7xl mx-auto w-full">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/v1/dashboard/monitoring/company">Company Monitoring Overview</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/v1/dashboard/monitoring/company/recent-changes">Recent Changes</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{company.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
            <p className="text-muted-foreground mt-1">{company.description}</p>
            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Single source of truth - Aggregating data from public sources and your connected integrations
            </p>
            
            {/* Company Info */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground flex items-center gap-1"
                >
                  {company.website.replace(/^https?:\/\//, "")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {company.location}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Incorporated {company.incorporationDate.toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {company.industry}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {/* Open integrations modal */}}
          >
            <Settings className="mr-2 h-4 w-4" />
            Manage Integrations
          </Button>
          <Button onClick={() => {/* Add private data modal */}}>
            <Plus className="mr-2 h-4 w-4" />
            Add Private Data
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="signals">
            Signals
            <Badge variant="secondary" className="ml-2">
              {signals.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="hiring">
            Hiring
            <Badge variant="secondary" className="ml-2">
              {hiringTrends.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="product">
            Product
            <Badge variant="secondary" className="ml-2">
              {productUpdates.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="private-data">
            Private Data
            <Badge variant="secondary" className="ml-2">
              {privateData.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Timeline Graph */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline of Key Information</CardTitle>
              <CardDescription>
                Visual overview of hiring, management, product, and financial changes over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TimelineGraph events={mockTimelineEvents} />
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Signals */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Signals</CardTitle>
                <CardDescription>Latest changes detected for this company</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {signals.slice(0, 5).map((signal) => {
                    const config = getStatusConfig(signal.signalType)
                    const Icon = config.icon
                    const SourceIcon = getSourceIcon(signal.source)

                    return (
                      <div
                        key={signal.id}
                        className={cn("flex items-start gap-3 p-3 rounded-lg border", config.bg)}
                      >
                        <div className={cn("mt-1", config.color)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{signal.changeType}</span>
                            <Badge variant="outline" className="text-xs">
                              <SourceIcon className="h-3 w-3 mr-1" />
                              {getSourceLabel(signal.source)}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{signal.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {signal.detectedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
                <CardDescription>Current company statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Signals</span>
                    <span className="font-semibold">{signals.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Management Team</span>
                    <span className="font-semibold">{management.length} members</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Recent Hires</span>
                    <span className="font-semibold">{hiringTrends.filter(h => h.change === "hired").length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Private Documents</span>
                    <span className="font-semibold">{privateData.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Signals Tab */}
        <TabsContent value="signals" className="space-y-4">
          <div className="space-y-3">
            {signals.map((signal) => {
              const config = getStatusConfig(signal.signalType)
              const Icon = config.icon
              const SourceIcon = getSourceIcon(signal.source)

              return (
                <Card key={signal.id} className={cn("transition-all hover:shadow-md", config.border)}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={cn("mt-1", config.color)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{signal.changeType}</span>
                          <Badge
                            variant={signal.signalType === "alert" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {signal.signalType}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {signal.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <SourceIcon className="h-3 w-3 mr-1" />
                            {getSourceLabel(signal.source)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{signal.description}</p>
                        {signal.sourceDetails && (
                          <p className="text-xs text-muted-foreground">Source: {signal.sourceDetails}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          <Clock className="h-3 w-3 inline mr-1" />
                          Detected {signal.detectedAt.toLocaleDateString()} at{" "}
                          {signal.detectedAt.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Hiring Tab */}
        <TabsContent value="hiring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hiring Trends</CardTitle>
              <CardDescription>Recent hiring activity and departures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hiringTrends.map((trend) => (
                  <div
                    key={trend.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      {trend.change === "hired" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <div>
                        <div className="font-medium">{trend.role}</div>
                        <div className="text-sm text-muted-foreground">
                          {trend.department} • {trend.level}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {trend.date.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Management Tab */}
        <TabsContent value="management" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Management Team</CardTitle>
              <CardDescription>Key executives and leadership</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {management.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.title}</div>
                      {member.previousCompany && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Previously at {member.previousCompany}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Joined {member.joinedDate.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Product Tab */}
        <TabsContent value="product" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Updates</CardTitle>
              <CardDescription>Recent product launches and announcements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {productUpdates.map((update) => (
                  <div
                    key={update.id}
                    className="flex items-start gap-3 p-3 rounded-lg border"
                  >
                    <Package className="h-4 w-4 mt-1 text-primary" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{update.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {update.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{update.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {update.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
              <CardDescription>Revenue, funding, and key metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {financials.map((financial) => (
                  <div
                    key={financial.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div>
                      <div className="font-medium">{financial.period}</div>
                      <div className="text-sm text-muted-foreground space-y-1 mt-2">
                        {financial.revenue && (
                          <div>Revenue: ${(financial.revenue / 1000000).toFixed(1)}M</div>
                        )}
                        {financial.employees && (
                          <div>Employees: {financial.employees}</div>
                        )}
                        {financial.funding && (
                          <div>Funding: ${(financial.funding / 1000000).toFixed(1)}M</div>
                        )}
                        {financial.valuation && (
                          <div>Valuation: ${(financial.valuation / 1000000000).toFixed(1)}B</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Private Data Tab */}
        <TabsContent value="private-data" className="space-y-4">
          {/* Connected Integrations */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Connected Integrations</CardTitle>
                  <CardDescription>
                    Automatically synced data from your connected systems
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Open integrations modal */}}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Manage
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {mockConnectedIntegrations.map((integration) => {
                  const typeIcons = {
                    email: Mail,
                    crm: Database,
                    "call-notes": Phone,
                    "file-management": FileText,
                  }
                  const Icon = typeIcons[integration.type]

                  return (
                    <div
                      key={integration.id}
                      className="flex items-center gap-3 p-3 rounded-lg border"
                    >
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{integration.name}</span>
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {integration.itemCount} items
                        </div>
                        {integration.lastSyncAt && (
                          <div className="text-xs text-muted-foreground">
                            Synced {integration.lastSyncAt.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Private Data List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Private Data</CardTitle>
                  <CardDescription>
                    Centralized view of all information from emails, CRMs, call notes, and file systems
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* Refresh sync */}}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Sync
                  </Button>
                  <Button size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {privateData.map((data) => {
                  const typeIcons = {
                    email: Mail,
                    "call-note": Phone,
                    "pitch-deck": FileText,
                    "crm-note": Database,
                    file: FileText,
                  }
                  const Icon = typeIcons[data.type]
                  const integrationIcons = {
                    email: Mail,
                    crm: Database,
                    "call-notes": Phone,
                    "file-management": FileText,
                  }
                  const IntegrationIcon = data.integrationType ? integrationIcons[data.integrationType] : null

                  return (
                    <div
                      key={data.id}
                      className="flex items-start gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{data.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {data.type.replace("-", " ")}
                          </Badge>
                          {data.source === "integration" && (
                            <Badge variant="secondary" className="text-xs gap-1">
                              {IntegrationIcon && <IntegrationIcon className="h-3 w-3" />}
                              {data.integrationName}
                            </Badge>
                          )}
                          {data.source === "integration" && (
                            <Badge variant="outline" className="text-xs">
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Auto-synced
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {data.content}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {data.syncedAt.toLocaleDateString()}
                          </span>
                          {data.syncedBy && (
                            <span>Synced by {data.syncedBy}</span>
                          )}
                          {data.originalUrl && (
                            <a
                              href={data.originalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 hover:text-foreground"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Link2 className="h-3 w-3" />
                              View original
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
