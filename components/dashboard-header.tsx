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
import { LogOut, User, Menu, X } from "lucide-react"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <Image src="/images/logo.png" alt="MyMosque Logo" width={32} height={32} className="w-full h-full object-contain" />
            </div>
            <span className="text-lg md:text-xl font-bold text-gray-900">MyMosque</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-gray-700 hover:text-mosque-blue font-medium transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard/announcements" className="text-gray-700 hover:text-mosque-blue font-medium transition-colors">
              Announcements
            </Link>
            <Link href="/dashboard/events" className="text-gray-700 hover:text-mosque-blue font-medium transition-colors">
              Events
            </Link>
            <Link href="/dashboard/prayer-times" className="text-gray-700 hover:text-mosque-blue font-medium transition-colors">
              Prayer Times
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 md:h-12 md:w-12 rounded-full [&_svg]:!size-5 md:[&_svg]:!size-6">
                  <User className="h-5 w-5 md:h-6 md:w-6"/>
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
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white mt-4 py-4">
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/dashboard" 
                className="px-4 py-2 text-gray-700 hover:text-mosque-blue hover:bg-gray-50 rounded-lg transition-colors"
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>
              <Link 
                href="/dashboard/announcements" 
                className="px-4 py-2 text-gray-700 hover:text-mosque-blue hover:bg-gray-50 rounded-lg transition-colors"
                onClick={closeMobileMenu}
              >
                Announcements
              </Link>
              <Link 
                href="/dashboard/events" 
                className="px-4 py-2 text-gray-700 hover:text-mosque-blue hover:bg-gray-50 rounded-lg transition-colors"
                onClick={closeMobileMenu}
              >
                Events
              </Link>
              <Link 
                href="/dashboard/prayer-times" 
                className="px-4 py-2 text-gray-700 hover:text-mosque-blue hover:bg-gray-50 rounded-lg transition-colors"
                onClick={closeMobileMenu}
              >
                Prayer Times
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
