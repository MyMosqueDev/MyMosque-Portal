"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Plus, Trash2 } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { DateRangePrayerTimes } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { deletePrayerTimes } from "@/app/dashboard/prayer-times/actions"
import { validatePrayerSchedule, validateDateOverlap } from "@/lib/validation"

interface ScheduleFormProps {
  dateRanges: DateRangePrayerTimes[]
  activeSchedule: string
  onDateRangesChange: (ranges: DateRangePrayerTimes[]) => void
  onActiveScheduleChange: (id: string) => void
  onSave: () => Promise<void>
  isLoading: boolean
}

const prayerNames = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
}

export function ScheduleForm({
  dateRanges,
  activeSchedule,
  onDateRangesChange,
  onActiveScheduleChange,
}: ScheduleFormProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  // Validate current schedule and update error state
  useEffect(() => {
    const currentSchedule = dateRanges.find(range => range.id === activeSchedule)
    if (currentSchedule) {
      const errors: Record<string, string> = {}
      
      // Validate schedule
      const scheduleValidation = validatePrayerSchedule(currentSchedule)
      if (!scheduleValidation.isValid) {
        scheduleValidation.errors.forEach(error => {
          errors[error.field] = error.message
        })
      }
      
      // Check for date overlaps
      const overlapValidation = validateDateOverlap(
        currentSchedule.startDate,
        currentSchedule.endDate,
        dateRanges,
        currentSchedule.id
      )
      if (!overlapValidation.isValid) {
        overlapValidation.errors.forEach(error => {
          errors[error.field] = error.message
        })
      }
      
      setValidationErrors(errors)
    }
  }, [dateRanges, activeSchedule])

  // Check if a date range overlaps with existing schedules
  const hasDateOverlap = (startDate: string, endDate: string, excludeId?: string) => {
    if (!startDate || !endDate) return false
    
    const newStart = new Date(startDate)
    const newEnd = new Date(endDate)
    
    return dateRanges.some(range => {
      if (excludeId && range.id === excludeId) return false
      if (!range.startDate || !range.endDate) return false
      
      const existingStart = new Date(range.startDate)
      const existingEnd = new Date(range.endDate)
      
      return newStart <= existingEnd && newEnd >= existingStart
    })
  }

  const addDateRange = () => {
    const newRange: DateRangePrayerTimes = {
      id: Date.now().toString(),
      name: `Schedule ${dateRanges.length + 1}`,
      startDate: "",
      endDate: "",
      status: "active",
      prayerTimes: {
        fajr: "05:30",
        dhuhr: "12:30",
        asr: "15:45",
        maghrib: "18:15",
        isha: "19:30",
      },
      timeMode: {
        fajr: "static",
        dhuhr: "static",
        asr: "static",
        maghrib: "static",
        isha: "static",
      },
      incrementValues: {
        fajr: 0,
        dhuhr: 0,
        asr: 0,
        maghrib: 0,
        isha: 0,
      },
      isNew: true, // Mark as new schedule
    }
    onDateRangesChange([...dateRanges, newRange])
    onActiveScheduleChange(newRange.id)
    toast({
      title: "Schedule Added",
      description: "New prayer schedule created successfully.",
    })
  }

  const removeDateRange = (id: string) => {
    setScheduleToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (scheduleToDelete && dateRanges.length > 1) {
      const scheduleToDeleteData = dateRanges.find(range => range.id === scheduleToDelete)
      
      if (scheduleToDeleteData) {
        // Only call server action if it's an existing schedule (not new)
        if (!scheduleToDeleteData.isNew) {
          try {
            const result = await deletePrayerTimes(scheduleToDelete)
            if (!result.success) {
              toast({
                title: "Delete Failed",
                description: result.error || "Failed to delete schedule. Please try again.",
                variant: "destructive",
              })
              return
            }
          } catch (error) {
            console.error('Error deleting schedule:', error)
            toast({
              title: "Delete Failed",
              description: "An unexpected error occurred. Please try again.",
              variant: "destructive",
            })
            return
          }
        }
        
        // Remove from local state
        const newRanges = dateRanges.filter((range) => range.id !== scheduleToDelete)
        onDateRangesChange(newRanges)
        if (activeSchedule === scheduleToDelete) {
          onActiveScheduleChange(newRanges[0].id)
        }
        
        toast({
          title: "Schedule Deleted",
          description: "Prayer schedule has been removed.",
        })
      }
    }
    setDeleteDialogOpen(false)
    setScheduleToDelete(null)
  }

  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setScheduleToDelete(null)
  }

  const updateDateRange = (id: string, field: string, value: string) => {
    onDateRangesChange(dateRanges.map((range) => {
      if (range.id === id) {
        const updatedRange = { ...range, [field]: value }
        
        if ((field === 'startDate' || field === 'endDate') && 
            updatedRange.startDate && updatedRange.endDate) {
          if (hasDateOverlap(updatedRange.startDate, updatedRange.endDate, id)) {
            toast({
              title: "Date Overlap Warning",
              description: "This schedule overlaps with another existing schedule. Please adjust the dates.",
              variant: "destructive",
            })
          }
        }
        
        return updatedRange
      }
      return range
    }))
  }

  const handlePrayerTimeChange = (rangeId: string, prayer: string, time: string) => {
    onDateRangesChange(dateRanges.map((range) =>
      range.id === rangeId
        ? {
            ...range,
            prayerTimes: {
              ...range.prayerTimes,
              [prayer]: time,
            },
          }
        : range,
    ))
  }

  const handleTimeModeChange = (rangeId: string, prayer: string, mode: "static" | "increment") => {
    onDateRangesChange(dateRanges.map((range) =>
      range.id === rangeId
        ? {
            ...range,
            timeMode: {
              ...range.timeMode,
              [prayer]: mode,
            },
          }
        : range,
    ))
  }

  const handleIncrementValueChange = (rangeId: string, prayer: string, value: string) => {
    const numValue = Number.parseInt(value) || 0
    if (numValue < 0) return

    onDateRangesChange(dateRanges.map((range) =>
      range.id === rangeId
        ? {
            ...range,
            incrementValues: {
              ...range.incrementValues,
              [prayer]: numValue,
            },
          }
        : range,
    ))
  }

  const calculateFinalTime = (range: DateRangePrayerTimes, prayer: string): string => {
    const prayerKey = prayer as keyof typeof range.prayerTimes
    const baseTime = range.prayerTimes[prayerKey]
    const mode = range.timeMode[prayerKey]

    if (mode === "static") {
      return baseTime
    } else {
      const increment = range.incrementValues[prayerKey]
      return `Iqama + ${increment}`
    }
  }

  const activeRange = dateRanges.find((range) => range.id === activeSchedule)

  if (dateRanges.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Prayer Schedules Found</h3>
            <p className="text-gray-600 mb-6">Create your first prayer schedule to get started.</p>
            <Button onClick={addDateRange} className="bg-mosque-green hover:bg-mosque-green-light">
              <Plus className="h-4 w-4 mr-2" />
              Create First Schedule
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-mosque-blue" />
                Prayer Time Schedules
              </CardTitle>
              <CardDescription>Manage prayer times for different date ranges</CardDescription>
            </div>
            <Button onClick={addDateRange} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Schedule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Label htmlFor="schedule-select">Select Schedule:</Label>
                <Select value={activeSchedule} onValueChange={onActiveScheduleChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Choose schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateRanges.map((range) => (
                      <SelectItem key={range.id} value={range.id}>
                        {range.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {dateRanges.length > 1 && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:bg-red-50 bg-transparent"
                  onClick={() => removeDateRange(activeSchedule)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Schedule
                </Button>
              )}
            </div>

            {activeRange && (
              <div className="space-y-6">
                {/* Date Range Configuration */}
                <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  {activeRange.startDate && activeRange.endDate && 
                   hasDateOverlap(activeRange.startDate, activeRange.endDate, activeRange.id) && (
                    <div className="md:col-span-3 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">
                            Date Overlap Warning
                          </h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <p>
                              This schedule overlaps with another existing schedule. Please adjust the dates to avoid conflicts.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor={`name-${activeRange.id}`}>Schedule Name</Label>
                    <Input
                      id={`name-${activeRange.id}`}
                      value={activeRange.name}
                      onChange={(e) => updateDateRange(activeRange.id, "name", e.target.value)}
                      placeholder="e.g., Winter Schedule"
                      className={validationErrors.name ? "border-red-500 focus:border-red-500" : ""}
                    />
                    {validationErrors.name && (
                      <p className="text-sm text-red-600">{validationErrors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`start-${activeRange.id}`}>Start Date</Label>
                    <Input
                      id={`start-${activeRange.id}`}
                      type="date"
                      value={activeRange.startDate}
                      onChange={(e) => updateDateRange(activeRange.id, "startDate", e.target.value)}
                      className={validationErrors.startDate ? "border-red-500 focus:border-red-500" : ""}
                    />
                    {validationErrors.startDate && (
                      <p className="text-sm text-red-600">{validationErrors.startDate}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`end-${activeRange.id}`}>End Date</Label>
                    <Input
                      id={`end-${activeRange.id}`}
                      type="date"
                      value={activeRange.endDate}
                      onChange={(e) => updateDateRange(activeRange.id, "endDate", e.target.value)}
                      className={validationErrors.endDate ? "border-red-500 focus:border-red-500" : ""}
                    />
                    {validationErrors.endDate && (
                      <p className="text-sm text-red-600">{validationErrors.endDate}</p>
                    )}
                  </div>
                </div>

                {/* Prayer Times with Toggle and Input */}
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(activeRange.prayerTimes).map(([prayer, time]) => (
                    <div key={prayer} className="space-y-3 p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">
                          {prayerNames[prayer as keyof typeof prayerNames]}
                        </Label>
                        <div className="text-xs text-gray-500">Final: {calculateFinalTime(activeRange, prayer)}</div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={activeRange.timeMode[prayer as keyof typeof activeRange.timeMode] === "increment"}
                            onCheckedChange={(checked) =>
                              handleTimeModeChange(activeRange.id, prayer, checked ? "increment" : "static")
                            }
                          />
                          <span className="text-xs">
                            {activeRange.timeMode[prayer as keyof typeof activeRange.timeMode] === "static"
                              ? "Static Time"
                              : "Increment"}
                          </span>
                        </div>

                        {activeRange.timeMode[prayer as keyof typeof activeRange.timeMode] === "static" ? (
                          <div className="space-y-1">
                            <Label htmlFor={`${prayer}-${activeRange.id}`} className="text-xs">
                              Prayer Time
                            </Label>
                            <Input
                              id={`${prayer}-${activeRange.id}`}
                              type="time"
                              value={time}
                              onChange={(e) => handlePrayerTimeChange(activeRange.id, prayer, e.target.value)}
                              className={`text-sm font-mono ${validationErrors[`prayerTimes.${prayer}`] ? "border-red-500 focus:border-red-500" : ""}`}
                            />
                            {validationErrors[`prayerTimes.${prayer}`] && (
                              <p className="text-xs text-red-600">{validationErrors[`prayerTimes.${prayer}`]}</p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <Label className="text-xs">Minutes after Iqama</Label>
                            <Input
                              type="number"
                              min="0"
                              value={activeRange.incrementValues[prayer as keyof typeof activeRange.incrementValues]}
                              onChange={(e) => handleIncrementValueChange(activeRange.id, prayer, e.target.value)}
                              placeholder="e.g., 5, 10, 15"
                              className={`text-sm font-mono ${validationErrors[`incrementValues.${prayer}`] ? "border-red-500 focus:border-red-500" : ""}`}
                            />
                            {validationErrors[`incrementValues.${prayer}`] && (
                              <p className="text-xs text-red-600">{validationErrors[`incrementValues.${prayer}`]}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{dateRanges.find(range => range.id === scheduleToDelete)?.name || 'this schedule'}&quot;?
              <br /><br />
              This action cannot be undone and will permanently remove this prayer schedule.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete Schedule
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 