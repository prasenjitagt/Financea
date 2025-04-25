"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";
import "./globals.css";
import ClientLayout from "./client-layout";
import { useEffect } from "react";
import Head from "next/head";
import AuthProvider from "@/lib/auth/authProvider";


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    document.title = "Financea"
  }, []);

  return (
    <Provider store={store}>
      <html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="icon" type="image/png" href="/favicon.png" />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <AuthProvider >
          <body>
            <ClientLayout>
              {children}
            </ClientLayout>
          </body>
        </AuthProvider>
      </html>
    </Provider>
  );
}
