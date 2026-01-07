"use client"

import * as React from "react"
import { Database, Bookmark, EyeOff, Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OpportunityAction } from "../types"
import { cn } from "@/lib/utils"

interface BulkActionBarProps {
  selectedCount: number
  onAction: (action: OpportunityAction) => void
  onClear: () => void
}

export function BulkActionBar({ selectedCount, onAction, onClear }: BulkActionBarProps) {
  const isVisible = selectedCount > 0

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300",
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-20 opacity-0 pointer-events-none"
      )}
    >
      <div className="flex items-center gap-2 bg-background border rounded-xl shadow-2xl px-4 py-3">
        {/* Selected Count */}
        <div className="flex items-center gap-2 pr-4 border-r">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
            {selectedCount}
          </div>
          <span className="text-sm font-medium">
            {selectedCount === 1 ? "item" : "items"} selected
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => onAction("run_skill")}
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Run Skill</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => onAction("send_to_crm")}
          >
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Send to CRM</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => onAction("save")}
          >
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Save</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onAction("hide")}
          >
            <EyeOff className="h-4 w-4" />
            <span className="hidden sm:inline">Hide</span>
          </Button>
        </div>

        {/* Clear Selection */}
        <div className="pl-2 border-l">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClear}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear selection</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

