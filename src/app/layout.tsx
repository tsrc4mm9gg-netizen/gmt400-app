import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import VehicleProfileProvider from "./VehicleProfileProvider";
import BackToTop from './ui/BackToTop';
import ToolsLauncher from "./ToolsLauncher";
import SiteHeader from "./site-header";
import SiteFooter from "./site-footer";
import { ModelSelectionProvider } from "./ModelSelectionContext";
import MobileTabBar from "./MobileTabBar";
import ServiceWorkerRegister from "./pwa/ServiceWorkerRegister";
import IosInstallHint from "./pwa/IosInstallHint";

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
  manifest: "/manifest.json",
  applicationName: "GMT400",
  appleWebApp: { capable: true, title: "GMT400", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
  // Next.js generuje „mobile-web-app-capable”; starsze iOS czytają wersję z prefiksem apple-.
  other: { "apple-mobile-web-app-capable": "yes" },
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

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-silver-600 focus:px-4 focus:py-2 focus:font-semibold focus:text-neutral-950"
        >
          Przejdź do treści
        </a>
        <ModelSelectionProvider>
          <SiteHeader />
          <div className="flex-1">
            <main id="main-content" tabIndex={-1} className="outline-none">
              <VehicleProfileProvider>{children}</VehicleProfileProvider>
            </main>
          </div>
          <SiteFooter />
          <ToolsLauncher />
          <BackToTop />
          <MobileTabBar />
          <IosInstallHint />
          <ServiceWorkerRegister />
        </ModelSelectionProvider>
      </body>
    </html>
  );
}
