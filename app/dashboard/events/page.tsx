"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Plus, MapPin, Clock, Users, Edit, Trash2, Save } from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { useState, useEffect } from "react"
import { Event } from "@/lib/types"
import { getEvents, updateEvent, deleteEvent } from "./actions"
import { toast } from "sonner"

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]) 
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null)
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    host: "",
    location: "",
  })
  const [isEditLoading, setIsEditLoading] = useState(false)

  // Helper function to convert 12-hour time to 24-hour format
  const convertTo24Hour = (time12h: string): string => {
    const [time, modifier] = time12h.split(' ')
    const [hours, minutes] = time.split(':')
    let adjustedHours = hours

    if (hours === '12') {
      adjustedHours = modifier === 'PM' ? '12' : '00'
    } else if (modifier === 'PM') {
      adjustedHours = String(parseInt(hours, 10) + 12)
    }
    
    return `${adjustedHours.padStart(2, '0')}:${minutes}`
  }

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      const {data, error} = await getEvents();
      if (error) {
        toast.error(error)
        return
      }
      setEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
      toast.error('Failed to load events')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

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

  const handleDelete = async (id: string) => {
    try {
      const { error } = await deleteEvent(id)
      
      if (error) {
        toast.error(error)
        return
      }

      // Update local state
      setEvents(prev => prev.filter(e => e.id !== id))
      toast.success("Event deleted successfully")
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error("Failed to delete event")
    }
  }

  const openDeleteDialog = (event: Event) => {
    setEventToDelete(event)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (eventToDelete && eventToDelete.id) {
      handleDelete(eventToDelete.id)
      setDeleteDialogOpen(false)
      setEventToDelete(null)
    }
  }

  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setEventToDelete(null)
  }

  const openEditDialog = (event: Event) => {
    setEventToEdit(event)
    const eventDate = new Date(event.date)
    const dateString = eventDate.toISOString().split('T')[0]
    
    // Format time in HH:MM format for the time input
    const hours = eventDate.getHours().toString().padStart(2, '0')
    const minutes = eventDate.getMinutes().toString().padStart(2, '0')
    const timeString = `${hours}:${minutes}`
    
    setEditFormData({
      title: event.title || "",
      description: event.description || "",
      date: dateString,
      startTime: timeString,
      host: event.host || "",
      location: event.location || "",
    })
    setEditDialogOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventToEdit) return
    
    // Basic client-side validation
    if (!editFormData.title.trim() || !editFormData.description.trim() || !editFormData.date || !editFormData.location) {
      toast.error("Title, description, date, and location are required")
      return
    }

    try {
      setIsEditLoading(true)

      // Combine date and time, handling AM/PM format
      let combinedDateTime: string
      if (editFormData.date && editFormData.startTime) {
        const time24h = editFormData.startTime.includes(' ') 
          ? convertTo24Hour(editFormData.startTime)
          : editFormData.startTime
        
        const [year, month, day] = editFormData.date.split('-').map(Number)
        const [hours, minutes] = time24h.split(':').map(Number)
        
        const localDate = new Date(year, month - 1, day, hours, minutes)
        combinedDateTime = localDate.toISOString()
      } else if (editFormData.date) {
        const [year, month, day] = editFormData.date.split('-').map(Number)
        const localDate = new Date(year, month - 1, day, 0, 0)
        combinedDateTime = localDate.toISOString()
      } else {
        combinedDateTime = new Date().toISOString()
      }

      const { data, error } = await updateEvent(eventToEdit.id as string, {
        title: editFormData.title,
        description: editFormData.description,
        date: combinedDateTime,
        host: editFormData.host,
        location: editFormData.location,
      })

      if (error) {
        toast.error(error)
        return
      }

      // Update local state
      setEvents(prev => prev.map(e => e.id === eventToEdit.id ? data : e))
      
      toast.success("Event updated successfully")
      setEditDialogOpen(false)
      setEventToEdit(null)
    } catch (error: unknown) {
      console.error('Error updating event:', error)
      toast.error("Failed to update event")
    } finally {
      setIsEditLoading(false)
    }
  }

  const handleEditInputChange = (field: string, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const cancelEdit = () => {
    setEditDialogOpen(false)
    setEventToEdit(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-6 md:py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mosque-green mx-auto mb-4"></div>
              <p className="text-gray-600">Loading events...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Events</h1>
            <p className="text-sm md:text-base text-gray-600">Manage your mosque events and programs</p>
          </div>
          <Link href="/dashboard/events/new">
            <Button className="bg-mosque-green hover:bg-mosque-green-light w-full sm:w-auto h-10 md:h-11 text-sm md:text-base">
              <Plus className="h-4 w-4 mr-2" />
              New Event
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardContent className="pt-4 md:pt-6">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 md:h-8 md:w-8 text-mosque-blue" />
                <div className="ml-3 md:ml-4">
                  <p className="text-xs md:text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">{events.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 md:pt-6">
              <div className="flex items-center">
                <div className="h-6 w-6 md:h-8 md:w-8 bg-mosque-blue/10 rounded-full flex items-center justify-center">
                  <div className="h-2 w-2 md:h-3 md:w-3 bg-mosque-blue rounded-full"></div>
                </div>
                <div className="ml-3 md:ml-4">
                  <p className="text-xs md:text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">
                    {events.filter(e => new Date(e.date) > new Date()).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 md:pt-6">
              <div className="flex items-center">
                <div className="h-6 w-6 md:h-8 md:w-8 bg-mosque-green/10 rounded-full flex items-center justify-center">
                  <div className="h-2 w-2 md:h-3 md:w-3 bg-mosque-green rounded-full"></div>
                </div>
                <div className="ml-3 md:ml-4">
                  <p className="text-xs md:text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">
                    {events.filter(e => {
                      const eventDate = new Date(e.date)
                      const now = new Date()
                      return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear()
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <div className="grid gap-4 md:gap-6">
          {events.length === 0 ? (
            <Card>
              <CardContent className="pt-4 md:pt-6">
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-sm md:text-base">No events yet</p>
                  <Link href="/dashboard/events/new">
                    <Button className="mt-4 bg-mosque-green hover:bg-mosque-green-light h-10 md:h-11 text-sm md:text-base">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Event
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            events.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Event Details */}
                    <div className="flex-1 p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 space-y-3 sm:space-y-0">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                            <h3 className="text-lg md:text-xl font-semibold text-gray-900 truncate">{event.title}</h3>
                            <div className="flex flex-wrap gap-2">
                              <Badge className={`${getStatusColor(event.date > new Date().toISOString() ? 'upcoming' : 'completed')} text-xs`}>
                                {event.date > new Date().toISOString() ? 'upcoming' : 'completed'}
                              </Badge>
                              <Badge className={`${getStatusColor(event.status === null ? 'draft' : event.status )} text-xs`}>
                                {event.status || 'draft'}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-4 line-clamp-2 text-sm md:text-base">{event.description}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-2 text-mosque-blue flex-shrink-0" />
                              <span className="truncate">{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 md:h-4 md:w-4 mr-2 text-mosque-blue flex-shrink-0" />
                              <span className="truncate">{new Date(event.date).toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                minute: '2-digit',
                                hour12: true 
                              })}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-2 text-mosque-blue flex-shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-3 w-3 md:h-4 md:w-4 mr-2 text-mosque-blue flex-shrink-0" />
                              <span className="truncate">{event.host}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 sm:ml-4 self-end sm:self-start">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(event)} className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 h-8 w-8 p-0" onClick={() => openDeleteDialog(event)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Delete Event</DialogTitle>
            <DialogDescription className="text-sm md:text-base">
              Are you sure you want to delete &quot;{eventToDelete?.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row space-y-2 sm:space-y-0">
            <Button variant="outline" onClick={cancelDelete} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} className="w-full sm:w-auto">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Edit Event</DialogTitle>
            <DialogDescription className="text-sm md:text-base">
              Update your event details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Main Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="text-sm md:text-base">Title *</Label>
                <Input
                  id="edit-title"
                  placeholder="Enter event title..."
                  value={editFormData.title}
                  onChange={(e) => handleEditInputChange("title", e.target.value)}
                  required
                  maxLength={100}
                  className="h-10 md:h-11 text-sm md:text-base"
                />
                <p className="text-xs md:text-sm text-gray-500">{editFormData.title.length}/100 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-sm md:text-base">Description *</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Describe your event..."
                  value={editFormData.description}
                  onChange={(e) => handleEditInputChange("description", e.target.value)}
                  rows={6}
                  required
                  maxLength={500}
                  className="text-sm md:text-base resize-none"
                />
                <p className="text-xs md:text-sm text-gray-500">{editFormData.description.length}/500 characters</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date" className="text-sm md:text-base">Date *</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editFormData.date}
                    onChange={(e) => handleEditInputChange("date", e.target.value)}
                    required
                    className="h-10 md:h-11 text-sm md:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-startTime" className="text-sm md:text-base">Start Time *</Label>
                  <Input
                    id="edit-startTime"
                    type="time"
                    value={editFormData.startTime}
                    onChange={(e) => handleEditInputChange("startTime", e.target.value)}
                    required
                    className="h-10 md:h-11 text-sm md:text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-location" className="text-sm md:text-base">Location *</Label>
                <Input
                  id="edit-location"
                  placeholder="e.g., Main Prayer Hall, Community Center"
                  value={editFormData.location}
                  onChange={(e) => handleEditInputChange("location", e.target.value)}
                  required
                  className="h-10 md:h-11 text-sm md:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-host" className="text-sm md:text-base">Host</Label>
                <Input
                  id="edit-host"
                  placeholder="e.g., Mufti Anwer, Nueces Mosque, etc."
                  value={editFormData.host}
                  onChange={(e) => handleEditInputChange("host", e.target.value)}
                  className="h-10 md:h-11 text-sm md:text-base"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold text-sm mb-2">Preview</h4>
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <h5 className="font-semibold text-gray-900 text-sm truncate">{editFormData.title || "Event Title"}</h5>
                  <span className="px-2 py-1 text-xs rounded-full bg-mosque-blue/10 text-mosque-blue w-fit">
                    {editFormData.date && new Date(editFormData.date) > new Date() ? 'upcoming' : 'completed'}
                  </span>
                </div>
                
                <p className="text-gray-600 text-xs">
                  {editFormData.description || "Event description will appear here..."}
                </p>
                <div className="space-y-1 text-xs text-gray-700">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-2 text-gray-500" />
                    <span>
                      {editFormData.date ? new Date(editFormData.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : "Date"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-2 text-gray-500" />
                    <span className="truncate">{editFormData.location || "Location"}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-2 text-gray-500" />
                    <span className="truncate">Hosted by {editFormData.host || "Nueces Mosque"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row space-y-2 sm:space-y-0">
            <Button variant="outline" onClick={cancelEdit} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              className="bg-mosque-green hover:bg-mosque-green-light w-full sm:w-auto"
              disabled={isEditLoading || !editFormData.title || !editFormData.description || !editFormData.date || !editFormData.location || !editFormData.startTime}
            >
              <Save className="h-4 w-4 mr-2" />
              {isEditLoading ? "Updating..." : "Update Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
