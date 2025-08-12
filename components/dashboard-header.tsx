"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { supabase } from "@/utils/supabase/client"
import { useState } from "react"
import useMosqueInfo from "@/hooks/useMosqueInfo"
import { MosqueInfo as MosqueInfoType } from "@/lib/types"
export function DashboardHeader() {
  const router = useRouter()
  const [mosqueInfo, setMosqueInfo] = useState<MosqueInfoType | null>(null)
  useMosqueInfo({setMosqueInfo: setMosqueInfo})

  const handleLogout = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error during logout:', error)
        return
      }
      
      // Clear local storage
      localStorage.removeItem('authenticatedUser')
      
      // Redirect to login page
      router.push("/")
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2 absolute left-20">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <Image src="/images/logo.png" alt="MyMosque Logo" width={32} height={32} className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold text-gray-900">MyMosque</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-gray-700 hover:text-mosque-blue font-medium">
              Dashboard
            </Link>
            <Link href="/dashboard/announcements" className="text-gray-700 hover:text-mosque-blue font-medium">
              Announcements
            </Link>
            <Link href="/dashboard/events" className="text-gray-700 hover:text-mosque-blue font-medium">
              Events
            </Link>
            <Link href="/dashboard/prayer-times" className="text-gray-700 hover:text-mosque-blue font-medium">
              Prayer Times
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4 absolute right-20">
            {/* Notifications */}
            {/* <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button> */}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 w-12 rounded-full [&_svg]:!size-6">
                  <User className="h-12 w-12"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {mosqueInfo?.name == null ? "Loading..." : mosqueInfo?.name || "Unknown Mosque"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {mosqueInfo?.email || "No email Found"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                {/* <DropdownMenuSeparator /> */}
                {/* <DropdownMenuItem asChild> */}
                  {/* <Link href="/dashboard/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
