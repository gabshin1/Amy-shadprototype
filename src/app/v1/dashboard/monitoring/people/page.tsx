"use client"

import * as React from "react"
import { User } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function PeopleMonitoringPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">People Monitoring</h1>
        <p className="text-muted-foreground mt-1">
          Monitor and track people across your network
        </p>
      </div>

      {/* Placeholder Content */}
      <Card>
        <CardHeader>
          <CardTitle>People Monitoring</CardTitle>
          <CardDescription>
            People monitoring features coming soon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">Coming Soon</h3>
            <p className="text-muted-foreground mt-1">
              People monitoring dashboard will be available here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
