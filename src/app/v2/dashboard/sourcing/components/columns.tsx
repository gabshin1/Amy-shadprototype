"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ExternalLink, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Opportunity, OpportunityAction } from "../types"
import { cn } from "@/lib/utils"

interface ColumnOptions {
  onAction: (opportunityId: string, action: OpportunityAction) => void
}

export const createColumns = ({ onAction }: ColumnOptions): ColumnDef<Opportunity>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "companyName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Company
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const opportunity = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 rounded-lg">
            <AvatarImage src={opportunity.logo} />
            <AvatarFallback className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-sm font-medium">
              {opportunity.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium">{opportunity.companyName}</span>
              {opportunity.website && (
                <a
                  href={`https://${opportunity.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            <span className="text-xs text-muted-foreground line-clamp-1 max-w-[300px]">
              {opportunity.description}
            </span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "sector",
    header: "Sector",
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-normal">
        {row.getValue("sector")}
      </Badge>
    ),
  },
  {
    accessorKey: "fundingStage",
    header: "Stage",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-normal">
        {row.getValue("fundingStage")}
      </Badge>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("location")}</span>
    ),
  },
  {
    accessorKey: "matchScore",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Match
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const score = row.getValue("matchScore") as number
      return (
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold",
              score >= 90
                ? "bg-emerald-500"
                : score >= 80
                ? "bg-green-500"
                : score >= 70
                ? "bg-yellow-500"
                : "bg-orange-500"
            )}
          >
            {score}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "foundDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Found
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("foundDate"))
      const today = new Date()
      const isToday = date.toDateString() === today.toDateString()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const isYesterday = date.toDateString() === yesterday.toDateString()

      return (
        <span className="text-muted-foreground">
          {isToday ? "Today" : isYesterday ? "Yesterday" : date.toLocaleDateString()}
        </span>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const opportunity = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onAction(opportunity.id, "send_to_crm")}>
              Send to CRM
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction(opportunity.id, "save")}>
              Save for later
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction(opportunity.id, "run_skill")}>
              Run a Skill
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onAction(opportunity.id, "hide")}
              className="text-destructive focus:text-destructive"
            >
              Hide
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]


