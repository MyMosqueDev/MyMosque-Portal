"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Save, RefreshCw, MapPin, Calendar, Settings, Plus, X } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"

interface PrayerTimeSetting {
  id: string
  name: string
  dateRange: {
    startDate: string
    endDate: string
  }
  prayerTimes: {
    fajr: string
    dhuhr: string
    asr: string
    maghrib: string
    isha: string
  }
  prayerIncrements: {
    fajr: string
    dhuhr: string
    asr: string
    maghrib: string
    isha: string
  }
  useIncrements: {
    fajr: boolean
    dhuhr: boolean
    asr: boolean
    maghrib: boolean
    isha: boolean
  }
}

export default function PrayerTimesPage() {
  const [settings, setSettings] = useState<PrayerTimeSetting[]>(() => {
    const startDate = new Date().toISOString().split('T')[0]
    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const formatDateRange = (startDate: string, endDate: string) => {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const startFormatted = `${(start.getMonth() + 1).toString().padStart(2, '0')}/${start.getDate().toString().padStart(2, '0')}`
      const endFormatted = `${(end.getMonth() + 1).toString().padStart(2, '0')}/${end.getDate().toString().padStart(2, '0')}`
      return `(${startFormatted} - ${endFormatted})`
    }
    
    return [{
      id: "1",
      name: formatDateRange(startDate, endDate),
      dateRange: {
        startDate,
        endDate,
      },
      prayerTimes: {
        fajr: "05:30",
        dhuhr: "12:30",
        asr: "03:45",
        maghrib: "06:15",
        isha: "07:30",
      },
      prayerIncrements: {
        fajr: "+0",
        dhuhr: "+0",
        asr: "+0",
        maghrib: "+0",
        isha: "+0",
      },
      useIncrements: {
        fajr: false,
        dhuhr: false,
        asr: false,
        maghrib: false,
        isha: false,
      },
    }]
  })

  const [activeTab, setActiveTab] = useState("1")

  const [jummahTimes, setJummahTimes] = useState({
    first: "01:30",
    second: "02:30",
  })

  const [globalSettings, setGlobalSettings] = useState({
    autoUpdate: true,
    sendNotifications: true,
    adjustForDST: true,
    calculationMethod: "ISNA",
  })

  const [isLoading, setIsLoading] = useState(false)

  const getCurrentSetting = () => {
    return settings.find(s => s.id === activeTab) || settings[0]
  }

  const updateCurrentSetting = (updates: Partial<PrayerTimeSetting>) => {
    setSettings(prev => prev.map(s => 
      s.id === activeTab ? { ...s, ...updates } : s
    ))
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) {
      return "(Select Dates)"
    }
    const start = new Date(startDate)
    const end = new Date(endDate)
    const startFormatted = `${(start.getMonth() + 1).toString().padStart(2, '0')}/${start.getDate().toString().padStart(2, '0')}`
    const endFormatted = `${(end.getMonth() + 1).toString().padStart(2, '0')}/${end.getDate().toString().padStart(2, '0')}`
    return `(${startFormatted} - ${endFormatted})`
  }

  const addNewSetting = () => {
    const newId = Date.now().toString()
    const newSetting: PrayerTimeSetting = {
      id: newId,
      name: "(Select Dates)",
      dateRange: {
        startDate: "",
        endDate: "",
      },
      prayerTimes: {
        fajr: "",
        dhuhr: "",
        asr: "",
        maghrib: "",
        isha: "",
      },
      prayerIncrements: {
        fajr: "+",
        dhuhr: "+",
        asr: "+",
        maghrib: "+",
        isha: "+",
      },
      useIncrements: {
        fajr: false,
        dhuhr: false,
        asr: false,
        maghrib: false,
        isha: false,
      },
    }
    setSettings(prev => [...prev, newSetting])
    setActiveTab(newId)
  }

  const deleteSetting = (id: string) => {
    if (settings.length === 1) return // Don't delete the last setting
    setSettings(prev => prev.filter(s => s.id !== id))
    if (activeTab === id) {
      setActiveTab(settings[0].id)
    }
  }

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    const current = getCurrentSetting()
    const newDateRange = {
      ...current.dateRange,
      [field]: value,
    }
    updateCurrentSetting({
      dateRange: newDateRange,
      name: formatDateRange(newDateRange.startDate, newDateRange.endDate)
    })
  }

  const handlePrayerTimeChange = (prayer: string, time: string) => {
    const current = getCurrentSetting()
    updateCurrentSetting({
      prayerTimes: {
        ...current.prayerTimes,
        [prayer]: time,
      }
    })
  }

  const handlePrayerIncrementChange = (prayer: string, increment: string) => {
    // Only allow numbers and automatically add + prefix
    const numbersOnly = increment.replace(/[^0-9]/g, '')
    const formattedIncrement = numbersOnly ? `+${numbersOnly}` : '+'
    const current = getCurrentSetting()
    updateCurrentSetting({
      prayerIncrements: {
        ...current.prayerIncrements,
        [prayer]: formattedIncrement,
      }
    })
  }

  const handleIncrementToggle = (prayer: string, useIncrement: boolean) => {
    const current = getCurrentSetting()
    updateCurrentSetting({
      useIncrements: {
        ...current.useIncrements,
        [prayer]: useIncrement,
      }
    })
  }

  const handleSettingNameChange = (name: string) => {
    updateCurrentSetting({ name })
  }

  const handleJummahTimeChange = (slot: string, time: string) => {
    setJummahTimes((prev) => ({
      ...prev,
      [slot]: time,
    }))
  }

  const handleSettingChange = (setting: string, value: boolean | string) => {
    setGlobalSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleAutoCalculate = async () => {
    setIsLoading(true)
    // Simulate auto-calculation
    setTimeout(() => {
      const current = getCurrentSetting()
      updateCurrentSetting({
        prayerTimes: {
          fajr: "5:28",
          dhuhr: "12:32",
          asr: "3:47",
          maghrib: "6:17",
          isha: "7:32",
        },
        prayerIncrements: {
          fajr: "+0",
          dhuhr: "+0",
          asr: "+0",
          maghrib: "+0",
          isha: "+0",
        },
        useIncrements: {
          fajr: false,
          dhuhr: false,
          asr: false,
          maghrib: false,
          isha: false,
        },
      })
      setIsLoading(false)
    }, 1500)
  }

  const prayerNames = {
    fajr: "Fajr",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
  }

  const currentSetting = getCurrentSetting()
  
  // Calculate the number of days in the date range
  const startDate = new Date(currentSetting.dateRange.startDate)
  const endDate = new Date(currentSetting.dateRange.endDate)
  const daysInRange = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Prayer Times</h1>
            <p className="text-gray-600">Manage prayer times for your mosque</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={handleAutoCalculate} variant="outline" disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Auto Calculate
            </Button>
            <Button onClick={handleSave} className="bg-mosque-green hover:bg-mosque-green-light" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Unified Container - Left side (3/4 width) */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <TabsList>
                        {settings.map(setting => (
                          <TabsTrigger key={setting.id} value={setting.id} className="flex items-center space-x-2">
                            <span>{setting.name}</span>
                            <Badge variant="secondary" className="ml-1">
                              {Math.ceil((new Date(setting.dateRange.endDate).getTime() - new Date(setting.dateRange.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                            </Badge>
                            {settings.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteSetting(setting.id)
                                }}
                                className="h-4 w-4 p-0 ml-1 hover:bg-red-100 hover:text-red-600"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </TabsTrigger>
                        ))}
                        <Button variant="ghost" onClick={addNewSetting}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </TabsList>
                    </div>
                  </div>
                  {settings.map(setting => (
                    <TabsContent key={setting.id} value={setting.id} className="space-y-6">
                      {/* Date Range */}
                      <div>
                        <div className="flex items-center mb-4">
                          <Calendar className="h-5 w-5 mr-2 text-mosque-blue" />
                          <h3 className="text-lg font-semibold">Date Range</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          Select the date range for these prayer times ({daysInRange} days)
                        </p>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="start-date" className="text-base font-medium">
                              Start Date
                            </Label>
                            <Input
                              id="start-date"
                              type="date"
                              value={setting.dateRange.startDate}
                              onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                              className="text-lg"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="end-date" className="text-base font-medium">
                              End Date
                            </Label>
                            <Input
                              id="end-date"
                              type="date"
                              value={setting.dateRange.endDate}
                              onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                              className="text-lg"
                            />
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">
                            <strong>Note:</strong> {setting.dateRange.startDate && setting.dateRange.endDate 
                              ? `These prayer times will be applied to all days from ${new Date(setting.dateRange.startDate).toLocaleDateString()} to ${new Date(setting.dateRange.endDate).toLocaleDateString()}.`
                              : "Please select a start and end date for this prayer schedule."
                            }
                          </p>
                        </div>
                      </div>

                      {/* Daily Prayer Times */}
                      <div>
                        <div className="flex items-center mb-4">
                          <Clock className="h-5 w-5 mr-2 text-mosque-blue" />
                          <h3 className="text-lg font-semibold">Daily Prayer Times</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          Prayer times for the selected date range
                        </p>
                        <div className="grid md:grid-cols-2 gap-6">
                          {Object.entries(setting.prayerTimes).map(([prayer, time]) => (
                            <div key={prayer} className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label htmlFor={prayer} className="text-base font-medium">
                                  {prayerNames[prayer as keyof typeof prayerNames]}
                                </Label>
                                <div className="flex items-center space-x-2">
                                  <span className={`text-xs ${!setting.useIncrements[prayer as keyof typeof setting.useIncrements] ? 'text-mosque-blue font-medium' : 'text-gray-500'}`}>
                                    Time
                                  </span>
                                  <Switch
                                    checked={setting.useIncrements[prayer as keyof typeof setting.useIncrements]}
                                    onCheckedChange={(checked) => handleIncrementToggle(prayer, checked)}
                                    className="scale-75"
                                  />
                                  <span className={`text-xs ${setting.useIncrements[prayer as keyof typeof setting.useIncrements] ? 'text-mosque-blue font-medium' : 'text-gray-500'}`}>
                                    Increment
                                  </span>
                                </div>
                              </div>
                              
                              {setting.useIncrements[prayer as keyof typeof setting.useIncrements] ? (
                                <div className="relative">
                                  <Input
                                    id={`${prayer}-increment`}
                                    type="text"
                                    value={setting.prayerIncrements[prayer as keyof typeof setting.prayerIncrements]}
                                    onChange={(e) => handlePrayerIncrementChange(prayer, e.target.value)}
                                    placeholder="+5"
                                    className="text-lg font-mono pr-12"
                                  />
                                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                    min
                                  </span>
                                </div>
                              ) : (
                                <Input
                                  id={prayer}
                                  type="time"
                                  value={time}
                                  onChange={(e) => handlePrayerTimeChange(prayer, e.target.value)}
                                  className="text-lg font-mono"
                                />
                              )}
                              
                              {setting.useIncrements[prayer as keyof typeof setting.useIncrements] && (
                                <p className="text-xs text-gray-500">
                                  Enter number of minutes to add (e.g., 5 for +5 minutes)
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Settings Sidebar - Right side (1/4 width) */}
          <div className="space-y-4">
              {/* Quick Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Updated</span>
                      <Badge className="bg-mosque-green/10 text-mosque-green">Just now</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Auto Calculation</span>
                      <Badge
                        className={
                          globalSettings.autoUpdate ? "bg-mosque-blue/10 text-mosque-blue" : "bg-gray-100 text-gray-600"
                        }
                      >
                        {globalSettings.autoUpdate ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Notifications</span>
                      <Badge
                        className={
                          globalSettings.sendNotifications
                            ? "bg-mosque-purple/10 text-mosque-purple"
                            : "bg-gray-100 text-gray-600"
                        }
                      >
                        {globalSettings.sendNotifications ? "On" : "Off"}
                      </Badge>
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
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Update</Label>
                      <p className="text-sm text-gray-500">Automatically calculate prayer times</p>
                    </div>
                    <Switch
                      checked={globalSettings.autoUpdate}
                      onCheckedChange={(checked) => handleSettingChange("autoUpdate", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Send Notifications</Label>
                      <p className="text-sm text-gray-500">Notify community of time changes</p>
                    </div>
                    <Switch
                      checked={globalSettings.sendNotifications}
                      onCheckedChange={(checked) => handleSettingChange("sendNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Daylight Saving</Label>
                      <p className="text-sm text-gray-500">Adjust for daylight saving time</p>
                    </div>
                    <Switch
                      checked={globalSettings.adjustForDST}
                      onCheckedChange={(checked) => handleSettingChange("adjustForDST", checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="calculation-method">Calculation Method</Label>
                    <select
                      id="calculation-method"
                      value={globalSettings.calculationMethod}
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

              {/* Next Prayer */}
              <Card>
                <CardHeader>
                  <CardTitle>Next Prayer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-mosque-green mb-1">Maghrib</div>
                    <div className="text-lg font-mono text-gray-600 mb-2">6:15 PM</div>
                    <div className="text-sm text-gray-500">in 2 hours 30 minutes</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        {/* Jummah Times and Location Info - Below everything */}
        <div className="mt-8 space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Jummah Times */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-mosque-green" />
                  Jummah Prayer Times
                </CardTitle>
                <CardDescription>Friday prayer times for your mosque</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first-jummah" className="text-base font-medium">
                      First Jummah
                    </Label>
                    <Input
                      id="first-jummah"
                      type="time"
                      value={jummahTimes.first}
                      onChange={(e) => handleJummahTimeChange("first", e.target.value)}
                      className="text-lg font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="second-jummah" className="text-base font-medium">
                      Second Jummah
                    </Label>
                    <Input
                      id="second-jummah"
                      type="time"
                      value={jummahTimes.second}
                      onChange={(e) => handleJummahTimeChange("second", e.target.value)}
                      className="text-lg font-mono"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-mosque-purple" />
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
        </div>
      </main>
    </div>
  )
}
