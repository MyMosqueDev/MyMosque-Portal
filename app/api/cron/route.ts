import getLocalPrayerTimes from '@/lib/getLocalPrayerTimes'
import { authorizeRequest } from '@/lib/auth'
import { parse12HourToMinutes, minutesTo12Hour, convert24To12Hour } from '@/lib/timeUtils'
import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { PrayerSchedule, PrayerTimes } from '@/lib/types'

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams
    const mosqueId = params.get('mosqueId')

    if (!mosqueId) {
        return new NextResponse('Mosque ID is required', { status: 400 })
    } 
    
    const supabase = await createClient()
    const authResult = await authorizeRequest(request, supabase, mosqueId)
    
    if (!authResult.authorized) {
        return authResult.errorResponse || new NextResponse('Unauthorized', { status: 401 })
    }
    
    const { data, error } = await supabase.from('mosques').select('*').eq('uid', mosqueId).single()
    if (error) {
        return new NextResponse('Error fetching mosque', { status: 500 })
    } 
    const prayerSchedule: PrayerSchedule = data.prayer_settings.schedule
    const address: string = data.address
    const localPrayerTimes = await getLocalPrayerTimes(address) // add a type to this
    
    if (!localPrayerTimes) {
        return new NextResponse('Failed to fetch local prayer times', { status: 500 })
    } 
    
    const prayerTimes: Array<{ day: string; times: PrayerTimes }> = localPrayerTimes.map((time) => { // fix this type
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
            const mode = prayerSchedule.timeMode[prayer]
            let iqamaTime: string
            
            if (mode === 'static') {
                // iqama is the static time from schedule
                iqamaTime = convert24To12Hour(prayerSchedule.prayerTimes[prayer])
            } else if (mode === 'increment') {
                // iqama is original time + increment
                const currentMinutes = parse12HourToMinutes(originalTime)
                const incrementMinutes = prayerSchedule.incrementValues[prayer]
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
    
    // Use upsert to insert or update in one operation
    const { data: prayerTimesData, error: upsertError } = await supabase
        .from('new_prayer_times')
        .upsert({
            'mm-yy': mmYy,
            mosque_id: mosqueId,
            prayer_times: prayerTimes
        }, {
            onConflict: 'mm-yy,mosque_id'
        })
        .select()
        .single()
    
    if (upsertError) {
        console.error('Error upserting prayer times:', upsertError)
        return new NextResponse(`Error saving prayer times: ${upsertError.message}`, { status: 500 })
    }
    
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
