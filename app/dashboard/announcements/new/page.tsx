"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Send } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { supabase } from "@/utils/supabase/client"
import useUser from "@/hooks/useUser"
import { Announcement, User } from "@/lib/types"
import { newAnnouncement } from "../actions"

export default function NewAnnouncementPage() {
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium",
    sendNotification: true,
    schedulePublish: false,
    publishDate: "",
    publishTime: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  useUser({setUser})

  const handleSubmit = async (e: React.FormEvent, action: "draft" | "publish") => {
    e.preventDefault()
    setIsLoading(true)
    
    const announcement: Announcement = {
      title: formData.title,
      description: formData.content,
      severity: formData.priority as "low" | "medium" | "high",
      status: action === "publish" ? "published" : "draft",
      created_at: new Date().toISOString(),
    }
    const { data, error } = await newAnnouncement(announcement)
    if (error) {
      console.error('Error creating announcement:', error)
    } else {

      router.push('/dashboard/announcements')
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/dashboard/announcements">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">New Announcement</h1>
            <p className="text-gray-600">Create a new announcement for your community</p>
          </div>
        </div>

        {isLoading && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 shadow-xl">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mosque-green mx-auto mb-4"></div>
                <p className="text-gray-600">Creating announcement...</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Announcement Details</CardTitle>
                <CardDescription>Fill in the information for your announcement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter announcement title..."
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your announcement content here..."
                    value={formData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    rows={8}
                    required
                  />
                  <p className="text-sm text-gray-500">{formData.content.length}/500 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - General information</SelectItem>
                      <SelectItem value="medium">Medium - Important updates</SelectItem>
                      <SelectItem value="high">High - Urgent announcements</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Publishing Options */}
            <Card>
              <CardHeader>
                <CardTitle>Publishing Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Send Push Notification</Label>
                    <p className="text-sm text-gray-500">Notify followers immediately</p>
                  </div>
                  <Switch
                    checked={formData.sendNotification}
                    onCheckedChange={(checked) => handleInputChange("sendNotification", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Schedule Publishing</Label>
                    <p className="text-sm text-gray-500">Publish at a specific time</p>
                  </div>
                  <Switch
                    checked={formData.schedulePublish}
                    onCheckedChange={(checked) => handleInputChange("schedulePublish", checked)}
                  />
                </div>

                {formData.schedulePublish && (
                  <div className="space-y-3 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="publishDate">Publish Date</Label>
                      <Input
                        id="publishDate"
                        type="date"
                        value={formData.publishDate}
                        onChange={(e) => handleInputChange("publishDate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="publishTime">Publish Time</Label>
                      <Input
                        id="publishTime"
                        type="time"
                        value={formData.publishTime}
                        onChange={(e) => handleInputChange("publishTime", e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{formData.title || "Announcement Title"}</h4>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        formData.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : formData.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {formData.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {formData.content || "Your announcement content will appear here..."}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Nueces Mosque • Just now</p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={(e) => handleSubmit(e, "publish")}
                className="w-full bg-mosque-green hover:bg-mosque-green-light"
                disabled={isLoading || !formData.title || !formData.content}
              >
                <Send className="h-4 w-4 mr-2" />
                {isLoading ? "Publishing..." : "Publish Now"}
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
