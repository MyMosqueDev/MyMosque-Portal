import getLocalPrayerTimes from "@/lib/getLocalPrayerTimes"
import { PrayerTime } from "@/lib/types"
import { useState, useEffect } from "react"

interface PrayerTimeData {
    day: string
    timings: Record<string, string>
}

function convertTo12Hour(time24: string): string {
    const [hours, minutes] = time24.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
}

export default function useLocalPrayerTimes(address: string) {
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimeData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!address) {
            setLoading(false)
            return
        }

        const fetchPrayerTimes = async () => {
            try {
                setLoading(true)
                setError(null)

                const res = await getLocalPrayerTimes(address);
                console.log('res', res)
                if (res) {
                    setPrayerTimes(res)
                } else {
                    setError('Failed to fetch prayer times')
                    setPrayerTimes([])
                }
            } catch (err) {
                console.error('Error fetching prayer times:', err)
                setError(err instanceof Error ? err.message : 'Failed to fetch prayer times')
                setPrayerTimes([])
            } finally {
                setLoading(false)
            }
        }

        fetchPrayerTimes()
    }, [address])

    return { prayerTimes, loading, error }
}