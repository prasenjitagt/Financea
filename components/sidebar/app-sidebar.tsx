"use client";

import * as React from "react";

import { NavMain } from "@/components/sidebar/nav-main";
// import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { DarkModeToggle } from "../theme/dark_mode_togggle";

// This is sample data.
// const projects = [{
//     name: "Design Engineering",
//     url: "#",
//     icon: Frame,
// }];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="bg-white dark:bg-white" /* Force white even in dark mode */
    >
      <SidebarHeader className="mb-1">
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <NavMain />
        {/* <NavProjects projects={projects} /> */}
        <DarkModeToggle />
      </SidebarContent>
      <SidebarFooter className="mb-5 ">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
