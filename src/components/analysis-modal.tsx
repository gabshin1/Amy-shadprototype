"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  X,
  Link as LinkIcon,
  FileText,
  Upload,
  Search,
  Sparkles,
  BookOpen,
  Save,
  MessageSquare,
  Filter,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { ContextItem, ContextType } from "./context-library/add-context-modal"
import { useContextLibrary } from "./context-library/context-provider"
import { cn } from "@/lib/utils"

export interface SavedCustomSkill {
  id: string
  name: string
  description: string
  skillType: "company" | "document" | "professional" | "research"
  contextItemIds: string[]
  createdAt: string
}

interface AnalysisModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  skillType: "company" | "document" | "professional" | "research"
  skillTitle: string
  contextItems?: ContextItem[]
  savedContextItemIds?: string[] // Pre-selected context items for saved skills
  onSkillSaved?: () => void // Callback when skill is saved
}

interface SavePreferencesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (name: string, description: string) => void
}

const typeConfig: Record<ContextType, { icon: typeof Sparkles; label: string; color: string }> = {
  prompt: { icon: Sparkles, label: "Prompt", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  knowledge: { icon: BookOpen, label: "Knowledge", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  template: { icon: FileText, label: "Template", color: "bg-green-500/10 text-green-600 border-green-500/20" },
}

function SavePreferencesModal({ open, onOpenChange, onSave }: SavePreferencesModalProps) {
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), description.trim())
      setName("")
      setDescription("")
      onOpenChange(false)
    }
  }

  React.useEffect(() => {
    if (!open) {
      setName("")
      setDescription("")
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Save as Custom Skill</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="skill-name">Name</Label>
            <Input
              id="skill-name"
              placeholder="Enter skill name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skill-description">Description</Label>
            <Textarea
              id="skill-description"
              placeholder="Enter skill description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function AnalysisModal({
  open,
  onOpenChange,
  skillType,
  skillTitle,
  contextItems: propContextItems,
  savedContextItemIds,
  onSkillSaved,
}: AnalysisModalProps) {
  const router = useRouter()
  const [url, setUrl] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [documents, setDocuments] = React.useState<File[]>([])
  const [selectedContextItems, setSelectedContextItems] = React.useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState<ContextType | "all">("all")
  const [expandedFolders, setExpandedFolders] = React.useState<Set<ContextType>>(new Set(["prompt", "template", "knowledge"]))
  const [saveModalOpen, setSaveModalOpen] = React.useState(false)
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  
  // Initialize selected context items from saved skill if provided
  React.useEffect(() => {
    if (open && savedContextItemIds && savedContextItemIds.length > 0) {
      setSelectedContextItems(new Set(savedContextItemIds))
    }
  }, [open, savedContextItemIds])
  
  // Try to use context library, fallback to prop or empty array
  let contextItems: ContextItem[] = []
  try {
    const context = useContextLibrary()
    contextItems = context.items
  } catch {
    // If context is not available, use prop or empty array
    contextItems = propContextItems || []
  }

  // Group items by type
  const groupedContextItems = React.useMemo(() => {
    const grouped: Record<ContextType, ContextItem[]> = {
      prompt: [],
      template: [],
      knowledge: [],
    }

    let filtered = contextItems

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((item) => item.type === typeFilter)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      )
    }

    // Group filtered items
    filtered.forEach((item) => {
      grouped[item.type].push(item)
    })

    return grouped
  }, [contextItems, searchQuery, typeFilter])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files))
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setDocuments(Array.from(e.dataTransfer.files))
    }
  }

  const toggleContextItem = (itemId: string) => {
    const newSelected = new Set(selectedContextItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedContextItems(newSelected)
  }

  const handleSavePreferences = (name: string, description: string) => {
    if (selectedContextItems.size === 0) {
      return // Should not be called if no items selected, but safety check
    }

    const savedSkill: SavedCustomSkill = {
      id: `skill-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      description: description.trim(),
      skillType,
      contextItemIds: Array.from(selectedContextItems),
      createdAt: new Date().toISOString(),
    }

    // Save to localStorage
    const existingSkills = JSON.parse(localStorage.getItem("customSkills") || "[]")
    existingSkills.push(savedSkill)
    localStorage.setItem("customSkills", JSON.stringify(existingSkills))

    // Notify parent component
    if (onSkillSaved) {
      onSkillSaved()
    }

    // Reset form
    setUrl("")
    setDescription("")
    setDocuments([])
    setSelectedContextItems(new Set())
    setSearchQuery("")
    setTypeFilter("all")
    setSaveModalOpen(false)
    onOpenChange(false)
  }

  const handleStartMeeting = () => {
    // Navigate to chat page with the analysis context
    const params = new URLSearchParams()
    if (skillType === "company" || skillType === "professional" || skillType === "research") {
      if (url) params.set("url", url)
    }
    if (skillType === "document") {
      // Documents would be handled differently in a real app
      // For now, we'll just pass the context
    }
    if (selectedContextItems.size > 0) {
      params.set("context", Array.from(selectedContextItems).join(","))
    }
    params.set("skillType", skillType)
    
    router.push(`/v1/dashboard/chat?${params.toString()}`)
    onOpenChange(false)
  }

  React.useEffect(() => {
    if (!open) {
      setUrl("")
      setDescription("")
      setDocuments([])
      setSelectedContextItems(new Set())
      setSearchQuery("")
      setTypeFilter("all")
      setExpandedFolders(new Set(["prompt", "template", "knowledge"]))
      setIsDragging(false)
    }
  }, [open])

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-xl">{skillTitle}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {/* Input Section */}
            <div className="space-y-4">
              {/* Company: URL only */}
              {skillType === "company" && (
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="url"
                      placeholder="Enter Company URL"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              )}

              {/* Professional: LinkedIn URL only */}
              {skillType === "professional" && (
                <div className="space-y-2">
                  <Label htmlFor="url">LinkedIn URL</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="url"
                      placeholder="Enter LinkedIn URL"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              )}

              {/* Research: Text or URL in same input */}
              {skillType === "research" && (
                <div className="space-y-2">
                  <Label htmlFor="url">Text or URL</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="url"
                      placeholder="Enter text query or URL"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              )}

              {/* Document: Documents only */}
              {skillType === "document" && (
                <div className="space-y-2">
                  <Label htmlFor="documents">Documents</Label>
                  <Input
                    ref={fileInputRef}
                    id="documents"
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer",
                      isDragging
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <Upload className={cn("h-8 w-8 mb-4", isDragging ? "text-primary" : "text-muted-foreground")} />
                    <p className="text-sm font-medium mb-1">
                      {isDragging ? "Drop files here" : "Drag and drop files here, or click to browse"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Multiple files supported
                    </p>
                  </div>
                  {documents.length > 0 && (
                    <div className="space-y-1 mt-2">
                      {documents.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>{file.name}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              const newDocs = documents.filter((_, i) => i !== idx)
                              setDocuments(newDocs)
                            }}
                            className="ml-auto text-destructive hover:text-destructive/80"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Context Library Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Select from Context Library</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    router.push("/v1/dashboard/context-library")
                    onOpenChange(false)
                  }}
                  className="text-xs"
                >
                  Manage Library
                </Button>
              </div>

              {/* Search and Filter */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search context library..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as ContextType | "all")}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="prompt">Prompt</SelectItem>
                    <SelectItem value="template">Template</SelectItem>
                    <SelectItem value="knowledge">Knowledge</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Context Items List - Folder System */}
              <div className="border rounded-lg max-h-64 overflow-y-auto">
                <div className="p-1">
                  {Object.entries(groupedContextItems).map(([type, items]) => {
                    if (items.length === 0) return null
                    const config = typeConfig[type as ContextType]
                    const Icon = config.icon
                    const folderType = type as ContextType
                    const isExpanded = expandedFolders.has(folderType)

                    const toggleFolder = () => {
                      const newExpanded = new Set(expandedFolders)
                      if (newExpanded.has(folderType)) {
                        newExpanded.delete(folderType)
                      } else {
                        newExpanded.add(folderType)
                      }
                      setExpandedFolders(newExpanded)
                    }

                    return (
                      <div key={type} className="mb-0.5 last:mb-0">
                        {/* Folder Header */}
                        <button
                          onClick={toggleFolder}
                          className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-muted/50 rounded-md transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground uppercase">
                            {config.label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({items.length})
                          </span>
                        </button>
                        {/* Items - Single Line Text */}
                        {isExpanded && (
                          <div className="ml-6">
                            {items.map((item) => {
                              const isSelected = selectedContextItems.has(item.id)

                              return (
                                <button
                                  key={item.id}
                                  onClick={() => toggleContextItem(item.id)}
                                  className={cn(
                                    "w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-md transition-colors text-left",
                                    isSelected
                                      ? "bg-primary/10 text-primary"
                                      : "hover:bg-muted/50 text-foreground"
                                  )}
                                >
                                  <span className="text-sm truncate flex-1">{item.name}</span>
                                  <Badge
                                    variant="outline"
                                    className={cn("text-xs shrink-0 h-5", config.color)}
                                  >
                                    {config.label}
                                  </Badge>
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {Object.values(groupedContextItems).every((items) => items.length === 0) && (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      {searchQuery || typeFilter !== "all" ? "No items found" : "No context items available"}
                    </div>
                  )}
                </div>
              </div>

              {selectedContextItems.size > 0 && (
                <div className="text-sm text-muted-foreground">
                  {selectedContextItems.size} item{selectedContextItems.size > 1 ? "s" : ""} selected
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t px-6 py-4 flex justify-end gap-2 bg-background">
            <Button
              variant="outline"
              onClick={() => setSaveModalOpen(true)}
              className="gap-2"
              disabled={selectedContextItems.size === 0}
            >
              <Save className="h-4 w-4" />
              Save Preferences
            </Button>
            <Button onClick={handleStartMeeting} className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Start Meeting
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <SavePreferencesModal
        open={saveModalOpen}
        onOpenChange={setSaveModalOpen}
        onSave={handleSavePreferences}
      />
    </>
  )
}
