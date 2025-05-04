"use client"

import * as React from "react"
import { ChevronsUpDown, Command, Receipt } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";


interface NavLinksType {
    title: string,
    url: string,
}

const navLinks: NavLinksType[] = [
    { title: "Create Invoice", url: "/invoices/create-invoice" },
    { title: "Create Client", url: "/clients/create-client" },
    { title: "Create Expense", url: "/expenses/create-expense" },
];


export function TeamSwitcher() {
    const { isMobile } = useSidebar()
    const pathname = usePathname();
    const router = useRouter();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <Command className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    Financea
                                </span>
                                <span className="truncate text-xs">Free Trial</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">

                        </DropdownMenuLabel>
                        {navLinks.map(linkItem => (
                            <DropdownMenuItem
                                key={linkItem.title}
                                onClick={() => {

                                    if (pathname != linkItem.url) {

                                        router.replace(linkItem.url);
                                    }

                                }}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-sm border">
                                    <Receipt className="size-4 shrink-0" />
                                </div>
                                {linkItem.title}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />

                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
