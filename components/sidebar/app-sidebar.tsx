"use client"

import * as React from "react";
import Image, { StaticImageData } from "next/image";
import DashboardIcon from "@/assets/icons/dashboard_sidebar_icon.svg";
import InvoicesIcon from "@/assets/icons/invoices_sidebar_icon.svg";
import PaymentsIcon from "@/assets/icons/payemnts_sidebar_icon.svg";
import ExpensesIcon from "@/assets/icons/expenses_sidebar_icon.svg";
import ClientsIcon from "@/assets/icons/clients_sidebar_icon.svg";
import SettingsIcon from "@/assets/icons/settings_sidebar_icon.svg";
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
import { SideBarMenuItemType } from "@/lib/types";
import { DarkModeToggle } from "../theme/dark_mode_togggle";


const menuItems: SideBarMenuItemType[] = [
    { title: "Dashboard", icon: DashboardIcon, path: "/", isActive: true },
    { title: "Invoices", icon: InvoicesIcon, path: "/invoices" },
    // { title: "Payments", icon: PaymentsIcon, path: "/payments" },
    { title: "Expenses", icon: ExpensesIcon, path: "/expenses" },
    { title: "Clients", icon: ClientsIcon, path: "/clients" },
    // { title: "Reports", icon: ReportsIcon, path: "/reports" },
    {
        title: "Settings",
        icon: SettingsIcon,
        path: "/settings",
        subMenuItems: [
            {
                title: "Account",
                path: "/settings/account"
            }
        ]
    },
];


// This is sample data.
// const projects = [{
//     name: "Design Engineering",
//     url: "#",
//     icon: Frame,
// }];


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar
            collapsible="none"
            {...props}
            className="bg-white dark:bg-white" /* Force white even in dark mode */
        >
            <SidebarHeader >
                <TeamSwitcher />
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent>
                <NavMain menuItems={menuItems} />
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
