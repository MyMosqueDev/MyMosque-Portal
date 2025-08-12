"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Plus, Trash2, Settings, Bell, Save } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { DashboardHeader } from "@/components/dashboard-header"
import { DateRangePrayerTimes } from "@/lib/types"
import { createPrayerTimes, getPrayerTimes, deletePrayerTimes, updatePrayerTimes, updateJummahTimes, updatePrayerSettings, getMosqueSettings } from "./actions"

export default function PrayerTimesPage() {
  const [dateRanges, setDateRanges] = useState<DateRangePrayerTimes[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null)

  const [activeSchedule, setActiveSchedule] = useState("")

  // Load prayer times on component mount
  useEffect(() => {
    const loadPrayerTimes = async () => {
      try {
        setIsLoadingData(true)
        const prayerTimes = await getPrayerTimes()
        
        if (prayerTimes && !('error' in prayerTimes)) {
            const transformedData = prayerTimes.map((item: any) => ({
              id: item.id?.toString(),
              name: item.name,
              startDate: item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : "",
              endDate: item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : "",
              status: item.status,
            prayerTimes: {
              fajr: item.prayerTimes?.fajr,
              dhuhr: item.prayerTimes?.dhuhr,
              asr: item.prayerTimes?.asr,
              maghrib: item.prayerTimes?.maghrib,
              isha: item.prayerTimes?.isha,
            },
            timeMode: {
              fajr: item.timeMode?.fajr,
              dhuhr: item.timeMode?.dhuhr,
              asr: item.timeMode?.asr,
              maghrib: item.timeMode?.maghrib,
              isha: item.timeMode?.isha,
            },
            incrementValues: {
              fajr: item.incrementValues?.fajr,
              dhuhr: item.incrementValues?.dhuhr,
              asr: item.incrementValues?.asr,
              maghrib: item.incrementValues?.maghrib,
              isha: item.incrementValues?.isha,
            },
          }))
          
          setDateRanges(transformedData)
          console.log(transformedData[0].startDate)
          console.log(transformedData[0].endDate)
          // Set the first schedule as active if we have data
          if (transformedData.length > 0) {
            setActiveSchedule(transformedData[0].id)
          }
        } else {
          console.error('Error loading prayer times:', prayerTimes)
          // Set default empty state
          setDateRanges([])
        }
      } catch (error) {
        console.error('Error loading prayer times:', error)
        setDateRanges([])
      } finally {
        setIsLoadingData(false)
      }
    }

    loadPrayerTimes()
  }, [])

  // Load mosque settings (jummah times and prayer settings)
  useEffect(() => {
    const loadMosqueSettings = async () => {
      try {
        const mosqueData = await getMosqueSettings()
        
        if (mosqueData && !('error' in mosqueData)) {
          // Load jummah times if they exist
          if (mosqueData.jummah_times && Array.isArray(mosqueData.jummah_times)) {
            setJummahTimes(mosqueData.jummah_times)
          }
          
          // Load prayer settings if they exist
          if (mosqueData.prayer_settings) {
            setSettings(prevSettings => ({
              ...prevSettings,
              ...mosqueData.prayer_settings
            }))
          }
        }
      } catch (error) {
        console.error('Error loading mosque settings:', error)
      }
    }

    if (!isLoadingData) {
      loadMosqueSettings()
    }
  }, [isLoadingData])

  const [jummahTimes, setJummahTimes] = useState([
    {
      id: "1",
      name: "First Jummah",
      athan: "01:30",
      iqama: "01:45",
    },
    {
      id: "2", 
      name: "Second Jummah",
      athan: "02:30",
      iqama: "02:45",
    }
  ])

  const [settings, setSettings] = useState({
    autoUpdate: true,
    sendNotifications: true,
    adjustForDST: true,
    hanafiAsr: false,
    calculationMethod: "ISNA",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [autoCalculate, setAutoCalculate] = useState(true)

  // Check if a date range overlaps with existing schedules
  const hasDateOverlap = (startDate: string, endDate: string, excludeId?: string) => {
    if (!startDate || !endDate) return false
    
    const newStart = new Date(startDate)
    const newEnd = new Date(endDate)
    
    return dateRanges.some(range => {
      // Skip the range we're updating (if provided)
      if (excludeId && range.id === excludeId) return false
      
      if (!range.startDate || !range.endDate) return false
      
      const existingStart = new Date(range.startDate)
      const existingEnd = new Date(range.endDate)
      
      // Check for overlap: new range overlaps if it starts before existing ends AND ends after existing starts
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
    }
    setDateRanges([...dateRanges, newRange])
    setActiveSchedule(newRange.id)
  }

  const removeDateRange = (id: string) => {
    setScheduleToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (scheduleToDelete && dateRanges.length > 1) {
      const newRanges = dateRanges.filter((range) => range.id !== scheduleToDelete)
      deletePrayerTimes(scheduleToDelete)
      setDateRanges(newRanges)
      if (activeSchedule === scheduleToDelete) {
        setActiveSchedule(newRanges[0].id)
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
    setDateRanges((ranges) => {
      const updatedRanges = ranges.map((range) => {
        if (range.id === id) {
          const updatedRange = { ...range, [field]: value }
          
          // Check for date overlaps when updating start or end dates
          if ((field === 'startDate' || field === 'endDate') && 
              updatedRange.startDate && updatedRange.endDate) {
            if (hasDateOverlap(updatedRange.startDate, updatedRange.endDate, id)) {
              // Show warning or handle overlap - for now, we'll just log it
              console.warn('Date overlap detected! This schedule overlaps with another existing schedule.')
              // You could add a toast notification here
            }
          }
          
          return updatedRange
        }
        return range
      })
      return updatedRanges
    })
  }

  const handlePrayerTimeChange = (rangeId: string, prayer: string, time: string) => {
    setDateRanges((ranges) =>
      ranges.map((range) =>
        range.id === rangeId
          ? {
              ...range,
              prayerTimes: {
                ...range.prayerTimes,
                [prayer]: time,
              },
            }
          : range,
      ),
    )
  }

  const handleTimeModeChange = (rangeId: string, prayer: string, mode: "static" | "increment") => {
    setDateRanges((ranges) =>
      ranges.map((range) =>
        range.id === rangeId
          ? {
              ...range,
              timeMode: {
                ...range.timeMode,
                [prayer]: mode,
              },
            }
          : range,
      ),
    )
  }

  const handleIncrementValueChange = (rangeId: string, prayer: string, value: string) => {
    const numValue = Number.parseInt(value) || 0
    if (numValue < 0) return // Ensure positive values only

    setDateRanges((ranges) =>
      ranges.map((range) =>
        range.id === rangeId
          ? {
              ...range,
              incrementValues: {
                ...range.incrementValues,
                [prayer]: numValue,
              },
            }
          : range,
      ),
    )
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

  const handleSave = async () => {
    setIsLoading(true)
    
    // Find the currently active schedule
    const currentSchedule = dateRanges.find(range => range.id === activeSchedule)
    
    if (!currentSchedule) {
      console.error('No active schedule found')
      setIsLoading(false)
      return
    }
    
    // Check for date overlaps before saving
    if (currentSchedule.startDate && currentSchedule.endDate && 
        hasDateOverlap(currentSchedule.startDate, currentSchedule.endDate, currentSchedule.id)) {
      console.error('Cannot save schedule with overlapping dates')
      alert('Cannot save schedule: Date range overlaps with another schedule. Please adjust the dates.')
      setIsLoading(false)
      return
    }
    
    console.log('Saving current schedule:', currentSchedule)
    
    try {
      // Check if this is an existing schedule (has a numeric ID from database) or new schedule
      const isExistingSchedule = currentSchedule.id && !isNaN(Number(currentSchedule.id)) && Number(currentSchedule.id) > 0
      
      let result
      if (isExistingSchedule) {
        console.log('Updating existing schedule with ID:', currentSchedule.id)
        result = await updatePrayerTimes(currentSchedule.id, currentSchedule)
      } else {
        console.log('Creating new schedule')
        result = await createPrayerTimes(currentSchedule)
      }
      
      if (result.success) {
        console.log('Schedule saved successfully')
        
        // Also save jummah times and settings
        try {
          await updateJummahTimes(jummahTimes)
          await updatePrayerSettings(settings)
          console.log('Jummah times and settings saved successfully')
        } catch (settingsError) {
          console.error('Error saving jummah times or settings:', settingsError)
        }
        
        setIsLoading(false)
      } else {
        console.error('Failed to save schedule:', result.error)
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Error saving schedule:', error)
      setIsLoading(false)
    }
  }

  const handleAutoCalculate = async () => {
    setIsLoading(true)
    setAutoCalculate(!autoCalculate)
    // Simulate auto-calculation for active tab
    setTimeout(() => {
      const activeRange = dateRanges.find((range) => range.id === activeSchedule)
      if (activeRange) {
        handlePrayerTimeChange(activeSchedule, "fajr", "05:28")
        handlePrayerTimeChange(activeSchedule, "sunrise", "07:00")
        handlePrayerTimeChange(activeSchedule, "dhuhr", "12:32")
        handlePrayerTimeChange(activeSchedule, "asr", "15:47")
        handlePrayerTimeChange(activeSchedule, "maghrib", "18:17")
        handlePrayerTimeChange(activeSchedule, "isha", "19:32")
      }
      setIsLoading(false)
    }, 1500)
  }

  const handleJummahTimeChange = (id: string, field: string, value: string) => {
    setJummahTimes((prevTimes) => 
      prevTimes.map(time => 
        time.id === id ? { ...time, [field]: value } : time
      )
    )
  }

  const addJummahTime = () => {
    const newId = Date.now().toString()
    const newTime = {
      id: newId,
      name: `Jummah ${jummahTimes.length + 1}`,
      athan: "1:30",
      iqama: "1:45",
    }
    setJummahTimes([...jummahTimes, newTime])
  }

  const removeJummahTime = (id: string) => {
    if (jummahTimes.length > 1) {
      setJummahTimes(jummahTimes.filter(time => time.id !== id))
    }
  }

  const handleSettingChange = (field: string, value: boolean | string) => {
    setSettings((prevSettings) => ({ ...prevSettings, [field]: value }))
  }

  const prayerNames = {
    fajr: "Fajr",
    sunrise: "Sunrise",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
  }

  const activeRange = dateRanges.find((range) => range.id === activeSchedule)

  const getScheduleForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return dateRanges.find((range) => {
      if (!range.startDate || !range.endDate) return false
      return dateStr >= range.startDate && dateStr <= range.endDate
    })
  }

  const hasAssignedPrayerTimes = (date: Date) => {
    return getScheduleForDate(date) !== undefined
  }

  const generateHeatMapData = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      days.push({
        day,
        date,
        hasSchedule: hasAssignedPrayerTimes(date),
      })
    }

    return days
  }

  const heatMapData = generateHeatMapData()
  const currentMonth = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })

    // Show loading state while fetching data
  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mosque-green mx-auto mb-4"></div>
              <p className="text-gray-600">Loading prayer schedules...</p>
                      </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{dateRanges.find(range => range.id === scheduleToDelete)?.name || 'this schedule'}"?
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
    </div>
  )
}

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Prayer Times</h1>
            <p className="text-gray-600">Manage prayer times for your mosque</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={handleAutoCalculate} variant="outline" disabled={isLoading}>
              <Bell className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Export
            </Button>
            <Button onClick={handleSave} className="bg-mosque-green hover:bg-mosque-green-light" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />   
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Prayer Times with Dropdown */}
          <div className="lg:col-span-2 space-y-6">
            {dateRanges.length === 0 ? (
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
            ) : (
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
                      <Select value={activeSchedule} onValueChange={setActiveSchedule}>
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

                    {/* Delete button for current schedule */}
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

                  {dateRanges.map((range) =>
                    range.id === activeSchedule ? (
                      <div key={range.id} className="space-y-6">
                        {/* Date Range Configuration */}
                        <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                          {range.startDate && range.endDate && hasDateOverlap(range.startDate, range.endDate, range.id) && (
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
                            <Label htmlFor={`name-${range.id}`}>Schedule Name</Label>
                            <Input
                              id={`name-${range.id}`}
                              value={range.name}
                              onChange={(e) => updateDateRange(range.id, "name", e.target.value)}
                              placeholder="e.g., Winter Schedule"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`start-${range.id}`}>Start Date</Label>
                            <Input
                              id={`start-${range.id}`}
                              type="date"
                              value={range.startDate}
                              onChange={(e) => updateDateRange(range.id, "startDate", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`end-${range.id}`}>End Date</Label>
                            <Input
                              id={`end-${range.id}`}
                              type="date"
                              value={range.endDate}
                              onChange={(e) => updateDateRange(range.id, "endDate", e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Prayer Times with Toggle and Input */}
                        <div className="grid md:grid-cols-2 gap-4">
                          {Object.entries(range.prayerTimes).map(([prayer, time]) => (
                            <div key={prayer} className="space-y-3 p-4 border rounded-lg">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">
                                  {prayerNames[prayer as keyof typeof prayerNames]}
                                </Label>
                                <div className="text-xs text-gray-500">Final: {calculateFinalTime(range, prayer)}</div>
                              </div>

                              <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    checked={range.timeMode[prayer as keyof typeof range.timeMode] === "increment"}
                                    onCheckedChange={(checked) =>
                                      handleTimeModeChange(range.id, prayer, checked ? "increment" : "static")
                                    }
                                  />
                                  <span className="text-xs">
                                    {range.timeMode[prayer as keyof typeof range.timeMode] === "static"
                                      ? "Static Time"
                                      : "Increment"}
                                  </span>
                                </div>

                                {range.timeMode[prayer as keyof typeof range.timeMode] === "static" ? (
                                  <div className="space-y-1">
                                    <Label htmlFor={`${prayer}-${range.id}`} className="text-xs">
                                      Prayer Time
                                    </Label>
                                    <Input
                                      id={`${prayer}-${range.id}`}
                                      type="time"
                                      value={time}
                                      onChange={(e) => handlePrayerTimeChange(range.id, prayer, e.target.value)}
                                      className="text-sm font-mono"
                                    />
                                  </div>
                                ) : (
                                  <div className="space-y-1">
                                    <Label className="text-xs">Minutes after Iqama</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      value={range.incrementValues[prayer as keyof typeof range.incrementValues]}
                                      onChange={(e) => handleIncrementValueChange(range.id, prayer, e.target.value)}
                                      placeholder="e.g., 5, 10, 15"
                                      className="text-sm font-mono"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null,
                  )}
                </div>
              </CardContent>
            </Card>
            )}

            {/* Jummah Times - Outside of tabs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-mosque-green" />
                  Jummah Prayer Times
                </CardTitle>
                <CardDescription>Friday prayer times for your mosque (applies to all schedules)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jummahTimes.map((jummah) => (
                    <div key={jummah.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-base font-medium">{jummah.name}</Label>
                        {jummahTimes.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeJummahTime(jummah.id)}
                            className="text-red-600 hover:bg-red-50 h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`athan-${jummah.id}`} className="text-sm">
                            Athan Time
                          </Label>
                          <Input
                            id={`athan-${jummah.id}`}
                            type="time"
                            value={jummah.athan}
                            onChange={(e) => handleJummahTimeChange(jummah.id, "athan", e.target.value)}
                            className="text-sm font-mono"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`iqama-${jummah.id}`} className="text-sm">
                            Iqama Time
                          </Label>
                          <Input
                            id={`iqama-${jummah.id}`}
                            type="time"
                            value={jummah.iqama}
                            onChange={(e) => handleJummahTimeChange(jummah.id, "iqama", e.target.value)}
                            className="text-sm font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={addJummahTime}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Jummah Time
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Location Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-mosque-purple" />
                  Location Information
                </CardTitle>
                <CardDescription>Location details for prayer time calculations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input id="latitude" placeholder="30.2672" defaultValue="30.2672" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input id="longitude" placeholder="-97.7431" defaultValue="-97.7431" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input id="timezone" placeholder="America/Chicago" defaultValue="America/Chicago" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="1906 Nueces St, Austin, TX 78705"
                      defaultValue="1906 Nueces St, Austin, TX 78705"
                      disabled
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Location information is automatically detected. Contact support to update.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Quick Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Schedules</span>
                  <Badge variant="outline">{dateRanges.length}</Badge>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Prayer Time Coverage</span>
                    <span className="text-xs text-gray-500">{currentMonth}</span>
                  </div>
                  <TooltipProvider>
                    <div className="grid grid-cols-7 gap-1 text-xs">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                          <div key={index} className="text-center text-gray-400 font-medium py-1">
                            {day}
                          </div>
                        ))}
                        {heatMapData.map((dayData, index) => {
                          if (dayData === null) {
                            return <div key={index}></div>
                          }
                          
                          const schedule = getScheduleForDate(dayData.date)
                          const isFriday = dayData.date.getDay() === 5
                          
                          return (
                            <Tooltip key={index}>
                              <TooltipTrigger asChild>
                                <div
                                  className={`aspect-square rounded-sm flex items-center justify-center text-xs cursor-pointer ${
                                    dayData.hasSchedule
                                      ? "bg-mosque-green text-white font-medium"
                                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                  }`}
                                >
                                  {dayData.day}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs animate-in fade-in-0 duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-150">
                                <div className="space-y-2">
                                  <div className="font-medium text-sm">
                                    {dayData.date.toLocaleDateString('en-US', { 
                                      weekday: 'long', 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}
                                  </div>
                                  
                                  {schedule ? (
                                    <div className="space-y-1">
                                      <div className="text-xs text-gray-500 font-medium">
                                        Schedule: {schedule.name}
                                      </div>
                                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                        {Object.entries(schedule.prayerTimes).map(([prayer, time]) => (
                                          <div key={prayer} className="flex justify-between">
                                            <span className="text-gray-600">
                                              {prayerNames[prayer as keyof typeof prayerNames]}:
                                            </span>
                                            <span className="font-mono font-medium">
                                              {calculateFinalTime(schedule, prayer)}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                      {isFriday && (
                                        <div className="pt-1 border-t border-gray-200">
                                          <div className="text-xs text-gray-500 font-medium">Jummah Times:</div>
                                          <div className="space-y-1 text-xs">
                                            {jummahTimes.map((jummah) => (
                                              <div key={jummah.id} className="flex justify-between">
                                                <span className="text-gray-600">{jummah.name}:</span>
                                                <span className="font-mono font-medium">{jummah.athan} (Athan) / {jummah.iqama} (Iqama)</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="text-xs text-gray-500">
                                      No prayer schedule assigned for this date
                                    </div>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          )
                        })}
                      </div>
                    </TooltipProvider>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-mosque-green rounded-sm"></div>
                      <span>Scheduled</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
                      <span>No schedule</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Update</Label>
                    <p className="text-sm text-gray-500">Automatically calculate prayer times</p>
                  </div>
                  <Switch
                    checked={settings.autoUpdate}
                    onCheckedChange={(checked) => handleSettingChange("autoUpdate", checked)}
                  />
                </div> */}

                {/* <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Send Notifications</Label>
                    <p className="text-sm text-gray-500">Notify community of time changes</p>
                  </div>
                  <Switch
                    checked={settings.sendNotifications}
                    onCheckedChange={(checked) => handleSettingChange("sendNotifications", checked)}
                  />
                </div> */}

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Hanafi Asr Times</Label>
                    <p className="text-sm text-gray-500">Use Hanafi calculation method for Asr prayer times</p>
                  </div>
                  <Switch
                    checked={settings.hanafiAsr}
                    onCheckedChange={(checked) => handleSettingChange("hanafiAsr", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calculation-method">Calculation Method</Label>
                  <select
                    id="calculation-method"
                    value={settings.calculationMethod}
                    onChange={(e) => handleSettingChange("calculationMethod", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mosque-green"
                  >
                    <option value="ISNA">ISNA (Islamic Society of North America)</option>
                    <option value="MWL">MWL (Muslim World League)</option>
                    <option value="EGYPT">Egyptian General Authority</option>
                    <option value="MAKKAH">Umm Al-Qura University, Makkah</option>
                    <option value="KARACHI">University of Islamic Sciences, Karachi</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{dateRanges.find(range => range.id === scheduleToDelete)?.name || 'this schedule'}"?
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
    </div>
  )
}
