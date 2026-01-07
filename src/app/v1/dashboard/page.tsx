"use client"

import { useState, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChatInput, ChatInputRef } from "@/components/chat-input"
import { IntegrationModal } from "@/components/integration-modal"
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
} from "lucide-react"

export default function Page() {
  const [integrationModalOpen, setIntegrationModalOpen] = useState(false)
  const [activeIntegrationTab, setActiveIntegrationTab] = useState("crm")
  const [chatMessage, setChatMessage] = useState("")
  const chatInputRef = useRef<ChatInputRef>(null)

  const openIntegration = (tab: string) => {
    setActiveIntegrationTab(tab)
    setIntegrationModalOpen(true)
  }

  const handleChatSend = (message: string) => {
    console.log("Chat sent:", message)
    // Clear the input after sending
    setChatMessage("")
  }

  const handlePromptClick = (prompt: string) => {
    setChatMessage(prompt)
    chatInputRef.current?.focusInput()
  }

  const actionCards = [
    {
      icon: Building2,
      title: "Analyse a Company",
      description: "Deep dive into financial health and market position.",
    },
    {
      icon: FileText,
      title: "Analyse a Document",
      description: "Extract insights and summaries from reports.",
    },
    {
      icon: User,
      title: "Analyse a Person",
      description: "Research background and professional history.",
    },
    {
      icon: Search,
      title: "Run Research",
      description: "Broad market analysis and trend identification.",
    },
  ]

  const promptChips = [
    [
      "Summarise my emails from today",
      "Who am I meeting today?",
      "How is Acme Corp performing?",
      "Who raised money recently?",
      "Check the latest news on tech stocks",
      "Find competitors for Stripe",
      "What is the sentiment of my last 5 meetings?",
      "Draft a follow-up to Sarah",
      "List top 5 VC deals this week",
      "Analyze the latest SEC filing for Apple",
    ],
    [
      "Find me some companies in the AI Memory layer",
      "What's the latest on Generative AI regulation?",
      "Summarize the key points from the last board deck",
      "Who are the key players in Quantum Computing?",
      "Draft an intro email to a potential investor",
      "What is the current valuation of OpenAI?",
      "Find recent acquisitions in the cybersecurity space",
      "Create a one-pager for our new product",
      "Analyze the competitive landscape for CRM tools",
      "What are the emerging trends in SaaS?",
    ],
    [
      "Identify key risks in this contract",
      "Compare the pricing models of AWS and Azure",
      "Find me a list of podcasts about venture capital",
      "What are the best practices for term sheets?",
      "Summarize the latest TechCrunch articles",
      "Who is the CEO of Databricks?",
      "Find me a graphic designer for our pitch deck",
      "What are the upcoming tech conferences in SF?",
      "Analyze the user feedback from our last survey",
      "Draft a tweet about our new feature launch",
    ],
    [
      "Find me companies similar to Notion",
      "What is the market size for cloud gaming?",
      "Summarize the key takeaways from the latest YC demo day",
      "Who are the top angel investors in fintech?",
      "Draft a LinkedIn post about our company culture",
      "What are the legal requirements for a Series A round?",
      "Find me a list of PR agencies for startups",
      "Analyze the growth metrics of our competitor",
      "What are the best tools for remote team management?",
      "Draft a meeting agenda for the weekly all-hands",
    ],
    [
      "Find me a list of potential beta testers",
      "What are the latest trends in edtech?",
      "Summarize the key points from the latest Fed meeting",
      "Who are the top influencers in the crypto space?",
      "Draft a press release for our funding announcement",
      "What are the best books on product management?",
      "Find me a list of co-working spaces in NYC",
      "Analyze the social media presence of our brand",
      "What are the tax implications of stock options?",
      "Draft a welcome email for new employees",
    ],
  ]

  return (
    <div className="flex flex-1 flex-col gap-8 p-8 max-w-7xl mx-auto w-full overflow-hidden">
      <IntegrationModal 
        open={integrationModalOpen} 
        onOpenChange={setIntegrationModalOpen} 
        defaultTab={activeIntegrationTab} 
      />

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
          Welcome Back Joe, <br/>
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

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {actionCards.map((card, index) => (
          <Card key={index} className="group hover:bg-accent/50 hover:shadow-sm transition-all cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <card.icon className="h-5 w-5 text-primary" />
                {card.title}
              </CardTitle>
              <CardDescription>
                {card.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Prompt Chips */}
      <div className="flex flex-col gap-3 mt-4 overflow-hidden mask-fade-sides">
        {promptChips.map((row, rowIndex) => (
          <div 
            key={rowIndex} 
            className={`flex gap-3 whitespace-nowrap w-max hover:pause-animation ${
              rowIndex % 2 === 0 ? "animate-marquee" : "animate-marquee-reverse"
            }`}
          >
            {/* Duplicate content for seamless loop */}
            {[...row, ...row].map((prompt, index) => (
              <Badge
                key={`${rowIndex}-${index}`}
                variant="secondary"
                className="text-sm py-1.5 px-4 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors shrink-0"
                onClick={() => handlePromptClick(prompt)}
              >
                {prompt}
              </Badge>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
