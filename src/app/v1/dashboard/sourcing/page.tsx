"use client"

import * as React from "react"
import { LayoutGrid, List, Plus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { FeedSelector } from "./components/feed-selector"
import { CreateFeedModal } from "./components/create-feed-modal"
import { TriageView } from "./components/triage-view"
import { TableView } from "./components/table-view"
import { mockFeeds, mockOpportunities } from "./data"
import { ViewMode, SourcingFeed, Opportunity, OpportunityAction } from "./types"
import { toast } from "sonner"

export default function SourcingPage() {
  const [viewMode, setViewMode] = React.useState<ViewMode>("triage")
  const [selectedFeed, setSelectedFeed] = React.useState<SourcingFeed | null>(mockFeeds[0])
  const [createModalOpen, setCreateModalOpen] = React.useState(false)
  const [opportunities, setOpportunities] = React.useState<Opportunity[]>(mockOpportunities)

  // Filter opportunities by selected feed
  const feedOpportunities = React.useMemo(() => {
    if (!selectedFeed) return []
    return opportunities.filter(
      (opp) => opp.feedId === selectedFeed.id && opp.status === "new"
    )
  }, [selectedFeed, opportunities])

  const handleAction = React.useCallback((opportunityId: string, action: OpportunityAction) => {
    setOpportunities((prev) =>
      prev.map((opp) => {
        if (opp.id !== opportunityId) return opp
        
        switch (action) {
          case "save":
            toast.success("Saved to your list")
            return { ...opp, status: "saved" as const }
          case "hide":
            toast.info("Hidden from view")
            return { ...opp, status: "hidden" as const }
          case "send_to_crm":
            toast.success("Sent to CRM")
            return { ...opp, status: "sent_to_crm" as const }
          case "run_skill":
            toast("Running skill...", { icon: <Sparkles className="h-4 w-4" /> })
            return opp
          default:
            return opp
        }
      })
    )
  }, [])

  const handleBulkAction = React.useCallback((opportunityIds: string[], action: OpportunityAction) => {
    setOpportunities((prev) =>
      prev.map((opp) => {
        if (!opportunityIds.includes(opp.id)) return opp
        
        switch (action) {
          case "save":
            return { ...opp, status: "saved" as const }
          case "hide":
            return { ...opp, status: "hidden" as const }
          case "send_to_crm":
            return { ...opp, status: "sent_to_crm" as const }
          default:
            return opp
        }
      })
    )

    const actionLabels: Record<OpportunityAction, string> = {
      save: "Saved",
      hide: "Hidden",
      send_to_crm: "Sent to CRM",
      run_skill: "Running skill on",
    }
    
    toast.success(`${actionLabels[action]} ${opportunityIds.length} items`)
  }, [])

  return (
    <div className="flex flex-1 flex-col gap-6 p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Sourcing</h1>
          <p className="text-sm text-muted-foreground">
            Discover new opportunities from your feeds
          </p>
        </div>

        <div className="flex items-center gap-3">
          <FeedSelector
            feeds={mockFeeds}
            selectedFeed={selectedFeed}
            onSelectFeed={setSelectedFeed}
            onCreateFeed={() => setCreateModalOpen(true)}
          />

          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) => value && setViewMode(value as ViewMode)}
            className="bg-muted rounded-lg p-1"
          >
            <ToggleGroupItem
              value="triage"
              aria-label="Triage view"
              className="data-[state=on]:bg-background data-[state=on]:shadow-sm px-3"
            >
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="table"
              aria-label="Table view"
              className="data-[state=on]:bg-background data-[state=on]:shadow-sm px-3"
            >
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <Button onClick={() => setCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Feed</span>
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      {selectedFeed && (
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            <span className="font-medium text-foreground">{feedOpportunities.length}</span> new opportunities
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">
            Last updated {new Date(selectedFeed.lastUpdated).toLocaleDateString()}
          </span>
        </div>
      )}

      {/* Main Content */}
      {!selectedFeed ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium">No feed selected</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Select a feed or create a new one to get started
            </p>
            <Button onClick={() => setCreateModalOpen(true)} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Create your first feed
            </Button>
          </div>
        </div>
      ) : feedOpportunities.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">All caught up!</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              You've reviewed all opportunities in this feed. Check back later for new matches.
            </p>
          </div>
        </div>
      ) : viewMode === "triage" ? (
        <TriageView
          opportunities={feedOpportunities}
          onAction={handleAction}
        />
      ) : (
        <TableView
          opportunities={feedOpportunities}
          onAction={handleAction}
          onBulkAction={handleBulkAction}
        />
      )}

      {/* Create Feed Modal */}
      <CreateFeedModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
    </div>
  )
}

