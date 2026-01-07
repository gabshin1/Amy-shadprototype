"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Sparkles, FileText, BookOpen } from "lucide-react"

export type ContextType = "prompt" | "template" | "knowledge"

export interface ContextItem {
  id: string
  name: string
  type: ContextType
  content: string
  description: string
  isShared: boolean
  createdAt: Date
}

interface AddContextModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (item: Omit<ContextItem, "id" | "createdAt">) => void
}

const contextTypes = [
  {
    id: "prompt" as ContextType,
    name: "Prompt",
    icon: Sparkles,
    description: "A reusable prompt that Amy can use to perform tasks.",
    placeholder: "e.g., Please analyze this pitch deck and provide a summary that includes...",
  },
  {
    id: "template" as ContextType,
    name: "Template",
    icon: FileText,
    description: "A document template Amy can reference when creating content.",
    placeholder: "e.g., # Investment Memo\n\n## Executive Summary\n[Brief overview of the opportunity]...",
  },
  {
    id: "knowledge" as ContextType,
    name: "Knowledge",
    icon: BookOpen,
    description: "Background information to help Amy understand your context.",
    placeholder: "e.g., Our firm focuses on early-stage B2B SaaS companies in the following areas...",
  },
]

export function AddContextModal({ open, onOpenChange, onAdd }: AddContextModalProps) {
  const [activeType, setActiveType] = React.useState<ContextType>("prompt")
  const [name, setName] = React.useState("")
  const [content, setContent] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [isShared, setIsShared] = React.useState(false)

  const activeContext = contextTypes.find((c) => c.id === activeType) || contextTypes[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !content.trim()) return

    onAdd({
      name: name.trim(),
      type: activeType,
      content: content.trim(),
      description: description.trim(),
      isShared,
    })

    // Reset form
    setName("")
    setContent("")
    setDescription("")
    setIsShared(false)
    setActiveType("prompt")
    onOpenChange(false)
  }

  // Reset form when modal opens
  React.useEffect(() => {
    if (open) {
      setName("")
      setContent("")
      setDescription("")
      setIsShared(false)
      setActiveType("prompt")
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] p-0 gap-0 overflow-hidden h-[600px] flex flex-col">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-lg font-medium">Add Context</DialogTitle>
        </DialogHeader>
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r bg-muted/30 overflow-y-auto p-2">
            <div className="flex flex-col gap-1">
              {contextTypes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveType(item.id)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeType === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="h-full flex flex-col">
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <activeContext.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">New {activeContext.name}</h2>
                      <p className="text-muted-foreground text-sm">
                        {activeContext.description}
                      </p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-6">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder={`e.g., ${activeContext.name === "Prompt" ? "Summarize Pitch Deck" : activeContext.name === "Template" ? "Investment Memo Template" : "Firm Investment Thesis"}`}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description">Describe this context to Amy</Label>
                      <Input
                        id="description"
                        placeholder="Help Amy understand when and how to use this context..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        This helps Amy know when to apply this context automatically.
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        placeholder={activeContext.placeholder}
                        className="min-h-[180px] resize-none"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label htmlFor="shared" className="text-base">Share with Team</Label>
                        <p className="text-sm text-muted-foreground">
                          Make this context available to all team members.
                        </p>
                      </div>
                      <Switch
                        id="shared"
                        checked={isShared}
                        onCheckedChange={setIsShared}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t px-6 py-4 flex justify-end gap-2 bg-background">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!name.trim() || !content.trim()}>
                  Add {activeContext.name}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
