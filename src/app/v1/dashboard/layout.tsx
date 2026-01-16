import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { ContextLibraryProvider } from "@/components/context-library/context-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ContextLibraryProvider>
      <SidebarProvider>
        <AppSidebar version="v1" />
        <SidebarInset>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </ContextLibraryProvider>
  )
}
