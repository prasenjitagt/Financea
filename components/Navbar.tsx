"use client";



import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";

import { FaCirclePlus } from "react-icons/fa6";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { DarkModeToggle } from "./theme/dark_mode_togggle";

interface NavLinksType {
  title: string;
  url: string;
}
const navLinks: NavLinksType[] = [
  { title: "Create Invoice", url: "/invoices/create-invoice" },
  { title: "Create Expense", url: "/expenses/create-expense" },
  { title: "Create Client", url: "/clients/create-client" },
];

export default function Navbar() {
  const [username, setUsername] = useState("Guest");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      setUsername("Name Loading...");
    } else if (status === "unauthenticated" || !session) {
      setUsername("Guest");
    } else {
      setUsername(session.user?.username ?? "Guest");
    }
  }, [session, status]);

  return (
    <div className="sticky top-0 z-20 h-[64px] px-6 py-2 mb-[24] flex items-center justify-between border-b  bg-white dark:bg-[#1f2937]  ">
      {/* Greeting and Username */}

      <section className="flex items-center gap-2">
        <SidebarTrigger />
        <div className="w-[1px] h-10 bg-gray-300 dark:bg-[#c5c8cc] mx-4" />
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-[#c5c8cc]">
            Hey,
          </p>
          <h2 className="text-[20] font-medium dark:text-[#c5c8cc]">{username}</h2>
        </div>
      </section>

      {/* Notification and triggerbutton */}
      <section className=" flex items-center">

        <div className="mr-12">
          <DarkModeToggle />
        </div>


        <div className="flex items-center gap-6 mr-1">

          {/* Notification */}
          <div className="relative">
            <FaBell className="text-gray-600 dark:text-[#c5c8cc] text-lg cursor-pointer" />
            <span className="absolute top-[-2px] right-[-3px] w-2.5 h-2.5 bg-red-500 rounded-full"></span>
          </div>


          <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <FaCirclePlus className=" w-5 h-5 cursor-pointer text-purple-600 dark:text-[#c5c8cc]" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-[200px] bg-[#f9fafb] dark:bg-[#1f2937]  border rounded-md shadow-lg z-[9999]"
            >
              <DropdownMenuGroup>


                {navLinks.map((linkItem) => (
                  <DropdownMenuItem
                    key={linkItem.url}
                    onClick={() => router.push(linkItem.url)}
                    className="px-4 py-2 dark:text-[#c5c8cc] dark:hover:bg-[#3e3e3e53] cursor-pointer"
                  >
                    <p>

                      {linkItem.title}
                    </p>

                  </DropdownMenuItem>
                ))}


              </DropdownMenuGroup>

            </DropdownMenuContent>
          </DropdownMenu>

        </div>

        <div>

        </div>




      </section>
    </div>
  );
}
