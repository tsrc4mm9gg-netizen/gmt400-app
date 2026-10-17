import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import VehicleProfileProvider from "./VehicleProfileProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GMT400 Encyklopedia",
  description: "Baza wiedzy dla właścicieli Chevrolet C/K, Tahoe, Suburban i GMC (1988–2000)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <VehicleProfileProvider>{children}</VehicleProfileProvider>
        <Link
          href="/narzedzia"
          className="fixed bottom-4 right-4 z-[90] rounded-full bg-amber-400 px-4 py-3 text-sm font-bold text-black shadow-lg transition hover:bg-amber-300"
        >
          🧰 Narzędzia
        </Link>
      </body>
    </html>
  );
}
