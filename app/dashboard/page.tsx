import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Calendar, Clock, MapPin, Users, TrendingUp, Eye } from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Followers",
      value: "1,247",
      change: "+12%",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Active Announcements",
      value: "8",
      change: "+2",
      icon: <Bell className="h-4 w-4" />,
    },
    {
      title: "Upcoming Events",
      value: "5",
      change: "+1",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: "This Month Views",
      value: "3,421",
      change: "+18%",
      icon: <Eye className="h-4 w-4" />,
    },
  ]

  const recentAnnouncements = [
    {
      title: "New Jummah Timing",
      date: "May 8, 2025",
      priority: "high",
      views: 234,
    },
    {
      title: "Donation Drive",
      date: "May 4, 2025",
      priority: "medium",
      views: 156,
    },
    {
      title: "Ramadan Schedule",
      date: "April 28, 2025",
      priority: "high",
      views: 445,
    },
  ]

  const upcomingEvents = [
    {
      title: "Nueces Night",
      date: "Tomorrow",
      time: "8:30 PM - 10:30 PM",
      location: "Main Prayer Hall",
    },
    {
      title: "Friday Khutbah",
      date: "Friday",
      time: "1:30 PM - 2:30 PM",
      location: "Main Prayer Hall",
    },
    {
      title: "Community Iftar",
      date: "Saturday",
      time: "7:00 PM - 9:00 PM",
      location: "Community Center",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Nueces Mosque</h1>
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
                <div className="flex items-center text-sm text-mosque-green">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change} from last month
                </div>
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
              <CardContent className="space-y-3">
                <Link href="/dashboard/announcements/new">
                  <Button className="w-full justify-start bg-mosque-green hover:bg-mosque-green-light">
                    <Bell className="h-4 w-4 mr-2" />
                    New Announcement
                  </Button>
                </Link>
                <Link href="/dashboard/events/new">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </Link>
                <Link href="/dashboard/prayer-times">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Clock className="h-4 w-4 mr-2" />
                    Update Prayer Times
                  </Button>
                </Link>
                <Link href="/dashboard/profile">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
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
                <Link href="/dashboard/announcements">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAnnouncements.map((announcement, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{announcement.title}</h4>
                          <Badge
                            variant={announcement.priority === "high" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {announcement.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{announcement.date}</p>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="h-3 w-3 mr-1" />
                        {announcement.views}
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
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-mosque-blue rounded-full mt-2"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-3 w-3 mr-1" />
                            {event.date}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-3 w-3 mr-1" />
                            {event.time}
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
