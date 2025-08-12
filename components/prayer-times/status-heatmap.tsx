"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { DateRangePrayerTimes } from "@/lib/types"

interface JummahTime {
  id: string
  name: string
  athan: string
  iqama: string
}

interface StatusHeatmapProps {
  dateRanges: DateRangePrayerTimes[]
  jummahTimes: JummahTime[]
}

const prayerNames = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
}

export function StatusHeatmap({ dateRanges, jummahTimes }: StatusHeatmapProps) {
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

  return (
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
  )
} 