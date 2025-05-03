"use client"

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
    SidebarSeparator,
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
            <SidebarHeader >
                <TeamSwitcher />
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent>
                <NavMain />
                {/* <NavProjects projects={projects} /> */}
                <DarkModeToggle />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
