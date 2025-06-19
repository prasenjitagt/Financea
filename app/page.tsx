"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    return (
        <div>
            <p>Welcome to Financea Home</p>
            <Button onClick={() => router.push("/login")}>Log In</Button>
        </div>
    )
}
