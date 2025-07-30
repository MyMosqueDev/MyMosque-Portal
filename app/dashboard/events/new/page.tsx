"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Calendar, Upload } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"

export default function NewEventPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    maxAttendees: "",
    requiresRegistration: false,
    sendNotification: true,
    isRecurring: false,
    recurringType: "weekly",
    image: null as File | null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent, action: "draft" | "publish") => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard/events")
    }, 1000)
  }

  const handleInputChange = (field: string, value: string | boolean | File | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleInputChange("image", file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/dashboard/events">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">New Event</h1>
            <p className="text-gray-600">Create a new event for your community</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>Basic information about your event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter event title..."
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your event..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Event Image</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload an image for your event</p>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="max-w-xs mx-auto"
                    />
                  </div>
                  {formData.image && <p className="text-sm text-green-600">Image selected: {formData.image.name}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Date & Time */}
            <Card>
              <CardHeader>
                <CardTitle>Date & Time</CardTitle>
                <CardDescription>When will your event take place?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange("startTime", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange("endTime", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Recurring Event</Label>
                    <p className="text-sm text-gray-500">This event repeats regularly</p>
                  </div>
                  <Switch
                    checked={formData.isRecurring}
                    onCheckedChange={(checked) => handleInputChange("isRecurring", checked)}
                  />
                </div>

                {formData.isRecurring && (
                  <div className="space-y-2">
                    <Label htmlFor="recurringType">Repeat</Label>
                    <select
                      id="recurringType"
                      value={formData.recurringType}
                      onChange={(e) => handleInputChange("recurringType", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mosque-green"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location & Capacity */}
            <Card>
              <CardHeader>
                <CardTitle>Location & Capacity</CardTitle>
                <CardDescription>Where will your event be held?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Main Prayer Hall, Community Center"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxAttendees">Maximum Attendees</Label>
                  <Input
                    id="maxAttendees"
                    type="number"
                    placeholder="e.g., 100"
                    value={formData.maxAttendees}
                    onChange={(e) => handleInputChange("maxAttendees", e.target.value)}
                  />
                  <p className="text-sm text-gray-500">Leave empty for unlimited capacity</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Event Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Event Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Requires Registration</Label>
                    <p className="text-sm text-gray-500">Users must register to attend</p>
                  </div>
                  <Switch
                    checked={formData.requiresRegistration}
                    onCheckedChange={(checked) => handleInputChange("requiresRegistration", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Send Notification</Label>
                    <p className="text-sm text-gray-500">Notify followers about this event</p>
                  </div>
                  <Switch
                    checked={formData.sendNotification}
                    onCheckedChange={(checked) => handleInputChange("sendNotification", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="font-semibold text-gray-900 mb-2">{formData.title || "Event Title"}</h4>
                  <p className="text-gray-600 text-sm mb-3">
                    {formData.description || "Event description will appear here..."}
                  </p>
                  <div className="space-y-1 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formData.date ? new Date(formData.date).toLocaleDateString() : "Date"}
                    </div>
                    {formData.startTime && formData.endTime && (
                      <div className="flex items-center">
                        <span className="w-3 h-3 mr-1"></span>
                        {formData.startTime} - {formData.endTime}
                      </div>
                    )}
                    {formData.location && (
                      <div className="flex items-center">
                        <span className="w-3 h-3 mr-1"></span>
                        {formData.location}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={(e) => handleSubmit(e, "publish")}
                className="w-full bg-mosque-green hover:bg-mosque-green-light"
                disabled={isLoading || !formData.title || !formData.description || !formData.date}
              >
                <Calendar className="h-4 w-4 mr-2" />
                {isLoading ? "Creating..." : "Create Event"}
              </Button>
              <Button
                onClick={(e) => handleSubmit(e, "draft")}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
