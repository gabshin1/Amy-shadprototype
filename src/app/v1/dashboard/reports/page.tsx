"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  FileText,
  Search,
  X,
  ArrowRight,
  Calendar,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

interface Report {
  id: string
  title: string
  date: Date
  type: "watchlist" | "analysis" | "pre-screening" | "sourcing"
  category?: string
}

const mockReports: Report[] = [
  // Watchlist Reports
  {
    id: "1",
    title: "Momentum Analysis: Hebbia",
    date: new Date("2026-01-14"),
    type: "watchlist",
    category: "Momentum Analysis",
  },
  {
    id: "2",
    title: "Company 360 Report: Hebbia",
    date: new Date("2025-11-11"),
    type: "watchlist",
    category: "Company 360",
  },
  {
    id: "3",
    title: "AI Infrastructure Companies - Weekly Report",
    date: new Date("2025-10-15"),
    type: "watchlist",
    category: "Weekly Report",
  },
  {
    id: "4",
    title: "Portfolio Companies - Daily Update",
    date: new Date("2025-10-17"),
    type: "watchlist",
    category: "Daily Update",
  },
  // Analysis Reports
  {
    id: "5",
    title: "Assessment of Illuminate Financial Portfolio Founders",
    date: new Date("2026-01-06"),
    type: "analysis",
    category: "Portfolio Analysis",
  },
  {
    id: "6",
    title: "S&P Global's Strategic Push into Private Markets (Updated)",
    date: new Date("2025-10-15"),
    type: "analysis",
    category: "Strategic Analysis",
  },
  {
    id: "7",
    title: "S&P Global's Acquisition of With Intelligence",
    date: new Date("2025-10-17"),
    type: "analysis",
    category: "M&A Analysis",
  },
  {
    id: "8",
    title: "Analysis of Goldman Sachs: Industry Ventures Acquisition & Investment Strategy",
    date: new Date("2025-11-11"),
    type: "analysis",
    category: "Investment Analysis",
  },
  {
    id: "9",
    title: "Analysis of Goldman Sachs' Acquisition of Industry Ventures",
    date: new Date("2025-10-17"),
    type: "analysis",
    category: "M&A Analysis",
  },
  {
    id: "10",
    title: "NVIDIA's Two-Year Transformation: An Earnings Analysis",
    date: new Date("2025-11-11"),
    type: "analysis",
    category: "Earnings Analysis",
  },
  {
    id: "11",
    title: "Analysis of Landscape PE Funds Portfolio",
    date: new Date("2025-10-15"),
    type: "analysis",
    category: "Portfolio Analysis",
  },
  {
    id: "12",
    title: "Inferred Fund Analysis",
    date: new Date("2025-10-17"),
    type: "analysis",
    category: "Fund Analysis",
  },
  // Pre-screening Reports
  {
    id: "13",
    title: "Pre-screening: AI Infrastructure Startups Q4 2025",
    date: new Date("2025-12-01"),
    type: "pre-screening",
    category: "Startup Screening",
  },
  {
    id: "14",
    title: "Pre-screening: Enterprise SaaS Companies",
    date: new Date("2025-11-15"),
    type: "pre-screening",
    category: "SaaS Screening",
  },
  {
    id: "15",
    title: "Pre-screening: Fintech Series B Opportunities",
    date: new Date("2025-10-20"),
    type: "pre-screening",
    category: "Fintech Screening",
  },
  // Sourcing Reports
  {
    id: "16",
    title: "Sourcing Report: AI/ML Companies - January 2026",
    date: new Date("2026-01-10"),
    type: "sourcing",
    category: "AI/ML Sourcing",
  },
  {
    id: "17",
    title: "Sourcing Report: Healthcare Tech Opportunities",
    date: new Date("2025-12-15"),
    type: "sourcing",
    category: "Healthcare Sourcing",
  },
  {
    id: "18",
    title: "Sourcing Report: Developer Tools Market",
    date: new Date("2025-11-20"),
    type: "sourcing",
    category: "Developer Tools",
  },
]

export default function ReportsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  
  // Get initial tab from URL params, default to "all"
  const initialTab = (searchParams?.get("tab") || "all") as "all" | "watchlist" | "analysis" | "pre-screening" | "sourcing"
  const showRecentOnly = searchParams?.get("recent") === "true"
  
  const [activeTab, setActiveTab] = React.useState<"all" | "watchlist" | "analysis" | "pre-screening" | "sourcing">(initialTab)
  
  // Update tab when URL params change
  React.useEffect(() => {
    if (searchParams?.get("tab")) {
      setActiveTab(searchParams.get("tab") as typeof activeTab)
    }
  }, [searchParams])

  const filteredReports = React.useMemo(() => {
    let filtered = mockReports

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter((r) => r.type === activeTab)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((r) => {
        const titleMatch = r.title.toLowerCase().includes(query)
        const categoryMatch = r.category?.toLowerCase().includes(query)
        return titleMatch || categoryMatch
      })
    }

    // Filter to show only recent reports (last 30 days) if requested
    if (showRecentOnly) {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      filtered = filtered.filter((r) => r.date >= thirtyDaysAgo)
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime())
  }, [activeTab, searchQuery, showRecentOnly])

  const getTabCount = (tab: typeof activeTab) => {
    if (tab === "all") return mockReports.length
    return mockReports.filter((r) => r.type === tab).length
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const handleOpenReport = (reportId: string) => {
    // In a real app, this would navigate to the report detail page
    router.push(`/v1/dashboard/reports/${reportId}`)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-8 max-w-7xl mx-auto w-full">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Reports</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1">
            All the reports generated during your meetings with Amy.
          </p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Recent Filter Indicator */}
      {showRecentOnly && (
        <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Showing recent reports from the last 30 days
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const params = new URLSearchParams(searchParams?.toString() || "")
              params.delete("recent")
              router.push(`/v1/dashboard/reports?${params.toString()}`)
            }}
          >
            Show all reports
          </Button>
        </div>
      )}

      {/* Tabs */}
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => {
          const newTab = value as typeof activeTab
          setActiveTab(newTab)
          // Update URL without the recent parameter when manually switching tabs
          const params = new URLSearchParams(searchParams?.toString() || "")
          params.set("tab", newTab)
          if (newTab !== "watchlist" || !showRecentOnly) {
            params.delete("recent")
          }
          router.push(`/v1/dashboard/reports?${params.toString()}`)
        }}
      >
        <TabsList>
          <TabsTrigger value="all">
            All Reports
            <Badge variant="secondary" className="ml-2">
              {getTabCount("all")}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="watchlist">
            Watchlist Reports
            <Badge variant="secondary" className="ml-2">
              {getTabCount("watchlist")}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="analysis">
            Analysis Reports
            <Badge variant="secondary" className="ml-2">
              {getTabCount("analysis")}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pre-screening">
            Pre-screening Reports
            <Badge variant="secondary" className="ml-2">
              {getTabCount("pre-screening")}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="sourcing">
            Sourcing Reports
            <Badge variant="secondary" className="ml-2">
              {getTabCount("sourcing")}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* All Reports Tab */}
        <TabsContent value="all" className="mt-6">
          <ReportsGrid reports={filteredReports} onOpenReport={handleOpenReport} formatDate={formatDate} />
        </TabsContent>

        {/* Watchlist Reports Tab */}
        <TabsContent value="watchlist" className="mt-6">
          <ReportsGrid reports={filteredReports} onOpenReport={handleOpenReport} formatDate={formatDate} />
        </TabsContent>

        {/* Analysis Reports Tab */}
        <TabsContent value="analysis" className="mt-6">
          <ReportsGrid reports={filteredReports} onOpenReport={handleOpenReport} formatDate={formatDate} />
        </TabsContent>

        {/* Pre-screening Reports Tab */}
        <TabsContent value="pre-screening" className="mt-6">
          <ReportsGrid reports={filteredReports} onOpenReport={handleOpenReport} formatDate={formatDate} />
        </TabsContent>

        {/* Sourcing Reports Tab */}
        <TabsContent value="sourcing" className="mt-6">
          <ReportsGrid reports={filteredReports} onOpenReport={handleOpenReport} formatDate={formatDate} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ReportsGridProps {
  reports: Report[]
  onOpenReport: (id: string) => void
  formatDate: (date: Date) => string
}

function ReportsGrid({ reports, onOpenReport, formatDate }: ReportsGridProps) {
  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
        <p className="text-muted-foreground font-medium mb-2">No reports found</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search query or selecting a different tab.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {reports.map((report) => (
        <Card
          key={report.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onOpenReport(report.id)}
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(report.date)}
                  </p>
                  <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                    {report.title}
                  </h3>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenReport(report.id)
                  }}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  Open Report
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
