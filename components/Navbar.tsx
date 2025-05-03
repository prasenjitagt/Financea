"use client";

import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { FaCirclePlus } from "react-icons/fa6";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";

interface NavLinksType {
  title: string,
  url: string,
}
const navLinks: NavLinksType[] = [
  { title: "Create Invoice", url: "/invoices/create-invoice" },
  { title: "Create Client", url: "/clients/create-client" },
  { title: "Create Expense", url: "/expenses/create-expense" },
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
    <div className="sticky top-0 z-50 h-[64px] px-6 py-2 flex items-center justify-between border opacity-80 backdrop-blur-md shadow-md">
      {/* Greeting and Username */}
      <section>
        <p className="text-sm font-semibold text-gray-500 dark:text-white">Hey 😊😊,</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">{username}</h2>
      </section>

      {/* Notification and triggerbutton */}
      <section className="flex items-center gap-4">
        {/* Notification */}
        <div className="relative">
          <FaBell className="text-gray-600 dark:text-white text-lg cursor-pointer" />
          <span className="absolute top-[-2px] right-[-3px] w-2.5 h-2.5 bg-red-500 rounded-full"></span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-[25px] h-[25px] text-purple-600 hover:bg-transparent"
            >
              <FaCirclePlus className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-[200px] bg-white border border-gray-200 rounded-md shadow-lg z-10"
          >
            {navLinks.map((linkItem) => (
              <DropdownMenuItem
                key={linkItem.url}
                onClick={() => router.push(linkItem.url)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {linkItem.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
    </div>
  );
};


