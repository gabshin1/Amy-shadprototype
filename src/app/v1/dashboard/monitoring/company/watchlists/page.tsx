"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, CheckCircle2, XCircle, Clock } from "lucide-react"
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
import { cn } from "@/lib/utils"

interface Watchlist {
  id: string
  name: string
  description?: string
  status: "active" | "inactive"
  runFrequency: string
  lastRun: string
  companyCount?: number
}

const mockWatchlists: Watchlist[] = [
  {
    id: "1",
    name: "Tesla",
    status: "active",
    runFrequency: "Bi-Weekly",
    lastRun: "4 days ago",
  },
  {
    id: "2",
    name: "Fund I",
    description: "Fund I",
    status: "inactive",
    runFrequency: "Bi-Weekly",
    lastRun: "10 days ago",
  },
  {
    id: "3",
    name: "Attio Monitoring",
    status: "inactive",
    runFrequency: "Bi-Weekly",
    lastRun: "16 days ago",
  },
  {
    id: "4",
    name: "Insight Partners (gabriel)",
    status: "inactive",
    runFrequency: "Bi-Weekly",
    lastRun: "16 days ago",
  },
  {
    id: "5",
    name: "Insight Partners Current Portfolio (Manual)",
    status: "active",
    runFrequency: "Bi-Weekly",
    lastRun: "2 days ago",
  },
  {
    id: "6",
    name: "Insight Partners Current Portfolio (CRM)",
    status: "active",
    runFrequency: "Bi-Weekly",
    lastRun: "2 days ago",
  },
  {
    id: "7",
    name: "Attio Watchlist",
    status: "inactive",
    runFrequency: "Bi-Weekly",
    lastRun: "16 days ago",
  },
  {
    id: "8",
    name: "Insight Partners - Portfolio",
    description: "Companies listed on Insight Partner's Portfolio Website",
    status: "inactive",
    runFrequency: "Bi-Weekly",
    lastRun: "17 days ago",
  },
  {
    id: "9",
    name: "Fintech Companies this Week",
    status: "inactive",
    runFrequency: "Bi-Weekly",
    lastRun: "a month ago",
  },
  {
    id: "10",
    name: "Portfolio Companies",
    description: "Multi-Signal Watchlist",
    status: "inactive",
    runFrequency: "Bi-Weekly",
    lastRun: "20 days ago",
  },
  {
    id: "11",
    name: "Lialia's WL",
    description: "Seed Stage Developer Tools",
    status: "inactive",
    runFrequency: "Bi-Weekly",
    lastRun: "3 months ago",
  },
]

export default function WatchlistsPage() {
  const router = useRouter()
  const activeWatchlists = mockWatchlists.filter((w) => w.status === "active")

  const getStatusIcon = (status: "active" | "inactive") => {
    if (status === "active") {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    }
    return <XCircle className="h-4 w-4 text-muted-foreground" />
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
            <BreadcrumbPage>Watchlists</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Watchlists</h1>
          <p className="text-muted-foreground mt-1">
            Configure your automated watchlists
          </p>
        </div>
        <Button onClick={() => router.push("/v1/dashboard/monitoring/company/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Watchlist
        </Button>
      </div>

      {/* Active Watchlists Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {activeWatchlists.map((watchlist) => (
          <Card
            key={watchlist.id}
            className={cn(
              "cursor-pointer hover:shadow-md transition-all",
              watchlist.status === "active" && "border-2 border-primary/20"
            )}
            onClick={() => router.push(`/v1/dashboard/monitoring/company/watchlists/${watchlist.id}`)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold leading-tight">
                  {watchlist.name}
                </CardTitle>
              </div>
              {watchlist.description && (
                <CardDescription className="mt-1 text-xs">
                  {watchlist.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Status */}
              <div className="flex items-center gap-2">
                {getStatusIcon(watchlist.status)}
                <span className={cn(
                  "text-sm font-medium capitalize",
                  watchlist.status === "active" ? "text-green-500" : "text-muted-foreground"
                )}>
                  {watchlist.status}
                </span>
              </div>

              {/* Run Frequency */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Runs {watchlist.runFrequency}</span>
              </div>

              {/* Last Run */}
              <div className="text-xs text-muted-foreground">
                Last Run: {watchlist.lastRun}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {activeWatchlists.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No active watchlists found</p>
            <Button onClick={() => router.push("/v1/dashboard/monitoring/company/create")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Watchlist
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
