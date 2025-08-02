"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Bell, Plus, Search, Eye, Edit, Trash2, Filter, Save, Send } from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { useEffect, useState } from "react"
import { Announcement } from "@/lib/types"
import { format } from "date-fns"
import { supabase } from "@/utils/supabase/client"
import useUser from "@/hooks/useUser"
import { User } from "@/lib/types"

export default function AnnouncementsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
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
  
  useUser({setUser})

  useEffect(() => {
    const announcementsData = sessionStorage.getItem('announcementsData') ? JSON.parse(sessionStorage.getItem('announcementsData') as string) : []
    console.log(announcementsData)
    setAnnouncements(announcementsData)
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
    const updatedAnnouncements = announcements.filter((announcement) => announcement.id !== id)
    setAnnouncements(updatedAnnouncements)
    sessionStorage.setItem('announcementsData', JSON.stringify(updatedAnnouncements))
    const {error: deletedError} = await supabase
      .from('announcements')
      .update({
        status: 'deleted'
      })
      .eq('id', id)

    if (deletedError) {
      console.error('Error deleting announcement:', deletedError)
    }
  }

  const openDeleteDialog = (announcement: Announcement) => {
    setAnnouncementToDelete(announcement)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (announcementToDelete) {
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
    setEditDialogOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!announcementToEdit) return
    
    setIsEditLoading(true)

    const { data, error: updateError } = await supabase
      .from('announcements')
      .update({
        title: editFormData.title,
        description: editFormData.content,
        severity: editFormData.priority,
        updated_at: new Date()
      })
      .eq('id', announcementToEdit.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating announcement:', updateError)
    } else {
      // Update sessionStorage
      const updatedAnnouncements = announcements.map((a: Announcement) => 
        a.id === announcementToEdit.id ? data : a
      )
      
      setAnnouncements(updatedAnnouncements)
      sessionStorage.setItem('announcementsData', JSON.stringify(updatedAnnouncements))

      const {error: updatedError} = await supabase
        .from('mosques')
        .update({
          last_announcement: new Date()
        })
        .eq('id', user?.id)

      if (updatedError) {
        console.error('Error updating mosque:', updatedError)
      }
      
      setIsEditLoading(false)
      setEditDialogOpen(false)
      setAnnouncementToEdit(null)
    }
  }

  const handleEditInputChange = (field: string, value: string | boolean) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const cancelEdit = () => {
    setEditDialogOpen(false)
    setAnnouncementToEdit(null)
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
        {/* <Card className="mb-6">
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
        </Card> */}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Bell className="h-8 w-8 text-mosque-blue" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{announcements.length}</p>
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
        </div>

        {/* Announcements List */}
        <Card>
          <CardHeader>
            <CardTitle>All Announcements</CardTitle>
            <CardDescription>Manage and monitor your community announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements
                .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())
                .map((announcement) => (
                <div
                  key={announcement.id}
                  className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                      <Badge className={getPriorityColor(announcement.severity)}>{announcement.severity}</Badge>
                      <Badge className={getStatusColor(announcement.status === null ? 'draft' : announcement.status )}>{announcement.status}</Badge>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{announcement.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{format(new Date(announcement.created_at), 'MMMM d, yyyy')}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(announcement)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => openDeleteDialog(announcement)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Announcement</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{announcementToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Announcement Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>
              Update your announcement details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Main Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  placeholder="Enter announcement title..."
                  value={editFormData.title}
                  onChange={(e) => handleEditInputChange("title", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-content">Content *</Label>
                <Textarea
                  id="edit-content"
                  placeholder="Write your announcement content here..."
                  value={editFormData.content}
                  onChange={(e) => handleEditInputChange("content", e.target.value)}
                  rows={6}
                  required
                />
                <p className="text-sm text-gray-500">{editFormData.content.length}/500 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority Level</Label>
                <Select value={editFormData.priority} onValueChange={(value) => handleEditInputChange("priority", value)}>
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
            </div>

            {/* Preview */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold text-sm mb-2">Preview</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <h5 className="font-semibold text-gray-900 text-sm">{editFormData.title || "Announcement Title"}</h5>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
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

          <DialogFooter>
            <Button variant="outline" onClick={cancelEdit}>
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              className="bg-mosque-green hover:bg-mosque-green-light"
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
