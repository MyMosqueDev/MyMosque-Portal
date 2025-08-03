'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { Announcement } from '@/lib/types'

// Create server-side Supabase client
async function createClient() {
    const cookieStore = await cookies()

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
            },
        },
        }
    )
}

// Input validation
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

// Sanitize input to prevent XSS
function sanitizeInput(input: string): string {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .trim()
}

export async function getAnnouncements() {
    try {
        const supabase = await createClient()
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            throw new Error('Authentication required')
        }

        // Fetch announcements with ownership check
        const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('masjid_id', user.id === '8b8e68c7-4d65-4f39-8baa-b4687eef861e' ? 1 : user.id)
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

export async function newAnnouncement(announcement: Announcement) {
    try {
        const supabase = await createClient()
        
        const validationErrors = validateAnnouncement({
            title: announcement.title,
            content: announcement.description,
            priority: announcement.severity
        })

        if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '))
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            throw new Error('Authentication required')
        }

        const sanitizedData = {
            title: sanitizeInput(announcement.title),
            description: sanitizeInput(announcement.description),
            severity: announcement.severity,
            status: announcement.status,
            masjid_id: user?.id === '8b8e68c7-4d65-4f39-8baa-b4687eef861e' ? 1 : user?.id,
        }

        const { data: newAnnouncement, error: createError } = await supabase
            .from('announcements')
            .insert(sanitizedData)
            .select()
            .single()
        
        await supabase
        .from('mosques')
        .update({
            last_announcement: new Date().toISOString()
        })
        .eq('id', user?.id === '8b8e68c7-4d65-4f39-8baa-b4687eef861e' ? 1 : user?.id)

        if (createError) {
            throw new Error('Failed to create announcement')
        }

        return { data: newAnnouncement, error: null }
    } catch (error) {
        return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

export async function updateAnnouncement(id: string, data: { title: string; content: string; priority: string }) {
    try {
        const supabase = await createClient()
        
        // Validate input
        const validationErrors = validateAnnouncement(data)
        if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '))
        }

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
        throw new Error('Authentication required')
        }

        // Verify ownership
        const { data: announcement, error: fetchError } = await supabase
        .from('announcements')
        .select('masjid_id')
        .eq('id', id)
        .single()

        if (fetchError || !announcement) {
            throw new Error('Announcement not found')
        }

        if (announcement.masjid_id !== (user.id === '8b8e68c7-4d65-4f39-8baa-b4687eef861e' ? 1 : user.id)) {
            throw new Error('You do not have permission to edit this announcement')
        }

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
        .eq('masjid_id', user.id === '8b8e68c7-4d65-4f39-8baa-b4687eef861e' ? 1 : user.id)
        .select()
        .single()

        if (updateError) {
            throw new Error('Failed to update announcement')
        }

        // Update mosque last_announcement timestamp
        await supabase
        .from('mosques')
        .update({
            last_announcement: new Date().toISOString()
        })
        .eq('id', user.id)

        revalidatePath('/dashboard/announcements')
        
        return { data: updatedAnnouncement, error: null }
    } catch (error) {
        return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

export async function deleteAnnouncement(id: string) {
    try {
        const supabase = await createClient()
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
            throw new Error('Authentication required')
        }

        // Verify ownership
        const { data: announcement, error: fetchError } = await supabase
        .from('announcements')
        .select('masjid_id')
        .eq('id', id)
        .single()

        if (fetchError || !announcement) {
            throw new Error('Announcement not found')
        }

        if (announcement.masjid_id !== (user.id === '8b8e68c7-4d65-4f39-8baa-b4687eef861e' ? 1 : user.id)) {
            throw new Error('You do not have permission to delete this announcement')
        }

        // Soft delete
        const { error: deleteError } = await supabase
        .from('announcements')
        .update({
            status: 'deleted',
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('masjid_id', user.id === '8b8e68c7-4d65-4f39-8baa-b4687eef861e' ? 1 : user.id)

        if (deleteError) {
            throw new Error('Failed to delete announcement')
        }

        revalidatePath('/dashboard/announcements')
        
        return { error: null }
    } catch (error) {
        return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

export async function createAnnouncement(data: { title: string; content: string; priority: string; status?: string }) {
    try {
        const supabase = await createClient()
        
        // Validate input
        const validationErrors = validateAnnouncement(data)
        if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '))
        }

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
            throw new Error('Authentication required')
        }

        // Sanitize inputs
        const sanitizedData = {
            title: sanitizeInput(data.title),
            description: sanitizeInput(data.content),
            severity: data.priority,
            status: data.status || 'draft',
            masjid_id: user.id === '8b8e68c7-4d65-4f39-8baa-b4687eef861e' ? 1 : user.id,
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

        // Update mosque last_announcement timestamp
        await supabase
            .from('mosques')
            .update({
                last_announcement: new Date().toISOString()
            })
            .eq('id', user.id)

        revalidatePath('/dashboard/announcements')
        
        return { data: newAnnouncement, error: null }
    } catch (error) {
        return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
} 