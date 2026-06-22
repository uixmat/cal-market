import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Link from "next/link";

import "./globals.css";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const interHeading = Inter({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  description:
    "A no-commission marketplace for bookable local services powered by Cal.com.",
  title: "Discover — Cal.com Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
        interHeading.variable
      )}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <header className="border-b">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
            <Link className="font-semibold text-lg tracking-tight" href="/">
              Discover
            </Link>
            <nav className="flex items-center gap-2">
              <Button render={<Link href="/" />} variant="ghost">
                Browse
              </Button>
              <Button render={<Link href="/search" />}>AI Search</Button>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
