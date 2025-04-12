import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reddit Clone",
  description: "A Reddit clone built with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 dark:bg-gray-800 flex flex-col min-h-screen`}
      >
        <div className="flex flex-col min-h-screen">
          {/* Navbar as its own flex item */}
          <div className="flex-none">
            <Navbar />
          </div>
          
          {/* Main content area as another flex item with enough space from navbar */}
          <div className="flex-grow mt-16">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
