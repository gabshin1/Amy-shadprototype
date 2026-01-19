"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Plus,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Minus,
  Mail,
  Sparkles,
  Calendar,
  Filter,
  Brain,
  CheckCircle2,
  Search,
  X,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Signal {
  id: string
  companyName: string
  companyId?: string
  watchlistName: string
  watchlistId: string
  signalType: "positive" | "negative" | "neutral" | "alert"
  changeType: string
  description: string
  detectedAt: Date
  founderEmail?: string
}

interface Watchlist {
  id: string
  name: string
  status: "active" | "inactive"
}

const mockWatchlists: Watchlist[] = [
  { id: "1", name: "Tesla", status: "active" },
  { id: "2", name: "Insight Partners Current Portfolio (Manual)", status: "active" },
  { id: "3", name: "Insight Partners Current Portfolio (CRM)", status: "active" },
  { id: "4", name: "Fund I", status: "inactive" },
  { id: "5", name: "Attio Monitoring", status: "inactive" },
]

const mockSignals: Signal[] = [
  {
    id: "1",
    companyName: "OpenAI",
    companyId: "openai",
    watchlistName: "Tesla",
    watchlistId: "1",
    signalType: "positive",
    changeType: "New funding round",
    description: "OpenAI announced a new $10B funding round led by Microsoft",
    detectedAt: new Date(),
    founderEmail: "sam@openai.com",
  },
  {
    id: "2",
    companyName: "Anthropic",
    companyId: "anthropic",
    watchlistName: "Tesla",
    watchlistId: "1",
    signalType: "alert",
    changeType: "Key executive departure",
    description: "CTO Dario Amodei has left the company",
    detectedAt: new Date(),
    founderEmail: "dario@anthropic.com",
  },
  {
    id: "3",
    companyName: "Langfuse",
    companyId: "langfuse",
    watchlistName: "Insight Partners Current Portfolio (Manual)",
    watchlistId: "2",
    signalType: "positive",
    changeType: "Product launch",
    description: "Launched new observability features for LLM applications",
    detectedAt: new Date(Date.now() - 86400000),
  },
  {
    id: "4",
    companyName: "Vercel",
    companyId: "vercel",
    watchlistName: "Insight Partners Current Portfolio (CRM)",
    watchlistId: "3",
    signalType: "negative",
    changeType: "Revenue decline",
    description: "Q4 revenue decreased by 15% compared to Q3",
    detectedAt: new Date(Date.now() - 172800000),
  },
  {
    id: "5",
    companyName: "Stripe",
    companyId: "stripe",
    watchlistName: "Tesla",
    watchlistId: "1",
    signalType: "neutral",
    changeType: "No significant changes",
    description: "No major updates detected in the monitoring period",
    detectedAt: new Date(Date.now() - 259200000),
  },
  {
    id: "6",
    companyName: "Anthropic",
    companyId: "anthropic",
    watchlistName: "Insight Partners Current Portfolio (Manual)",
    watchlistId: "2",
    signalType: "positive",
    changeType: "New partnership announced",
    description: "Partnership with Google Cloud for enterprise AI solutions",
    detectedAt: new Date(Date.now() - 345600000),
  },
]

const mockAnalysis = {
  all: {
    title: "Overall Recent Changes Analysis",
    insights: [
      "6 signals detected across 3 active watchlists in the last 7 days",
      "2 positive signals indicate strong momentum in AI infrastructure space",
      "1 alert requires immediate attention: Anthropic executive departure",
      "Revenue decline detected for Vercel - recommend financial review",
    ],
  },
  "1": {
    title: "Tesla Watchlist Analysis",
    insights: [
      "3 signals detected in Tesla watchlist",
      "Mixed signals: 1 positive (OpenAI funding), 1 alert (Anthropic departure), 1 neutral",
      "Anthropic executive departure is the highest priority item requiring investigation",
      "OpenAI's new funding round presents a potential outreach opportunity",
    ],
  },
  "2": {
    title: "Insight Partners Current Portfolio (Manual) Analysis",
    insights: [
      "2 signals detected in this watchlist",
      "Both signals are positive, indicating strong portfolio momentum",
      "Langfuse product launch shows active innovation",
      "Anthropic partnership with Google Cloud strengthens market position",
    ],
  },
  "3": {
    title: "Insight Partners Current Portfolio (CRM) Analysis",
    insights: [
      "1 signal detected in this watchlist",
      "Negative signal: Vercel revenue decline requires attention",
      "Recommend scheduling a call with Vercel leadership to understand the decline",
      "Monitor for additional signals in the coming weeks",
    ],
  },
}

export default function RecentChangesPage() {
  const router = useRouter()
  const [selectedWatchlist, setSelectedWatchlist] = React.useState<string>("all")
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [signals, setSignals] = React.useState<Signal[]>(mockSignals)

  const activeWatchlists = mockWatchlists.filter((w) => w.status === "active")

  const filteredSignals = React.useMemo(() => {
    let filtered = signals

    // Filter by watchlist
    if (selectedWatchlist !== "all") {
      filtered = filtered.filter((s) => s.watchlistId === selectedWatchlist)
    }

    // Filter by search query (company name or watchlist name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((s) => {
        const companyMatch = s.companyName.toLowerCase().includes(query)
        const watchlistMatch = s.watchlistName.toLowerCase().includes(query)
        return companyMatch || watchlistMatch
      })
    }

    return filtered
  }, [selectedWatchlist, searchQuery, signals])

  const currentAnalysis = React.useMemo(() => {
    // If searching, show all analysis; otherwise show watchlist-specific
    if (searchQuery.trim() && selectedWatchlist === "all") {
      return mockAnalysis.all
    }
    return mockAnalysis[selectedWatchlist as keyof typeof mockAnalysis] || mockAnalysis.all
  }, [selectedWatchlist, searchQuery])

  const getStatusConfig = (status: Signal["signalType"]) => {
    const configs = {
      positive: { icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
      negative: { icon: TrendingDown, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
      neutral: { icon: Minus, color: "text-muted-foreground", bg: "bg-muted", border: "border-border" },
      alert: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
    }
    return configs[status]
  }

  const handleSendEmail = (signal: Signal) => {
    // In a real app, this would open an email composer
    console.log("Send email to:", signal.founderEmail || signal.companyName)
  }

  const handleRunSkill = (signal: Signal) => {
    // In a real app, this would open skill selection modal
    console.log("Run skill for:", signal.companyName)
  }

  const handleScheduleCall = (signal: Signal) => {
    // In a real app, this would open calendar scheduling
    console.log("Schedule call for:", signal.companyName)
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
            <BreadcrumbPage>Recent Changes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recent Changes</h1>
          <p className="text-muted-foreground mt-1">
            All data changes and signals from your watchlists
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push("/v1/dashboard/monitoring/company/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Create Watchlist
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by company or watchlist..."
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

        {/* Watchlist Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium whitespace-nowrap">Filter by Watchlist:</span>
          <Select value={selectedWatchlist} onValueChange={setSelectedWatchlist}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select a watchlist" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Active Watchlists</SelectItem>
              {activeWatchlists.map((watchlist) => (
                <SelectItem key={watchlist.id} value={watchlist.id}>
                  {watchlist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Results Info */}
      {(searchQuery || selectedWatchlist !== "all") && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Showing {filteredSignals.length} of {signals.length} signals
          </span>
          {(searchQuery || selectedWatchlist !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("")
                setSelectedWatchlist("all")
              }}
              className="text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Amy Analysis */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>Amy's Analysis</CardTitle>
          </div>
          <CardDescription>{currentAnalysis.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {currentAnalysis.insights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{insight}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Signal Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Signals ({filteredSignals.length})
          </h2>
        </div>

        <div className="space-y-3">
          {filteredSignals.map((signal) => {
            const config = getStatusConfig(signal.signalType)
            const Icon = config.icon

            return (
              <Card
                key={signal.id}
                className={cn("transition-all hover:shadow-md cursor-pointer", config.border)}
                onClick={() => {
                  const companySlug = signal.companyId || signal.companyName.toLowerCase().replace(/\s+/g, '-')
                  router.push(`/v1/dashboard/monitoring/company/${companySlug}`)
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <div className={cn("mt-1", config.color)}>
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Signal Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-base">{signal.companyName}</h3>
                            <Badge
                              variant={signal.signalType === "alert" ? "destructive" : "secondary"}
                              className="text-xs"
                            >
                              {signal.signalType}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {signal.watchlistName}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            {signal.changeType}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {signal.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Detected {signal.detectedAt.toLocaleDateString()} at{" "}
                            {signal.detectedAt.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                        {signal.founderEmail && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendEmail(signal)}
                            className="gap-2"
                          >
                            <Mail className="h-4 w-4" />
                            Email Founder
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                              <Sparkles className="h-4 w-4" />
                              Run Skill
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => handleRunSkill(signal)}>
                              <span className="text-xs">Custom Skills</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRunSkill(signal)}>
                              <span className="text-xs">Pre-built Skills</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleScheduleCall(signal)}
                          className="gap-2"
                        >
                          <Calendar className="h-4 w-4" />
                          Schedule Call
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredSignals.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground mb-2 font-medium">
                No signals found
              </p>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                {searchQuery || selectedWatchlist !== "all"
                  ? "Try adjusting your search query or watchlist filter"
                  : "No signals detected yet. Signals will appear here as they are detected."}
              </p>
              {(searchQuery || selectedWatchlist !== "all") && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedWatchlist("all")
                  }}
                >
                  Clear all filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
