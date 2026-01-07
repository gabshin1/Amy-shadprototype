"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function VersionSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const currentVersion = pathname?.startsWith("/v2") ? "v2" : "v1"

  const switchVersion = (version: "v1" | "v2") => {
    if (version === currentVersion) return

    let newPath = pathname
    if (version === "v2") {
      newPath = pathname.replace(/^\/v1/, "/v2")
    } else {
      newPath = pathname.replace(/^\/v2/, "/v1")
    }

    // Handle case where path doesn't start with version (e.g. root)
    if (newPath === pathname) {
       // If we are at root or non-versioned path, default to dashboard of target version
       newPath = `/${version}/dashboard`
    }

    router.push(newPath)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="lg" className="rounded-full h-12 w-12 shadow-lg" variant={currentVersion === "v2" ? "default" : "outline"}>
            <Layers className="h-6 w-6" />
            <span className="sr-only">Switch Version</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => switchVersion("v1")} className="cursor-pointer">
            <span className={currentVersion === "v1" ? "font-bold" : ""}>Version 1 (Live)</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => switchVersion("v2")} className="cursor-pointer">
            <span className={currentVersion === "v2" ? "font-bold" : ""}>Version 2 (Prototype)</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

