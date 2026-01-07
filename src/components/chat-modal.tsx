"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ChatInput } from "@/components/chat-input"

interface ChatModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChatModal({ open, onOpenChange }: ChatModalProps) {
  const handleSend = (message: string) => {
    // In a real app, you would send the message to the backend here
    console.log("Sending message:", message)
    
    // Close the modal
    onOpenChange(false)
    
    // Show toast notification
    toast("Amy started working on your request", {
      action: {
        label: "View progress",
        onClick: () => {
          // Navigate to chat or relevant page
          console.log("View progress clicked")
        },
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-4 py-2 border-b">
          <DialogTitle className="text-sm font-medium">Ask Amy</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-[400px]">
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 justify-start">
                 <div className="bg-muted rounded-lg p-3 text-sm max-w-[80%]">
                    Hello! I'm Amy. How can I help you today?
                 </div>
              </div>
            </div>
          </div>
          <div className="p-4 border-t bg-muted/20">
            <ChatInput onSend={handleSend} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
