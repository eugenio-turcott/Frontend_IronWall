import { Gauge, Home, LayoutDashboard, ArrowDownUpIcon, ChartNoAxesCombinedIcon, TriangleAlertIcon, TrendingUpDownIcon} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/Components/ui/sidebar"

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "#",
    icon: LayoutDashboard,
  },
  {
    title: "Consumo total",
    url: "#",
    icon: Gauge,
  },
  {
    title: "Tendencias de crecimiento",
    url: "#",
    icon: TrendingUpDownIcon,
  },
  {
    title: "Trafico de red",
    url: "#",
    icon: ArrowDownUpIcon,
  },
    {
    title: "Fallas",
    url: "#",
    icon: TriangleAlertIcon,
  },
   {
    title: "Prediccion de crecimiento",
    url: "#",
    icon: ChartNoAxesCombinedIcon,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
