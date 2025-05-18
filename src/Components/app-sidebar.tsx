import { useState } from "react";
import {
  Gauge,
  LayoutDashboard,
  ArrowDownUpIcon,
  ChartNoAxesCombinedIcon,
  BanIcon,
  TriangleAlertIcon,
  TrendingUpDownIcon,
  LogOut,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  BellIcon,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/Components/ui/sidebar";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/Components/ui/collapsible";

import logo from "../assets/xcien_logo.png";
import logo_chico from "../assets/xcien_logo_c.png";

const items_home = [
  {
    title: "Panel",
    url: "#",
    icon: LayoutDashboard,
  },
  {
    title: "Consumo total",
    url: "#",
    icon: Gauge,
  },
  {
    title: "Histórico de crecimiento",
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
    icon: BanIcon,
  },
  {
    title: "Prediccion de crecimiento",
    url: "#",
    icon: ChartNoAxesCombinedIcon,
  },
];

const items_avisos = [
  {
    title: "Alertas",
    url: "#",
    icon: TriangleAlertIcon,
  },
  {
    title: "Notificaciones",
    url: "#",
    icon: BellIcon,
  },
];

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Sidebar className={`relative ${isCollapsed ? "w-[4.5rem]" : "w-64"}`}>
      <Button
        onClick={toggleSidebar}
        variant="ghost"
        size="icon"
        className={`absolute -right-3 top-4 z-10 size-6 rounded-full border bg-background p-0 cursor-pointer text-foreground hover:bg-muted [&_svg]:text-current`}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
      <SidebarContent>
        <div className="px-4 mt-4 flex justify-center mb-4">
          {isCollapsed ? (
            <img src={logo_chico} alt="XCIEN Logo C" className="h-10 w-auto" />
          ) : (
            <img src={logo} alt="XCIEN Logo" className="h-15 w-auto" />
          )}
        </div>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            {!isCollapsed && (
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="w-full flex items-center justify-between">
                  Inicio
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
            )}
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="mb-8">
                  {items_home.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a
                          href={item.url}
                          className={`flex items-center ${
                            isCollapsed ? "justify-center p-6" : "p-2"
                          }`}
                        >
                          <item.icon
                            className={`${
                              isCollapsed ? "!h-6 !w-6" : "!h-4 !w-4"
                            }`}
                          />
                          {!isCollapsed && (
                            <span className="ml-2">{item.title}</span>
                          )}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            {!isCollapsed && (
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="w-full flex items-center justify-between">
                  Avisos
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
            )}
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items_avisos.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a
                          href={item.url}
                          className={`flex items-center ${
                            isCollapsed ? "justify-center p-6" : "p-2"
                          }`}
                        >
                          <item.icon
                            className={`${
                              isCollapsed ? "!h-6 !w-6" : "!h-4 !w-4"
                            }`}
                          />
                          {!isCollapsed && (
                            <span className="ml-2">{item.title}</span>
                          )}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="#cuenta"
                    className={`py-6 flex items-center ${
                      isCollapsed ? "justify-center" : ""
                    }`}
                  >
                    <Avatar className={isCollapsed ? "h-10 w-10" : "h-8 w-8"}>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                      <div className="flex-1 ml-2">
                        <p className="text-sm font-medium">
                          Nombre del Usuario
                        </p>
                      </div>
                    )}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* <SidebarMenuItem>
                <SidebarMenuButton onClick={() => console.log("Cerrar sesión")}>
                  <LogOut />
                  <span>Cerrar sesión</span>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
