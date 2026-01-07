"use client"

import * as React from "react"
import {
  Command,
  LifeBuoy,
  Send,
  Sparkles,
  Home,
  Inbox,
  PlusCircle,
  MessageSquare,
  CheckSquare,
  Activity,
  Search,
  Brain,
  Database,
  FolderKanban,
  FileText,
  BookOpen,
  Blocks,
  ChevronRight,
  type LucideIcon,
} from "lucide-react"

import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChatModal } from "@/components/chat-modal"
import { NewTaskModal } from "@/components/new-task-modal"
import { ReportModal } from "@/components/report-modal"
import { Badge } from "@/components/ui/badge"

interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  badge?: string
  action?: string
  items?: {
    title: string
    url: string
  }[]
}

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navTop: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Ask Amy",
      url: "#",
      icon: Sparkles,
      action: "chat",
    },
    {
      title: "New Task",
      url: "#",
      icon: PlusCircle,
      action: "new-task",
    },
    {
      title: "To Review",
      url: "/dashboard/review",
      icon: Inbox,
      badge: "4",
    },
  ],
  navWork: [
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: FolderKanban,
    },
    {
      title: "Chats",
      url: "#",
      icon: MessageSquare,
    },
    {
      title: "Reports",
      url: "#",
      icon: FileText,
      action: "reports",
    },
    {
      title: "Tasks",
      url: "#",
      icon: CheckSquare,
      items: [
        {
          title: "Bulk Tasks",
          url: "/dashboard/bulk-tasks",
        },
        {
          title: "Recurring Tasks",
          url: "/dashboard/recurring-tasks",
        },
      ],
    },
    {
      title: "Monitoring",
      url: "#",
      icon: Activity,
      items: [
        {
          title: "System Status",
          url: "#",
        },
        {
          title: "Logs",
          url: "#",
        },
      ],
    },
    {
      title: "Sourcing",
      url: "/dashboard/sourcing",
      icon: Search,
    },
  ],
  navConfig: [
    {
      title: "Knowledge",
      url: "#",
      icon: Brain,
    },
    {
      title: "Memory",
      url: "#",
      icon: Database,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
}

// Helper to update URLs based on version
function updateUrls(items: NavItem[], version: string): NavItem[] {
  return items.map((item) => {
    const newItem = { ...item }
    if (newItem.url && newItem.url.startsWith("/dashboard")) {
      newItem.url = newItem.url.replace("/dashboard", `/${version}/dashboard`)
    }
    if (newItem.items) {
      newItem.items = newItem.items.map((subItem) => ({
        ...subItem,
        url: subItem.url.startsWith("/dashboard")
          ? subItem.url.replace("/dashboard", `/${version}/dashboard`)
          : subItem.url,
      }))
    }
    return newItem
  })
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  version?: "v1" | "v2"
}

function NavGroup({
  label,
  items,
  onNavClick,
}: {
  label?: string
  items: NavItem[]
  onNavClick?: (action?: string) => void
}) {
  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              {item.action ? (
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() => onNavClick?.(item.action)}
                >
                  <item.icon />
                  <span>{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton asChild tooltip={item.title}>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </a>
                </SidebarMenuButton>
              )}
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export function AppSidebar({ version = "v1", ...props }: AppSidebarProps) {
  const [isChatOpen, setIsChatOpen] = React.useState(false)
  const [isNewTaskOpen, setIsNewTaskOpen] = React.useState(false)
  const [isReportsOpen, setIsReportsOpen] = React.useState(false)

  const handleNavClick = (action?: string) => {
    if (action === "chat") {
      setIsChatOpen(true)
    } else if (action === "new-task") {
      setIsNewTaskOpen(true)
    } else if (action === "reports") {
      setIsReportsOpen(true)
    }
  }

  const navTop = React.useMemo(() => {
    let items = updateUrls(data.navTop, version)
    if (version === "v1") {
      items = items.filter((item) => item.title !== "To Review")
      items = items.map((item) =>
        item.title === "New Task" ? { ...item, title: "Quick Task" } : item
      )
    }
    return items
  }, [version])

  const navWork = React.useMemo(() => {
    let items = updateUrls(data.navWork, version)
    if (version === "v1") {
      items = items.filter(
        (item) => item.title !== "Projects" && item.title !== "Reports"
      )
    }
    return items
  }, [version])

  const navOutputs = React.useMemo(() => {
    if (version === "v1") {
      return [
        {
          title: "Reports",
          url: "#",
          icon: FileText,
          action: "reports",
        },
      ]
    }
    return []
  }, [version])

  const navConfig = React.useMemo(() => {
    let items = updateUrls(data.navConfig, version)
    if (version === "v1") {
      items = items.map((item) =>
        item.title === "Knowledge"
          ? { ...item, title: "Context Library", url: `/${version}/dashboard/context-library` }
          : item
      )
      items.push({
        title: "Integrations",
        url: `/${version}/integrations`,
        icon: Blocks,
      })
    }
    return items
  }, [version])

  const navCookbook = React.useMemo(() => {
    if (version === "v1") {
      return [
        {
          title: "Library",
          url: `/${version}/cookbook`,
          icon: BookOpen,
        },
      ]
    }
    return []
  }, [version])

  return (
    <>
      <Sidebar variant="inset" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Acme Inc</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavGroup items={navTop} onNavClick={handleNavClick} />
          <NavGroup label="Work" items={navWork} onNavClick={handleNavClick} />
          {navOutputs.length > 0 && (
            <NavGroup label="Outputs" items={navOutputs} onNavClick={handleNavClick} />
          )}
          {navCookbook.length > 0 && <NavGroup label="Cookbook" items={navCookbook} />}
          <NavGroup label="Config" items={navConfig} />
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>
      <ChatModal open={isChatOpen} onOpenChange={setIsChatOpen} />
      <NewTaskModal open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen} />
      <ReportModal open={isReportsOpen} onOpenChange={setIsReportsOpen} />
    </>
  )
}
