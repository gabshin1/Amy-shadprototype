"use client"

import * as React from "react"
import { ArrowUpIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { ContextMentionPopup } from "./context-mention-popup"
import { useContextLibrary } from "./context-library/context-provider"
import { ContextItem } from "./context-library/add-context-modal"

// InputGroup components implementation based on ShadCN patterns

const InputGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full flex-col rounded-xl border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all duration-300",
        className
      )}
      {...props}
    />
  )
})
InputGroup.displayName = "InputGroup"

const InputGroupTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <Textarea
      ref={ref}
      className={cn(
        "min-h-[60px] w-full resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:transition-opacity placeholder:duration-500",
        className
      )}
      {...props}
    />
  )
})
InputGroupTextarea.displayName = "InputGroupTextarea"

const InputGroupAddon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { align?: "start" | "center" | "end" | "block-end" }
>(({ className, align = "center", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2 p-2",
        align === "block-end" && "mt-auto",
        className
      )}
      {...props}
    />
  )
})
InputGroupAddon.displayName = "InputGroupAddon"

type ExtendedButtonProps = Omit<React.ComponentProps<typeof Button>, "size"> & {
  size?: React.ComponentProps<typeof Button>["size"] | "icon-xs"
}

const InputGroupButton = React.forwardRef<
  HTMLButtonElement,
  ExtendedButtonProps
>(({ className, size, ...props }, ref) => {
  const resolvedSize = size === "icon-xs" ? "icon" : size
  return (
    <Button
      ref={ref}
      variant="ghost"
      size={resolvedSize}
      className={cn(size === "icon-xs" && "h-8 w-8", className)}
      {...props}
    />
  )
})
InputGroupButton.displayName = "InputGroupButton"

const InputGroupText = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
})
InputGroupText.displayName = "InputGroupText"

export interface ChatInputRef {
  focusInput: () => void
}

interface ChatInputProps {
  onSend: (message: string) => void
  value?: string
  onChange?: (value: string) => void
}

const PLACEHOLDERS = [
  "What are the latest companies Accel funded?",
  "Did any of the pitches i recived today match my thesis?",
  "Are Langfuse hiring at the moment?",
  "What are the most important updates from companies on my watchlists?",
  "Find me some companies operating in the Ai Memory layer space"
]

export const ChatInput = React.forwardRef<ChatInputRef, ChatInputProps>(({ onSend, value: externalValue, onChange: externalOnChange }, ref) => {
  const [internalMessage, setInternalMessage] = React.useState("")
  const [placeholderIndex, setPlaceholderIndex] = React.useState(0)
  const [fade, setFade] = React.useState(false)
  const [isHighlighted, setIsHighlighted] = React.useState(false)
  const [mentionOpen, setMentionOpen] = React.useState(false)
  const [mentionQuery, setMentionQuery] = React.useState("")
  const [mentionStartPos, setMentionStartPos] = React.useState<number | null>(null)
  
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const inputGroupRef = React.useRef<HTMLDivElement>(null)

  // Get context items
  let contextItems: ContextItem[] = []
  try {
    const context = useContextLibrary()
    contextItems = context.items
  } catch {
    contextItems = []
  }

  // Expose focus method via ref
  React.useImperativeHandle(ref, () => ({
    focusInput: () => {
      textareaRef.current?.focus()
      setIsHighlighted(true)
      setTimeout(() => setIsHighlighted(false), 1000)
    }
  }))

  // Determine if controlled or uncontrolled
  const isControlled = externalValue !== undefined
  const message = isControlled ? externalValue : internalMessage
  
  const setMessage = (newValue: string) => {
    if (!isControlled) {
      setInternalMessage(newValue)
    }
    externalOnChange?.(newValue)
  }

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFade(true)
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length)
        setFade(false)
      }, 200) // Match transition duration
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const handleSend = () => {
    if (message.trim()) {
      onSend(message)
      setMessage("")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const cursorPos = e.target.selectionStart
    
    setMessage(newValue)
    
    // Detect @ mention
    const textBeforeCursor = newValue.substring(0, cursorPos)
    const lastAtIndex = textBeforeCursor.lastIndexOf("@")
    
    if (lastAtIndex !== -1) {
      // Check if there's a space or newline after @ (mention ended)
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1)
      const hasSpaceOrNewline = /[\s\n]/.test(textAfterAt)
      
      if (!hasSpaceOrNewline) {
        // We're in a mention - extract query
        const query = textAfterAt
        setMentionQuery(query)
        setMentionStartPos(lastAtIndex)
        setMentionOpen(true)
        return
      }
    }
    
    // Close mention if @ was removed or we moved out of mention context
    if (mentionOpen) {
      setMentionOpen(false)
      setMentionQuery("")
      setMentionStartPos(null)
    }
  }

  const handleMentionSelect = (item: ContextItem) => {
    if (mentionStartPos === null || !textareaRef.current) return
    
    const currentValue = message
    const textBefore = currentValue.substring(0, mentionStartPos)
    const textAfter = currentValue.substring(textareaRef.current.selectionStart)
    
    // Insert mention as text: @itemName
    const mentionText = `@${item.name} `
    const newValue = textBefore + mentionText + textAfter
    
    setMessage(newValue)
    setMentionOpen(false)
    setMentionQuery("")
    setMentionStartPos(null)
    
    // Restore cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = textBefore.length + mentionText.length
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
        textareaRef.current.focus()
      }
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Don't interfere with mention popup keyboard navigation
    if (mentionOpen && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === "Escape")) {
      return
    }
    
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="relative">
      <InputGroup 
        ref={inputGroupRef}
        className={cn(
          isHighlighted && "ring-2 ring-primary ring-offset-2 border-primary"
        )}
      >
        <InputGroupTextarea
          ref={textareaRef}
          placeholder={PLACEHOLDERS[placeholderIndex]}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={cn(fade && "placeholder:text-transparent transition-colors duration-200")}
        />
      <InputGroupAddon align="block-end">
        <InputGroupButton
          variant="outline"
          className="rounded-full"
          size="icon-xs"
        >
          <PlusIcon className="h-4 w-4" />
        </InputGroupButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <InputGroupButton variant="ghost">Auto</InputGroupButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="start"
            className="[--radius:0.95rem]"
          >
            <DropdownMenuItem>Auto</DropdownMenuItem>
            <DropdownMenuItem>Agent</DropdownMenuItem>
            <DropdownMenuItem>Manual</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <InputGroupText className="ml-auto">52% used</InputGroupText>
        <Separator orientation="vertical" className="!h-4" />
        <InputGroupButton
          variant="default"
          className="rounded-full"
          size="icon-xs"
          disabled={!message.trim()}
          onClick={handleSend}
        >
          <ArrowUpIcon className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
    
    <ContextMentionPopup
      open={mentionOpen}
      query={mentionQuery}
      items={contextItems}
      onSelect={handleMentionSelect}
      onClose={() => {
        setMentionOpen(false)
        setMentionQuery("")
        setMentionStartPos(null)
      }}
    />
    </div>
  )
})
ChatInput.displayName = "ChatInput"
