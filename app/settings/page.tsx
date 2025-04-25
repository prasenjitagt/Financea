"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LuLogOut } from "react-icons/lu";
import { ImSpinner2 } from "react-icons/im";
import { useState } from "react";
import { signOut } from "next-auth/react";

const Settings = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const handleLogout = () => {
    setIsLoggingOut(true); // Show spinner
    signOut({ callbackUrl: "/login" })

  };
  return (
    <div className="relative flex flex-col items-center justify-center w-full  bg-gray-100">

      {/* Logout Button */}
      <Button
        variant="outline"
        className="absolute md:top-[2rem] md:left-[2rem] sm:top-[1rem] sm:left-[1rem] flex items-center gap-4 px-8 py-5 text-lg font-medium text-gray-700 cursor-pointer"
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <ImSpinner2 className="w-4 h-4 animate-spin text-purple-600" />
        ) : (
          <>
            <LuLogOut className="w-4 h-4 transition-all duration-300" />
            Logout
          </>
        )}
      </Button>
    </div>
  )
}

export default Settings