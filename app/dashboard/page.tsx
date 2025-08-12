"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Calendar, Clock, MapPin, Star, DollarSign } from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { useState } from "react"
import { MosqueData, User } from "@/lib/types"
import { useMosque } from "@/hooks/useMosque"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import useUser from "@/hooks/useUser"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [mosque, setMosque] = useState<MosqueData | null>(null)
  const router = useRouter()

  useUser({setUser})
  useMosque({mosqueId: user?.id || '', setMosque: setMosque})
  
  if(!mosque || !mosque.announcements || !mosque.events || !mosque.prayerTimes || !mosque.info) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mosque-green mx-auto mb-4"></div>
              <p className="text-gray-600">Loading mosque data...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const stats = [
    {
      title: "Total Stars",
      value: mosque.info.stars,
      icon: <Star className="h-4 w-4 text-yellow-500" />,
    },
    {
      title: "Announcements Pushed",
      value: mosque.announcements.filter(announcement => announcement.status === "published").length,
      icon: <Bell className="h-4 w-4 text-mosque-green" />,
    },
    {
      title: "Events Created",
      value: mosque.events.filter(event => event.status === "published").length,
      icon: <Calendar className="h-4 w-4 text-mosque-blue" />,
    },
    {
      title: "Total Donations",
      value: "Coming Soon...",
      icon: <DollarSign className="h-4 w-4 text-mosque-purple" />,
    },
  ]

  // TODO: add better error handling
  if (!user) {
    return <div>Something went wrong. Please try again.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {mosque.info.name}</h1>
          <p className="text-gray-600">{"Here's what's happening with your community today."}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className="text-gray-400">{stat.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                {/* 
                TODO: Add change in stats
                <div className="flex items-center text-sm text-mosque-green">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change} from last month
                </div> */}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks for managing your mosque</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/announcements/new">
                  <Button variant="outline" className="w-full justify-start bg-transparen my-1">
                    <Bell className="h-4 w-4 mr-2" />
                    New Announcement
                  </Button>
                </Link>
                <Link href="/dashboard/events/new">
                  <Button variant="outline" className="w-full justify-start bg-transparent my-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </Link>
                <Link href="/dashboard/prayer-times">
                  <Button variant="outline" className="w-full justify-start bg-transparent my-1">
                    <Clock className="h-4 w-4 mr-2" />
                    Update Prayer Times
                  </Button>
                </Link>
                <Link href="/dashboard/profile">
                  <Button variant="outline" className="w-full justify-start bg-transparent my-1">
                    <MapPin className="h-4 w-4 mr-2" />
                    Edit Mosque Info
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Announcements */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Announcements</CardTitle>
                  <CardDescription>Your latest community updates</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Store data in sessionStorage for the next page
                    sessionStorage.setItem('announcementsData', JSON.stringify(mosque.announcements))
                    router.push('/dashboard/announcements')
                  }}
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mosque.announcements
                    .filter(announcement => announcement.status === "published")
                    .slice(0, 3)
                    .map((announcement, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1 justify-between">
                          <h4 className="font-medium text-gray-900">{announcement.title}</h4>
                          <Badge
                            variant={announcement.severity.toLowerCase() as "high" | "medium" | "low"}
                            className="text-xs"
                          >
                            {announcement.severity.toLowerCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{format(new Date(announcement.created_at), 'MMMM d, yyyy')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Events scheduled for this week</CardDescription>
                </div>
                <Link href="/dashboard/events">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mosque.events.filter(event => event.status === "published").slice(0, 3).map((event, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-mosque-blue rounded-full mt-2"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(event.date), 'MMMM d, yyyy')}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-3 w-3 mr-1" />
                            {format(new Date(event.date), 'h:mm a')}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-3 w-3 mr-1" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
