"use client"

import * as React from "react"
import { useState } from "react"
import { Plus, Sparkles, FileText, BookOpen, Users, User, MoreHorizontal, Pencil, Trash2, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AddContextModal, ContextItem, ContextType } from "@/components/context-library/add-context-modal"

const initialMockData: ContextItem[] = [
  {
    id: "1",
    name: "Summarize Pitch Deck",
    type: "prompt",
    content: "Please analyze this pitch deck and provide a summary that includes: 1) Company overview, 2) Problem being solved, 3) Solution approach, 4) Market size and opportunity, 5) Business model, 6) Team background, 7) Key risks and concerns, 8) Overall recommendation.",
    description: "Use when reviewing new pitch decks to get a structured summary",
    isShared: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Investment Memo Template",
    type: "template",
    content: "# Investment Memo\n\n## Executive Summary\n[Brief overview of the opportunity]\n\n## Company Overview\n- Founded: \n- Headquarters: \n- Employees: \n\n## Market Opportunity\n[Market size, growth, trends]\n\n## Product & Technology\n[Description of product/service]\n\n## Business Model\n[Revenue model, unit economics]\n\n## Competition\n[Competitive landscape analysis]\n\n## Team\n[Key team members and backgrounds]\n\n## Financials\n[Key financial metrics]\n\n## Investment Terms\n[Proposed terms]\n\n## Risks & Mitigants\n[Key risks and how to address them]\n\n## Recommendation\n[Investment recommendation]",
    description: "Standard template for creating investment memos for IC review",
    isShared: true,
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    name: "Firm Investment Thesis",
    type: "knowledge",
    content: "Our firm focuses on early-stage B2B SaaS companies in the following areas:\n\n1. AI-native applications that fundamentally change workflows\n2. Developer tools and infrastructure\n3. Vertical SaaS in underserved industries\n4. Data infrastructure and analytics\n\nWe typically invest at Seed to Series A, with check sizes ranging from $500K to $5M. We look for:\n- Strong technical founders\n- Large market opportunities ($1B+)\n- Clear path to $100M ARR\n- Capital efficient growth strategies",
    description: "Core investment thesis to guide deal evaluation decisions",
    isShared: true,
    createdAt: new Date("2024-01-05"),
  },
  {
    id: "4",
    name: "Cold Outreach Email",
    type: "template",
    content: "Subject: [Personalized Subject Line]\n\nHi [First Name],\n\n[Opening line referencing something specific about them or their company]\n\nI'm reaching out because [reason for outreach]. At [Our Firm], we [brief value proposition].\n\n[1-2 sentences about why this is relevant to them]\n\nWould you be open to a brief call next week to discuss?\n\nBest,\n[Your Name]",
    description: "Template for initial founder outreach emails",
    isShared: false,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "5",
    name: "Founder Scoring Framework",
    type: "knowledge",
    content: "When evaluating founders, we assess the following criteria on a 1-5 scale:\n\n**Technical Depth (1-5)**\n- Domain expertise\n- Technical skills relevant to the problem\n- Track record of building\n\n**Market Insight (1-5)**\n- Understanding of customer pain points\n- Knowledge of competitive landscape\n- Vision for market evolution\n\n**Execution Ability (1-5)**\n- Speed of iteration\n- Resource efficiency\n- Hiring and team building\n\n**Communication (1-5)**\n- Clarity of vision\n- Storytelling ability\n- Investor relations\n\nMinimum threshold: Average score of 3.5 across all categories.",
    description: "Scoring rubric for evaluating founding teams",
    isShared: true,
    createdAt: new Date("2024-01-12"),
  },
  {
    id: "6",
    name: "Generate Deal Memo",
    type: "prompt",
    content: "Based on the provided materials, generate a comprehensive deal memo that covers: company background, market analysis, competitive positioning, team assessment, financial overview, key risks, and investment recommendation. Format the output as a professional document suitable for investment committee review.",
    description: "Prompt to generate comprehensive deal memos from provided materials",
    isShared: true,
    createdAt: new Date("2024-01-18"),
  },
  {
    id: "7",
    name: "My Meeting Prep Checklist",
    type: "prompt",
    content: "Before my meeting with [Company/Person], please prepare:\n1. Summary of previous interactions\n2. Recent news about the company\n3. Key questions I should ask\n4. Potential concerns to address\n5. Relevant portfolio company connections\n6. Competitive landscape updates",
    description: "Personal checklist for preparing before founder meetings",
    isShared: false,
    createdAt: new Date("2024-01-22"),
  },
]

const typeConfig: Record<ContextType, { icon: typeof Sparkles; color: string; label: string }> = {
  prompt: { icon: Sparkles, color: "text-muted-foreground", label: "Prompt" },
  template: { icon: FileText, color: "text-muted-foreground", label: "Template" },
  knowledge: { icon: BookOpen, color: "text-muted-foreground", label: "Knowledge" },
}

export default function ContextLibraryPage() {
  const [items, setItems] = useState<ContextItem[]>(initialMockData)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const handleAddContext = (newItem: Omit<ContextItem, "id" | "createdAt">) => {
    const item: ContextItem = {
      ...newItem,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setItems((prev) => [item, ...prev])
  }

  const handleDeleteContext = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const filteredItems = activeTab === "all" 
    ? items 
    : items.filter((item) => item.type === activeTab)

  const getCounts = () => ({
    all: items.length,
    prompt: items.filter((i) => i.type === "prompt").length,
    template: items.filter((i) => i.type === "template").length,
    knowledge: items.filter((i) => i.type === "knowledge").length,
  })

  const counts = getCounts()

  return (
    <div className="flex flex-1 flex-col gap-8 p-8 max-w-7xl mx-auto w-full">
      <AddContextModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAdd={handleAddContext}
      />

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Context Library</h1>
          <p className="text-muted-foreground">
            Store and manage prompts, templates, and knowledge that Amy can use to assist you.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            How this works?
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Context
          </Button>
        </div>
      </div>

      {/* Tabs and Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
          <TabsTrigger value="all" className="gap-2">
            All
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {counts.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="prompt" className="gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Prompts</span>
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {counts.prompt}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="template" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Templates</span>
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {counts.template}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Knowledge</span>
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {counts.knowledge}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No items yet</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Get started by adding your first context item.
              </p>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Context
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => {
                const config = typeConfig[item.type]
                const Icon = config.icon
                return (
                  <Card key={item.id} className="group relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`${config.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {config.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          {item.isShared ? (
                            <Users className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <User className="h-4 w-4 text-muted-foreground" />
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteContext(item.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <CardTitle className="text-lg mt-2">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-3 text-sm">
                        {item.content}
                      </CardDescription>
                      <p className="text-xs text-muted-foreground mt-3">
                        Added {item.createdAt.toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
