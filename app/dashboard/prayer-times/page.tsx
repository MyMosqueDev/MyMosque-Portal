"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Clock, Save, RefreshCw, MapPin, Calendar, Settings } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"

export default function PrayerTimesPage() {
  const [prayerTimes, setPrayerTimes] = useState({
    fajr: "5:30",
    sunrise: "6:45",
    dhuhr: "12:30",
    asr: "3:45",
    maghrib: "6:15",
    isha: "7:30",
  })

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

  const handlePrayerTimeChange = (prayer: string, time: string) => {
    setPrayerTimes((prev) => ({
      ...prev,
      [prayer]: time,
    }))
  }

  const handleJummahTimeChange = (slot: string, time: string) => {
    setJummahTimes((prev) => ({
      ...prev,
      [slot]: time,
    }))
  }

  const handleSettingChange = (setting: string, value: boolean | string) => {
    setSettings((prev) => ({
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
      setPrayerTimes({
        fajr: "5:28",
        sunrise: "6:43",
        dhuhr: "12:32",
        asr: "3:47",
        maghrib: "6:17",
        isha: "7:32",
      })
      setIsLoading(false)
    }, 1500)
  }

  const prayerNames = {
    fajr: "Fajr",
    sunrise: "Sunrise",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
  }

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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Prayer Times */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Prayer Times */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-mosque-blue" />
                  Daily Prayer Times
                </CardTitle>
                <CardDescription>
                  Current prayer times for today,{" "}
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(prayerTimes).map(([prayer, time]) => (
                    <div key={prayer} className="space-y-2">
                      <Label htmlFor={prayer} className="text-base font-medium">
                        {prayerNames[prayer as keyof typeof prayerNames]}
                      </Label>
                      <Input
                        id={prayer}
                        type="time"
                        value={time}
                        onChange={(e) => handlePrayerTimeChange(prayer, e.target.value)}
                        className="text-lg font-mono"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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

          {/* Settings Sidebar */}
          <div className="space-y-6">
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
                        settings.autoUpdate ? "bg-mosque-blue/10 text-mosque-blue" : "bg-gray-100 text-gray-600"
                      }
                    >
                      {settings.autoUpdate ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Notifications</span>
                    <Badge
                      className={
                        settings.sendNotifications
                          ? "bg-mosque-purple/10 text-mosque-purple"
                          : "bg-gray-100 text-gray-600"
                      }
                    >
                      {settings.sendNotifications ? "On" : "Off"}
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
                  <div className="text-lg font-mono text-gray-600 mb-2">6:15 PM</div>
                  <div className="text-sm text-gray-500">in 2 hours 30 minutes</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
