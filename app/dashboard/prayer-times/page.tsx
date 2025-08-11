"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Plus, Trash2, Settings, Bell } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
// Fixed import to use named export instead of default export
import { DashboardHeader } from "@/components/dashboard-header"

interface DateRangePrayerTimes {
  id: string
  name: string
  startDate: string
  endDate: string
  prayerTimes: {
    fajr: string
    sunrise: string
    dhuhr: string
    asr: string
    maghrib: string
    isha: string
  }
  timeMode: {
    fajr: "static" | "increment"
    sunrise: "static" | "increment"
    dhuhr: "static" | "increment"
    asr: "static" | "increment"
    maghrib: "static" | "increment"
    isha: "static" | "increment"
  }
  incrementValues: {
    fajr: number
    sunrise: number
    dhuhr: number
    asr: number
    maghrib: number
    isha: number
  }
}

export default function PrayerTimesPage() {
  const [dateRanges, setDateRanges] = useState<DateRangePrayerTimes[]>([
    {
      id: "1",
      name: "Default Schedule",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      prayerTimes: {
        fajr: "05:30",
        sunrise: "07:00",
        dhuhr: "12:30",
        asr: "15:45",
        maghrib: "18:15",
        isha: "19:30",
      },
      timeMode: {
        fajr: "static",
        sunrise: "static",
        dhuhr: "static",
        asr: "static",
        maghrib: "static",
        isha: "static",
      },
      incrementValues: {
        fajr: 0,
        sunrise: 0,
        dhuhr: 0,
        asr: 0,
        maghrib: 0,
        isha: 0,
      },
    },
  ])

  const [activeSchedule, setActiveSchedule] = useState("1")

  const [jummahTimes, setJummahTimes] = useState({
    first: "1:30",
    second: "2:30",
  })

  const [settings, setSettings] = useState({
    autoUpdate: true,
    sendNotifications: true,
    adjustForDST: true,
    calculationMethod: "ISNA",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [autoCalculate, setAutoCalculate] = useState(true)

  const addDateRange = () => {
    const newRange: DateRangePrayerTimes = {
      id: Date.now().toString(),
      name: `Schedule ${dateRanges.length + 1}`,
      startDate: "",
      endDate: "",
      prayerTimes: {
        fajr: "05:30",
        sunrise: "07:00",
        dhuhr: "12:30",
        asr: "15:45",
        maghrib: "18:15",
        isha: "19:30",
      },
      timeMode: {
        fajr: "static",
        sunrise: "static",
        dhuhr: "static",
        asr: "static",
        maghrib: "static",
        isha: "static",
      },
      incrementValues: {
        fajr: 0,
        sunrise: 0,
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
    if (dateRanges.length > 1) {
      const newRanges = dateRanges.filter((range) => range.id !== id)
      setDateRanges(newRanges)
      if (activeSchedule === id) {
        setActiveSchedule(newRanges[0].id)
      }
    }
  }

  const updateDateRange = (id: string, field: string, value: string) => {
    setDateRanges((ranges) => ranges.map((range) => (range.id === id ? { ...range, [field]: value } : range)))
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
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
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

  const handleJummahTimeChange = (field: string, value: string) => {
    setJummahTimes((prevTimes) => ({ ...prevTimes, [field]: value }))
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

  const hasAssignedPrayerTimes = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return dateRanges.some((range) => {
      if (!range.startDate || !range.endDate) return false
      return dateStr >= range.startDate && dateStr <= range.endDate
    })
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
              Auto Calculate
            </Button>
            <Button onClick={handleSave} className="bg-mosque-green hover:bg-mosque-green-light" disabled={isLoading}>
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Prayer Times with Dropdown */}
          <div className="lg:col-span-2 space-y-6">
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
                  <span className="text-sm text-gray-600">Auto-calculation</span>
                  <Badge variant={autoCalculate ? "default" : "secondary"}>
                    {autoCalculate ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Schedules</span>
                  <Badge variant="outline">{dateRanges.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Next Prayer</span>
                  <span className="text-sm font-medium">Maghrib in 2h 15m</span>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Prayer Time Coverage</span>
                    <span className="text-xs text-gray-500">{currentMonth}</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-xs">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                      <div key={index} className="text-center text-gray-400 font-medium py-1">
                        {day}
                      </div>
                    ))}
                    {heatMapData.map((dayData, index) => (
                      <div
                        key={index}
                        className={`aspect-square rounded-sm flex items-center justify-center text-xs ${
                          dayData === null
                            ? ""
                            : dayData.hasSchedule
                              ? "bg-mosque-green text-white font-medium"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        }`}
                        title={
                          dayData
                            ? `${dayData.date.toLocaleDateString()} - ${dayData.hasSchedule ? "Has schedule" : "No schedule"}`
                            : ""
                        }
                      >
                        {dayData?.day}
                      </div>
                    ))}
                  </div>
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
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Update</Label>
                    <p className="text-sm text-gray-500">Automatically calculate prayer times</p>
                  </div>
                  <Switch
                    checked={settings.autoUpdate}
                    onCheckedChange={(checked) => handleSettingChange("autoUpdate", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Send Notifications</Label>
                    <p className="text-sm text-gray-500">Notify community of time changes</p>
                  </div>
                  <Switch
                    checked={settings.sendNotifications}
                    onCheckedChange={(checked) => handleSettingChange("sendNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daylight Saving</Label>
                    <p className="text-sm text-gray-500">Adjust for daylight saving time</p>
                  </div>
                  <Switch
                    checked={settings.adjustForDST}
                    onCheckedChange={(checked) => handleSettingChange("adjustForDST", checked)}
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

            {/* Next Prayer */}
            <Card>
              <CardHeader>
                <CardTitle>Next Prayer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-mosque-green mb-1">Maghrib</div>
                  <div className="text-lg font-mono text-gray-600 mb-2">
                    {activeRange ? calculateFinalTime(activeRange, "maghrib") : "18:15"} PM
                  </div>
                  <div className="text-sm text-gray-500">in 2 hours 30 minutes</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
