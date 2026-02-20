import { LayoutGrid, Shield, FileText, Settings, BarChart3, Users, Bell } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", icon: LayoutGrid, active: false },
  { title: "Hazard Reports", icon: Shield, active: true },
  { title: "Analytics", icon: BarChart3, active: false },
  { title: "Documents", icon: FileText, active: false },
];

const managementItems = [
  { title: "Users", icon: Users, active: false },
  { title: "Notifications", icon: Bell, active: false },
  { title: "Settings", icon: Settings, active: false },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-1 py-1">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
            B
          </div>
          {!collapsed && (
            <span className="text-sm font-bold text-sidebar-foreground truncate">BEATS</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={item.active} tooltip={item.title}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={item.active} tooltip={item.title}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-1 py-1">
          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Users className="h-3 w-3 text-primary" />
          </div>
          {!collapsed && (
            <span className="text-[11px] text-sidebar-foreground truncate">Evaluator Mode</span>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
