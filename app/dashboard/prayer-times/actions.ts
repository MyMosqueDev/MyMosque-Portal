'use server'

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { sanitizeInput } from "@/lib/utils";
import { revalidatePath } from 'next/cache'
import { DateRangePrayerTimes, JummahTime, PrayerSettings } from "@/lib/types";
import { validatePrayerSchedule, validateJummahTimes } from "@/lib/validation";

interface ActionResult {
  success: boolean;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
  data?: any;
}

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
                    } catch (error) {
                        console.error('Error setting cookies:', error)
                    }
                }
            }
        }
    )
}

async function getCurrentUser() {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
        console.error('Authentication error:', userError)
        throw new Error('Authentication failed')
    }
    
    if (!user) {
        throw new Error('User not authenticated')
    }
    
    return user
}

export async function getPrayerTimes(): Promise<ActionResult> {
    try {
        const user = await getCurrentUser()
        const supabase = await createClient()

        const { data: prayerTimes, error: prayerTimesError } = await supabase
            .from('test_prayer_times')
            .select('*')
            .eq('masjid_id', user.id)
            .neq('status', 'deleted')

        if (prayerTimesError) {
            console.error('Database error fetching prayer times:', prayerTimesError)
            return { 
                success: false, 
                error: 'Failed to fetch prayer times. Please try again.' 
            }
        }

        return { 
            success: true, 
            data: prayerTimes || [] 
        }
    } catch (error) {
        console.error('Error in getPrayerTimes:', error)
        if (error instanceof Error && error.message === 'User not authenticated') {
            revalidatePath('/login')
            return { 
                success: false, 
                error: 'Authentication required. Please log in again.' 
            }
        }
        return { 
            success: false, 
            error: 'An unexpected error occurred. Please try again.' 
        }
    }
}

export async function createPrayerTimes(data: DateRangePrayerTimes): Promise<ActionResult> {
    try {
        // Validate the prayer schedule data
        const validation = validatePrayerSchedule(data)
        if (!validation.isValid) {
            return {
                success: false,
                errors: validation.errors
            }
        }

        const user = await getCurrentUser()
        console.log('user', user.id)
        const supabase = await createClient()

        // Check if mosque exists
        const { error: mosqueError } = await supabase
            .from('mosques')
            .select('id')
            .eq('uid', user.id)
            .single()

        if (mosqueError) {
            console.error('Error checking mosque:', mosqueError)
            return {
                success: false,
                error: 'Mosque not found. Please contact support.'
            }
        }

        // Sanitize input and remove isNew flag
        const { ...dataWithoutIsNew } = data
        const sanitizedName = sanitizeInput(dataWithoutIsNew.name)
        const sanitizedData = {
            ...dataWithoutIsNew,
            name: sanitizedName,
            masjid_id: user.id
        }

        const { data: newPrayerTimes, error: createError } = await supabase
            .from('test_prayer_times')
            .insert(sanitizedData)
            .select()
            .single()

        if (createError) {
            console.error('Error creating prayer times:', createError)
            return {
                success: false,
                error: 'Failed to create prayer schedule. Please try again.'
            }
        }

        revalidatePath('/dashboard/prayer-times')
        return { success: true, data: newPrayerTimes }
    } catch (error) {
        console.error('Error in createPrayerTimes:', error)
        if (error instanceof Error && error.message === 'User not authenticated') {
            revalidatePath('/login')
            return {
                success: false,
                error: 'Authentication required. Please log in again.'
            }
        }
        return {
            success: false,
            error: 'An unexpected error occurred. Please try again.'
        }
    }
}

export async function deletePrayerTimes(id: string): Promise<ActionResult> {
    try {
        const user = await getCurrentUser()
        const supabase = await createClient()

        // Verify the schedule belongs to the user's mosque
        const { data: existingSchedule, error: fetchError } = await supabase
            .from('test_prayer_times')
            .select('id, masjid_id')
            .eq('id', id)
            .eq('masjid_id', user.id)
            .single()

        if (fetchError || !existingSchedule) {
            return {
                success: false,
                error: 'Schedule not found or you do not have permission to delete it.'
            }
        }

        const { error: deleteError } = await supabase
            .from('test_prayer_times')
            .update({ status: 'deleted' })
            .eq('id', id)

        if (deleteError) {
            console.error('Error deleting prayer times:', deleteError)
            return {
                success: false,
                error: 'Failed to delete prayer schedule. Please try again.'
            }
        }

        revalidatePath('/dashboard/prayer-times')
        return { success: true }
    } catch (error) {
        console.error('Error in deletePrayerTimes:', error)
        if (error instanceof Error && error.message === 'User not authenticated') {
            revalidatePath('/login')
            return {
                success: false,
                error: 'Authentication required. Please log in again.'
            }
        }
        return {
            success: false,
            error: 'An unexpected error occurred. Please try again.'
        }
    }
}

export async function updatePrayerTimes(id: string, data: DateRangePrayerTimes): Promise<ActionResult> {
    try {
        // Validate the prayer schedule data
        const validation = validatePrayerSchedule(data)
        if (!validation.isValid) {
            return {
                success: false,
                errors: validation.errors
            }
        }

        const user = await getCurrentUser()
        const supabase = await createClient()

        // Verify the schedule belongs to the user's mosque
        const { data: existingSchedule, error: fetchError } = await supabase
            .from('test_prayer_times')
            .select('id, masjid_id')
            .eq('id', id)
            .eq('masjid_id', user.id)
            .single()

        if (fetchError || !existingSchedule) {
            return {
                success: false,
                error: 'Schedule not found or you do not have permission to update it.'
            }
        }

        // Sanitize input and remove isNew flag
        const { ...dataWithoutIsNew } = data
        const sanitizedName = sanitizeInput(dataWithoutIsNew.name)
        const sanitizedData = {
            ...dataWithoutIsNew,
            name: sanitizedName,
            updated_at: new Date().toISOString()
        }

        const { error: updateError } = await supabase
            .from('test_prayer_times')
            .update(sanitizedData)
            .eq('id', id)

        if (updateError) {
            console.error('Error updating prayer times:', updateError)
            return {
                success: false,
                error: 'Failed to update prayer schedule. Please try again.'
            }
        }

        // Update mosque table with last prayer time update
        const { error: mosqueUpdateError } = await supabase
            .from('mosques')
            .update({
                last_prayer: new Date().toISOString()
            })
            .eq('uid', user.id)

        if (mosqueUpdateError) {
            console.error('Error updating mosque last_prayer_time:', mosqueUpdateError)
            // Don't fail the entire operation for this
        }

        revalidatePath('/dashboard/prayer-times')
        return { success: true }
    } catch (error) {
        console.error('Error in updatePrayerTimes:', error)
        if (error instanceof Error && error.message === 'User not authenticated') {
            revalidatePath('/login')
            return {
                success: false,
                error: 'Authentication required. Please log in again.'
            }
        }
        return {
            success: false,
            error: 'An unexpected error occurred. Please try again.'
        }
    }
}

export async function updateJummahTimes(jummahTimes: JummahTime[]): Promise<ActionResult> {
    try {
        // Validate jummah times
        const validation = validateJummahTimes(jummahTimes)
        if (!validation.isValid) {
            return {
                success: false,
                errors: validation.errors
            }
        }

        const user = await getCurrentUser()
        const supabase = await createClient()

        // Transform array to object format for database storage
        const jummahTimesObject = jummahTimes.reduce((acc, time, index) => {
            acc[`jummah${index + 1}`] = time
            return acc
        }, {} as Record<string, JummahTime>)

        const { error: updateError } = await supabase
            .from('mosques')
            .update({
                jummah_times: jummahTimesObject
            })
            .eq('uid', user.id)

        if (updateError) {
            console.error('Error updating jummah times:', updateError)
            return {
                success: false,
                error: 'Failed to update Jummah times. Please try again.'
            }
        }

        revalidatePath('/dashboard/prayer-times')
        return { success: true }
    } catch (error) {
        console.error('Error in updateJummahTimes:', error)
        if (error instanceof Error && error.message === 'User not authenticated') {
            revalidatePath('/login')
            return {
                success: false,
                error: 'Authentication required. Please log in again.'
            }
        }
        return {
            success: false,
            error: 'An unexpected error occurred. Please try again.'
        }
    }
}

export async function updatePrayerSettings(settings: PrayerSettings): Promise<ActionResult> {
    try {
        const user = await getCurrentUser()
        const supabase = await createClient()

        const { error: updateError } = await supabase
            .from('mosques')
            .update({
                prayer_settings: settings
            })
            .eq('uid', user.id)

        if (updateError) {
            console.error('Error updating prayer settings:', updateError)
            return {
                success: false,
                error: 'Failed to update prayer settings. Please try again.'
            }
        }

        revalidatePath('/dashboard/prayer-times')
        return { success: true }
    } catch (error) {
        console.error('Error in updatePrayerSettings:', error)
        if (error instanceof Error && error.message === 'User not authenticated') {
            revalidatePath('/login')
            return {
                success: false,
                error: 'Authentication required. Please log in again.'
            }
        }
        return {
            success: false,
            error: 'An unexpected error occurred. Please try again.'
        }
    }
}

export async function getMosqueSettings(): Promise<ActionResult> {
    try {
        const user = await getCurrentUser()
        const supabase = await createClient()

        const { data: mosque, error: mosqueError } = await supabase
            .from('mosques')
            .select('jummah_times, prayer_settings')
            .eq('uid', user.id)
            .single()

        if (mosqueError) {
            console.error('Error fetching mosque settings:', mosqueError)
            return {
                success: false,
                error: 'Failed to fetch mosque settings. Please try again.'
            }
        }

        // Transform jummah_times from object format back to array if it exists
        if (mosque?.jummah_times && typeof mosque.jummah_times === 'object' && !Array.isArray(mosque.jummah_times)) {
            mosque.jummah_times = Object.values(mosque.jummah_times)
        }

        return { success: true, data: mosque }
    } catch (error) {
        console.error('Error in getMosqueSettings:', error)
        if (error instanceof Error && error.message === 'User not authenticated') {
            revalidatePath('/login')
            return {
                success: false,
                error: 'Authentication required. Please log in again.'
            }
        }
        return {
            success: false,
            error: 'An unexpected error occurred. Please try again.'
        }
    }
}