"use client"

import * as React from "react"
import { Sparkles, FileText, BookOpen, ChevronRight, ChevronDown } from "lucide-react"
import { ContextItem, ContextType } from "./context-library/add-context-modal"
import { cn } from "@/lib/utils"

interface ContextMentionPopupProps {
  open: boolean
  query: string
  items: ContextItem[]
  onSelect: (item: ContextItem) => void
  onClose: () => void
}

const typeConfig: Record<ContextType, { icon: typeof Sparkles; label: string; color: string }> = {
  prompt: { icon: Sparkles, label: "Prompt", color: "text-blue-600" },
  template: { icon: FileText, label: "Template", color: "text-green-600" },
  knowledge: { icon: BookOpen, label: "Knowledge", color: "text-purple-600" },
}

export function ContextMentionPopup({
  open,
  query,
  items,
  onSelect,
  onClose,
}: ContextMentionPopupProps) {
  const [expandedTypes, setExpandedTypes] = React.useState<Set<ContextType>>(
    new Set(["prompt", "template", "knowledge"])
  )
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  // Filter items by query
  const filteredItems = React.useMemo(() => {
    if (!query.trim()) {
      return items
    }
    const lowerQuery = query.toLowerCase()
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
    )
  }, [items, query])

  // Group items by type
  const groupedItems = React.useMemo(() => {
    const grouped: Record<ContextType, ContextItem[]> = {
      prompt: [],
      template: [],
      knowledge: [],
    }
    filteredItems.forEach((item) => {
      grouped[item.type].push(item)
    })
    return grouped
  }, [filteredItems])

  // Flatten for keyboard navigation
  const flatItems = React.useMemo(() => {
    const flat: Array<{ item: ContextItem; type: ContextType }> = []
    Object.entries(groupedItems).forEach(([type, typeItems]) => {
      if (expandedTypes.has(type as ContextType)) {
        typeItems.forEach((item) => {
          flat.push({ item, type: type as ContextType })
        })
      }
    })
    return flat
  }, [groupedItems, expandedTypes])

  // Reset selection when query changes
  React.useEffect(() => {
    setSelectedIndex(0)
  }, [query, expandedTypes])

  // Handle keyboard navigation
  React.useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, flatItems.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (flatItems[selectedIndex]) {
          onSelect(flatItems[selectedIndex].item)
        }
      } else if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, flatItems, selectedIndex, onSelect, onClose])

  if (!open) return null

  const toggleType = (type: ContextType) => {
    const newExpanded = new Set(expandedTypes)
    if (newExpanded.has(type)) {
      newExpanded.delete(type)
    } else {
      newExpanded.add(type)
    }
    setExpandedTypes(newExpanded)
  }

  let currentIndex = 0

  return (
    <div className="absolute bottom-full left-0 mb-2 z-50 bg-popover border rounded-lg shadow-lg max-h-[200px] w-[320px] overflow-hidden flex flex-col">
      <div className="p-2 border-b text-xs font-medium text-muted-foreground">
        Context Library
      </div>
      <div className="overflow-y-auto flex-1">
        {Object.entries(groupedItems).map(([type, typeItems]) => {
          const typeKey = type as ContextType
          const config = typeConfig[typeKey]
          const Icon = config.icon
          const isExpanded = expandedTypes.has(typeKey)
          const hasItems = typeItems.length > 0

          if (!hasItems && query.trim()) return null

          const typeStartIndex = currentIndex
          let typeItemIndices: number[] = []
          if (isExpanded) {
            typeItems.forEach((_, idx) => {
              typeItemIndices.push(currentIndex++)
            })
          }

          return (
            <div key={type} className="border-b last:border-b-0">
              {/* Category Header */}
              <button
                onClick={() => toggleType(typeKey)}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted/50 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <Icon className={cn("h-3.5 w-3.5", config.color)} />
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    {config.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({typeItems.length})
                  </span>
                </div>
              </button>

              {/* Items */}
              {isExpanded && hasItems && (
                <div className="ml-6">
                  {typeItems.map((item, idx) => {
                    const itemIndex = typeItemIndices[idx]
                    const isSelected = selectedIndex === itemIndex

                    return (
                      <button
                        key={item.id}
                        onClick={() => onSelect(item)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors text-left",
                          isSelected
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-muted/50 text-foreground"
                        )}
                      >
                        <span className="truncate">{item.name}</span>
                      </button>
                    )
                  })}
                </div>
              )}

              {isExpanded && !hasItems && (
                <div className="ml-6 px-3 py-2 text-xs text-muted-foreground">
                  No items found
                </div>
              )}
            </div>
          )
        })}

        {Object.values(groupedItems).every((items) => items.length === 0) && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            {query ? "No items found matching your search." : "No context items available."}
          </div>
        )}
      </div>
    </div>
  )
}
