'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, Sparkles, Bell, Smartphone, Clock, Wrench, Sparkle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function PatchNotesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-4 md:left-10 w-48 md:w-72 h-48 md:h-72 bg-gradient-to-br from-mosque-green/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-4 md:right-20 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-br from-mosque-blue/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-64 md:w-80 h-64 md:h-80 bg-gradient-to-br from-mosque-purple/10 to-transparent rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl shadow-lg overflow-hidden">
              <Image src="/images/logo.png" alt="MyMosque Logo" width={32} height={32} className="w-full h-full object-contain" />
            </div>
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-mosque-green to-mosque-blue bg-clip-text text-transparent">
              MyMosque
            </span>
          </div>
          
          <Link href="/">
            <Button variant="ghost" className="rounded-full hover:bg-white/50 text-xs md:text-sm px-2 md:px-4">
              <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="relative py-6 md:py-24 px-0 md:px-4">
        <div className="w-full md:container md:mx-auto md:max-w-4xl relative z-10">
          <div className="text-center mb-8 md:mb-12 px-4 md:px-0">
            <Badge className="mb-4 bg-mosque-green/20 text-mosque-green border-mosque-green/20 rounded-full px-4 md:px-6 py-2 shadow-lg backdrop-blur-sm text-sm md:text-base">
              <Sparkles className="h-3 w-3 mr-2 inline" />
              Release Notes
            </Badge>
            <h1 className="text-3xl md:text-6xl font-bold mb-3 md:mb-4 px-2">
              <span className="bg-gradient-to-r from-mosque-green via-mosque-blue to-mosque-purple bg-clip-text text-transparent">
                Version 1.1.2
              </span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 px-4">Latest updates and improvements</p>
          </div>

          <Card className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border-0 shadow-xl rounded-none md:rounded-3xl mb-6 md:mb-8">
            <CardHeader className="p-4 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 mb-4">
                <CardTitle className="text-xl md:text-3xl font-bold text-gray-900">
                  What's New
                </CardTitle>
                <Badge className="bg-mosque-blue/20 text-mosque-blue border-mosque-blue/20 w-fit">
                  January 2025
                </Badge>
              </div>
              <CardDescription className="text-sm md:text-lg text-gray-600">
                We're excited to share the latest improvements and features in this release.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-8 pt-0">
              <div className="space-y-5 md:space-y-6">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-mosque-green to-mosque-blue flex items-center justify-center flex-shrink-0 mt-0.5 md:mt-1">
                    <Bell className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-xl font-semibold text-gray-900 mb-1.5 md:mb-2">
                      Prayer Time Notifications
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                      Prayer time notifications are here. Head to <strong>Settings</strong> to enable them and choose which prayers you'd like to be notified about. You'll receive alerts <strong>15 minutes before iqama</strong> and <strong>at iqama time</strong>, so you never miss a prayer at your go-to masjid.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-mosque-blue to-mosque-purple flex items-center justify-center flex-shrink-0 mt-0.5 md:mt-1">
                    <Wrench className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-xl font-semibold text-gray-900 mb-1.5 md:mb-2">
                      Fixed Announcement & Event Notifications
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                      We resolved an issue that prevented some users from receiving announcement and event notifications. A backend bug was stopping certain devices from being properly registered. This has now been fixed—notifications should work as expected as long as they're enabled.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-mosque-purple to-mosque-green flex items-center justify-center flex-shrink-0 mt-0.5 md:mt-1">
                    <Smartphone className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-xl font-semibold text-gray-900 mb-1.5 md:mb-2">
                      Android Beta Release
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                      Our Android beta is now available! We're opening up early access to gather feedback and ensure a consistent, high-quality experience across all devices.{" "}
                      <Link href="/android-beta" className="text-mosque-blue hover:text-mosque-blue-light font-medium underline underline-offset-2">
                        Sign up for the beta
                      </Link>
                      {" "}to get early access and help shape the future of MyMosque on Android.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-mosque-green to-mosque-blue flex items-center justify-center flex-shrink-0 mt-0.5 md:mt-1">
                    <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-xl font-semibold text-gray-900 mb-1.5 md:mb-2">
                      Prayer Times Admin Portal Rework
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                      We've reworked how prayer times are managed in the admin portal. Admins now get a <strong>monthly prayer time chart</strong> based on their mosque's location, along with a cleaner and more maintainable system that reduces complexity and manual work.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-mosque-blue to-mosque-purple flex items-center justify-center flex-shrink-0 mt-0.5 md:mt-1">
                    <Sparkle className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-xl font-semibold text-gray-900 mb-1.5 md:mb-2">
                      Minor UI/UX Improvements
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                      A handful of small UI tweaks and bug fixes across the app to improve usability, visual consistency, and overall polish.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center px-4 md:px-0">
            <Link href="/">
              <Button
                size="lg"
                className="bg-gradient-to-r from-mosque-green to-mosque-blue hover:from-mosque-green-light hover:to-mosque-blue-light rounded-full px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base shadow-xl transform hover:scale-105 transition-all duration-300 w-full md:w-auto"
              >
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 md:py-16 px-4 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl shadow-lg overflow-hidden">
                <Image src="/images/logo.png" alt="MyMosque Logo" width={32} height={32} className="w-full h-full object-contain" />
              </div>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-mosque-green to-mosque-blue bg-clip-text text-transparent">
                MyMosque
              </span>
            </div>
            <p className="text-center md:text-right text-sm md:text-base">
              © 2025 MyMosque. Connecting communities, one mosque at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

