import type { Metadata } from "next";


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
        {children}
      </body>
    </html>
  );
}
