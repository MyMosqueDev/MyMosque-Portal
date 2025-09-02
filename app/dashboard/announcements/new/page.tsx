"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Send, Upload, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Announcement } from "@/lib/types"
import { newAnnouncement } from "../actions"
import { MosqueInfo as MosqueInfoType } from "@/lib/types"
import useMosqueInfo from "@/hooks/useMosqueInfo"
import { toast } from "sonner"

export default function NewAnnouncementPage() {
  const [mosqueInfo, setMosqueInfo] = useState<MosqueInfoType | null>(null)
  useMosqueInfo({setMosqueInfo: setMosqueInfo})
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium",
    sendNotification: true,
    schedulePublish: false,
    publishDate: "",
    publishTime: "",
    image: null as File | null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent, action: "draft" | "publish") => {
    e.preventDefault()
    setIsLoading(true)
    
    const announcementData = {
      title: formData.title,
      description: formData.content,
      severity: formData.priority as "low" | "medium" | "high",
      status: action === "publish" ? "published" : "draft" as "published" | "draft",
      created_at: new Date().toISOString(),
      mosque_name: mosqueInfo?.name,
      ...(formData.image && { image: formData.image }),
    }
    const { error } = await newAnnouncement(announcementData)
    if (error) {
      console.error('Error creating announcement:', error)
    } else {
      router.push('/dashboard/announcements')
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 md:mb-8 space-y-4 sm:space-y-0">
          <Link href="/dashboard/announcements">
            <Button variant="ghost" size="sm" className="mr-0 sm:mr-4 h-10 md:h-11 text-sm md:text-base">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">New Announcement</h1>
            <p className="text-sm md:text-base text-gray-600">Create a new announcement for your community</p>
          </div>
        </div>

        {isLoading && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-xl mx-4">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mosque-green mx-auto mb-4"></div>
                <p className="text-gray-600 text-sm md:text-base">Creating announcement...</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg md:text-xl">Announcement Details</CardTitle>
                <CardDescription className="text-sm md:text-base">Fill in the information for your announcement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm md:text-base">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter announcement title..."
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                    className="h-10 md:h-11 text-sm md:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm md:text-base">Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your announcement content here..."
                    value={formData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    rows={8}
                    required
                    className="text-sm md:text-base resize-none"
                  />
                  <p className="text-xs md:text-sm text-gray-500">{formData.content.length}/500 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="text-sm md:text-base">Image (Optional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-6 text-center">
                    <Upload className="h-6 w-6 md:h-8 md:w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs md:text-sm text-gray-600 mb-2">Upload an image for your announcement</p>
                    <p className="text-xs text-gray-500 mb-2">Accepted formats: JPEG, PNG, WebP (max 5MB)</p>
                    <Input
                      id="image"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="max-w-xs mx-auto"
                    />
                  </div>
                  {formData.image && (
                    <p className="text-xs md:text-sm text-green-600 flex items-center">
                      <ImageIcon className="h-4 w-4 mr-1" />
                      Image selected: {formData.image.name} ({(formData.image.size / 1024 / 1024).toFixed(2)}MB)
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-sm md:text-base">Priority Level</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger className="h-10 md:h-11 text-sm md:text-base">
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
          <div className="space-y-4 md:space-y-6">
            {/* Preview */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg md:text-xl">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-200 rounded-lg p-3 md:p-4 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm md:text-base truncate">{formData.title || "Announcement Title"}</h4>
                    <span
                      className={`px-2 py-1 text-xs rounded-full w-fit ${
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
                  
                  {formData.image && (
                    <div className="mb-3">
                      <div className="w-full aspect-video rounded-lg overflow-hidden border border-gray-200">
                        <Image 
                          src={URL.createObjectURL(formData.image)} 
                          alt="Announcement preview" 
                          width={400}
                          height={225}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  <p className="text-gray-600 text-xs md:text-sm">
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
                className="w-full bg-mosque-green hover:bg-mosque-green-light h-10 md:h-11 text-sm md:text-base"
                disabled={isLoading || !formData.title || !formData.content}
              >
                <Send className="h-4 w-4 mr-2" />
                {isLoading ? "Publishing..." : "Publish Now"}
              </Button>
              <Button
                onClick={(e) => handleSubmit(e, "draft")}
                variant="outline"
                className="w-full h-10 md:h-11 text-sm md:text-base"
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
