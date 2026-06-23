import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import "./globals.css";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { SiteRail } from "@/components/layout/site-rail";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const interHeading = Inter({
  subsets: ["latin"],
  variable: "--font-heading",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  description:
    "A no-commission marketplace for bookable local services powered by Cal.com.",
  title: "Discover — Cal.com Marketplace",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        inter.variable,
        interHeading.variable,
        geistMono.variable,
        "font-sans"
      )}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col text-foreground">
        <ThemeProvider>
          <ScrollToTop />
          <SiteRail>
            <SiteHeader />
            <main className="flex flex-1 flex-col max-sm:pt-[calc(4.75rem+env(safe-area-inset-top,0px))]">
              {children}
            </main>
          </SiteRail>
          {modal}
        </ThemeProvider>
      </body>
    </html>
  );
}
