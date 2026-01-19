"use client"

import * as React from "react"
import { Search, Sparkles, FileText, BookOpen, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { ContextItem, ContextType } from "./add-context-modal"

interface ContextMentionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: ContextItem[]
  onSelect: (item: ContextItem) => void
}

const typeConfig: Record<ContextType, { icon: typeof Sparkles; label: string }> = {
  knowledge: { icon: BookOpen, label: "Knowledge" },
  prompt: { icon: Sparkles, label: "Prompts" },
  template: { icon: FileText, label: "Templates" },
}

interface Category {
  type: ContextType
  label: string
  icon: typeof Sparkles
  items: ContextItem[]
}

export function ContextMentionModal({
  open,
  onOpenChange,
  items,
  onSelect,
}: ContextMentionModalProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [expandedCategories, setExpandedCategories] = React.useState<Set<ContextType>>(new Set())

  // Group items by category
  const categories = React.useMemo(() => {
    const grouped: Category[] = [
      {
        type: "knowledge",
        label: "Knowledge",
        icon: BookOpen,
        items: items.filter((item) => item.type === "knowledge"),
      },
      {
        type: "prompt",
        label: "Prompts",
        icon: Sparkles,
        items: items.filter((item) => item.type === "prompt"),
      },
      {
        type: "template",
        label: "Templates",
        icon: FileText,
        items: items.filter((item) => item.type === "template"),
      },
    ]

    // Filter by search query if provided
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      return grouped.map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.content.toLowerCase().includes(query)
        ),
      }))
    }

    return grouped
  }, [items, searchQuery])

  // Flatten all items for keyboard navigation
  const allItems = React.useMemo(() => {
    const flat: Array<{ item: ContextItem; category: ContextType }> = []
    categories.forEach((category) => {
      if (expandedCategories.has(category.type) || searchQuery.trim()) {
        category.items.forEach((item) => {
          flat.push({ item, category: category.type })
        })
      }
    })
    return flat
  }, [categories, expandedCategories, searchQuery])

  // Calculate total selectable items (categories + expanded items)
  const totalSelectable = React.useMemo(() => {
    let count = categories.length
    categories.forEach((category) => {
      if (expandedCategories.has(category.type) || searchQuery.trim()) {
        count += category.items.length
      }
    })
    return count
  }, [categories, expandedCategories, searchQuery])

  // Reset selection when items change
  React.useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery, expandedCategories])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, totalSelectable - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      // Find what's selected
      let currentIndex = 0
      for (const category of categories) {
        if (currentIndex === selectedIndex) {
          // Toggle category expansion
          const newExpanded = new Set(expandedCategories)
          if (newExpanded.has(category.type)) {
            newExpanded.delete(category.type)
          } else {
            newExpanded.add(category.type)
          }
          setExpandedCategories(newExpanded)
          return
        }
        currentIndex++

        if (expandedCategories.has(category.type) || searchQuery.trim()) {
          for (const item of category.items) {
            if (currentIndex === selectedIndex) {
              handleSelect(item)
              return
            }
            currentIndex++
          }
        }
      }
    } else if (e.key === "Escape") {
      onOpenChange(false)
    }
  }

  const handleSelect = (item: ContextItem) => {
    onSelect(item)
    onOpenChange(false)
    setSearchQuery("")
    setExpandedCategories(new Set())
    setSelectedIndex(0)
  }

  const toggleCategory = (type: ContextType) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(type)) {
      newExpanded.delete(type)
    } else {
      newExpanded.add(type)
    }
    setExpandedCategories(newExpanded)
  }

  // Calculate which item is selected for rendering
  const getSelectedItem = () => {
    let currentIndex = 0
    for (const category of categories) {
      if (currentIndex === selectedIndex) {
        return { type: "category" as const, category }
      }
      currentIndex++

      if (expandedCategories.has(category.type) || searchQuery.trim()) {
        for (const item of category.items) {
          if (currentIndex === selectedIndex) {
            return { type: "item" as const, item, category: category.type }
          }
          currentIndex++
        }
      }
    }
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[500px] p-0 gap-0 max-h-[500px] flex flex-col"
        onKeyDown={handleKeyDown}
      >
        <DialogTitle className="sr-only">Select Context Item</DialogTitle>
        {/* Search Bar */}
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search context items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-1">
            {categories.map((category) => {
              const isExpanded = expandedCategories.has(category.type) || searchQuery.trim()
              const categoryIndex = categories.indexOf(category)
              let itemStartIndex = categoryIndex + 1
              
              // Calculate if category is selected
              const isCategorySelected = selectedIndex === categoryIndex
              
              // Calculate item indices
              const itemIndices: number[] = []
              if (isExpanded) {
                categories.slice(0, categoryIndex).forEach((cat) => {
                  if (expandedCategories.has(cat.type) || searchQuery.trim()) {
                    itemStartIndex += cat.items.length
                  }
                })
                category.items.forEach((_, idx) => {
                  itemIndices.push(itemStartIndex + idx)
                })
              }

              const Icon = category.icon

              return (
                <div key={category.type} className="space-y-0.5">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.type)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                      isCategorySelected
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{category.label}</span>
                    </div>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isExpanded && "rotate-90"
                      )}
                    />
                  </button>

                  {/* Category Items */}
                  {isExpanded && (
                    <div className="ml-6 space-y-0.5">
                      {category.items.length === 0 ? (
                        <div className="px-3 py-2 text-xs text-muted-foreground">
                          No items found
                        </div>
                      ) : (
                        category.items.map((item, itemIdx) => {
                          const itemIndex = itemIndices[itemIdx]
                          const isItemSelected = selectedIndex === itemIndex

                          return (
                            <button
                              key={item.id}
                              onClick={() => handleSelect(item)}
                              className={cn(
                                "w-full flex items-start gap-3 px-3 py-2 rounded-md text-sm transition-colors text-left",
                                isItemSelected
                                  ? "bg-accent text-accent-foreground"
                                  : "hover:bg-muted text-foreground"
                              )}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{item.name}</div>
                                {item.description && (
                                  <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                    {item.description}
                                  </div>
                                )}
                              </div>
                            </button>
                          )
                        })
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            {categories.every((cat) => cat.items.length === 0) && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "No items found matching your search." : "No context items available."}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
