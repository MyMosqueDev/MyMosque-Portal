"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from 'lucide-react'

interface PrayerTimeData {
  day: string
  timings: Record<string, string>
}

interface MonthlyPrayerTimesProps {
  prayerTimes: PrayerTimeData[]
  loading: boolean
  error: string | null
}

const prayerLabels: Record<string, string> = {
  fajr: "Fajr",
  sunrise: "Sunrise",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  sunset: "Sunset",
  isha: "Isha",
}

const prayerOrder = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'sunset', 'isha']

export function MonthlyPrayerTimes({ prayerTimes, loading, error }: MonthlyPrayerTimesProps) {
  const currentMonth = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-mosque-blue" />
            Monthly Prayer Times
          </CardTitle>
          <CardDescription>{currentMonth}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mosque-green"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-mosque-blue" />
            Monthly Prayer Times
          </CardTitle>
          <CardDescription>{currentMonth}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-sm text-red-600">
            {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!prayerTimes || prayerTimes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-mosque-blue" />
            Monthly Prayer Times
          </CardTitle>
          <CardDescription>{currentMonth}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-sm text-gray-500">
            No prayer times available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-mosque-blue" />
          Monthly Prayer Times
        </CardTitle>
        <CardDescription className="text-[11px]">{currentMonth}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="h-[320px] w-full overflow-x-auto overflow-y-auto">
          <Table className="min-w-[900px] text-xs">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px] px-1.5 py-1 text-[11px] sticky left-0 bg-white">
                  Day
                </TableHead>
                {prayerOrder.map((prayer) => (
                  <TableHead
                    key={prayer}
                    className="text-center px-1.5 py-1 text-[11px] whitespace-nowrap"
                  >
                    {prayerLabels[prayer]}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {prayerTimes.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium px-1.5 py-1 text-[11px] sticky left-0 bg-white">
                    {item.day}
                  </TableCell>
                  {prayerOrder.map((prayer) => (
                    <TableCell
                      key={prayer}
                      className="text-center text-[11px] font-mono px-1.5 py-1 whitespace-nowrap"
                    >
                      {item.timings[prayer] || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
