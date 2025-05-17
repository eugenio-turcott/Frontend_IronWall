import { SidebarProvider, SidebarTrigger } from "@/Components/ui/sidebar"
import { AppSidebar } from "@/Components/app-sidebar"
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
