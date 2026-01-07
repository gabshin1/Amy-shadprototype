"use client"

import { useState } from "react"
import { Upload, FileUp, Download, CheckCircle2, Clock, PlayCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

const bulkJobs = [
  {
    id: "J-1024",
    type: "Company Enrichment",
    file: "saas_leads_v2.csv",
    status: "completed",
    progress: 100,
    records: 450,
    date: "Today, 10:30 AM",
  },
  {
    id: "J-1025",
    type: "LinkedIn Signal Scan",
    file: "portfolio_cos.xlsx",
    status: "processing",
    progress: 45,
    records: 128,
    date: "Today, 2:15 PM",
  },
  {
    id: "J-1026",
    type: "News Sentiment Analysis",
    file: "target_list_q4.csv",
    status: "queued",
    progress: 0,
    records: 2500,
    date: "Pending",
  },
]

export default function BulkTasksPage() {
  const [selectedTask, setSelectedTask] = useState<string>("")

  return (
    <div className="flex flex-1 flex-col gap-8 p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Bulk Operations</h1>
        <p className="text-muted-foreground">
          Upload lists and run automated tasks at scale.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[350px_1fr]">
        {/* New Job Setup */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>New Bulk Job</CardTitle>
              <CardDescription>Start a new bulk processing task.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Task Type
                </label>
                <Select onValueChange={setSelectedTask}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select operation..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enrich">Company Enrichment</SelectItem>
                    <SelectItem value="linkedin">LinkedIn Signal Scan</SelectItem>
                    <SelectItem value="news">News Sentiment Analysis</SelectItem>
                    <SelectItem value="pricing">Competitor Pricing Check</SelectItem>
                    <SelectItem value="tech">Tech Stack Identification</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Upload Data
                </label>
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium">Drag file here or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">CSV, Excel supported</p>
                </div>
              </div>

              <Button className="w-full" disabled={!selectedTask}>
                <PlayCircle className="mr-2 h-4 w-4" />
                Start Job
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Jobs */}
        <div className="flex flex-col gap-6">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Recent Jobs</CardTitle>
              <CardDescription>Monitor status of your bulk operations.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job ID</TableHead>
                    <TableHead>Task Type</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bulkJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.id}</TableCell>
                      <TableCell>{job.type}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{job.file}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            job.status === "completed"
                              ? "default" // Using default (primary color) for success-like state as per strict theme rules or I could use secondary. Let's use outline + specific classes or just map to theme.
                              : job.status === "processing"
                              ? "secondary"
                              : "outline"
                          }
                          className={cn(
                            "capitalize",
                            job.status === "completed" && "bg-green-500 hover:bg-green-600 border-transparent text-white", // Overriding for success visual
                            job.status === "processing" && "animate-pulse"
                          )}
                        >
                          {job.status === "completed" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                          {job.status === "processing" && <Clock className="mr-1 h-3 w-3" />}
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[140px]">
                        <div className="flex items-center gap-2">
                          <Progress value={job.progress} className="h-2" />
                          <span className="text-xs text-muted-foreground w-8 text-right">{job.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {job.status === "completed" && (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


