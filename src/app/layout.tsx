import type { Metadata } from "next";

import Navbar from "@/components/Navbar";

import AuthListener from "@/components/AuthListener";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taskingo",
  description: "Your own task manager!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="shortcut icon" href="/favicon.svg" />
      <body>
        <AuthListener />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
