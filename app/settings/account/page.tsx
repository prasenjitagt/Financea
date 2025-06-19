"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";



export default function Profile() {


    async function logOut() {

        await signOut();

    }



    return (
        <div className="flex flex-col">
            <p>
                Profile
            </p>
            <Button className="w-15" onClick={logOut}>
                Logout
            </Button>

        </div>
    )
}
