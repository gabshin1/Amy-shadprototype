"use client"

import * as React from "react"
import { X, Plus, Sparkles, Bell, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

interface CreateFeedModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SECTORS = [
  "AI/ML", "Developer Tools", "Infrastructure", "Fintech", "HealthTech",
  "CleanTech", "SaaS", "E-commerce", "EdTech", "Cybersecurity", "Biotech"
]

const LOCATIONS = [
  "San Francisco", "New York", "Los Angeles", "Austin", "Seattle",
  "Boston", "London", "Berlin", "Paris", "Remote", "Europe", "US"
]

const FUNDING_STAGES = [
  "Pre-seed", "Seed", "Series A", "Series B", "Series C+"
]

const DATA_SOURCES = [
  { id: "crunchbase", name: "Crunchbase", enabled: true },
  { id: "pitchbook", name: "PitchBook", enabled: true },
  { id: "linkedin", name: "LinkedIn", enabled: true },
  { id: "twitter", name: "Twitter/X", enabled: false },
  { id: "product_hunt", name: "Product Hunt", enabled: true },
  { id: "github", name: "GitHub Trending", enabled: false },
]

export function CreateFeedModal({ open, onOpenChange }: CreateFeedModalProps) {
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [selectedSectors, setSelectedSectors] = React.useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = React.useState<string[]>([])
  const [selectedStages, setSelectedStages] = React.useState<string[]>([])
  const [keywords, setKeywords] = React.useState("")
  const [enabledSources, setEnabledSources] = React.useState<string[]>(
    DATA_SOURCES.filter(s => s.enabled).map(s => s.id)
  )
  const [dailyDigest, setDailyDigest] = React.useState(true)

  const toggleItem = (
    item: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((s) => s !== item))
    } else {
      setSelected([...selected, item])
    }
  }

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("Please enter a feed name")
      return
    }

    // Here you would normally save the feed
    toast.success(`Feed "${name}" created successfully!`)
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setName("")
    setDescription("")
    setSelectedSectors([])
    setSelectedLocations([])
    setSelectedStages([])
    setKeywords("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Create Sourcing Feed
          </DialogTitle>
          <DialogDescription>
            Define criteria for Amy to find new opportunities matching your investment thesis.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="criteria" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="criteria" className="gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              Criteria
            </TabsTrigger>
            <TabsTrigger value="sources" className="gap-2">
              <Database className="h-3.5 w-3.5" />
              Sources
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-3.5 w-3.5" />
              Alerts
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="criteria" className="mt-0 space-y-6">
              {/* Feed Name */}
              <div className="space-y-2">
                <Label htmlFor="feed-name">Feed Name</Label>
                <Input
                  id="feed-name"
                  placeholder="e.g., AI Infrastructure Startups"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="feed-description">Description (optional)</Label>
                <Textarea
                  id="feed-description"
                  placeholder="Describe what you're looking for..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="resize-none"
                  rows={2}
                />
              </div>

              {/* Sectors */}
              <div className="space-y-2">
                <Label>Sectors</Label>
                <div className="flex flex-wrap gap-2">
                  {SECTORS.map((sector) => (
                    <Badge
                      key={sector}
                      variant={selectedSectors.includes(sector) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/90 transition-colors"
                      onClick={() => toggleItem(sector, selectedSectors, setSelectedSectors)}
                    >
                      {sector}
                      {selectedSectors.includes(sector) && (
                        <X className="h-3 w-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Locations */}
              <div className="space-y-2">
                <Label>Locations</Label>
                <div className="flex flex-wrap gap-2">
                  {LOCATIONS.map((location) => (
                    <Badge
                      key={location}
                      variant={selectedLocations.includes(location) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/90 transition-colors"
                      onClick={() => toggleItem(location, selectedLocations, setSelectedLocations)}
                    >
                      {location}
                      {selectedLocations.includes(location) && (
                        <X className="h-3 w-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Funding Stages */}
              <div className="space-y-2">
                <Label>Funding Stages</Label>
                <div className="flex flex-wrap gap-2">
                  {FUNDING_STAGES.map((stage) => (
                    <Badge
                      key={stage}
                      variant={selectedStages.includes(stage) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/90 transition-colors"
                      onClick={() => toggleItem(stage, selectedStages, setSelectedStages)}
                    >
                      {stage}
                      {selectedStages.includes(stage) && (
                        <X className="h-3 w-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords (optional)</Label>
                <Textarea
                  id="keywords"
                  placeholder="Enter keywords separated by commas (e.g., LLM, inference, MLOps)"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="resize-none"
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">
                  Amy will prioritize companies mentioning these terms
                </p>
              </div>
            </TabsContent>

            <TabsContent value="sources" className="mt-0 space-y-4">
              <p className="text-sm text-muted-foreground">
                Select which data sources Amy should monitor for this feed.
              </p>
              <div className="space-y-3">
                {DATA_SOURCES.map((source) => (
                  <div
                    key={source.id}
                    className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      if (enabledSources.includes(source.id)) {
                        setEnabledSources(enabledSources.filter(s => s !== source.id))
                      } else {
                        setEnabledSources([...enabledSources, source.id])
                      }
                    }}
                  >
                    <span className="font-medium">{source.name}</span>
                    <div
                      className={`w-10 h-6 rounded-full transition-colors ${
                        enabledSources.includes(source.id) ? "bg-primary" : "bg-muted"
                      } relative`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          enabledSources.includes(source.id) ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0 space-y-4">
              <p className="text-sm text-muted-foreground">
                Configure how you want to be notified about new matches.
              </p>
              <div className="space-y-3">
                <div
                  className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setDailyDigest(!dailyDigest)}
                >
                  <div>
                    <p className="font-medium">Daily Digest</p>
                    <p className="text-sm text-muted-foreground">
                      Receive a summary email every morning
                    </p>
                  </div>
                  <div
                    className={`w-10 h-6 rounded-full transition-colors ${
                      dailyDigest ? "bg-primary" : "bg-muted"
                    } relative`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        dailyDigest ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border opacity-50">
                  <div>
                    <p className="font-medium">Slack Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified in Slack for high-score matches
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Feed
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

