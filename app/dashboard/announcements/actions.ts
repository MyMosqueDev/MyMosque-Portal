'use server'

import { revalidatePath } from 'next/cache'
import { Announcement, User } from '@/lib/types'
import { sanitizeInput } from '@/lib/utils'
import { createSupabaseClient, getCurrentUser } from '@/lib/supabase'
import { SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import { sendNotifications } from '@/lib/notifications';

// validate announcement data
function validateAnnouncement(data: { title: string; content: string; priority: string }) {
    const errors: string[] = []
    
    if (!data.title?.trim()) {
        errors.push("Title is required")
    } else if (data.title.length > 100) {
        errors.push("Title must be less than 100 characters")
    }
    
    if (!data.content?.trim()) {
        errors.push("Content is required")
    } else if (data.content.length > 500) {
        errors.push("Content must be less than 500 characters")
    }
    
    if (!["low", "medium", "high"].includes(data.priority)) {
        errors.push("Invalid priority level")
    }
    
    return errors
}

export async function getAnnouncements() {
    try {
        const supabase = await createSupabaseClient()
        
        const user = await getCurrentUser(supabase);

        // Fetch announcements with ownership check
        const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('masjid_id', user.id)
        .neq('status', 'deleted')
        .order('created_at', { ascending: false })

        if (error) {
            throw new Error('Failed to fetch announcements')
        }

        return { data: data || [], error: null }
    } catch (error) {
        return { data: [], error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

async function verifyAnnouncementOwnership(supabase: SupabaseClient, id: string, user: SupabaseUser) {
    const {data: announcement, error: fetchError} = await supabase
        .from('announcements')
        .select('masjid_id')
        .eq('id', id)
        .single()
    if (fetchError || !announcement) {
        throw new Error('Announcement not found')
    }
    if (announcement.masjid_id !== user.id) {
        throw new Error('You do not have permission to edit this announcement')
    }
}

async function updateMosqueLastAnnouncement(supabase: SupabaseClient, user: SupabaseUser) {
    await supabase
        .from('mosques')
        .update({
            last_announcement: new Date().toISOString()
        })
        .eq('uid', user.id)
}

export async function newAnnouncement(announcement: Announcement) {
    try {
        const supabase = await createSupabaseClient();
        const user = await getCurrentUser(supabase);
        
        const validationErrors = validateAnnouncement({
            title: announcement.title,
            content: announcement.description,
            priority: announcement.severity
        })

        if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '))
        }

        const sanitizedData = {
            title: sanitizeInput(announcement.title),
            description: sanitizeInput(announcement.description),
            severity: announcement.severity,
            status: announcement.status,
            masjid_id: user?.id,
        }

        const { data: newAnnouncement, error: createError } = await supabase
            .from('announcements')
            .insert(sanitizedData)
            .select()
            .single()
        
        await updateMosqueLastAnnouncement(supabase, user)

        if (createError) {
            throw new Error('Failed to create announcement')
        }

        const somePushTokens = [
            'ExponentPushToken[IDtnDjONa_qpIemIzqeVZQ]',
        ];
        sendNotifications({
            pushTokens: somePushTokens,
            title: `${announcement.mosque_name}: ${announcement.title}`,
            body: announcement.description,
            data: {
                withSome: 'data'
            }
        })
        return { data: newAnnouncement, error: null }
    } catch (error) {
        return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

export async function updateAnnouncement(id: string, data: { title: string; content: string; priority: string }) {
    try {
        const supabase = await createSupabaseClient();
        const user = await getCurrentUser(supabase);
        
        // Validate input
        const validationErrors = validateAnnouncement(data)
        if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '))
        }

        await verifyAnnouncementOwnership(supabase, id, user)

        // Sanitize inputs
        const sanitizedData = {
            title: sanitizeInput(data.title),
            description: sanitizeInput(data.content),
            severity: data.priority,
            updated_at: new Date().toISOString()
        }

        // Update announcement
        const { data: updatedAnnouncement, error: updateError } = await supabase
            .from('announcements')
            .update(sanitizedData)
            .eq('id', id)
            .eq('masjid_id', user.id)
            .select()
            .single()

        await updateMosqueLastAnnouncement(supabase, user)

        if (updateError) {
            throw new Error('Failed to update announcement')
        }

        revalidatePath('/dashboard/announcements')
        
        return { data: updatedAnnouncement, error: null }
    } catch (error) {
        return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

export async function deleteAnnouncement(id: string) {
    try {
        const supabase = await createSupabaseClient()
        const user = await getCurrentUser(supabase);

        await verifyAnnouncementOwnership(supabase, id, user)

        // Soft delete
        const { error: deleteError } = await supabase
            .from('announcements')
            .update({
                status: 'deleted',
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('masjid_id', user.id)

        if (deleteError) {
            throw new Error('Failed to delete announcement')
        }

        await updateMosqueLastAnnouncement(supabase, user)

        revalidatePath('/dashboard/announcements')
        
        return { error: null }
    } catch (error) {
        return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

export async function createAnnouncement(data: { title: string; content: string; priority: string; status?: string }) {
    try {
        const supabase = await createSupabaseClient();
        const user = await getCurrentUser(supabase);
        
        // Validate input
        const validationErrors = validateAnnouncement(data)
        if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '))
        }

        // Sanitize inputs
        const sanitizedData = {
            title: sanitizeInput(data.title),
            description: sanitizeInput(data.content),
            severity: data.priority,
            status: data.status || 'draft',
            masjid_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }

        // Create announcement
        const { data: newAnnouncement, error: createError } = await supabase
            .from('announcements')
            .insert(sanitizedData)
            .select()
            .single()

        if (createError) {
            throw new Error('Failed to create announcement')
        }

        await updateMosqueLastAnnouncement(supabase, user)

        revalidatePath('/dashboard/announcements')
        
        return { data: newAnnouncement, error: null }
    } catch (error) {
        return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
} 