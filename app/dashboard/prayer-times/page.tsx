"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Bell, Save } from 'lucide-react'
import { DashboardHeader } from "@/components/dashboard-header"
import { DateRangePrayerTimes } from "@/lib/types"
import { createPrayerTimes, getPrayerTimes, updatePrayerTimes, updateJummahTimes, updatePrayerSettings, getMosqueSettings } from "./actions"
import { ScheduleForm } from "@/components/prayer-times/schedule-form"
import { JummahTimes } from "@/components/prayer-times/jummah-times"
import { PrayerSettings } from "@/components/prayer-times/prayer-settings"
import { StatusHeatmap } from "@/components/prayer-times/status-heatmap"
import { SettingsSidebar } from "@/components/prayer-times/prayer-settings"
import { LoadingState } from "@/components/prayer-times/loading-state"
import { useToast } from "@/hooks/use-toast"

interface JummahTime {
  id: string
  name: string
  athan: string
  iqama: string
}

interface PrayerSettings {
  autoUpdate: boolean
  sendNotifications: boolean
  adjustForDST: boolean
  hanafiAsr: boolean
  calculationMethod: string
}

export default function PrayerTimesPage() {
  const [dateRanges, setDateRanges] = useState<DateRangePrayerTimes[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [activeSchedule, setActiveSchedule] = useState("")
  const [error, setError] = useState<string | null>(null)

  const [jummahTimes, setJummahTimes] = useState<JummahTime[]>([
    {"id": "1", "name": "First Jummah", "athan": "13:30", "iqama": "13:45"}, 
    {"id": "2", "name": "Second Jummah", "athan": "14:30", "iqama": "14:45"}
  ])

  const [settings, setSettings] = useState<PrayerSettings>({
    autoUpdate: true,
    sendNotifications: true,
    adjustForDST: true,
    hanafiAsr: false,
    calculationMethod: "ISNA",
  })

  const { toast } = useToast()

  // Load prayer times on component mount
  useEffect(() => {
    const loadPrayerTimes = async () => {
      try {
        setIsLoadingData(true)
        setError(null)
        
        const result = await getPrayerTimes()
        
        if (result.success && result.data) {
          const transformedData = result.data.map((item: DateRangePrayerTimes) => ({
            id: item.id?.toString(),
            name: item.name,
            startDate: item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : "",
            endDate: item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : "",
            status: item.status,
            prayerTimes: {
              fajr: item.prayerTimes?.fajr || "05:30",
              dhuhr: item.prayerTimes?.dhuhr || "12:30",
              asr: item.prayerTimes?.asr || "15:45",
              maghrib: item.prayerTimes?.maghrib || "18:15",
              isha: item.prayerTimes?.isha || "19:30",
            },
            timeMode: {
              fajr: item.timeMode?.fajr || "static",
              dhuhr: item.timeMode?.dhuhr || "static",
              asr: item.timeMode?.asr || "static",
              maghrib: item.timeMode?.maghrib || "static",
              isha: item.timeMode?.isha || "static",
            },
            incrementValues: {
              fajr: item.incrementValues?.fajr || 0,
              dhuhr: item.incrementValues?.dhuhr || 0,
              asr: item.incrementValues?.asr || 0,
              maghrib: item.incrementValues?.maghrib || 0,
              isha: item.incrementValues?.isha || 0,
            },
            isNew: false, // Mark as existing schedule from database
          }))
          
          setDateRanges(transformedData)
          
          // Set the first schedule as active if we have data
          if (transformedData.length > 0) {
            setActiveSchedule(transformedData[0].id)
          }
        } else {
          console.error('Error loading prayer times:', result.error)
          setError(result.error || 'Failed to load prayer times')
          setDateRanges([])
        }
      } catch (error) {
        console.error('Error loading prayer times:', error)
        setError('An unexpected error occurred while loading prayer times')
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
        const result = await getMosqueSettings()
        
        if (result.success && result.data) {
          // Load jummah times if they exist
          if (result.data.jummah_times && Array.isArray(result.data.jummah_times)) {
            setJummahTimes(result.data.jummah_times)
          }
          
          // Load prayer settings if they exist
          if (result.data.prayer_settings) {
            setSettings(prevSettings => ({
              ...prevSettings,
              ...result.data.prayer_settings
            }))
          }
        } else {
          console.error('Error loading mosque settings:', result.error)
          // Don't set error here as it's not critical
        }
      } catch (error) {
        console.error('Error loading mosque settings:', error)
        // Don't set error here as it's not critical
      }
    }

    if (!isLoadingData) {
      loadMosqueSettings()
    }
  }, [isLoadingData])

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Find the currently active schedule
      const currentSchedule = dateRanges.find(range => range.id === activeSchedule)
      
      if (!currentSchedule) {
        toast({
          title: "No Active Schedule",
          description: "Please select a schedule to save.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
      
      // Check if this is a new schedule or existing one
      const isNewSchedule = currentSchedule.isNew === true
      
      let result
      if (isNewSchedule) {
        result = await createPrayerTimes(currentSchedule)
      } else {
        result = await updatePrayerTimes(currentSchedule.id, currentSchedule)
      }
      
      if (result.success) {
        // If it was a new schedule and successfully created, update the local state
        if (isNewSchedule && result.data) {
          // Transform the returned data to match our format
          const savedSchedule = {
            id: result.data.id?.toString(),
            name: result.data.name,
            startDate: result.data.startDate ? new Date(result.data.startDate).toISOString().split('T')[0] : "",
            endDate: result.data.endDate ? new Date(result.data.endDate).toISOString().split('T')[0] : "",
            status: result.data.status,
            prayerTimes: {
              fajr: result.data.prayerTimes?.fajr || "05:30",
              dhuhr: result.data.prayerTimes?.dhuhr || "12:30",
              asr: result.data.prayerTimes?.asr || "15:45",
              maghrib: result.data.prayerTimes?.maghrib || "18:15",
              isha: result.data.prayerTimes?.isha || "19:30",
            },
            timeMode: {
              fajr: result.data.timeMode?.fajr || "static",
              dhuhr: result.data.timeMode?.dhuhr || "static",
              asr: result.data.timeMode?.asr || "static",
              maghrib: result.data.timeMode?.maghrib || "static",
              isha: result.data.timeMode?.isha || "static",
            },
            incrementValues: {
              fajr: result.data.incrementValues?.fajr || 0,
              dhuhr: result.data.incrementValues?.dhuhr || 0,
              asr: result.data.incrementValues?.asr || 0,
              maghrib: result.data.incrementValues?.maghrib || 0,
              isha: result.data.incrementValues?.isha || 0,
            },
            isNew: false, // Mark as saved
          }
          
          // Update the schedule in local state and keep the same active schedule
          setDateRanges(prevRanges => 
            prevRanges.map(range => 
              range.id === currentSchedule.id 
                ? savedSchedule
                : range
            )
          )
          
          // Update the active schedule ID to the new database ID
          setActiveSchedule(savedSchedule.id)
        }
        
        // Also save jummah times and settings
        const jummahResult = await updateJummahTimes(jummahTimes)
        const settingsResult = await updatePrayerSettings(settings)
        
        if (jummahResult.success && settingsResult.success) {
          toast({
            title: "Success",
            description: "All changes saved successfully.",
          })
        } else {
          toast({
            title: "Partial Success",
            description: "Schedule saved but some settings may not have been updated.",
            variant: "default",
          })
        }
      } else {
        if (result.errors) {
          // Handle validation errors
          const errorMessages = result.errors.map(err => err.message).join(', ')
          toast({
            title: "Validation Error",
            description: errorMessages,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Save Failed",
            description: result.error || "Failed to save schedule. Please try again.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error('Error saving schedule:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while fetching data
  if (isLoadingData) {
    return <LoadingState />
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
              <p className="text-sm md:text-base text-gray-600 mb-6">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-mosque-green hover:bg-mosque-green-light h-10 md:h-11 text-sm md:text-base"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Prayer Times</h1>
            <p className="text-sm md:text-base text-gray-600">Manage prayer times for your mosque</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" disabled className="h-10 md:h-11 text-sm md:text-base">
                  <Bell className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Coming soon!</p>
              </TooltipContent>
            </Tooltip>
            <Button 
              onClick={handleSave} 
              className="bg-mosque-green hover:bg-mosque-green-light h-10 md:h-11 text-sm md:text-base" 
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />   
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Prayer Times with Dropdown */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <ScheduleForm
              dateRanges={dateRanges}
              activeSchedule={activeSchedule}
              onDateRangesChange={setDateRanges}
              onActiveScheduleChange={setActiveSchedule}
              onSave={handleSave}
              isLoading={isLoading}
            />

            <JummahTimes
              jummahTimes={jummahTimes}
              onJummahTimesChange={setJummahTimes}
            />

            <PrayerSettings
              settings={settings}
              onSettingsChange={setSettings}
            />
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-4 md:space-y-6">
            <StatusHeatmap
              dateRanges={dateRanges}
              jummahTimes={jummahTimes}
            />

            <SettingsSidebar
              settings={settings}
              onSettingsChange={setSettings}
            />
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 md:p-8 shadow-xl mx-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mosque-green mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm md:text-base">Saving changes...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
