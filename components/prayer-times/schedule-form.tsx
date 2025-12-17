"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Clock } from 'lucide-react'
import { PrayerSchedule } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { validatePrayerScheduleData } from "@/lib/validation"

interface ScheduleFormProps {
  schedule: PrayerSchedule | null
  onScheduleChange: (schedule: PrayerSchedule | null) => void
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

const PRAYER_ORDER: Array<keyof typeof prayerNames> = ["fajr", "dhuhr", "asr", "maghrib", "isha"]

export function ScheduleForm({
  schedule,
  onScheduleChange,
}: ScheduleFormProps) {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  // Validate schedule and update error state
  useEffect(() => {
    if (schedule) {
      const errors: Record<string, string> = {}
      
      // Validate schedule
      const scheduleValidation = validatePrayerScheduleData(schedule)
      if (!scheduleValidation.isValid) {
        scheduleValidation.errors.forEach(error => {
          errors[error.field] = error.message
        })
      }
      
      setValidationErrors(errors)
    }
  }, [schedule])


  const handlePrayerTimeChange = (prayer: string, time: string) => {
    if (!schedule) return
    
    onScheduleChange({
      ...schedule,
      prayerTimes: {
        ...schedule.prayerTimes,
        [prayer]: time,
      },
    })
  }

  const handleTimeModeChange = (prayer: string, mode: "static" | "increment") => {
    if (!schedule) return
    
    onScheduleChange({
      ...schedule,
      timeMode: {
        ...schedule.timeMode,
        [prayer]: mode,
      },
    })
  }

  const handleIncrementValueChange = (prayer: string, value: string) => {
    if (!schedule) return
    
    const numValue = Number.parseInt(value) || 0
    if (numValue < 0) return

    onScheduleChange({
      ...schedule,
      incrementValues: {
        ...schedule.incrementValues,
        [prayer]: numValue,
      },
    })
  }

  const calculateFinalTime = (prayer: string): string => {
    if (!schedule) return ""
    
    const prayerKey = prayer as keyof typeof schedule.prayerTimes
    const baseTime = schedule.prayerTimes[prayerKey]
    const mode = schedule.timeMode[prayerKey]

    if (mode === "static") {
      return baseTime
    } else {
      const increment = schedule.incrementValues[prayerKey]
      return `Iqama + ${increment}`
    }
  }

  if (!schedule) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Prayer Schedule Found</h3>
            <p className="text-gray-600 mb-6">Please wait while the schedule loads.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-mosque-blue" />
            Prayer Time Schedule
          </CardTitle>
          <CardDescription>Manage your prayer times schedule</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Prayer Times with Toggle and Input */}
          <div className="grid md:grid-cols-2 gap-4">
            {PRAYER_ORDER.map((prayer) => (
              <div key={prayer} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    {prayerNames[prayer as keyof typeof prayerNames]}
                  </Label>
                  <div className="text-xs text-gray-500">Final: {calculateFinalTime(prayer)}</div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={schedule.timeMode[prayer as keyof typeof schedule.timeMode] === "increment"}
                      onCheckedChange={(checked) =>
                        handleTimeModeChange(prayer, checked ? "increment" : "static")
                      }
                    />
                    <span className="text-xs">
                      {schedule.timeMode[prayer as keyof typeof schedule.timeMode] === "static"
                        ? "Static Time"
                        : "Increment"}
                    </span>
                  </div>

                  {schedule.timeMode[prayer as keyof typeof schedule.timeMode] === "static" ? (
                    <div className="space-y-1">
                      <Label htmlFor={`${prayer}-time`} className="text-xs">
                        Prayer Time
                      </Label>
                      <Input
                        id={`${prayer}-time`}
                        type="time"
                        value={schedule.prayerTimes[prayer]}
                        onChange={(e) => handlePrayerTimeChange(prayer, e.target.value)}
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
                        value={schedule.incrementValues[prayer as keyof typeof schedule.incrementValues]}
                        onChange={(e) => handleIncrementValueChange(prayer, e.target.value)}
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
      </CardContent>
    </Card>
  )
} 