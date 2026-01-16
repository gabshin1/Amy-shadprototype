"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Building2, TrendingUp, TrendingDown, AlertCircle, Minus, FileText, Calendar } from "lucide-react"
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
} from "@/components/ui/breadcrumb"

interface Watchlist {
  id: string
  name: string
  description: string
  companyCount: number
  createdAt: Date
}

interface Company {
  id: string
  name: string
  status: "positive" | "negative" | "neutral" | "alert"
  changeType: string
  lastUpdate: Date
}

interface WatchlistReport {
  id: string
  watchlistName: string
  generatedAt: Date
  summary: string
  keyFindings: string[]
}

const mockWatchlists: Watchlist[] = [
  {
    id: "1",
    name: "AI Infrastructure Companies",
    description: "Companies building AI infrastructure and developer tools",
    companyCount: 12,
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "2",
    name: "Portfolio Companies",
    description: "Active monitoring of our portfolio companies",
    companyCount: 8,
    createdAt: new Date("2024-01-05"),
  },
  {
    id: "3",
    name: "Competitive Landscape",
    description: "Key competitors in the SaaS space",
    companyCount: 15,
    createdAt: new Date("2024-01-15"),
  },
]

const mockCompanies: Company[] = [
  { id: "1", name: "OpenAI", status: "positive", changeType: "New funding round", lastUpdate: new Date() },
  { id: "2", name: "Anthropic", status: "alert", changeType: "Key executive departure", lastUpdate: new Date() },
  { id: "3", name: "Langfuse", status: "positive", changeType: "Product launch", lastUpdate: new Date() },
  { id: "4", name: "Vercel", status: "negative", changeType: "Revenue decline", lastUpdate: new Date() },
  { id: "5", name: "Stripe", status: "neutral", changeType: "No significant changes", lastUpdate: new Date() },
]

const mockReports: WatchlistReport[] = [
  {
    id: "1",
    watchlistName: "AI Infrastructure Companies",
    generatedAt: new Date("2024-01-20"),
    summary: "Weekly monitoring report covering 12 companies in the AI infrastructure space.",
    keyFindings: [
      "3 companies showed positive momentum with new product launches",
      "1 company raised Series B funding",
      "2 companies expanded their engineering teams",
    ],
  },
  {
    id: "2",
    watchlistName: "Portfolio Companies",
    generatedAt: new Date("2024-01-19"),
    summary: "Daily monitoring update for portfolio companies.",
    keyFindings: [
      "All portfolio companies showing steady growth",
      "2 companies preparing for next funding round",
    ],
  },
  {
    id: "3",
    watchlistName: "Competitive Landscape",
    generatedAt: new Date("2024-01-18"),
    summary: "Bi-weekly competitive analysis report.",
    keyFindings: [
      "New competitor entered the market",
      "Pricing changes detected across 3 competitors",
    ],
  },
]

export default function CompanyMonitoringPage() {
  const router = useRouter()
  const [watchlists, setWatchlists] = React.useState<Watchlist[]>(mockWatchlists)

  const stats = React.useMemo(() => {
    const totalCompanies = watchlists.reduce((sum, w) => sum + w.companyCount, 0)
    const positive = mockCompanies.filter((c) => c.status === "positive").length
    const negative = mockCompanies.filter((c) => c.status === "negative").length
    const neutral = mockCompanies.filter((c) => c.status === "neutral").length
    const alerts = mockCompanies.filter((c) => c.status === "alert").length

    return {
      totalCompanies,
      positive,
      negative,
      neutral,
      alerts,
    }
  }, [watchlists])

  return (
    <div className="flex flex-1 flex-col gap-8 p-8 max-w-7xl mx-auto w-full">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Company Monitoring</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Company Monitoring Overview</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and track companies across your watchlists
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push("/v1/dashboard/monitoring/company/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Create Watchlist
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all watchlists
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
        {/* Watchlists */}
        <Card 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => router.push("/v1/dashboard/monitoring/company/watchlists")}
        >
          <CardHeader>
            <CardTitle>Watchlists</CardTitle>
            <CardDescription>
              Manage your company watchlists
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {watchlists.map((watchlist) => (
                <div
                  key={watchlist.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium">{watchlist.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {watchlist.description}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{watchlist.companyCount} companies</span>
                      <span>Created {watchlist.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Changes */}
        <Card 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => router.push("/v1/dashboard/monitoring/company/recent-changes")}
        >
          <CardHeader>
            <CardTitle>Recent Changes</CardTitle>
            <CardDescription>
              Latest updates from monitored companies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockCompanies.map((company) => {
                const statusConfig = {
                  positive: { icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
                  negative: { icon: TrendingDown, color: "text-red-500", bg: "bg-red-500/10" },
                  neutral: { icon: Minus, color: "text-muted-foreground", bg: "bg-muted" },
                  alert: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
                }
                const config = statusConfig[company.status]
                const Icon = config.icon

                return (
                  <div
                    key={company.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${config.bg} transition-colors`}
                  >
                    <div className={`${config.color}`}>
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
      </div>

      {/* Recent Watchlist Reports */}
      <Card 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => router.push("/v1/dashboard/reports?tab=watchlist&recent=true")}
      >
        <CardHeader>
          <CardTitle>Recent Watchlist Reports</CardTitle>
          <CardDescription>
            Latest automated reports from your watchlists
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReports.map((report) => (
              <div
                key={report.id}
                className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/v1/dashboard/reports?tab=watchlist&recent=true`)
                }}
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{report.watchlistName}</span>
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
