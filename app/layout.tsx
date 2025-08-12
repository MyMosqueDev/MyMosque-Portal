import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from 'sonner';
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MyMosque - Connect Your Community",
  description:
    "Bridge your mosque with your community through real-time announcements, event management, and seamless digital communication.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TooltipProvider delayDuration={100}>
          {children}
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  )
}
