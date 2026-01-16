"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowRight,
  ArrowLeft,
  Users,
  Search,
  X,
  Sparkles,
  FileText,
  BookOpen,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ContextMentionModal } from "@/components/context-library/context-mention-modal"
import { ContextItem, ContextType } from "@/components/context-library/add-context-modal"
import { cn } from "@/lib/utils"

// Mock team members
const mockTeamMembers = [
  { id: "1", name: "Sarah Chen", email: "sarah@example.com", avatar: "", fallback: "SC" },
  { id: "2", name: "Michael Park", email: "michael@example.com", avatar: "", fallback: "MP" },
  { id: "3", name: "Jessica Lee", email: "jessica@example.com", avatar: "", fallback: "JL" },
  { id: "4", name: "David Kim", email: "david@example.com", avatar: "", fallback: "DK" },
  { id: "5", name: "Emily Wang", email: "emily@example.com", avatar: "", fallback: "EW" },
]

// Mock context items (in a real app, this would come from a store/API)
const mockContextItems: ContextItem[] = [
  {
    id: "1",
    name: "Summarize Pitch Deck",
    type: "prompt",
    content: "Please analyze this pitch deck and provide a summary...",
    description: "Use when reviewing new pitch decks to get a structured summary",
    isShared: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Investment Memo Template",
    type: "template",
    content: "# Investment Memo\n\n## Executive Summary...",
    description: "Standard template for creating investment memos for IC review",
    isShared: true,
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    name: "Firm Investment Thesis",
    type: "knowledge",
    content: "Our firm focuses on early-stage B2B SaaS companies...",
    description: "Core investment thesis to guide deal evaluation decisions",
    isShared: true,
    createdAt: new Date("2024-01-05"),
  },
  {
    id: "4",
    name: "Cold Outreach Email",
    type: "template",
    content: "Subject: [Personalized Subject Line]...",
    description: "Template for initial founder outreach emails",
    isShared: false,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "5",
    name: "Founder Scoring Framework",
    type: "knowledge",
    content: "When evaluating founders, we assess the following criteria...",
    description: "Scoring rubric for evaluating founding teams",
    isShared: true,
    createdAt: new Date("2024-01-12"),
  },
  {
    id: "6",
    name: "Generate Deal Memo",
    type: "prompt",
    content: "Based on the provided materials, generate a comprehensive deal memo...",
    description: "Prompt to generate comprehensive deal memos from provided materials",
    isShared: true,
    createdAt: new Date("2024-01-18"),
  },
]

const typeConfig: Record<ContextType, { icon: typeof Sparkles; label: string; color: string }> = {
  knowledge: { icon: BookOpen, label: "Knowledge", color: "text-blue-500" },
  prompt: { icon: Sparkles, label: "Prompts", color: "text-purple-500" },
  template: { icon: FileText, label: "Templates", color: "text-green-500" },
}

export default function ConfigureWatchlistPage() {
  const router = useRouter()
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [selectedMembers, setSelectedMembers] = React.useState<Set<string>>(new Set())
  const [selectedContextItems, setSelectedContextItems] = React.useState<ContextItem[]>([])
  const [memberSearchOpen, setMemberSearchOpen] = React.useState(false)
  const [contextModalOpen, setContextModalOpen] = React.useState(false)
  const [contextSearchQuery, setContextSearchQuery] = React.useState("")

  const handleAddMember = (memberId: string) => {
    const newSelected = new Set(selectedMembers)
    newSelected.add(memberId)
    setSelectedMembers(newSelected)
    setMemberSearchOpen(false)
  }

  const handleRemoveMember = (memberId: string) => {
    const newSelected = new Set(selectedMembers)
    newSelected.delete(memberId)
    setSelectedMembers(newSelected)
  }

  const handleSelectContext = (item: ContextItem) => {
    if (!selectedContextItems.find((i) => i.id === item.id)) {
      setSelectedContextItems([...selectedContextItems, item])
    }
    setContextModalOpen(false)
  }

  const handleRemoveContext = (itemId: string) => {
    setSelectedContextItems(selectedContextItems.filter((item) => item.id !== itemId))
  }

  const filteredContextItems = React.useMemo(() => {
    if (!contextSearchQuery.trim()) {
      return mockContextItems
    }
    const query = contextSearchQuery.toLowerCase()
    return mockContextItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query)
    )
  }, [contextSearchQuery])

  const availableMembers = mockTeamMembers.filter((member) => !selectedMembers.has(member.id))

  const canCreate = title.trim().length > 0

  const handleCreateWatchlist = () => {
    if (!canCreate) {
      return
    }

    // Here you would save the watchlist configuration
    const watchlistData = {
      title: title.trim(),
      description: description.trim(),
      members: Array.from(selectedMembers),
      contextItems: selectedContextItems.map((item) => item.id),
    }

    // In a real app, this would be an API call
    console.log("Creating watchlist:", watchlistData)

    // Navigate to the monitoring page
    router.push("/v1/dashboard/monitoring/company")
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
              <Link href="/v1/dashboard/monitoring/company/create">Create Watchlist</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Configure</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configure Watchlist</h1>
        <p className="text-muted-foreground mt-1">
          Add details and share your watchlist with your team
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Form */}
        <div className="space-y-6">
          {/* Title */}
          <Card>
            <CardHeader>
              <CardTitle>Watchlist Details</CardTitle>
              <CardDescription>
                Give your watchlist a name and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., AI Infrastructure Companies"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this watchlist is for..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle>Share with Team</CardTitle>
              <CardDescription>
                Add team members who should have access to this watchlist
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedMembers.size > 0 && (
                <div className="flex flex-wrap gap-2">
                  {Array.from(selectedMembers).map((memberId) => {
                    const member = mockTeamMembers.find((m) => m.id === memberId)
                    if (!member) return null
                    return (
                      <Badge
                        key={memberId}
                        variant="secondary"
                        className="flex items-center gap-2 px-3 py-1"
                      >
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="text-[10px]">{member.fallback}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{member.name}</span>
                        <button
                          onClick={() => handleRemoveMember(memberId)}
                          className="ml-1 hover:bg-muted rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )
                  })}
                </div>
              )}

              <Popover open={memberSearchOpen} onOpenChange={setMemberSearchOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Team Member
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search team members..." />
                    <CommandList>
                      <CommandEmpty>No members found.</CommandEmpty>
                      <CommandGroup>
                        {availableMembers.map((member) => (
                          <CommandItem
                            key={member.id}
                            onSelect={() => handleAddMember(member.id)}
                            className="flex items-center gap-2"
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="text-xs">{member.fallback}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{member.name}</span>
                              <span className="text-xs text-muted-foreground">{member.email}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Context Library */}
        <Card>
          <CardHeader>
            <CardTitle>Context Library</CardTitle>
            <CardDescription>
              Add context items to help Amy understand this watchlist
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search context library..."
                value={contextSearchQuery}
                onChange={(e) => setContextSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Add Context Button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setContextModalOpen(true)}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Add Context Item
            </Button>

            {/* Selected Context Items */}
            {selectedContextItems.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Selected Context Items</Label>
                <div className="space-y-2">
                  {selectedContextItems.map((item) => {
                    const config = typeConfig[item.type]
                    const Icon = config.icon
                    return (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-3 rounded-lg border bg-muted/50"
                      >
                        <div className={cn("mt-0.5", config.color)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{item.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {config.label}
                            </Badge>
                          </div>
                          {item.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveContext(item.id)}
                          className="hover:bg-muted rounded-full p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Filtered Results (when searching) */}
            {contextSearchQuery.trim() && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Search Results {filteredContextItems.filter((item) => !selectedContextItems.find((i) => i.id === item.id)).length > 0 && `(${filteredContextItems.filter((item) => !selectedContextItems.find((i) => i.id === item.id)).length})`}
                </Label>
                {filteredContextItems.filter((item) => !selectedContextItems.find((i) => i.id === item.id)).length > 0 ? (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {filteredContextItems
                      .filter((item) => !selectedContextItems.find((i) => i.id === item.id))
                      .map((item) => {
                        const config = typeConfig[item.type]
                        const Icon = config.icon
                        return (
                          <div
                            key={item.id}
                            className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => handleSelectContext(item)}
                          >
                            <div className={cn("mt-0.5", config.color)}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">{item.name}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {config.label}
                                </Badge>
                              </div>
                              {item.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No context items found matching "{contextSearchQuery}"
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Context Mention Modal */}
      <ContextMentionModal
        open={contextModalOpen}
        onOpenChange={setContextModalOpen}
        items={mockContextItems.filter((item) => !selectedContextItems.find((i) => i.id === item.id))}
        onSelect={handleSelectContext}
      />

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => router.push("/v1/dashboard/monitoring/company/create/data-sources")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleCreateWatchlist} disabled={!canCreate}>
          Create Watchlist
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
