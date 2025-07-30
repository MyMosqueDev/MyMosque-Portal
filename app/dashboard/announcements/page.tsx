import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Bell, Plus, Search, Eye, Edit, Trash2, Filter } from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"

export default function AnnouncementsPage() {
  const announcements = [
    {
      id: 1,
      title: "New Jummah Timing",
      content: "We have changed our Jummah Prayer Times. We will now only have two Jummas at 1:30 and 2:30.",
      priority: "high",
      date: "May 8, 2025",
      views: 234,
      status: "published",
    },
    {
      id: 2,
      title: "Donation Drive",
      content: "We're collecting donations for the local food bank. Please bring non-perishable items to the mosque.",
      priority: "medium",
      date: "May 4, 2025",
      views: 156,
      status: "published",
    },
    {
      id: 3,
      title: "Ramadan Schedule",
      content: "Updated prayer times and iftar schedule for the holy month of Ramadan.",
      priority: "high",
      date: "April 28, 2025",
      views: 445,
      status: "published",
    },
    {
      id: 4,
      title: "Community Clean-up Day",
      content: "Join us for our monthly community service project this Saturday morning.",
      priority: "low",
      date: "April 25, 2025",
      views: 89,
      status: "draft",
    },
    {
      id: 5,
      title: "Youth Program Registration",
      content: "Registration is now open for our summer youth program. Limited spots available.",
      priority: "medium",
      date: "April 20, 2025",
      views: 312,
      status: "published",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-mosque-green/10 text-mosque-green"
      case "draft":
        return "bg-gray-100 text-gray-600"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
            <p className="text-gray-600">Manage your community announcements and updates</p>
          </div>
          <Link href="/dashboard/announcements/new">
            <Button className="bg-mosque-green hover:bg-mosque-green-light">
              <Plus className="h-4 w-4 mr-2" />
              New Announcement
            </Button>
          </Link>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search announcements..." className="pl-10" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  All Status
                </Button>
                <Button variant="outline" size="sm">
                  All Priority
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Bell className="h-8 w-8 text-mosque-blue" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-mosque-green/10 rounded-full flex items-center justify-center">
                  <div className="h-3 w-3 bg-mosque-green rounded-full"></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <div className="h-3 w-3 bg-gray-400 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Drafts</p>
                  <p className="text-2xl font-bold text-gray-900">4</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-mosque-purple" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">1,236</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Announcements List */}
        <Card>
          <CardHeader>
            <CardTitle>All Announcements</CardTitle>
            <CardDescription>Manage and monitor your community announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                      <Badge className={getPriorityColor(announcement.priority)}>{announcement.priority}</Badge>
                      <Badge className={getStatusColor(announcement.status)}>{announcement.status}</Badge>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{announcement.content}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{announcement.date}</span>
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {announcement.views} views
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
