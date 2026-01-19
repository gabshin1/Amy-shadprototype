"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Database, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CRMProvider {
  id: string
  name: string
  icon: React.ReactNode
  connected: boolean
}

interface CRMConfigModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  crmId: string
  crmName: string
}

// CRM Provider Icons
const AffinityIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
    {/* Four interconnected loop shapes */}
    <path
      d="M8 6C8 8.20914 9.79086 10 12 10C14.2091 10 16 8.20914 16 6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M18 12C18 14.2091 16.2091 16 14 16C11.7909 16 10 14.2091 10 12C10 9.79086 11.7909 8 14 8C16.2091 8 18 9.79086 18 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M8 18C8 20.2091 9.79086 22 12 22C14.2091 22 16 20.2091 16 18C16 15.7909 14.2091 14 12 14C9.79086 14 8 15.7909 8 18Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M6 12C6 14.2091 7.79086 16 10 16C12.2091 16 14 14.2091 14 12C14 9.79086 12.2091 8 10 8C7.79086 8 6 9.79086 6 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
  </svg>
)

const AttioIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-700 dark:text-gray-300">
    {/* Two overlapping angular arrow-like shapes */}
    <path
      d="M12 2L20 7V12L12 17L4 12V7L12 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinejoin="round"
    />
    <path
      d="M8 10L12 7L16 10"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 14L12 17L16 14"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const getCRMIcon = (crmId: string) => {
  switch (crmId.toLowerCase()) {
    case "affinity":
      return <AffinityIcon />
    case "attio":
      return <AttioIcon />
    default:
      return <Database className="h-6 w-6" />
  }
}

export function CRMConfigModal({ open, onOpenChange, crmId, crmName }: CRMConfigModalProps) {
  const [selectedProvider, setSelectedProvider] = React.useState<string>(crmId)
  const [selectedList, setSelectedList] = React.useState<string>("tracking-list")
  const [selectedColumn, setSelectedColumn] = React.useState<string>("all-entries")
  const [filterField, setFilterField] = React.useState<string>("added-by")
  const [filterValue, setFilterValue] = React.useState<string>("all-users")

  const crmProviders: CRMProvider[] = [
    {
      id: "affinity",
      name: "Affinity",
      icon: <AffinityIcon />,
      connected: true,
    },
    {
      id: "attio",
      name: "Attio",
      icon: <AttioIcon />,
      connected: true,
    },
  ]

  const handleSave = () => {
    // Here you would save the configuration
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Database className="h-6 w-6 text-muted-foreground" />
              <div>
                <DialogTitle>Configure CRM Sync</DialogTitle>
                <DialogDescription className="mt-1">
                  Connect your CRM and select which companies to import
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground h-auto py-1"
            >
              Cancel
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Select CRM Provider */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select CRM Provider</Label>
            <div className="grid grid-cols-2 gap-3">
              {crmProviders.map((provider) => {
                const isSelected = selectedProvider === provider.id
                return (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider.id)}
                    className={cn(
                      "relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 bg-background"
                    )}
                  >
                    {isSelected && (
                      <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-primary fill-primary" />
                    )}
                    <div className="text-muted-foreground flex items-center justify-center h-12 w-12">
                      {provider.icon}
                    </div>
                    <div className="text-sm font-medium">{provider.name}</div>
                    <div className="text-xs text-primary">Already connected</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 1: Select List to Import */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Step 1: Select List to Import</Label>
            <Select value={selectedList} onValueChange={setSelectedList}>
              <SelectTrigger>
                <SelectValue placeholder="Select a list" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tracking-list">Tracking List (companies)</SelectItem>
                <SelectItem value="portfolio-list">Portfolio List</SelectItem>
                <SelectItem value="prospects-list">Prospects List</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Step 2: Select Board Column */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Step 2: Select Board Column</Label>
            <Select value={selectedColumn} onValueChange={setSelectedColumn}>
              <SelectTrigger>
                <SelectValue placeholder="Select a column" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-entries">All Entries (56 entries)</SelectItem>
                <SelectItem value="qualified">Qualified (12 entries)</SelectItem>
                <SelectItem value="in-progress">In Progress (8 entries)</SelectItem>
                <SelectItem value="closed">Closed (36 entries)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Step 3: Filtering */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Step 3: Filtering</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Select value={filterField} onValueChange={setFilterField}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="added-by">Added By</SelectItem>
                    <SelectItem value="updated-by">Updated By</SelectItem>
                    <SelectItem value="stage">Stage</SelectItem>
                    <SelectItem value="industry">Industry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Select value={filterValue} onValueChange={setFilterValue}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-users">All Users</SelectItem>
                    <SelectItem value="user-1">John Doe</SelectItem>
                    <SelectItem value="user-2">Jane Smith</SelectItem>
                    <SelectItem value="user-3">Bob Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">
              + Add filter
            </Button>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleSave} className="min-w-[140px]">Save Configuration</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
