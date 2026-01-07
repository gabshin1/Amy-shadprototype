"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { SourcingFeed } from "../types"

interface FeedSelectorProps {
  feeds: SourcingFeed[]
  selectedFeed: SourcingFeed | null
  onSelectFeed: (feed: SourcingFeed) => void
  onCreateFeed: () => void
}

export function FeedSelector({
  feeds,
  selectedFeed,
  onSelectFeed,
  onCreateFeed,
}: FeedSelectorProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[280px] justify-between h-10"
        >
          <div className="flex items-center gap-2 truncate">
            {selectedFeed ? (
              <>
                <span className="truncate font-medium">{selectedFeed.name}</span>
                {selectedFeed.newCount > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px] font-medium">
                    {selectedFeed.newCount} new
                  </Badge>
                )}
              </>
            ) : (
              <span className="text-muted-foreground">Select a feed...</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search feeds..." />
          <CommandList>
            <CommandEmpty>No feeds found.</CommandEmpty>
            <CommandGroup heading="Your Feeds">
              {feeds.map((feed) => (
                <CommandItem
                  key={feed.id}
                  value={feed.name}
                  onSelect={() => {
                    onSelectFeed(feed)
                    setOpen(false)
                  }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Check
                      className={cn(
                        "h-4 w-4",
                        selectedFeed?.id === feed.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span>{feed.name}</span>
                  </div>
                  {feed.newCount > 0 && (
                    <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                      {feed.newCount}
                    </Badge>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  onCreateFeed()
                  setOpen(false)
                }}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create new feed
              </CommandItem>
              <CommandItem className="gap-2 text-muted-foreground">
                <Settings className="h-4 w-4" />
                Manage feeds
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}


