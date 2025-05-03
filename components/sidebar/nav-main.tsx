"use client"

import { usePathname, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { SideBarMenuItemType } from "@/lib/types";
import Image from "next/image";
import DashboardIcon from "@/assets/icons/dashboard_sidebar_icon.svg";
import InvoicesIcon from "@/assets/icons/invoices_sidebar_icon.svg";
import ExpensesIcon from "@/assets/icons/expenses_sidebar_icon.svg";
import ClientsIcon from "@/assets/icons/clients_sidebar_icon.svg";
import SettingsIcon from "@/assets/icons/settings_sidebar_icon.svg";

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

export function NavMain() {
    const pathname = usePathname();
    const router = useRouter();

    const handleNavigation = (clickedPath: string) => {
        if (pathname === clickedPath) return; // avoid re-routing if already on same path
        router.push(clickedPath);
    };

    return (
        <SidebarGroup>
            <SidebarMenu>


                {menuItems.map((item) => {
                    const hasSubItems = item.subMenuItems && item.subMenuItems.length > 0;

                    return (
                        <Collapsible

                            key={item.title}
                            asChild
                            defaultOpen={item.isActive}
                            className="group/collapsible "
                        >
                            <SidebarMenuItem >
                                {hasSubItems ? (
                                    <>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton
                                                className={`rounded-none h-10 cursor-pointer ${pathname.startsWith(item.path) ? "bg-[#e8eeff]" : ""}`}
                                                tooltip={item.title}
                                            >
                                                {item.icon && <Image src={item.icon} alt={`${item.title} icon`} width={20} />}
                                                <span>{item.title}</span>
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.subMenuItems?.map((subItem) => (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton
                                                            className={`rounded-none h-7 cursor-pointer ${pathname === subItem.path ? "bg-[#e8eeff] border-r-[3px] border-[#5E84EC]" : ""}`}

                                                            onClick={() => handleNavigation(subItem.path)}
                                                        >
                                                            <span>{subItem.title}</span>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </>
                                ) : (
                                    <SidebarMenuButton
                                        className={`rounded-none h-10  ${pathname === item.path ? "bg-[#e8eeff] border-r-[3px] border-[#5E84EC]" : ""}`}
                                        tooltip={item.title}
                                        onClick={() => handleNavigation(item.path)}
                                    >

                                        {item.icon && <Image src={item.icon} alt={`${item.title} icon`} width={20} />}
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                )}
                            </SidebarMenuItem>


                        </Collapsible>
                    );
                })}


            </SidebarMenu>


        </SidebarGroup>
    );
}