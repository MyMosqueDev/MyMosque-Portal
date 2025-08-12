"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Bell } from 'lucide-react'

interface PrayerSettings {
  autoUpdate: boolean
  sendNotifications: boolean
  adjustForDST: boolean
  hanafiAsr: boolean
  calculationMethod: string
}

interface PrayerSettingsProps {
  settings: PrayerSettings
  onSettingsChange: (settings: PrayerSettings) => void
}

export function PrayerSettings({ settings, onSettingsChange }: PrayerSettingsProps) {

  return (
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
  )
}

export function SettingsSidebar({ settings, onSettingsChange }: PrayerSettingsProps) {
  const handleSettingChange = (field: string, value: boolean | string) => {
    onSettingsChange({ ...settings, [field]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
  )
} 