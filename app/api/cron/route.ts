import getLocalPrayerTimes from '@/lib/getLocalPrayerTimes'
import { createClient } from '@/utils/supabase/server'
import { NextRequest } from 'next/server'

type PrayerTimes = {
    fajr: { adhan: string; iqama: string };
    sunrise: string;
    dhuhr: { adhan: string; iqama: string };
    asr: { adhan: string; iqama: string };
    maghrib: { adhan: string; iqama: string };
    sunset: string;
    isha: { adhan: string; iqama: string };
};

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams

    if (!params.has('mosqueId')) {
        return new Response('Mosque ID is required', { status: 400 })
    } else {
        const mosqueId = params.get('mosqueId')
        const supabase = await createClient()
        const { data, error } = await supabase.from('mosques').select('*').eq('uid', mosqueId).single()
        if (error) {
            return new Response('Error fetching mosque', { status: 500 })
        } 
        const PrayerSchedule = data.prayer_settings.schedule
        const address = data.address

        const localPrayerTimes = await getLocalPrayerTimes(address)

        if (!localPrayerTimes) {
            return new Response('Failed to fetch local prayer times', { status: 500 })
        } 
        
        // Helper function to parse 12-hour time string to minutes since midnight
        const parse12HourToMinutes = (timeStr: string): number => {
            const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
            if (!match) return 0
            
            let hours = parseInt(match[1], 10)
            const minutes = parseInt(match[2], 10)
            const ampm = match[3].toUpperCase()
            
            if (ampm === 'PM' && hours !== 12) hours += 12
            if (ampm === 'AM' && hours === 12) hours = 0
            
            return hours * 60 + minutes
        }
        
        // Helper function to convert minutes since midnight to 12-hour format
        const minutesTo12Hour = (minutes: number): string => {
            const hours = Math.floor(minutes / 60) % 24
            const mins = minutes % 60
            const ampm = hours >= 12 ? 'PM' : 'AM'
            const hour12 = hours % 12 || 12
            return `${hour12}:${mins.toString().padStart(2, '0')} ${ampm}`
        }
        
        // Helper function to convert 24-hour format (HH:MM) to 12-hour format
        const convert24To12Hour = (time24: string): string => {
            const [hours, minutes] = time24.split(':')
            const hour = parseInt(hours, 10)
            const ampm = hour >= 12 ? 'PM' : 'AM'
            const hour12 = hour % 12 || 12
            return `${hour12}:${minutes} ${ampm}`
        }
        
        const prayerTimes = localPrayerTimes.map((time) => {
            const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const
            const times: PrayerTimes = {
                sunrise: time.timings.sunrise || '',
                sunset: time.timings.sunset || '',
                fajr: { adhan: '', iqama: '' },
                dhuhr: { adhan: '', iqama: '' },
                asr: { adhan: '', iqama: '' },
                maghrib: { adhan: '', iqama: '' },
                isha: { adhan: '', iqama: '' }
            }
            
            prayers.forEach((prayer) => {
                const originalTime = time.timings[prayer] // adhan - original time
                const mode = PrayerSchedule.timeMode[prayer]
                let iqamaTime: string
                
                if (mode === 'static') {
                    // iqama is the static time from schedule
                    iqamaTime = convert24To12Hour(PrayerSchedule.prayerTimes[prayer])
                } else if (mode === 'increment') {
                    // iqama is original time + increment
                    const currentMinutes = parse12HourToMinutes(originalTime)
                    const incrementMinutes = PrayerSchedule.incrementValues[prayer]
                    const newMinutes = currentMinutes + incrementMinutes
                    iqamaTime = minutesTo12Hour(newMinutes)
                } else {
                    // If no mode specified, use original time for both
                    iqamaTime = originalTime
                }
                
                times[prayer] = {
                    adhan: originalTime,
                    iqama: iqamaTime
                }
            })
            
            return {
                day: time.day,
                times
            }
        })
        
        const now = new Date()
        const month = (now.getMonth() + 1).toString().padStart(2, '0')
        const year = now.getFullYear().toString().slice(-2)
        const mmYy = `${month}-${year}`
        
        const { data: existingRecord } = await supabase
            .from('new_prayer_times')
            .select('*')
            .eq('mm-yy', mmYy)
            .eq('mosque_id', mosqueId)
            .maybeSingle()
        
        let insertData, insertError
        
        if (existingRecord) {
            const { data, error } = await supabase
                .from('new_prayer_times')
                .update({
                    prayer_times: prayerTimes
                })
                .eq('mm-yy', mmYy)
                .eq('mosque_id', mosqueId)
                .select()
                .single()
            insertData = data
            insertError = error
        } else {
            const { data, error } = await supabase
                .from('new_prayer_times')
                .insert({
                    'mm-yy': mmYy,
                    mosque_id: mosqueId,
                    prayer_times: prayerTimes
                })
                .select()
                .single()
            insertData = data
            insertError = error
        }
        
        if (insertError) {
            console.error('Error inserting prayer times:', insertError)
            return new Response(`Error saving prayer times: ${insertError.message}`, { status: 500 })
        }
        
        // Update last_prayer timestamp in mosques table
        const { error: updateError } = await supabase
            .from('mosques')
            .update({
                last_prayer: new Date().toISOString()
            })
            .eq('uid', mosqueId)
        
        if (updateError) {
            console.error('Error updating last_prayer:', updateError)
        }
        
        return new Response(JSON.stringify({ 
            success: true, 
            mmYy,
            mosqueId,
            prayerTimesCount: prayerTimes.length 
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}