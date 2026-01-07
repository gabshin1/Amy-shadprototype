"use client"

import * as React from "react"
import {
  Building2,
  MapPin,
  Users,
  ExternalLink,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Opportunity } from "../types"
import { cn } from "@/lib/utils"

interface OpportunityCardProps {
  opportunity: Opportunity
  className?: string
  style?: React.CSSProperties
  isTop?: boolean
}

export function OpportunityCard({
  opportunity,
  className,
  style,
  isTop = false,
}: OpportunityCardProps) {
  const [showDetails, setShowDetails] = React.useState(false)

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500"
    if (score >= 80) return "bg-green-500"
    if (score >= 70) return "bg-yellow-500"
    return "bg-orange-500"
  }

  return (
    <Card
      className={cn(
        "w-full max-w-md mx-auto overflow-hidden transition-all duration-300",
        isTop && "shadow-xl",
        className
      )}
      style={style}
    >
      <CardContent className="p-6">
        {/* Header with Company Info */}
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-14 w-14 rounded-xl border-2 border-background shadow-sm">
            <AvatarImage src={opportunity.logo} />
            <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-lg font-semibold">
              {opportunity.initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg truncate">
                {opportunity.companyName}
              </h3>
              {opportunity.website && (
                <a
                  href={`https://${opportunity.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {opportunity.description}
            </p>
          </div>

          {/* Match Score */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm",
                getMatchScoreColor(opportunity.matchScore)
              )}
            >
              {opportunity.matchScore}
            </div>
            <span className="text-[10px] text-muted-foreground mt-1">Match</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="gap-1">
            <Building2 className="h-3 w-3" />
            {opportunity.sector}
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <MapPin className="h-3 w-3" />
            {opportunity.location}
          </Badge>
          <Badge variant="outline">{opportunity.fundingStage}</Badge>
          {opportunity.employeeCount && (
            <Badge variant="outline" className="gap-1">
              <Users className="h-3 w-3" />
              {opportunity.employeeCount}
            </Badge>
          )}
        </div>

        {/* Founders */}
        {opportunity.founders && opportunity.founders.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-1">Founders</p>
            <p className="text-sm font-medium">{opportunity.founders.join(", ")}</p>
          </div>
        )}

        {/* Why Amy Found This - Expandable */}
        <div className="border-t pt-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium">Why Amy found this</span>
            {showDetails ? (
              <ChevronUp className="h-4 w-4 ml-auto" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-auto" />
            )}
          </button>

          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              showDetails ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"
            )}
          >
            <p className="text-sm text-muted-foreground leading-relaxed">
              {opportunity.whyMatched}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


