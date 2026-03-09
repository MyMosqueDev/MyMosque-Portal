"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Bell, Save } from 'lucide-react'
import { DashboardHeader } from "@/components/dashboard-header"
import { CombinedPrayerSettings, PrayerSchedule } from "@/lib/types"
import {  updateJummahTimes, updatePrayerSettings, getMosqueSettings } from "./actions"
import { ScheduleForm } from "@/components/prayer-times/schedule-form"
import { JummahTimes } from "@/components/prayer-times/jummah-times"
import { PrayerSettings } from "@/components/prayer-times/prayer-settings"
import { MonthlyPrayerTimes } from "@/components/prayer-times/monthly-prayer-times"
import { SettingsSidebar } from "@/components/prayer-times/prayer-settings"
import { LoadingState } from "@/components/prayer-times/loading-state"
import { useToast } from "@/hooks/use-toast"
import useLocalPrayerTimes from "@/hooks/useLocalPrayerTimes"
import useMosqueInfo from "@/hooks/useMosqueInfo"
import { MosqueInfo } from "@/lib/types"

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
  const [schedule, setSchedule] = useState<PrayerSchedule | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mosqueInfo, setMosqueInfo] = useState<MosqueInfo | null>(null)

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

  // Get mosque info for address
  useMosqueInfo({ setMosqueInfo: setMosqueInfo })

  // Get local prayer times using mosque address
  const { prayerTimes: monthlyPrayerTimes, loading: monthlyLoading, error: monthlyError } = useLocalPrayerTimes(
    mosqueInfo?.address || ""
  )

  // Load mosque settings (prayer times, jummah times, and prayer settings)
  useEffect(() => {
    const loadMosqueSettings = async () => {
      try {
        setIsLoadingData(true)
        setError(null)
        
        const result = await getMosqueSettings()


        if (result.success && result.data) {

          const jummahTimes = result.data.jummah_times as JummahTime[]
          const prayerSettings = result.data.prayer_settings.settings as PrayerSettings
          const prayerSchedule = result.data.prayer_settings.schedule as PrayerSchedule

          setJummahTimes(jummahTimes)
          setSettings(prayerSettings)
          setSchedule(prayerSchedule)
          
        } 
      } catch (error) {
        console.error('Error loading mosque settings:', error)
        setError('An unexpected error occurred while loading mosque settings')
      } finally {
        setIsLoadingData(false)
      }
    }

    loadMosqueSettings()
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)
    if (!schedule || !settings) {
      toast({
        title: "No Schedule or Settings",
        description: "Please create a schedule and settings to save.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    const newSettings: CombinedPrayerSettings = {
      schedule: schedule,
      settings: settings,
    }

    try {
        
        const jummahResult = await updateJummahTimes(jummahTimes)
        const settingsResult = await updatePrayerSettings(newSettings)
        
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
          {/* Prayer Times */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <ScheduleForm
              schedule={schedule}
              onScheduleChange={setSchedule}
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
            <MonthlyPrayerTimes
              prayerTimes={monthlyPrayerTimes}
              loading={monthlyLoading}
              error={monthlyError}
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
