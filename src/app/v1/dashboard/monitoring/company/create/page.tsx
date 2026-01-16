"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Rocket,
  TrendingUp,
  Building2,
  Settings,
  DollarSign,
  Users,
  Lightbulb,
  BarChart3,
  Briefcase,
  ChevronUp,
  ChevronDown,
  Star,
  Check,
  Save,
  ArrowRight,
  FileText,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Signal {
  id: string
  name: string
  description: string
  category: string
  hasThreshold: boolean
  thresholdLabel?: string
  thresholdValue?: number
  thresholdUnit?: string
  thresholdValue2?: number
  thresholdUnit2?: string
}

interface Stage {
  id: string
  name: string
  icon: LucideIcon
  description: string
  defaultSignals?: string[]
  defaultPriority?: string[]
}

const stages: Stage[] = [
  {
    id: "early-stage",
    name: "Early Stage VC",
    icon: Rocket,
    description: "Commonly used for: Prospective Deals, early portfolio monitoring, competitive discovery, passed companies.",
    defaultSignals: [
      "funding-rounds",
      "revenue-metrics",
      "employee-count",
      "key-executive-changes",
      "new-product-launches",
      "product-reviews",
      "pricing-changes",
      "active-job-posts",
      "partnerships",
      "new-customers",
      "company-updates",
      "news-coverage",
      "business-description-changes",
    ],
    defaultPriority: [
      "funding-rounds",
      "revenue-metrics",
      "key-executive-changes",
      "new-product-launches",
      "new-customers",
      "business-description-changes",
    ],
  },
  {
    id: "series-ab",
    name: "Series A/B VC",
    icon: TrendingUp,
    description: "Commonly used for: Portfolio monitoring, growth tracking, competitive analysis, market positioning.",
    defaultSignals: [
      "funding-rounds",
      "revenue-metrics",
      "acquisition-activity",
      "employee-seniority-mix",
      "key-executive-changes",
      "new-product-launches",
      "product-reviews",
      "pricing-changes",
      "website-traffic",
      "partnerships",
      "new-customers",
      "office-expansion",
      "company-updates",
      "news-coverage",
      "business-description-changes",
    ],
    defaultPriority: [
      "funding-rounds",
      "revenue-metrics",
      "key-executive-changes",
      "new-product-launches",
      "partnerships",
      "new-customers",
      "office-expansion",
      "company-updates",
    ],
  },
  {
    id: "growth",
    name: "Growth Equity",
    icon: BarChart3,
    description: "Commonly used for: Growth metrics, market expansion, operational efficiency, exit readiness.",
    defaultSignals: [
      "funding-rounds",
      "revenue-metrics",
      "ipo-activity",
      "acquisition-activity",
      "employee-review-scores",
      "employee-seniority-mix",
      "key-executive-changes",
      "product-reviews",
      "technology-stack",
      "partnerships",
      "new-customers",
      "office-expansion",
      "company-updates",
      "news-coverage",
      "business-description-changes",
    ],
    defaultPriority: [
      "funding-rounds",
      "revenue-metrics",
      "ipo-activity",
      "acquisition-activity",
      "key-executive-changes",
      "office-expansion",
      "company-updates",
      "news-coverage",
    ],
  },
  {
    id: "corp-dev",
    name: "Corp Dev / M&A",
    icon: Building2,
    description: "Commonly used for: Acquisition targets, strategic fit analysis, market consolidation, competitive intelligence.",
    defaultSignals: [
      "revenue-metrics",
      "acquisition-activity",
      "key-executive-changes",
      "new-product-launches",
      "technology-stack",
      "pricing-changes",
      "website-traffic",
      "partnerships",
      "new-customers",
      "office-expansion",
      "company-updates",
      "news-coverage",
      "business-description-changes",
    ],
    defaultPriority: [
      "acquisition-activity",
      "key-executive-changes",
      "new-product-launches",
      "technology-stack",
      "pricing-changes",
      "partnerships",
      "new-customers",
      "company-updates",
    ],
  },
  {
    id: "funds",
    name: "Funds",
    icon: DollarSign,
    description: "Commonly used for: Fund performance tracking, portfolio company monitoring, market trends.",
    defaultSignals: [
      "funding-rounds",
      "acquisition-activity",
      "ipo-activity",
      "key-executive-changes",
      "new-customers",
      "company-updates",
      "news-coverage",
    ],
    defaultPriority: [],
  },
  {
    id: "custom",
    name: "Custom",
    icon: Settings,
    description: "Build your own custom configuration from scratch.",
  },
]

const signals: Signal[] = [
  // Financial & Funding
  {
    id: "funding-rounds",
    name: "Funding Rounds",
    description: "Track competitive positioning and investor quality",
    category: "financial-funding",
  },
  {
    id: "revenue-metrics",
    name: "Revenue Metrics",
    description: "Alert when revenue changes by more than",
    category: "financial-funding",
    hasThreshold: true,
    thresholdValue: 15,
    thresholdUnit: "%",
    thresholdValue2: 10,
    thresholdUnit2: "M",
  },
  {
    id: "ipo-activity",
    name: "IPO Activity",
    description: "Track public market readiness and exit timing",
    category: "financial-funding",
  },
  {
    id: "acquisition-activity",
    name: "Acquisition Activity",
    description: "Monitor M&A activity and strategic fit",
    category: "financial-funding",
  },
  // Team & Talent
  {
    id: "employee-count",
    name: "Employee Count",
    description: "Alert when headcount changes by more than",
    category: "team-talent",
    hasThreshold: true,
    thresholdValue: 20,
    thresholdUnit: "%",
    thresholdValue2: 100,
    thresholdUnit2: "total headcount",
  },
  {
    id: "employee-review-scores",
    name: "Employee Review Scores",
    description: "Alert when scores drop below",
    category: "team-talent",
    hasThreshold: true,
    thresholdValue: 3.5,
    thresholdUnit: "/ 5",
  },
  {
    id: "employee-seniority-mix",
    name: "Employee Seniority Mix",
    description: "Track organizational maturity signals",
    category: "team-talent",
  },
  {
    id: "key-executive-changes",
    name: "Key Executive Changes",
    description: "Alert on C-suite and leadership changes",
    category: "team-talent",
  },
  // Product & Innovation
  {
    id: "new-product-launches",
    name: "New Product Launches",
    description: "Track innovation velocity and product expansion",
    category: "product-innovation",
  },
  {
    id: "product-reviews",
    name: "Product Reviews",
    description: "Alert when average rating drops below",
    category: "product-innovation",
    hasThreshold: true,
    thresholdValue: 4,
    thresholdUnit: "/ 5",
  },
  {
    id: "technology-stack",
    name: "Technology Stack",
    description: "Track technical sophistication and infrastructure investments",
    category: "product-innovation",
  },
  {
    id: "pricing-changes",
    name: "Pricing Changes",
    description: "Alert when pricing changes",
    category: "product-innovation",
  },
  // Market & Momentum
  {
    id: "active-job-posts",
    name: "Active Job Posts",
    description: "Alert when job posts change by more than",
    category: "market-momentum",
    hasThreshold: true,
    thresholdValue: 25,
    thresholdUnit: "%",
  },
  {
    id: "linkedin-followers",
    name: "LinkedIn Followers",
    description: "Alert when followers change by more than",
    category: "market-momentum",
    hasThreshold: true,
    thresholdValue: 10,
    thresholdUnit: "%",
  },
  {
    id: "website-traffic",
    name: "Website Traffic",
    description: "Alert when website traffic changes by more than",
    category: "market-momentum",
    hasThreshold: true,
    thresholdValue: 20,
    thresholdUnit: "%",
  },
  {
    id: "partnerships",
    name: "Partnerships",
    description: "Track strategic alliances and partnership announcements",
    category: "market-momentum",
  },
  {
    id: "new-customers",
    name: "New Customers",
    description: "Monitor customer acquisition and notable client wins",
    category: "market-momentum",
  },
  // Business Activity
  {
    id: "office-expansion",
    name: "Office Expansion",
    description: "Track geographic expansion and market prioritization",
    category: "business-activity",
  },
  {
    id: "company-updates",
    name: "Company Updates",
    description: "Monitor transparency and momentum indicators",
    category: "business-activity",
  },
  {
    id: "news-coverage",
    name: "News Coverage",
    description: "Track media momentum and market perception",
    category: "business-activity",
  },
  {
    id: "business-description-changes",
    name: "Business Description Changes",
    description: "Alert on positioning shifts and strategy pivots",
    category: "business-activity",
  },
]

const categories = [
  {
    id: "financial-funding",
    name: "Financial & Funding",
    icon: FileText,
  },
  {
    id: "team-talent",
    name: "Team & Talent",
    icon: Users,
  },
  {
    id: "product-innovation",
    name: "Product & Innovation",
    icon: Lightbulb,
  },
  {
    id: "market-momentum",
    name: "Market & Momentum",
    icon: BarChart3,
  },
  {
    id: "business-activity",
    name: "Business Activity",
    icon: Briefcase,
  },
]

export default function CreateWatchlistPage() {
  const router = useRouter()
  const [selectedStage, setSelectedStage] = React.useState<string | null>(null)
  const [selectedSignals, setSelectedSignals] = React.useState<Set<string>>(new Set())
  const [prioritySignals, setPrioritySignals] = React.useState<Set<string>>(new Set())
  const [thresholdValues, setThresholdValues] = React.useState<Record<string, { value?: number; value2?: number }>>({})
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set())
  const categoryRefs = React.useRef<Record<string, HTMLDivElement | null>>({})

  const handleSaveAsCustom = () => {
    // Save current configuration as a custom template
    const customConfig = {
      name: "Custom Configuration",
      signals: Array.from(selectedSignals),
      prioritySignals: Array.from(prioritySignals),
      thresholds: thresholdValues,
      createdAt: new Date().toISOString(),
    }

    // Store in localStorage (in a real app, this would be saved to a backend)
    const existingCustoms = JSON.parse(localStorage.getItem("watchlistCustomConfigs") || "[]")
    existingCustoms.push(customConfig)
    localStorage.setItem("watchlistCustomConfigs", JSON.stringify(existingCustoms))

    // Show success feedback (you could use a toast here)
    alert("Configuration saved as custom template!")
  }

  // Apply default signals when stage is selected
  React.useEffect(() => {
    if (selectedStage) {
      const stage = stages.find((s) => s.id === selectedStage)
      if (stage?.defaultSignals) {
        setSelectedSignals(new Set(stage.defaultSignals))
        // Set priority signals based on stage
        if (stage.defaultPriority) {
          setPrioritySignals(new Set(stage.defaultPriority))
        } else {
          setPrioritySignals(new Set())
        }
      } else {
        setSelectedSignals(new Set())
        setPrioritySignals(new Set())
      }
    }
  }, [selectedStage])

  // Scroll to category when expanded
  const handleCategoryToggle = (categoryId: string, isExpanding: boolean) => {
    const newExpanded = new Set(expandedCategories)
    if (isExpanding) {
      newExpanded.add(categoryId)
      setExpandedCategories(newExpanded)
      // Scroll to category after state update
      setTimeout(() => {
        const element = categoryRefs.current[categoryId]
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 100)
    } else {
      newExpanded.delete(categoryId)
      setExpandedCategories(newExpanded)
    }
  }

  const toggleSignal = (signalId: string) => {
    const newSelected = new Set(selectedSignals)
    if (newSelected.has(signalId)) {
      newSelected.delete(signalId)
      const newPriority = new Set(prioritySignals)
      newPriority.delete(signalId)
      setPrioritySignals(newPriority)
    } else {
      newSelected.add(signalId)
    }
    setSelectedSignals(newSelected)
  }

  const togglePriority = (signalId: string) => {
    if (!selectedSignals.has(signalId)) return
    const newPriority = new Set(prioritySignals)
    if (newPriority.has(signalId)) {
      newPriority.delete(signalId)
    } else {
      newPriority.add(signalId)
    }
    setPrioritySignals(newPriority)
  }

  const updateThreshold = (signalId: string, field: "value" | "value2", value: number) => {
    setThresholdValues((prev) => ({
      ...prev,
      [signalId]: {
        ...prev[signalId],
        [field]: value,
      },
    }))
  }

  const getCategorySignals = (categoryId: string) => {
    return signals.filter((s) => s.category === categoryId)
  }

  const getCategoryStats = (categoryId: string) => {
    const categorySignals = getCategorySignals(categoryId)
    const selected = categorySignals.filter((s) => selectedSignals.has(s.id)).length
    const priority = categorySignals.filter((s) => prioritySignals.has(s.id)).length
    return { selected, priority }
  }

  const weeklyDigestSignals = Array.from(selectedSignals).map((id) => signals.find((s) => s.id === id)).filter(Boolean) as Signal[]
  const priorityAlertSignals = Array.from(prioritySignals).map((id) => signals.find((s) => s.id === id)).filter(Boolean) as Signal[]

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
            <BreadcrumbPage>Create Watchlist</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Signal Configuration</h1>
          <p className="text-muted-foreground mt-1">
            Configure company data sources you want Amy to monitor on your watchlist.
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Signals Selected: {selectedSignals.size}
        </Badge>
      </div>

      {/* Stages */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          {stages.map((stage) => {
            const Icon = stage.icon
            const isSelected = selectedStage === stage.id
            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(stage.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted border-border"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{stage.name}</span>
              </button>
            )
          })}
        </div>
        {selectedStage && (
          <p className="text-sm text-muted-foreground">
            {stages.find((s) => s.id === selectedStage)?.description}
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main Content - Categories */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Categories of Data Signals</h2>
          {categories.map((category) => {
            const Icon = category.icon
            const stats = getCategoryStats(category.id)
            const categorySignals = getCategorySignals(category.id)
            const isExpanded = expandedCategories.has(category.id)

            return (
              <div
                key={category.id}
                ref={(el) => {
                  categoryRefs.current[category.id] = el
                }}
              >
                <Collapsible
                  open={isExpanded}
                  onOpenChange={(open) => handleCategoryToggle(category.id, open)}
                >
                  <Card>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-base">{category.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {stats.selected}
                        </Badge>
                        {stats.priority > 0 && (
                          <Badge variant="outline" className="text-xs">
                            ⭐{stats.priority}
                          </Badge>
                        )}
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4 pt-0">
                      {categorySignals.map((signal) => {
                        const isSelected = selectedSignals.has(signal.id)
                        const isPriority = prioritySignals.has(signal.id)
                        const threshold = thresholdValues[signal.id] || {}

                        return (
                          <div
                            key={signal.id}
                            className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleSignal(signal.id)}
                              />
                              <div className="flex-1">
                                <div className="font-medium text-sm">{signal.name}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  {signal.description}
                                  {signal.hasThreshold && isSelected && (
                                    <span className="inline-flex items-center gap-1 ml-2">
                                      <Input
                                        type="number"
                                        value={threshold.value ?? signal.thresholdValue ?? ""}
                                        onChange={(e) =>
                                          updateThreshold(signal.id, "value", parseFloat(e.target.value) || 0)
                                        }
                                        className="h-6 w-12 text-xs inline-flex"
                                      />
                                      <span>{signal.thresholdUnit}</span>
                                      {signal.thresholdValue2 !== undefined && (
                                        <>
                                          <span>and/or</span>
                                          <Input
                                            type="number"
                                            value={threshold.value2 ?? signal.thresholdValue2 ?? ""}
                                            onChange={(e) =>
                                              updateThreshold(signal.id, "value2", parseFloat(e.target.value) || 0)
                                            }
                                            className="h-6 w-12 text-xs inline-flex"
                                          />
                                          <span>{signal.thresholdUnit2}</span>
                                        </>
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => togglePriority(signal.id)}
                              disabled={!isSelected}
                              className={cn(
                                "shrink-0",
                                !isSelected && "opacity-50 cursor-not-allowed"
                              )}
                            >
                              {isPriority ? (
                                <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                              ) : (
                                <Star className="h-5 w-5 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                        )
                      })}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
              </div>
            )
          })}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-base">Weekly Digest</CardTitle>
              <p className="text-xs text-muted-foreground">Included in your weekly summary</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {weeklyDigestSignals.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No signals selected</p>
                ) : (
                  weeklyDigestSignals.map((signal) => (
                    <div key={signal.id} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{signal.name}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-base">Priority Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {priorityAlertSignals.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No priority alerts set</p>
                ) : (
                  priorityAlertSignals.map((signal) => (
                    <div key={signal.id} className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span>{signal.name}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-end pt-4 border-t">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveAsCustom}>
            <Save className="mr-2 h-4 w-4" />
            Save as Custom
          </Button>
          <Button
            onClick={() => router.push("/v1/dashboard/monitoring/company/create/data-sources")}
            disabled={selectedSignals.size === 0}
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
