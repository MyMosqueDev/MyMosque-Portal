'use server'

import { sanitizeInput } from "@/lib/utils";
import { revalidatePath } from 'next/cache'
import { CombinedPrayerSettings, DateRangePrayerTimes, JummahTime, PrayerSettings } from "@/lib/types";
import { validatePrayerSchedule, validateJummahTimes } from "@/lib/validation";
import { createSupabaseClient, getCurrentUser } from "@/lib/supabase";

interface ActionResult {
    success: boolean;
    error?: string;
    errors?: Array<{ field: string; message: string }>;
    data?: any;
}

export async function getPrayerTimes(): Promise<ActionResult> {
    try {
        const supabase = await createSupabaseClient()
        const user = await getCurrentUser(supabase)

        const { data: mosque, error: mosqueError } = await supabase
            .from('mosques')
            .select('prayer_settings')
            .eq('uid', user.id)
            .single()

        if (mosqueError) {
            console.error('Database error fetching prayer times:', mosqueError)
            return { 
                success: false, 
                error: 'Failed to fetch prayer times. Please try again.' 
            }
        }

        // Extract prayer schedule from prayer_settings if it exists
        const prayerSettings = mosque?.prayer_settings || {}
        const hasPrayerSchedule = prayerSettings.prayerTimes || prayerSettings.timeMode || prayerSettings.incrementValues
        
        // Return prayer schedule if it exists in prayer_settings, otherwise return empty array
        const prayerTimes = hasPrayerSchedule ? [{
            id: prayerSettings.id || Date.now().toString(),
            name: prayerSettings.name || "Prayer Schedule",
            startDate: prayerSettings.startDate || "",
            endDate: prayerSettings.endDate || "",
            status: prayerSettings.status || "active",
            prayerTimes: prayerSettings.prayerTimes || {},
            timeMode: prayerSettings.timeMode || {},
            incrementValues: prayerSettings.incrementValues || {},
        }] : []

        return { 
            success: true, 
            data: prayerTimes 
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

        const supabase = await createSupabaseClient()
        const user = await getCurrentUser(supabase)

        // Get existing prayer_settings to preserve other settings
        const { data: existingMosque, error: fetchError } = await supabase
            .from('mosques')
            .select('prayer_settings')
            .eq('uid', user.id)
            .single()

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
            console.error('Error fetching existing prayer settings:', fetchError)
            return {
                success: false,
                error: 'Failed to fetch existing settings. Please try again.'
            }
        }

        // Sanitize input and extract only prayer schedule fields (exclude isNew and any other extra fields)
        const { isNew, ...rest } = data
        const sanitizedName = sanitizeInput(rest.name || "Prayer Schedule")
        
        // Explicitly extract only the prayer schedule fields to avoid including any extra data
        const prayerScheduleData = {
            id: rest.id,
            name: sanitizedName,
            startDate: rest.startDate || "",
            endDate: rest.endDate || "",
            status: rest.status || "active",
            prayerTimes: rest.prayerTimes || {},
            timeMode: rest.timeMode || {},
            incrementValues: rest.incrementValues || {},
        }

        // Merge prayer schedule into existing prayer_settings, preserving other settings
        const existingSettings = existingMosque?.prayer_settings || {}
        const updatedPrayerSettings = {
            ...existingSettings,
            ...prayerScheduleData,
        }

        // Save prayer times to prayer_settings in mosques table
        const { data: updatedMosque, error: updateError } = await supabase
            .from('mosques')
            .update({
                prayer_settings: updatedPrayerSettings,
                last_prayer: new Date().toISOString()
            })
            .eq('uid', user.id)
            .select('prayer_settings')
            .single()

        if (updateError) {
            console.error('Error creating prayer times:', updateError)
            return {
                success: false,
                error: 'Failed to create prayer schedule. Please try again.'
            }
        }

        revalidatePath('/dashboard/prayer-times')
        return { success: true, data: updatedMosque?.prayer_settings }
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

// export async function updatePrayerTimes(id: string, data: DateRangePrayerTimes): Promise<ActionResult> {
//     try {
//         // Validate the prayer schedule data
//         const validation = validatePrayerSchedule(data)
//         if (!validation.isValid) {
//             return {
//                 success: false,
//                 errors: validation.errors
//             }
//         }

//         const supabase = await createSupabaseClient()
//         const user = await getCurrentUser(supabase)

//         // Get existing prayer_settings to preserve other settings
//         const { data: existingMosque, error: fetchError } = await supabase
//             .from('mosques')
//             .select('prayer_settings')
//             .eq('uid', user.id)
//             .single()

//         if (fetchError) {
//             console.error('Error fetching existing prayer settings:', fetchError)
//             return {
//                 success: false,
//                 error: 'Failed to fetch existing settings. Please try again.'
//             }
//         }

//         // Sanitize input and extract only prayer schedule fields (exclude isNew and any other extra fields)
//         const { isNew, ...rest } = data
//         const sanitizedName = sanitizeInput(rest.name || "Prayer Schedule")
        
//         // Explicitly extract only the prayer schedule fields to avoid including any extra data
//         const prayerScheduleData = {
//             id: rest.id,
//             name: sanitizedName,
//             startDate: rest.startDate || "",
//             endDate: rest.endDate || "",
//             status: rest.status || "active",
//             prayerTimes: rest.prayerTimes || {},
//             timeMode: rest.timeMode || {},
//             incrementValues: rest.incrementValues || {},
//         }

//         // Merge prayer schedule into existing prayer_settings, preserving other settings
//         const existingSettings = existingMosque?.prayer_settings || {}
//         const updatedPrayerSettings = {
//             ...existingSettings,
//             ...prayerScheduleData,
//         }

//         // Update prayer times in prayer_settings in mosques table
//         const { data: updatedMosque, error: updateError } = await supabase
//             .from('mosques')
//             .update({
//                 prayer_settings: updatedPrayerSettings,
//                 last_prayer: new Date().toISOString()
//             })
//             .eq('uid', user.id)
//             .select('prayer_settings')
//             .single()

//         if (updateError) {
//             console.error('Error updating prayer times:', updateError)
//             return {
//                 success: false,
//                 error: 'Failed to update prayer schedule. Please try again.'
//             }
//         }

//         revalidatePath('/dashboard/prayer-times')
//         return { success: true, data: updatedMosque?.prayer_settings }
//     } catch (error) {
//         console.error('Error in updatePrayerTimes:', error)
//         if (error instanceof Error && error.message === 'User not authenticated') {
//             revalidatePath('/login')
//             return {
//                 success: false,
//                 error: 'Authentication required. Please log in again.'
//             }
//         }
//         return {
//             success: false,
//             error: 'An unexpected error occurred. Please try again.'
//         }
//     }
// }

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

        const supabase = await createSupabaseClient()
        const user = await getCurrentUser(supabase)

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

export async function updatePrayerSettings(settings: CombinedPrayerSettings): Promise<ActionResult> {
    try {
        const supabase = await createSupabaseClient()
        const user = await getCurrentUser(supabase)

        // Get existing prayer_settings to preserve prayer schedule data
        const { data: existingMosque, error: fetchError } = await supabase
            .from('mosques')
            .select('prayer_settings')
            .eq('uid', user.id)
            .single()

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
            console.error('Error fetching existing prayer settings:', fetchError)
            return {
                success: false,
                error: 'Failed to fetch existing settings. Please try again.'
            }
        }

        // Merge new settings with existing prayer schedule data
        const existingSettings = existingMosque?.prayer_settings || {}
        const updatedPrayerSettings = {
            ...existingSettings,
            ...settings,
        }

        const { error: updateError } = await supabase
            .from('mosques')
            .update({
                prayer_settings: updatedPrayerSettings
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
        const supabase = await createSupabaseClient()
        const user = await getCurrentUser(supabase)

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