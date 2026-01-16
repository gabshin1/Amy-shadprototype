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
  MessageSquare,
  Filter,
  ChevronRight,
  ChevronDown,
  Linkedin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { ContextItem, ContextType } from "./context-library/add-context-modal"
import { useContextLibrary } from "./context-library/context-provider"
import { cn } from "@/lib/utils"

export type PreBuiltSkillType =
  | "Company 360"
  | "Competitor Analysis"
  | "Momentum Analysis"
  | "Founder Assessment"
  | "Pitch Deck Analyzer"
  | "Data Extract"
  | "Market Mapping"

interface PreBuiltSkillModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  skillType: PreBuiltSkillType
  contextItems?: ContextItem[]
}

const typeConfig: Record<ContextType, { icon: typeof Sparkles; label: string; color: string }> = {
  prompt: { icon: Sparkles, label: "Prompt", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  knowledge: { icon: BookOpen, label: "Knowledge", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  template: { icon: FileText, label: "Template", color: "bg-green-500/10 text-green-600 border-green-500/20" },
}

// Define which skills need which inputs
const skillInputConfig: Record<PreBuiltSkillType, { needsUrl: boolean; needsLinkedInUrl: boolean; needsDocument: boolean }> = {
  "Company 360": { needsUrl: true, needsLinkedInUrl: false, needsDocument: false },
  "Competitor Analysis": { needsUrl: true, needsLinkedInUrl: false, needsDocument: false },
  "Momentum Analysis": { needsUrl: true, needsLinkedInUrl: false, needsDocument: false },
  "Founder Assessment": { needsUrl: false, needsLinkedInUrl: true, needsDocument: false },
  "Pitch Deck Analyzer": { needsUrl: false, needsLinkedInUrl: false, needsDocument: true },
  "Data Extract": { needsUrl: false, needsLinkedInUrl: false, needsDocument: true },
  "Market Mapping": { needsUrl: false, needsLinkedInUrl: false, needsDocument: false },
}

export function PreBuiltSkillModal({
  open,
  onOpenChange,
  skillType,
  contextItems: propContextItems,
}: PreBuiltSkillModalProps) {
  const router = useRouter()
  const config = skillInputConfig[skillType]
  
  const [url, setUrl] = React.useState("")
  const [linkedInUrl, setLinkedInUrl] = React.useState("")
  const [documents, setDocuments] = React.useState<File[]>([])
  const [selectedContextItems, setSelectedContextItems] = React.useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState<ContextType | "all">("all")
  const [expandedFolders, setExpandedFolders] = React.useState<Set<ContextType>>(new Set(["prompt", "template", "knowledge"]))
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  
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

  const handleStart = () => {
    // Navigate to chat page with the analysis context
    const params = new URLSearchParams()
    if (url) params.set("url", url)
    if (linkedInUrl) params.set("linkedinUrl", linkedInUrl)
    if (selectedContextItems.size > 0) {
      params.set("context", Array.from(selectedContextItems).join(","))
    }
    params.set("skillType", skillType)
    
    router.push(`/v1/dashboard/chat?${params.toString()}`)
    onOpenChange(false)
  }

  const hasRequiredInput = () => {
    if (config.needsUrl) return url.trim().length > 0
    if (config.needsLinkedInUrl) return linkedInUrl.trim().length > 0
    if (config.needsDocument) return documents.length > 0
    return true // Market Mapping doesn't need any input
  }

  React.useEffect(() => {
    if (!open) {
      setUrl("")
      setLinkedInUrl("")
      setDocuments([])
      setSelectedContextItems(new Set())
      setSearchQuery("")
      setTypeFilter("all")
      setExpandedFolders(new Set(["prompt", "template", "knowledge"]))
      setIsDragging(false)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl">{skillType}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Input Section */}
          <div className="space-y-4">
            {/* URL Input */}
            {config.needsUrl && (
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="url"
                    placeholder="Enter URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            )}

            {/* LinkedIn URL Input */}
            {config.needsLinkedInUrl && (
              <div className="space-y-2">
                <Label htmlFor="linkedin-url">LinkedIn URL</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="linkedin-url"
                    placeholder="Enter LinkedIn URL"
                    value={linkedInUrl}
                    onChange={(e) => setLinkedInUrl(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            )}

            {/* Documents Input */}
            {config.needsDocument && (
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
              <Label>Add Context Library</Label>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleStart} disabled={!hasRequiredInput()} className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Start Analysis
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
