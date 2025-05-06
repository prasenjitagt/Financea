import React, { useEffect } from 'react'
import "@/app/topProgress.css"
import { usePathname, useSearchParams } from 'next/navigation';
export default function TopProgressBar() {

    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {

    }, [pathname, searchParams]);
    return (
        <div className="w-full h-[5px] bg-red-500 animate-slide" />
    )
}
