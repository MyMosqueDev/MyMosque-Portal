'use server'

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { sanitizeInput } from "@/lib/utils";
import { revalidatePath } from 'next/cache'
import { DateRangePrayerTimes } from "@/lib/types";

async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                }, 
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                        )
                    } catch {
                        console.log('Error setting cookies')
                    }
                }
            }
        }
    )
}

export async function getPrayerTimes() {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
        revalidatePath('/login')
        throw new Error('Authentication required')
    }

    const { data: prayerTimes, error: prayerTimesError } = await supabase
    .from('test_prayer_times')
    .select('*')
    .eq('masjid_id', user.id === '8b8e68c7-4d65-4f39-8baa-b4687eef861e' ? 1 : user.id)
    .neq('status', 'deleted')

    if (prayerTimesError) {
        console.log('prayer times error')
        return { error: prayerTimesError.message }
    }

    return prayerTimes
}

function validatePrayerTimes(data: { startDate: string, endDate: string}) {
    const errors: string[] = []

    if (data.startDate > data.endDate) {
        errors.push("Start date must be before end date")
    }

    return errors
}

export async function createPrayerTimes(data: DateRangePrayerTimes) {
    console.log(data)
    const errors = validatePrayerTimes(data)
    if (errors.length > 0) {
        return { errors }
    }

    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
        revalidatePath('/login')
        throw new Error('Authentication required')
    }

    const { data: mosque, error: mosqueError } = await supabase
    .from('mosques')
    .select('id')
    .eq('id', user.id === '8b8e68c7-4d65-4f39-8baa-b4687eef861e' ? 1 : user.id)
    .single()

    const sanatizeName = sanitizeInput(data.name)
    const sanatizedTimes = {
        ...data,
        name: sanatizeName,
        masjid_id: user.id === '8b8e68c7-4d65-4f39-8baa-b4687eef861e' ? 1 : user.id
    }

    const {data: newPrayerTimes, error: createError} = await supabase
            .from('test_prayer_times')
            .insert(sanatizedTimes)
            .select()
            .single()

    if (createError) {
        console.log('create error')
        return { error: createError.message }
    }

    revalidatePath('/dashboard/prayer-times')
    return { success: true }
}

export async function deletePrayerTimes(id: string) {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
        revalidatePath('/login')
        throw new Error('Authentication required')
    }

    const { data: prayerTimes, error: prayerTimesError } = await supabase
    .from('test_prayer_times')
    .update({
        status: 'deleted'
    })
    .eq('id', id)

    if (prayerTimesError) {
        console.log('prayer times error')
        return { error: prayerTimesError.message }
    }
}

export async function updatePrayerTimes(id: string, data: DateRangePrayerTimes) {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
        revalidatePath('/login')
        throw new Error('Authentication required')
    }

    const { data: prayerTimes, error: prayerTimesError } = await supabase
    .from('test_prayer_times')
    .update(data)
    .eq('id', id)

    if (prayerTimesError) {
        console.log('prayer times error')
        return { error: prayerTimesError.message }
    }

    // Update mosque table with last prayer time update
    const { data: updatePrayerTimes, error: updateError } = await supabase
    .from('mosques')
    .update({
        last_prayer_time: new Date().toISOString()
    })
    .eq('id', user.id === '8b8e68c7-4d65-4f39-8baa-b4687eef861e' ? 1 : user.id)

    revalidatePath('/dashboard/prayer-times')
    return { success: true }
}

export async function updateJummahTimes(jummahTimes: any[]) {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
        revalidatePath('/login')
        throw new Error('Authentication required')
    }

    const { data: mosque, error: mosqueError } = await supabase
    .from('mosques')
    .update({
        jummah_times: jummahTimes
    })
    .eq('id', user.id === '8b8e68c7-4d65-4f39-8baa-b4687eef861e' ? 1 : user.id)

    if (mosqueError) {
        console.log('mosque update error')
        return { error: mosqueError.message }
    }

    revalidatePath('/dashboard/prayer-times')
    return { success: true }
}

export async function updatePrayerSettings(settings: any) {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
        revalidatePath('/login')
        throw new Error('Authentication required')
    }

    const { data: mosque, error: mosqueError } = await supabase
    .from('mosques')
    .update({
        prayer_settings: settings
    })
    .eq('id', user.id === '8b8e68c7-4d65-4f39-8baa-b4687eef861e' ? 1 : user.id)

    if (mosqueError) {
        console.log('mosque settings update error')
        return { error: mosqueError.message }
    }

    revalidatePath('/dashboard/prayer-times')
    return { success: true }
}

export async function getMosqueSettings() {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
        revalidatePath('/login')
        throw new Error('Authentication required')
    }

    const { data: mosque, error: mosqueError } = await supabase
    .from('mosques')
    .select('jummah_times, prayer_settings')
    .eq('id', user.id === '8b8e68c7-4d65-4f39-8baa-b4687eef861e' ? 1 : user.id)
    .single()

    if (mosqueError) {
        console.log('mosque settings fetch error')
        return { error: mosqueError.message }
    }

    return mosque
}