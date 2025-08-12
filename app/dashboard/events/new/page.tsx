"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Calendar, Upload, Share2, Users, MapPin, Image as ImageIcon, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { createEvent } from "../actions"
import { toast } from "sonner"
import { EventFormData } from "@/lib/types"

interface ValidationErrors {
  title?: string
  description?: string
  date?: string
  startTime?: string
  location?: string
  image?: string
  general?: string
}

export default function NewEventPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    host: "",
    isRecurring: false,
    recurringType: "weekly",
    endDate: "",
    image: null as File | null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const router = useRouter()

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

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Event title is required"
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Event title must be at least 3 characters long"
    } else if (formData.title.trim().length > 100) {
      newErrors.title = "Event title must be less than 100 characters"
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Event description is required"
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Event description must be at least 10 characters long"
    } else if (formData.description.trim().length > 1000) {
      newErrors.description = "Event description must be less than 1000 characters"
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = "Event date is required"
    } else {
      const selectedDate = new Date(formData.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Reset time to start of day
      
      if (selectedDate < today) {
        newErrors.date = "Event date must be in the future"
      }
    }

    // Time validation
    if (!formData.startTime) {
      newErrors.startTime = "Start time is required"
    } else {
      // Check if the selected date and time is in the future
      if (formData.date) {
        const selectedDateTime = new Date(`${formData.date}T${formData.startTime}`)
        const now = new Date()
        
        if (selectedDateTime <= now) {
          newErrors.startTime = "Event start time must be in the future"
        }
      }
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = "Event location is required"
    } else if (formData.location.trim().length < 3) {
      newErrors.location = "Event location must be at least 3 characters long"
    }

    // Image validation
    if (!formData.image) {
      newErrors.image = "Event image is required"
    } else {
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(formData.image.type)) {
        newErrors.image = "Please upload a valid image file (JPEG, PNG, or WebP)"
      }
      
      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (formData.image.size > maxSize) {
        newErrors.image = "Image file size must be less than 5MB"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent, action: "draft" | "publish") => {
    e.preventDefault()
    
    // Clear previous errors
    setErrors({})
    
    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    setIsLoading(true)

    // Combine date and time, handling AM/PM format
    let combinedDateTime: string
    if (formData.date && formData.startTime) {
      const time24h = formData.startTime.includes(' ') 
        ? convertTo24Hour(formData.startTime)
        : formData.startTime
      
      const [year, month, day] = formData.date.split('-').map(Number)
      const [hours, minutes] = time24h.split(':').map(Number)
      
      const localDate = new Date(year, month - 1, day, hours, minutes)
      combinedDateTime = localDate.toISOString()
    } else if (formData.date) {
      const [year, month, day] = formData.date.split('-').map(Number)
      const localDate = new Date(year, month - 1, day, 0, 0)
      combinedDateTime = localDate.toISOString()
    } else {
      combinedDateTime = new Date().toISOString()
    }

    const eventData: EventFormData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      date: combinedDateTime,
      host: formData.host.trim(),
      location: formData.location.trim(),
      image: formData.image,
      status: action === "publish" ? "published" : "draft",
    };

    const { error } = await createEvent(eventData)
    if (error) {
      toast.error(error)
      setIsLoading(false)
    } else {
      toast.success('Event created successfully')
      router.push('/dashboard/events')
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean | File | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    
    // Clear error for this field when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a valid image file (JPEG, PNG, or WebP)")
        return
      }
      
      // Validate file size
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        toast.error("Image file size must be less than 5MB")
        return
      }
      
      handleInputChange("image", file)
    }
  }

  // Helper function to render error message
  const renderError = (field: keyof ValidationErrors) => {
    const error = errors[field]
    if (!error) return null
    
    return (
      <div className="flex items-center mt-1 text-sm text-red-600">
        <AlertCircle className="h-4 w-4 mr-1" />
        {error}
      </div>
    )
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

        {isLoading && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 shadow-xl">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mosque-green mx-auto mb-4"></div>
                <p className="text-gray-600">Creating event...</p>
              </div>
            </div>
          </div>
        )}

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
                    className={errors.title ? "border-red-500 focus:border-red-500" : ""}
                    required
                  />
                  {renderError("title")}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your event..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={6}
                    className={errors.description ? "border-red-500 focus:border-red-500" : ""}
                    required
                  />
                  {renderError("description")}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Event Image *</Label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    errors.image ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}>
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload an image for your event</p>
                    <p className="text-xs text-gray-500 mb-2">Accepted formats: JPEG, PNG, WebP (max 5MB)</p>
                    <Input
                      id="image"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="max-w-xs mx-auto"
                      required
                    />
                  </div>
                  {formData.image && (
                    <p className="text-sm text-green-600 flex items-center">
                      <ImageIcon className="h-4 w-4 mr-1" />
                      Image selected: {formData.image.name} ({(formData.image.size / 1024 / 1024).toFixed(2)}MB)
                    </p>
                  )}
                  {renderError("image")}
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
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className={errors.date ? "border-red-500 focus:border-red-500" : ""}
                      required
                    />
                    {renderError("date")}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange("startTime", e.target.value)}
                      className={errors.startTime ? "border-red-500 focus:border-red-500" : ""}
                      required
                    />
                    {renderError("startTime")}
                  </div>
                </div>

                {/* <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Recurring Event</Label>
                    <p className="text-sm text-gray-500">This event repeats regularly</p>
                  </div>
                  <Switch
                    checked={formData.isRecurring}
                    onCheckedChange={(checked) => handleInputChange("isRecurring", checked)}
                  />
                </div> */}

                {formData.isRecurring && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="recurringType">Repeat</Label>
                      <select
                        id="recurringType"
                        value={formData.recurringType}
                        onChange={(e) => handleInputChange("recurringType", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mosque-green"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange("endDate", e.target.value)}
                        min={formData.date}
                        className="w-full"
                        required
                      />
                      <p className="text-sm text-gray-500">When should this recurring event stop?</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location & Capacity */}
            <Card>
              <CardHeader>
                <CardTitle>Who & Where</CardTitle>
                <CardDescription>Where will your event be held and who will be hosting?</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Where will your event be held? *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Main Prayer Hall, Community Center"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className={errors.location ? "border-red-500 focus:border-red-500" : ""}
                    required
                  />
                  {renderError("location")}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="host">Who will be hosting?</Label>
                  <Input
                    id="host"
                    placeholder="e.g., Mufti Anwer, Nueces Mosque, etc."
                    value={formData.host}
                    onChange={(e) => handleInputChange("host", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  {/* Header Section */}
                  <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                    <div className="text-center flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm">{formData.title || "Event Title"}</h3>
                      <p className="text-xs text-gray-600">Mosque Name</p>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="px-4 py-2 bg-gray-50">
                    {/* Event Image */}
                    <div className="w-full aspect-square rounded-lg mb-4 overflow-hidden border border-gray-200">
                      {formData.image ? (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Image 
                            src={URL.createObjectURL(formData.image)} 
                            alt="Event preview" 
                            width={400}
                            height={400}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <div className="text-center">
                            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">No image uploaded</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Event Information */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {formData.date ? new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : "Date"}
                          </p>
                          <p className="text-xs text-gray-600">
                            {formData.startTime ? 
                              new Date(`2000-01-01T${formData.startTime}`).toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                minute: '2-digit',
                                hour12: true 
                              }) 
                              : "Time"
                            }
                          </p>
                        </div>
                        <Share2 className="w-4 h-4 text-gray-500" />
                      </div>
                      
                      <div className="space-y-2 text-xs text-gray-700">
                        <div className="flex items-center">
                          <Users className="w-3 h-3 mr-2 text-gray-500" />
                          <span>Hosted by {formData.host || "Nueces Mosque"}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-2 text-gray-500" />
                          <span className="underline">Located @ {formData.location || "location"}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {formData.description || "Event description will appear here..."}
                      </p>
                    </div>
                  </div>


                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={(e) => handleSubmit(e, "publish")}
                className="w-full bg-mosque-green hover:bg-mosque-green-light"
                disabled={isLoading}
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
