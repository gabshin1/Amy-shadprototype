"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Building2,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Minus,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  MoreVertical,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Company {
  id: string
  name: string
  status: "positive" | "negative" | "neutral" | "alert"
  changeType: string
  lastUpdate: Date
}

interface WatchlistReport {
  id: string
  generatedAt: Date
  summary: string
  keyFindings: string[]
}

interface Action {
  id: string
  type: "review" | "contact" | "update" | "investigate"
  title: string
  description: string
  priority: "high" | "medium" | "low"
  companyName?: string
}

// Mock data - in a real app, this would be fetched based on the watchlist ID
const mockWatchlistData = {
  id: "1",
  name: "Tesla",
  status: "active" as const,
  runFrequency: "Bi-Weekly",
  lastRun: "4 days ago",
  companyCount: 12,
}

const mockCompanies: Company[] = [
  { id: "1", name: "OpenAI", status: "positive", changeType: "New funding round", lastUpdate: new Date() },
  { id: "2", name: "Anthropic", status: "alert", changeType: "Key executive departure", lastUpdate: new Date() },
  { id: "3", name: "Langfuse", status: "positive", changeType: "Product launch", lastUpdate: new Date() },
  { id: "4", name: "Vercel", status: "negative", changeType: "Revenue decline", lastUpdate: new Date() },
  { id: "5", name: "Stripe", status: "neutral", changeType: "No significant changes", lastUpdate: new Date() },
  { id: "6", name: "Anthropic", status: "positive", changeType: "New partnership announced", lastUpdate: new Date(Date.now() - 86400000) },
  { id: "7", name: "Vercel", status: "alert", changeType: "Major security incident", lastUpdate: new Date(Date.now() - 172800000) },
]

const mockReports: WatchlistReport[] = [
  {
    id: "1",
    generatedAt: new Date("2024-01-20"),
    summary: "Weekly monitoring report covering 12 companies in the Tesla watchlist.",
    keyFindings: [
      "3 companies showed positive momentum with new product launches",
      "1 company raised Series B funding",
      "2 companies expanded their engineering teams",
      "1 company reported revenue decline requiring attention",
    ],
  },
  {
    id: "2",
    generatedAt: new Date("2024-01-13"),
    summary: "Bi-weekly monitoring update for Tesla watchlist companies.",
    keyFindings: [
      "All portfolio companies showing steady growth",
      "2 companies preparing for next funding round",
      "New competitor entered the market",
    ],
  },
]

const mockActions: Action[] = [
  {
    id: "1",
    type: "investigate",
    title: "Review Anthropic executive departure",
    description: "Key executive departure detected - requires investigation",
    priority: "high",
    companyName: "Anthropic",
  },
  {
    id: "2",
    type: "contact",
    title: "Reach out to OpenAI about funding",
    description: "New funding round announced - opportunity to connect",
    priority: "medium",
    companyName: "OpenAI",
  },
  {
    id: "3",
    type: "review",
    title: "Review Vercel revenue decline",
    description: "Revenue decline detected - review financials",
    priority: "high",
    companyName: "Vercel",
  },
  {
    id: "4",
    type: "update",
    title: "Update Langfuse partnership details",
    description: "New partnership announced - update company profile",
    priority: "low",
    companyName: "Langfuse",
  },
]

export default function WatchlistDashboardPage() {
  const router = useRouter()
  const params = useParams()
  const watchlistId = params.id as string

  const stats = React.useMemo(() => {
    const positive = mockCompanies.filter((c) => c.status === "positive").length
    const negative = mockCompanies.filter((c) => c.status === "negative").length
    const neutral = mockCompanies.filter((c) => c.status === "neutral").length
    const alerts = mockCompanies.filter((c) => c.status === "alert").length

    return {
      total: mockCompanies.length,
      positive,
      negative,
      neutral,
      alerts,
    }
  }, [])

  const getStatusConfig = (status: Company["status"]) => {
    const configs = {
      positive: { icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
      negative: { icon: TrendingDown, color: "text-red-500", bg: "bg-red-500/10" },
      neutral: { icon: Minus, color: "text-muted-foreground", bg: "bg-muted" },
      alert: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
    }
    return configs[status]
  }

  const getPriorityColor = (priority: Action["priority"]) => {
    const colors = {
      high: "text-destructive",
      medium: "text-yellow-500",
      low: "text-muted-foreground",
    }
    return colors[priority]
  }

  const getActionIcon = (type: Action["type"]) => {
    const icons = {
      review: FileText,
      contact: Building2,
      update: CheckCircle2,
      investigate: AlertCircle,
    }
    return icons[type]
  }

  return (
    <div className="flex flex-1 flex-col gap-8 p-8 max-w-7xl mx-auto w-full">
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
              <Link href="/v1/dashboard/monitoring/company/watchlists">Watchlists</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{mockWatchlistData.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/v1/dashboard/monitoring/company/watchlists")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{mockWatchlistData.name}</h1>
              <Badge variant="outline" className="gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                Active
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                Runs {mockWatchlistData.runFrequency}
              </span>
              <span>Last Run: {mockWatchlistData.lastRun}</span>
              <span>{mockWatchlistData.companyCount} companies</span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit Watchlist</DropdownMenuItem>
            <DropdownMenuItem>Run Now</DropdownMenuItem>
            <DropdownMenuItem>Export Data</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              In this watchlist
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Priority Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.alerts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Changes</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.positive}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Companies with positive momentum
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negative Changes</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.negative}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Companies with concerns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No Changes</CardTitle>
            <Minus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.neutral}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Stable companies
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Changes */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Changes</CardTitle>
            <CardDescription>
              Latest updates from companies in this watchlist
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockCompanies.map((company) => {
                const config = getStatusConfig(company.status)
                const Icon = config.icon

                return (
                  <div
                    key={company.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                      config.bg
                    )}
                  >
                    <div className={config.color}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{company.name}</div>
                      <div className="text-sm text-muted-foreground mt-0.5">
                        {company.changeType}
                      </div>
                    </div>
                    <Badge variant={company.status === "alert" ? "destructive" : "secondary"}>
                      {company.status}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>
              Recommended actions for this watchlist
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockActions.map((action) => {
                const Icon = getActionIcon(action.type)
                return (
                  <div
                    key={action.id}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className={cn("mt-0.5", getPriorityColor(action.priority))}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{action.title}</span>
                        <Badge
                          variant={action.priority === "high" ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {action.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                      {action.companyName && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Company: {action.companyName}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Watchlist Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Watchlist Reports</CardTitle>
          <CardDescription>
            Automated reports specific to this watchlist
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReports.map((report) => (
              <div
                key={report.id}
                className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{mockWatchlistData.name} Report</span>
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {report.generatedAt.toLocaleDateString()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{report.summary}</p>
                  <div className="space-y-1">
                    {report.keyFindings.map((finding, idx) => (
                      <div key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>{finding}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
