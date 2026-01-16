"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { ChatInput } from "@/components/chat-input"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

export default function ChatPage() {
  const searchParams = useSearchParams()
  const [messages, setMessages] = React.useState<Array<{ role: "user" | "assistant"; content: string }>>([])

  // Get initial context from URL params
  const url = searchParams?.get("url")
  const text = searchParams?.get("text")
  const context = searchParams?.get("context")
  const skillType = searchParams?.get("skillType")

  React.useEffect(() => {
    // If there's initial context, add it as a system message
    if (url || text || context || skillType) {
      const contextMessage = []
      if (url) contextMessage.push(`URL: ${url}`)
      if (text) contextMessage.push(`Text: ${text}`)
      if (context) contextMessage.push(`Context items: ${context}`)
      if (skillType) contextMessage.push(`Skill type: ${skillType}`)
      
      // In a real app, this would be sent to the backend
      console.log("Starting meeting with context:", contextMessage.join(", "))
    }
  }, [url, text, context, skillType])

  const handleSend = (message: string) => {
    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: message }])
    
    // In a real app, this would send to backend and get response
    // For now, just add a placeholder response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm working on your request. This is a placeholder response." },
      ])
    }, 1000)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-8 max-w-4xl mx-auto w-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Chat with Amy</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex-1 flex flex-col gap-4">
        <div className="flex-1 overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h1 className="text-2xl font-semibold mb-2">Start your meeting with Amy</h1>
              <p className="text-muted-foreground">
                {url || text || context
                  ? "I have the context you provided. How can I help you?"
                  : "Ask me anything or provide context to get started."}
              </p>
            </div>
          ) : (
            messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t pt-4">
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  )
}
