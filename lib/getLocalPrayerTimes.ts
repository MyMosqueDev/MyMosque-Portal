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

export default async function getLocalPrayerTimes(address: string) {
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const method = 3 // ISNA
    const school = 1 // Hanafi
    const encodedAddress = encodeURIComponent(address).replace(/%20/g, '+')

    const url = `https://api.aladhan.com/v1/calendarByAddress/${year}/${month}?address=${encodedAddress}&method=${method}&school=${school}`
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Failed to fetch prayer times: ${response.statusText}`)
        return null
    }
    const data = await response.json()
    const res: PrayerTimeData[] = []
    const prayerKeys = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Sunset', 'Isha']
    
    for (const item of data.data) {
        const [day, month, year] = item.date.gregorian.date.split('-');
        const timings = item.timings
        
        const formattedTimings: Record<string, string> = {}
        for (const key of prayerKeys) {
            if (timings[key]) {
                const timeMatch = timings[key].match(/(\d{2}:\d{2})/)
                if (timeMatch) {
                    formattedTimings[key.toLowerCase()] = convertTo12Hour(timeMatch[1])
                }
            }
        }
        
        const curr: PrayerTimeData = {
            day: day,
            timings: formattedTimings
        }
        res.push(curr)
    }
    return res
}