import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Plus, Search, MapPin, Clock, Users, Edit, Trash2, Filter } from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"

export default function EventsPage() {
  const events = [
    {
      id: 1,
      title: "Cookies & Mulk",
      description:
        "Join us every Monday Night as Mufti Anwer gives us a deep dive into Surah Al Mulk followed by some delicious cookies and milk!",
      date: "2025-06-02",
      time: "8:30 PM - 10:30 PM",
      location: "Main Prayer Hall",
      attendees: 45,
      maxAttendees: 60,
      status: "upcoming",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-r9km6ojVaqoWY78JS8nFguROyLfA6s.png",
    },
    {
      id: 2,
      title: "Friday Khutbah",
      description: "Weekly Friday prayer and sermon for the community.",
      date: "2025-05-30",
      time: "1:30 PM - 2:30 PM",
      location: "Main Prayer Hall",
      attendees: 120,
      maxAttendees: 150,
      status: "upcoming",
    },
    {
      id: 3,
      title: "Community Iftar",
      description: "Join us for a community iftar during the blessed month of Ramadan.",
      date: "2025-05-31",
      time: "7:00 PM - 9:00 PM",
      location: "Community Center",
      attendees: 80,
      maxAttendees: 100,
      status: "upcoming",
    },
    {
      id: 4,
      title: "Youth Basketball Tournament",
      description: "Annual basketball tournament for youth aged 13-18.",
      date: "2025-05-25",
      time: "2:00 PM - 6:00 PM",
      location: "Gymnasium",
      attendees: 32,
      maxAttendees: 32,
      status: "completed",
    },
    {
      id: 5,
      title: "Islamic Finance Workshop",
      description: "Learn about Islamic principles of finance and investment.",
      date: "2025-06-05",
      time: "7:00 PM - 9:00 PM",
      location: "Conference Room",
      attendees: 15,
      maxAttendees: 30,
      status: "upcoming",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-mosque-blue/10 text-mosque-blue"
      case "completed":
        return "bg-mosque-green/10 text-mosque-green"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
            <p className="text-gray-600">Manage your mosque events and programs</p>
          </div>
          <Link href="/dashboard/events/new">
            <Button className="bg-mosque-green hover:bg-mosque-green-light">
              <Plus className="h-4 w-4 mr-2" />
              New Event
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
                  <Input placeholder="Search events..." className="pl-10" />
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
                  This Month
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
                <Calendar className="h-8 w-8 text-mosque-blue" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-mosque-blue/10 rounded-full flex items-center justify-center">
                  <div className="h-3 w-3 bg-mosque-blue rounded-full"></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-mosque-green" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Attendees</p>
                  <p className="text-2xl font-bold text-gray-900">292</p>
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
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <div className="grid gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Event Image */}
                  {event.image && (
                    <div className="md:w-48 h-48 md:h-auto">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Event Details */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                          <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-mosque-blue" />
                            {formatDate(event.date)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-mosque-blue" />
                            {event.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-mosque-blue" />
                            {event.location}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-mosque-blue" />
                            {event.attendees}/{event.maxAttendees} attendees
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-mosque-green h-2 rounded-full transition-all"
                        style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
