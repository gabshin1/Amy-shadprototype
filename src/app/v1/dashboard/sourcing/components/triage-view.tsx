"use client"

import * as React from "react"
import {
  Database,
  EyeOff,
  Sparkles,
  SkipForward,
  Keyboard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { OpportunityCard } from "./opportunity-card"
import { Opportunity, OpportunityAction } from "../types"
import { cn } from "@/lib/utils"

interface TriageViewProps {
  opportunities: Opportunity[]
  onAction: (opportunityId: string, action: OpportunityAction) => void
}

export function TriageView({ opportunities, onAction }: TriageViewProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isAnimating, setIsAnimating] = React.useState(false)
  const [animationDirection, setAnimationDirection] = React.useState<"left" | "right" | null>(null)
  const [showKeyboardHelp, setShowKeyboardHelp] = React.useState(false)

  const currentOpportunity = opportunities[currentIndex]
  const hasNext = currentIndex < opportunities.length - 1

  const handleAction = React.useCallback(
    (action: OpportunityAction) => {
      if (isAnimating || !currentOpportunity) return

      setIsAnimating(true)
      setAnimationDirection(action === "hide" ? "left" : "right")

      // Trigger the action
      onAction(currentOpportunity.id, action)

      // After animation, move to next card
      setTimeout(() => {
        if (hasNext) {
          setCurrentIndex((prev) => prev + 1)
        }
        setIsAnimating(false)
        setAnimationDirection(null)
      }, 300)
    },
    [currentOpportunity, hasNext, isAnimating, onAction]
  )

  const handleSkip = React.useCallback(() => {
    if (isAnimating || !hasNext) return

    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1)
      setIsAnimating(false)
    }, 200)
  }, [hasNext, isAnimating])

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      switch (e.key.toLowerCase()) {
        case "s":
          handleAction("send_to_crm")
          break
        case "h":
          handleAction("hide")
          break
        case "r":
          handleAction("run_skill")
          break
        case " ":
          e.preventDefault()
          handleSkip()
          break
        case "arrowright":
          handleAction("send_to_crm")
          break
        case "arrowleft":
          handleAction("hide")
          break
        case "?":
          setShowKeyboardHelp((prev) => !prev)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleAction, handleSkip])

  if (!currentOpportunity) {
    return null
  }

  return (
    <div className="flex flex-col items-center flex-1">
      {/* Progress Indicator */}
      <div className="mb-6 text-center">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{currentIndex + 1}</span>
          {" "}of{" "}
          <span className="font-medium text-foreground">{opportunities.length}</span>
          {" "}new opportunities
        </p>
        <div className="flex gap-1 mt-2 justify-center">
          {opportunities.slice(0, Math.min(10, opportunities.length)).map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                idx < currentIndex
                  ? "w-4 bg-primary"
                  : idx === currentIndex
                  ? "w-6 bg-primary"
                  : "w-4 bg-muted"
              )}
            />
          ))}
          {opportunities.length > 10 && (
            <span className="text-xs text-muted-foreground ml-1">
              +{opportunities.length - 10}
            </span>
          )}
        </div>
      </div>

      {/* Card Stack */}
      <div className="relative w-full max-w-md h-[420px] perspective-1000">
        {/* Background cards for depth effect */}
        {opportunities.slice(currentIndex + 1, currentIndex + 3).map((opp, idx) => (
          <div
            key={opp.id}
            className="absolute inset-0 transition-all duration-300"
            style={{
              transform: `translateY(${(idx + 1) * 8}px) scale(${1 - (idx + 1) * 0.05})`,
              opacity: 1 - (idx + 1) * 0.3,
              zIndex: 10 - idx,
            }}
          >
            <OpportunityCard opportunity={opp} />
          </div>
        ))}

        {/* Current card */}
        <div
          className={cn(
            "absolute inset-0 transition-all duration-300 z-20",
            isAnimating && animationDirection === "left" && "animate-swipe-left",
            isAnimating && animationDirection === "right" && "animate-swipe-right",
            isAnimating && !animationDirection && "opacity-0 scale-95"
          )}
          style={{
            transform: isAnimating
              ? animationDirection === "left"
                ? "translateX(-120%) rotate(-10deg)"
                : animationDirection === "right"
                ? "translateX(120%) rotate(10deg)"
                : "scale(0.95)"
              : "translateX(0) rotate(0)",
          }}
        >
          <OpportunityCard opportunity={currentOpportunity} isTop />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 mt-8">
        <Button
          variant="outline"
          size="lg"
          className="gap-2 h-12 px-6 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
          onClick={() => handleAction("hide")}
          disabled={isAnimating}
        >
          <EyeOff className="h-5 w-5" />
          Hide
          <kbd className="ml-2 px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded">H</kbd>
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="gap-2 h-12 px-6"
          onClick={() => handleAction("run_skill")}
          disabled={isAnimating}
        >
          <Sparkles className="h-5 w-5" />
          Run Skill
          <kbd className="ml-2 px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded">R</kbd>
        </Button>

        <Button
          size="lg"
          className="gap-2 h-12 px-6 bg-primary"
          onClick={() => handleAction("send_to_crm")}
          disabled={isAnimating}
        >
          <Database className="h-5 w-5" />
          Send to CRM
          <kbd className="ml-2 px-1.5 py-0.5 text-[10px] font-mono bg-primary-foreground/20 rounded">S</kbd>
        </Button>
      </div>

      {/* Skip Button */}
      {hasNext && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-4 gap-2 text-muted-foreground"
          onClick={handleSkip}
          disabled={isAnimating}
        >
          <SkipForward className="h-4 w-4" />
          Skip for now
          <kbd className="ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded">Space</kbd>
        </Button>
      )}

      {/* Keyboard Shortcuts Help */}
      <div className="fixed bottom-6 right-6">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full shadow-lg"
          onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
        >
          <Keyboard className="h-4 w-4" />
        </Button>

        {showKeyboardHelp && (
          <div className="absolute bottom-14 right-0 w-64 bg-popover border rounded-lg shadow-xl p-4 animate-in fade-in slide-in-from-bottom-2">
            <h4 className="font-medium mb-3">Keyboard Shortcuts</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Send to CRM</span>
                <kbd className="px-2 py-0.5 bg-muted rounded font-mono text-xs">S</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hide</span>
                <kbd className="px-2 py-0.5 bg-muted rounded font-mono text-xs">H</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Run Skill</span>
                <kbd className="px-2 py-0.5 bg-muted rounded font-mono text-xs">R</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Skip</span>
                <kbd className="px-2 py-0.5 bg-muted rounded font-mono text-xs">Space</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Toggle help</span>
                <kbd className="px-2 py-0.5 bg-muted rounded font-mono text-xs">?</kbd>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

