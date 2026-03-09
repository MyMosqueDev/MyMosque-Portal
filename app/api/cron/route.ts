import getLocalPrayerTimes from '@/lib/getLocalPrayerTimes'
import { authorizeRequest } from '@/lib/auth'
import { parse12HourToMinutes, minutesTo12Hour, convert24To12Hour } from '@/lib/timeUtils'
import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { PrayerSchedule, PrayerTimes } from '@/lib/types'
import { SupabaseClient } from '@supabase/supabase-js'

type CronResponse = {
    success: string[]
    error: {error: string, mosqueId: string}[]
}

type UpdatePrayerTimesResult = {
    success: boolean
    error?: string
}

const getMosqueIds = async (supabase: SupabaseClient) => {
    const { data, error } = await supabase.from("mosques").select("uid");
    if (error) {
        console.error('Error fetching mosque IDs:', error)
        return []
    }
    return data.map((mosque) => mosque.uid)
}

export async function GET(request: NextRequest) {
    console.log('Cron route called')
    const params = request.nextUrl.searchParams
    const mosqueId : string | null = params.get('mosqueId')

    const res: CronResponse = {
        success: [],
        error: [],
    }

    const supabase: SupabaseClient = await createClient()

    const authResult = await authorizeRequest(request, supabase, mosqueId)

    if (!authResult.authorized) {
        return authResult.errorResponse || new NextResponse('Unauthorized', { status: 401 })
    }

    if (mosqueId) {
        const result = await updatePrayerTimes(supabase, mosqueId)
        if (result.success) {
            res.success.push(mosqueId)
        } else {
            res.error.push({error: result.error || 'Unknown error', mosqueId: mosqueId})
        }
    } else {
        const mosqueIds = await getMosqueIds(supabase);
        for (const mosqueId of mosqueIds) {
            const result = await updatePrayerTimes(supabase, mosqueId)
            if (result.success) {
                res.success.push(mosqueId)
            } else {
                res.error.push({error: result.error || 'Unknown error', mosqueId: mosqueId})
            }
        }
    }

    return new Response(JSON.stringify({ 
        success: res.success, 
        error: res.error 
    }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    })

}

const updatePrayerTimes = async (supabase: SupabaseClient, mosqueId: string) => {
    const { data, error } = await supabase.from('mosques').select('*').eq('uid', mosqueId).single()
    if (error) {
        return {
            success: false,
            error: error.message || 'Unknown error',
        } as UpdatePrayerTimesResult
    } 
    const prayerSchedule: PrayerSchedule = data.prayer_settings.schedule
    const address: string = data.address
    const localPrayerTimes = await getLocalPrayerTimes(address) // add a type to this
    
    if (!localPrayerTimes) {
        return {
            error: 'Failed to fetch local prayer times',
            success: false
        } as UpdatePrayerTimesResult
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
    
    const { data: existingRecord } = await supabase
        .from('new_prayer_times')
        .select('*')
        .eq('mm-yy', mmYy)
        .eq('mosque_id', mosqueId)
        .maybeSingle()
    
    let insertData, insertError;
    
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
        return {
            success: false,
            error: insertError.message || 'Failed to save prayer times'
        } as UpdatePrayerTimesResult
    }
    
    const { error: updateError } = await supabase
        .from('mosques')
        .update({
            last_prayer: new Date().toISOString()
        })
        .eq('uid', mosqueId)
    
    if (updateError) {
        console.error('Error updating last_prayer:', updateError)
        return {
            error: updateError.message || 'Unknown error', 
            success: false
        } as UpdatePrayerTimesResult
    }

    return {
        success: true
    } as UpdatePrayerTimesResult
}