"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";
import "./globals.css";
import { useEffect } from "react";
import Head from "next/head";
import AuthProvider from "@/lib/auth/authProvider";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import { Separator } from "@/components/ui/separator";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  useEffect(() => {
    document.title = "Financea";
  }, []);

  // List of routes without sidebar
  const hideSidebar = ["/login", "/signup", "/"].includes(pathname);

  return (
    <Provider store={store}>
      <SidebarProvider>
        <html lang="en" suppressHydrationWarning className="h-screen">
          <Head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            <link rel="icon" type="image/png" href="/favicon.png" />
            <link rel="shortcut icon" href="/favicon.ico" />
          </Head>
          <AuthProvider>
            <body className="h-full" >

              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
              >

                {hideSidebar ? (
                  // No Sidebar Layout (Login/Signup)
                  <main className="w-full">
                    {children}
                  </main>
                ) : (
                  // Layout with Sidebar
                  <main className="w-full flex ">
                    {/* Sidebar */}
                    <section className="flex" >
                      <AppSidebar />
                    </section>

                    <Separator orientation="vertical" />

                    {/* <div className="w-full h-screen overflow-auto bg-[#F7F6F6] dark:bg-[#171717]"> */}
                    <div className="w-full h-screen overflow-auto ">
                      <Navbar />
                      <section className="px-6 pb-4">
                        <div className="my-2 ">
                          <SidebarTrigger />
                        </div>
                        {children}
                      </section>
                      <Toaster />
                    </div>
                  </main>
                )}


              </ThemeProvider>
            </body>
          </AuthProvider>
        </html>
      </SidebarProvider>
    </Provider>
  );
}
