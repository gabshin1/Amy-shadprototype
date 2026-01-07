import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Globe,
  Calendar,
  Search,
  Users,
  Newspaper,
  DollarSign,
  Filter,
  ArrowRight,
} from "lucide-react"

const recurringTasks = [
  {
    title: "Website Change Detection",
    description: "Track portfolio or target companies for website updates, team changes, or new product launches.",
    icon: Globe,
    frequency: "Weekly",
    tags: ["Monitoring", "Intelligence"],
  },
  {
    title: "Meeting Prepper",
    description: "Automatically generate detailed briefing documents for your upcoming calendar events.",
    icon: Calendar,
    frequency: "Daily",
    tags: ["Productivity", "Research"],
  },
  {
    title: "Market Research Scan",
    description: "Scan the web for latest trends, news, and reports on specific market sectors.",
    icon: Search,
    frequency: "Weekly",
    tags: ["Research", "Strategy"],
  },
  {
    title: "LinkedIn Signal Monitor",
    description: "Track key hires, departures, and role changes at target firms to identify opportunities.",
    icon: Users,
    frequency: "Weekly",
    tags: ["Sourcing", "HR"],
  },
  {
    title: "News Sentiment Watch",
    description: "Monitor and analyze news sentiment for a specific list of portfolio companies.",
    icon: Newspaper,
    frequency: "Daily",
    tags: ["Monitoring", "Risk"],
  },
  {
    title: "Competitor Pricing Tracker",
    description: "Periodically check competitor pricing pages to identify strategy shifts.",
    icon: DollarSign,
    frequency: "Monthly",
    tags: ["Strategy", "Competitors"],
  },
  {
    title: "Deal Flow Screener",
    description: "Automatically screen new inbound leads against your investment thesis.",
    icon: Filter,
    frequency: "Real-time",
    tags: ["Sourcing", "Deal Flow"],
  },
]

export default function RecurringTasksPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Recurring Tasks</h1>
        <p className="text-muted-foreground">
          Set up automated workflows to save time and stay informed.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recurringTasks.map((task) => (
          <Card key={task.title} className="flex flex-col">
            <CardHeader>
              <div className="mb-2 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <task.icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">{task.title}</CardTitle>
              <CardDescription>{task.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                  {task.frequency}
                </Badge>
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full group">
                Setup Workflow
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

