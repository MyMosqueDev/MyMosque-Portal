"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Bell, Plus, Edit, Trash2, Save, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { DashboardHeader } from "@/components/dashboard-header"
import { useEffect, useState } from "react"
import { Announcement } from "@/lib/types"
import { format } from "date-fns"
import { toast } from "sonner"
import { getAnnouncements, updateAnnouncement, deleteAnnouncement } from "./actions"

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [announcementToEdit, setAnnouncementToEdit] = useState<Announcement | null>(null)
  const [editFormData, setEditFormData] = useState({
    title: "",
    content: "",
    priority: "medium",
  })
  const [isEditLoading, setIsEditLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  
  // Fetch announcements from server
  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true)
      
      const { data, error } = await getAnnouncements()
      if (error) {
        toast.error(error)
        return
      }

      setAnnouncements(data)
    } catch (error) {
      console.error('Error fetching announcements:', error)
      toast.error("Failed to load announcements")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

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

  const handleDelete = async (id: string) => {
    try {
      const { error } = await deleteAnnouncement(id)
      
      if (error) {
        toast.error(error)
        return
      }

      // Update local state
      setAnnouncements(prev => prev.filter(a => a.id !== id))
      toast.success("Announcement deleted successfully")
    } catch (error) {
      console.error('Error deleting announcement:', error)
      toast.error("Failed to delete announcement")
    }
  }

  const openDeleteDialog = (announcement: Announcement) => {
    setAnnouncementToDelete(announcement)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (announcementToDelete && announcementToDelete.id) {
      handleDelete(announcementToDelete.id)
      setDeleteDialogOpen(false)
      setAnnouncementToDelete(null)
    }
  }

  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setAnnouncementToDelete(null)
  }

  const openEditDialog = (announcement: Announcement) => {
    setAnnouncementToEdit(announcement)
    setEditFormData({
      title: announcement.title || "",
      content: announcement.description || "",
      priority: announcement.severity || "medium",
    })
    setValidationErrors([])
    setEditDialogOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!announcementToEdit) return
    
    // Basic client-side validation
    if (!editFormData.title.trim() || !editFormData.content.trim()) {
      toast.error("Title and content are required")
      return
    }

    try {
      setIsEditLoading(true)
      setValidationErrors([])

      const { data, error } = await updateAnnouncement(announcementToEdit.id as string, editFormData)

      if (error) {
        toast.error(error)
        return
      }

      // Update local state
      setAnnouncements(prev => prev.map(a => a.id === announcementToEdit.id ? data : a))
      
      toast.success("Announcement updated successfully")
      setEditDialogOpen(false)
      setAnnouncementToEdit(null)
    } catch (error: unknown) {
      console.error('Error updating announcement:', error)
      toast.error("Failed to update announcement")
    } finally {
      setIsEditLoading(false)
    }
  }

  const handleEditInputChange = (field: string, value: string | boolean) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }

  const cancelEdit = () => {
    setEditDialogOpen(false)
    setAnnouncementToEdit(null)
    setValidationErrors([])
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-6 md:py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mosque-green mx-auto mb-4"></div>
              <p className="text-gray-600">Loading announcements...</p>
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
            <p className="text-sm md:text-base text-gray-600">Manage your community announcements and updates</p>
          </div>
          <Link href="/dashboard/announcements/new">
            <Button className="bg-mosque-green hover:bg-mosque-green-light w-full sm:w-auto h-10 md:h-11 text-sm md:text-base">
              <Plus className="h-4 w-4 mr-2" />
              New Announcement
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardContent className="pt-4 md:pt-6">
              <div className="flex items-center">
                <Bell className="h-6 w-6 md:h-8 md:w-8 text-mosque-blue" />
                <div className="ml-3 md:ml-4">
                  <p className="text-xs md:text-sm font-medium text-gray-600">Total</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">{announcements.length}</p>
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
                  <p className="text-xs md:text-sm font-medium text-gray-600">Published</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">
                    {announcements.filter(a => a.status === 'published').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 md:pt-6">
              <div className="flex items-center">
                <div className="h-6 w-6 md:h-8 md:w-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <div className="h-2 w-2 md:h-3 md:w-3 bg-gray-400 rounded-full"></div>
                </div>
                <div className="ml-3 md:ml-4">
                  <p className="text-xs md:text-sm font-medium text-gray-600">Drafts</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">
                    {announcements.filter(a => a.status === 'draft' || a.status === null).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Announcements List */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg md:text-xl">All Announcements</CardTitle>
            <CardDescription className="text-sm md:text-base">Manage and monitor your community announcements</CardDescription>
          </CardHeader>
          <CardContent>
            {announcements.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-sm md:text-base">No announcements yet</p>
                <Link href="/dashboard/announcements/new">
                  <Button className="mt-4 bg-mosque-green hover:bg-mosque-green-light h-10 md:h-11 text-sm md:text-base">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Announcement
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {announcements
                  .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())
                  .map((announcement) => (
                  <div
                    key={announcement.id}
                    className="flex flex-col sm:flex-row sm:items-start justify-between p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors space-y-3 sm:space-y-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">{announcement.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={`${getPriorityColor(announcement.severity)} text-xs`}>{announcement.severity}</Badge>
                          <Badge className={`${getStatusColor(announcement.status === null ? 'draft' : announcement.status )} text-xs`}>
                            {announcement.status || 'draft'}
                          </Badge>
                        </div>
                      </div>
                      
                      {announcement.image && (
                        <div className="mb-3">
                          <div className="w-full sm:w-32 h-20 rounded-lg overflow-hidden border border-gray-200">
                            <Image 
                              src={announcement.image} 
                              alt={announcement.title}
                              width={128}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                      
                      <p className="text-gray-600 mb-3 line-clamp-2 text-sm md:text-base">{announcement.description}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs md:text-sm text-gray-500">
                        <span>{format(new Date(announcement.created_at), 'MMMM d, yyyy')}</span>
                        {announcement.updated_at && announcement.updated_at !== announcement.created_at && (
                          <span className="text-gray-500/75 italic">Edited {format(new Date(announcement.updated_at), 'MMMM d, yyyy')}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:ml-4 self-end sm:self-start">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(announcement)} className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 h-8 w-8 p-0" onClick={() => openDeleteDialog(announcement)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Delete Announcement</DialogTitle>
            <DialogDescription className="text-sm md:text-base">
              Are you sure you want to delete &quot;{announcementToDelete?.title}&quot;? This action cannot be undone.
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

      {/* Edit Announcement Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Edit Announcement</DialogTitle>
            <DialogDescription className="text-sm md:text-base">
              Update your announcement details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Main Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="text-sm md:text-base">Title *</Label>
                <Input
                  id="edit-title"
                  placeholder="Enter announcement title..."
                  value={editFormData.title}
                  onChange={(e) => handleEditInputChange("title", e.target.value)}
                  required
                  maxLength={100}
                  className="h-10 md:h-11 text-sm md:text-base"
                />
                <p className="text-xs md:text-sm text-gray-500">{editFormData.title.length}/100 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-content" className="text-sm md:text-base">Content *</Label>
                <Textarea
                  id="edit-content"
                  placeholder="Write your announcement content here..."
                  value={editFormData.content}
                  onChange={(e) => handleEditInputChange("content", e.target.value)}
                  rows={6}
                  required
                  maxLength={500}
                  className="text-sm md:text-base resize-none"
                />
                <p className="text-xs md:text-sm text-gray-500">{editFormData.content.length}/500 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-priority" className="text-sm md:text-base">Priority Level</Label>
                <Select value={editFormData.priority} onValueChange={(value) => handleEditInputChange("priority", value)}>
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
            </div>

            {/* Preview */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold text-sm mb-2">Preview</h4>
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <h5 className="font-semibold text-gray-900 text-sm truncate">{editFormData.title || "Announcement Title"}</h5>
                  <span
                    className={`px-2 py-1 text-xs rounded-full w-fit ${
                      editFormData.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : editFormData.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {editFormData.priority}
                  </span>
                </div>
                <p className="text-gray-600 text-xs">
                  {editFormData.content || "Your announcement content will appear here..."}
                </p>
                <p className="text-xs text-gray-500">Nueces Mosque • Just now</p>
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
              disabled={isEditLoading || !editFormData.title || !editFormData.content}
            >
              <Save className="h-4 w-4 mr-2" />
              {isEditLoading ? "Updating..." : "Update Announcement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
