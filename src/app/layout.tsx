import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import VehicleProfileProvider from "./VehicleProfileProvider";
import ToolsLauncher from "./ToolsLauncher";
import SiteHeader from "./site-header";
import SiteFooter from "./site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.gmt400.pl"),
  title: {
    default: "GMT400 Encyklopedia",
    template: "%s | GMT400",
  },
  description: "Baza wiedzy dla właścicieli Chevrolet C/K, Tahoe, Suburban i GMC (1988–2000)",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "GMT400",
    title: "GMT400 Encyklopedia",
    description: "Baza wiedzy dla właścicieli Chevrolet C/K, Tahoe, Suburban i GMC (1988–2000)",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "GMT400 Encyklopedia",
    description: "Baza wiedzy dla właścicieli Chevrolet C/K, Tahoe, Suburban i GMC (1988–2000)",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}>
        <SiteHeader />
        <div className="flex-1">
          <VehicleProfileProvider>{children}</VehicleProfileProvider>
        </div>
        <SiteFooter />
        <ToolsLauncher />
      </body>
    </html>
  );
}
