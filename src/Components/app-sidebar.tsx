import { useState, useEffect } from "react";
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
  SidebarMenuBadge,
} from "@/Components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/Components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/Components/ui/dropdown-menu";
import logo from "../assets/xcien_logo.png";
import logo_chico from "../assets/xcien_logo_c.png";
import { useAuth } from "../hooks/useAuth";

const items_home = [
  {
    title: "Panel",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Consumo total",
    url: "#consumo_total",
    icon: Gauge,
  },
  {
    title: "Histórico de crecimiento",
    url: "#historico_crecimiento",
    icon: ChartNoAxesCombinedIcon,
  },
  {
    title: "Trafico de red",
    url: "#trafico_red",
    icon: ArrowDownUpIcon,
  },
  {
    title: "Fallas",
    url: "#fallas",
    icon: BanIcon,
  },
  {
    title: "Prediccion de crecimiento",
    url: "#prediccion_crecimiento",
    icon: TrendingUpDownIcon,
  },
];

const items_avisos = [
  {
    title: "Alertas",
    url: "/alertas",
    icon: TriangleAlertIcon,
  },
];

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Leer del sessionStorage al inicializar
    const saved = sessionStorage.getItem("isSidebarCollapsed");
    return saved === "true";
  });
  const [activeItem, setActiveItem] = useState("Panel");
  const { user } = useAuth();
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash.substring(1);
      const currentActive = activeItem;

      // Primero verificar las rutas normales (/alertas, /notificaciones)
      if (path === "/alertas" || path === "/notificaciones") {
        const matchingItem = items_avisos.find((item) => item.url === path);
        if (matchingItem && currentActive !== matchingItem.title) {
          setActiveItem(matchingItem.title);
          sessionStorage.setItem("activeSidebarItem", matchingItem.title);
        }
        return;
      }

      // Luego verificar los hashes para las gráficas
      if (hash) {
        const matchingItem = items_home.find((item) => item.url === `#${hash}`);
        if (matchingItem && currentActive !== matchingItem.title) {
          setActiveItem(matchingItem.title);
          sessionStorage.setItem("activeSidebarItem", matchingItem.title);
        }
        return;
      }

      // Ruta por defecto (/dashboard)
      if (path === "/dashboard" && currentActive !== "Panel") {
        setActiveItem("Panel");
        sessionStorage.setItem("activeSidebarItem", "Panel");
      }
    };

    window.addEventListener("popstate", handleLocationChange);
    handleLocationChange(); // Ejecutar inmediatamente

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, [activeItem]);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    // Guardar en sessionStorage y también en cookie para consistencia
    sessionStorage.setItem("isSidebarCollapsed", String(newState));
    document.cookie = `sidebar_state=${newState}; path=/; max-age=${
      60 * 60 * 24 * 7
    }`;
  };

  useEffect(() => {
    const savedItem = sessionStorage.getItem("activeSidebarItem");
    if (savedItem) {
      const allItems = [...items_home, ...items_avisos];
      const foundItem = allItems.find((item) => item.title === savedItem);
      if (foundItem) {
        handleItemClick(foundItem.title, foundItem.url, true);
      }
    }
  }, []);

  useEffect(() => {
    const storedCount = sessionStorage.getItem("numberAlerts");
    setAlertCount(storedCount ? parseInt(storedCount) : 0);

    // Escuchar cambios en el sessionStorage (para otras pestañas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "numberAlerts") {
        setAlertCount(e.newValue ? parseInt(e.newValue) : 0);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Escuchar cambios en la misma pestaña
    const handleInternalChange = () => {
      const newCount = sessionStorage.getItem("numberAlerts");
      if (newCount !== null) {
        setAlertCount(parseInt(newCount));
      }
    };

    // Configurar un intervalo para verificar cambios (puedes ajustar el tiempo)
    const intervalId = setInterval(handleInternalChange, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  const handleItemClick = (
    title: string,
    url?: string,
    skipNavigation = false
  ) => {
    if (activeItem !== title) {
      setActiveItem(title);
      sessionStorage.setItem("activeSidebarItem", title);
    }

    if (!skipNavigation && url) {
      if (url.startsWith("#")) {
        // Para gráficas del dashboard
        if (window.location.pathname !== "/dashboard") {
          // Si no estamos en dashboard, navegar primero allí
          window.location.href = `/dashboard${url}`;
        } else {
          // Si ya estamos en dashboard, actualizar el hash
          window.location.hash = url.substring(1);
        }
      } else {
        // Para otras rutas
        window.location.href = url;
      }
    }
  };

  return (
    <Sidebar className={`${isCollapsed ? "w-[4.5rem]" : "w-64"}`}>
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
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180 cursor-pointer" />
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
                          onClick={(e) => {
                            e.preventDefault();
                            handleItemClick(item.title, item.url);
                          }}
                          className={`flex items-center ${
                            isCollapsed ? "justify-center p-6" : "p-2"
                          } ${
                            activeItem === item.title
                              ? "bg-muted text-primary rounded-md"
                              : ""
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
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180 cursor-pointer" />
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
                          onClick={() => handleItemClick(item.title)}
                          className={`flex items-center ${
                            isCollapsed ? "justify-center p-6" : "p-2"
                          } ${
                            activeItem === item.title
                              ? "bg-muted text-primary rounded-md"
                              : ""
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
                      {item.title === "Alertas" && !isCollapsed && (
                        <SidebarMenuBadge>
                          {alertCount > 0 ? alertCount : "0"}
                        </SidebarMenuBadge>
                      )}
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton asChild>
                      <div
                        className={`cursor-pointer py-6 flex items-center ${
                          isCollapsed ? "justify-center" : ""
                        }`}
                      >
                        <Avatar
                          className={isCollapsed ? "h-10 w-10" : "h-8 w-8"}
                        >
                          <AvatarImage src={user?.avatar_url || undefined} />
                          <AvatarFallback className="text-black">
                            {user?.full_name
                              ? user.full_name
                                  .split(" ")
                                  .filter(Boolean)
                                  .map((name: string) => name[0].toUpperCase())
                                  .join("")
                                  .slice(0, 2)
                              : "NU"}
                          </AvatarFallback>
                        </Avatar>
                        {!isCollapsed && (
                          <div className="flex-1 ml-2">
                            <p className="text-sm font-medium">
                              {user?.full_name || "Nombre del Usuario"}
                            </p>
                          </div>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="flex items-center space-x-2">
                      <Avatar className={isCollapsed ? "h-10 w-10" : "h-8 w-8"}>
                        <AvatarImage src={user?.avatar_url || undefined} />
                        <AvatarFallback className="text-black">
                          {user?.full_name
                            ? user.full_name
                                .split(" ")
                                .filter(Boolean)
                                .map((name: string) => name[0].toUpperCase())
                                .join("")
                                .slice(0, 2)
                            : "NU"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {user?.full_name || "Nombre del Usuario"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user?.email || "usuario@correo.com"}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem disabled>
                      {user?.role === "Administrador" || !user?.subrole
                        ? `Rol: ${user?.role || "Administrador"}`
                        : `Rol: ${user?.role} (${user.subrole})`}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        sessionStorage.removeItem("authToken");
                        sessionStorage.removeItem("userData");
                        window.location.href = "/";
                      }}
                      className="text-red-600 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4 text-red-600" />
                      <span className="text-red-600">Cerrar sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
