"use client"

import { useState, useRef, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ChatInput, ChatInputRef } from "@/components/chat-input"
import { IntegrationModal } from "@/components/integration-modal"
import { AnalysisModal, SavedCustomSkill } from "@/components/analysis-modal"
import { PreBuiltSkillModal, PreBuiltSkillType } from "@/components/pre-built-skill-modal"
import {
  Brain,
  Database,
  Mail,
  MessageSquare,
  Phone,
  FileText,
  Share2,
  Paperclip,
  Search,
  User,
  Building2,
  Sparkles,
  Globe,
  TrendingUp,
  Activity,
  Users,
  Presentation,
  Download,
  Map,
} from "lucide-react"

export default function Page() {
  const [integrationModalOpen, setIntegrationModalOpen] = useState(false)
  const [activeIntegrationTab, setActiveIntegrationTab] = useState("crm")
  const [chatMessage, setChatMessage] = useState("")
  const [activeSkillTab, setActiveSkillTab] = useState("custom")
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<{ type: "company" | "document" | "professional" | "research"; title: string } | null>(null)
  const [preBuiltSkillModalOpen, setPreBuiltSkillModalOpen] = useState(false)
  const [selectedPreBuiltSkill, setSelectedPreBuiltSkill] = useState<PreBuiltSkillType | null>(null)
  const [savedSkills, setSavedSkills] = useState<SavedCustomSkill[]>([])
  const [selectedSavedSkill, setSelectedSavedSkill] = useState<SavedCustomSkill | null>(null)
  const chatInputRef = useRef<ChatInputRef>(null)

  // Load saved skills from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = JSON.parse(localStorage.getItem("customSkills") || "[]")
      setSavedSkills(saved)
    }
  }, [])

  const handleSkillSaved = () => {
    // Reload saved skills after saving
    if (typeof window !== "undefined") {
      const saved = JSON.parse(localStorage.getItem("customSkills") || "[]")
      setSavedSkills(saved)
    }
  }

  const handleSavedSkillClick = (savedSkill: SavedCustomSkill) => {
    setSelectedSavedSkill(savedSkill)
    setSelectedSkill({ type: savedSkill.skillType, title: savedSkill.name })
    setAnalysisModalOpen(true)
  }

  const openIntegration = (tab: string) => {
    setActiveIntegrationTab(tab)
    setIntegrationModalOpen(true)
  }

  const handleChatSend = (message: string) => {
    console.log("Chat sent:", message)
    // Clear the input after sending
    setChatMessage("")
  }


  const customSkillsCards = [
    {
      icon: Building2,
      title: "Analyse a Company",
      description: "Input a Company URL, and select a custom prompt from the context library for Amy to analyse it.",
      type: "company" as const,
    },
    {
      icon: FileText,
      title: "Analyse an Document",
      description: "Input a document and give Amy guidance to perform a certain type of analysis on it.",
      type: "document" as const,
    },
    {
      icon: User,
      title: "Analyse a Professional",
      description: "Provide Amy with a professional profile and the type of analysis you'd like her to run on it.",
      type: "professional" as const,
    },
    {
      icon: Globe,
      title: "Run Deep Research",
      description: "Provide an open ended query for Amy to use her data sources and tools to solve.",
      type: "research" as const,
    },
  ]

  const handleSkillClick = (card: typeof customSkillsCards[0]) => {
    setSelectedSkill({ type: card.type, title: card.title })
    setAnalysisModalOpen(true)
  }

  const preBuiltSkillsCards = [
    {
      icon: Building2,
      title: "Company 360" as PreBuiltSkillType,
      description: "Comprehensive analysis of a company's financial health, market position, and strategic outlook.",
    },
    {
      icon: TrendingUp,
      title: "Competitor Analysis" as PreBuiltSkillType,
      description: "Deep dive into competitive landscape, market positioning, and differentiation strategies.",
    },
    {
      icon: Activity,
      title: "Momentum Analysis" as PreBuiltSkillType,
      description: "Track and analyze company growth trends, funding momentum, and market signals.",
    },
    {
      icon: Users,
      title: "Founder Assessment" as PreBuiltSkillType,
      description: "Evaluate founder background, experience, and track record for investment decisions.",
    },
    {
      icon: Presentation,
      title: "Pitch Deck Analyzer" as PreBuiltSkillType,
      description: "Analyze pitch decks for clarity, completeness, and investment readiness.",
    },
    {
      icon: Download,
      title: "Data Extract" as PreBuiltSkillType,
      description: "Extract and structure key data points from documents, websites, and reports.",
    },
    {
      icon: Map,
      title: "Market Mapping" as PreBuiltSkillType,
      description: "Map market landscapes, identify key players, and visualize market structures.",
    },
  ]

  const handlePreBuiltSkillClick = (skillType: PreBuiltSkillType) => {
    setSelectedPreBuiltSkill(skillType)
    setPreBuiltSkillModalOpen(true)
  }

  return (
    <div className="flex flex-1 flex-col gap-8 p-8 max-w-7xl mx-auto w-full overflow-hidden">
      <IntegrationModal 
        open={integrationModalOpen} 
        onOpenChange={setIntegrationModalOpen} 
        defaultTab={activeIntegrationTab} 
      />

      {selectedSkill && (
        <AnalysisModal
          open={analysisModalOpen}
          onOpenChange={(open) => {
            setAnalysisModalOpen(open)
            if (!open) {
              setSelectedSavedSkill(null)
              setSelectedSkill(null)
            }
          }}
          skillType={selectedSkill.type}
          skillTitle={selectedSkill.title}
          savedContextItemIds={selectedSavedSkill?.contextItemIds}
          onSkillSaved={handleSkillSaved}
        />
      )}

      {selectedPreBuiltSkill && (
        <PreBuiltSkillModal
          open={preBuiltSkillModalOpen}
          onOpenChange={setPreBuiltSkillModalOpen}
          skillType={selectedPreBuiltSkill}
        />
      )}

      {/* Header Section with Tech Stack */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-nowrap gap-3 items-center overflow-x-auto pb-2 scrollbar-hide mask-fade">
            <h2 className="text-sm font-medium text-muted-foreground mr-2 shrink-0">
              Tech Stack Integration
            </h2>
            <Badge 
              variant="secondary" 
              className="gap-1.5 py-1 px-3 cursor-pointer hover:bg-secondary/80 transition-colors shrink-0"
              onClick={() => openIntegration("crm")}
            >
              <Database className="h-3.5 w-3.5 text-muted-foreground" />
              CRM
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 ml-1 shadow-[0_0_4px_rgba(34,197,94,0.5)]"></span>
            </Badge>
            <Badge 
              variant="secondary" 
              className="gap-1.5 py-1 px-3 cursor-pointer hover:bg-secondary/80 transition-colors shrink-0"
              onClick={() => openIntegration("email")}
            >
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              Email
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 ml-1 shadow-[0_0_4px_rgba(34,197,94,0.5)]"></span>
            </Badge>
            <Badge 
              variant="secondary" 
              className="gap-1.5 py-1 px-3 cursor-pointer hover:bg-secondary/80 transition-colors shrink-0"
              onClick={() => openIntegration("slack")}
            >
              <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
              Slack
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 ml-1 shadow-[0_0_4px_rgba(34,197,94,0.5)]"></span>
            </Badge>
            <Badge 
              variant="secondary" 
              className="gap-1.5 py-1 px-3 cursor-pointer hover:bg-secondary/80 transition-colors shrink-0"
              onClick={() => openIntegration("call_notes")}
            >
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              Call Notes
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 ml-1 shadow-[0_0_4px_rgba(34,197,94,0.5)]"></span>
            </Badge>
            <Badge 
              variant="secondary" 
              className="gap-1.5 py-1 px-3 cursor-pointer hover:bg-secondary/80 transition-colors shrink-0"
              onClick={() => openIntegration("data_room")}
            >
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              Data Room
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 ml-1 shadow-[0_0_4px_rgba(34,197,94,0.5)]"></span>
            </Badge>
            <Badge 
              variant="secondary" 
              className="gap-1.5 py-1 px-3 cursor-pointer hover:bg-secondary/80 transition-colors shrink-0"
              onClick={() => openIntegration("knowledge_base")}
            >
              <Brain className="h-3.5 w-3.5 text-muted-foreground" />
              Knowledge Base
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 ml-1 shadow-[0_0_4px_rgba(34,197,94,0.5)]"></span>
            </Badge>
            <Badge 
              variant="secondary" 
              className="gap-1.5 py-1 px-3 cursor-pointer hover:bg-secondary/80 transition-colors shrink-0"
              onClick={() => openIntegration("social_media")}
            >
              <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
              Social Media
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 ml-1 shadow-[0_0_4px_rgba(34,197,94,0.5)]"></span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center space-y-8 mt-12 mb-8">
        <h1 className="text-4xl font-semibold tracking-tight text-center">
          Welcome Back Gabriel, <br/>
          <span className="text-muted-foreground">What shall we work on?</span>
        </h1>

        {/* Chat Input */}
        <div className="w-full max-w-2xl">
          <ChatInput 
            ref={chatInputRef}
            value={chatMessage} 
            onChange={setChatMessage} 
            onSend={handleChatSend}
          />
          <div className="mt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
             <Sparkles className="h-3 w-3" />
             <span>Context Window: 128k tokens available</span>
          </div>
        </div>
      </div>

      {/* Skills Tabs and Cards */}
      <Tabs value={activeSkillTab} onValueChange={setActiveSkillTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="custom">Custom Skills</TabsTrigger>
          <TabsTrigger value="prebuilt">Pre-Built Skills</TabsTrigger>
        </TabsList>
        
        <TabsContent value="custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {customSkillsCards.map((card, index) => (
              <Card 
                key={index} 
                className="group hover:border-2 hover:shadow-sm transition-all cursor-pointer h-[200px] flex flex-col"
                onClick={() => {
                  setSelectedSavedSkill(null)
                  handleSkillClick(card)
                }}
              >
                <CardHeader className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <card.icon className="h-5 w-5 text-primary" />
                    {card.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {card.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
            {savedSkills.map((savedSkill) => {
              // Get icon based on skill type
              const getIcon = () => {
                switch (savedSkill.skillType) {
                  case "company":
                    return Building2
                  case "document":
                    return FileText
                  case "professional":
                    return User
                  case "research":
                    return Globe
                  default:
                    return Sparkles
                }
              }
              const Icon = getIcon()
              
              return (
                <Card 
                  key={savedSkill.id} 
                  className="group hover:border-2 hover:shadow-sm transition-all cursor-pointer h-[200px] flex flex-col"
                  onClick={() => handleSavedSkillClick(savedSkill)}
                >
                  <CardHeader className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Icon className="h-5 w-5 text-primary" />
                      {savedSkill.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {savedSkill.description || "Saved custom skill"}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="prebuilt">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {preBuiltSkillsCards.map((card, index) => (
              <Card 
                key={index} 
                className="group hover:border-2 hover:shadow-sm transition-all cursor-pointer h-[200px] flex flex-col"
                onClick={() => handlePreBuiltSkillClick(card.title)}
              >
                <CardHeader className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <card.icon className="h-5 w-5 text-primary" />
                    {card.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {card.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
