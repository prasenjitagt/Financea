"use client";



import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { FaCirclePlus } from "react-icons/fa6";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";

interface NavLinksType {
  title: string;
  url: string;
}
const navLinks: NavLinksType[] = [
  { title: "Create Invoice", url: "/invoices/create-invoice" },
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
    <div className="sticky top-0 z-50 h-[64px] px-6 py-2 mb-[24] flex items-center justify-between border-b  bg-white dark:bg-gray-800  ">
      {/* Greeting and Username */}

      <section className="flex items-center gap-2">
        <SidebarTrigger />
        <div className="w-[1px] h-10 bg-gray-300 mx-4" />
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-white">
            Hey,
          </p>
          <h2 className="text-[20] font-medium dark:text-white">{username}</h2>
        </div>
      </section>

      {/* Notification and triggerbutton */}
      <section className="flex items-center gap-4">
        {/* Notification */}
        <div className="relative">
          <FaBell className="text-gray-600 dark:text-white text-lg cursor-pointer" />
          <span className="absolute top-[-2px] right-[-3px] w-2.5 h-2.5 bg-red-500 rounded-full"></span>
        </div>


        <Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <FaCirclePlus className=" w-5 h-5 cursor-pointer text-purple-600" />
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

              <DialogTrigger className="w-full">
                <DropdownMenuItem
                  className="border border-red-500  px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Create Client
                </DropdownMenuItem>
              </DialogTrigger>

            </DropdownMenuContent>
          </DropdownMenu>


          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share link</DialogTitle>
              <DialogDescription>
                Anyone who has this link will be able to view this.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input
                  id="link"
                  defaultValue="https://ui.shadcn.com/docs/installation"
                  readOnly
                />
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>


        </Dialog>

      </section>
    </div>
  );
}
