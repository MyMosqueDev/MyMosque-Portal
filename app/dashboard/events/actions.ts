'use server'

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { sanitizeInput } from "@/lib/utils";
import { revalidatePath } from 'next/cache'
import { EventFormData } from "@/lib/types";

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

function validateEvent(data: { title: string; description: string; date: string }) {
    const errors: string[] = []
    
    if (!data.title?.trim()) {
        errors.push("Title is required")
    } else if (data.title.length > 100) {
        errors.push("Title must be less than 100 characters")
    }
    
    if (!data.description?.trim()) {
        errors.push("Content is required")
    } else if (data.description.length > 500) {
        errors.push("Content must be less than 500 characters")
    }

    const date = new Date(data.date)
    if(date < new Date()) {
        errors.push("Date must be in the future")
    }
    return errors
}

export async function getEvents() {
    try {
        console.log('fetching events')
        const supabase = await createClient()

        // get current user
        const {data: {user}, error: userError} = await supabase.auth.getUser();
        if (userError || !user) {
            revalidatePath('/login')
            throw new Error('Authentication required')
        }

        // fetch events with ownership check
        const {data, error} = await supabase
        .from('events')
        .select('*')
        .eq('masjid_id', user.id === '8b8e68c7-4d65-4f39-8baa-b4687eef861e' ? 1 : user.id)
        .neq('status', 'deleted')
        .order('date', { ascending: false })
        if (error) {
            throw new Error('Failed to fetch events')
        }

        return { data: data || [], error: null }
    } catch (error) {
        return { data: [], error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

export async function createEvent(event: EventFormData) {
    console.log('creating event')
    try {
        const supabase = await createClient()

        // get current user
        const {data: {user}, error: userError} = await supabase.auth.getUser();
        if (userError || !user) {
            revalidatePath('/login')
            throw new Error('Authentication required')
        } 

        if (!event.host) {
            const {data: mosque, error: mosqueError} = await supabase
            .from('mosques')
            .select('name')
            .eq('id', user.id === '8b8e68c7-4d65-4f39-8baa-b4687eef861e' ? 1 : user.id)
            .single()
            if (mosqueError) {
                throw new Error('Failed to fetch mosque')
            }
            event.host = mosque.name
        }

        // validate event data
        const validationErrors = validateEvent(event)
        if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '))
        }

        // sanitize input
        const imageName = `${event.title.toLowerCase().replace(/\s+/g, '-') + '-' + event.date.split('T')[0]}.jpg`
        const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${imageName}`
        const sanitizedEvent = {
            ...event,
            title: sanitizeInput(event.title),
            description: sanitizeInput(event.description),
            host: sanitizeInput(event.host || ''),
            location: sanitizeInput(event.location),
            date: event.date,
            status: event.status,
            masjid_id: user.id === '8b8e68c7-4d65-4f39-8baa-b4687eef861e' ? 1 : user.id,
            image: imageUrl,
            created_at: new Date().toISOString(),
        }

        const {error: imageError} = await supabase.storage.from('images')
        .upload(imageName, event.image as File)
        if (imageError) {
            throw new Error(imageError.message)
        }

        const {data: newEvent, error: createError} = await supabase
            .from('events')
            .insert(sanitizedEvent)
            .select()
            .single()

        if (createError) {
            console.log('create error')
            console.log(createError.message)
            throw new Error('Failed to create event')
        }
        console.log(newEvent)

        await supabase
            .from('mosques')
            .update({
                last_event: new Date().toISOString()
            })
            .eq('id', user?.id === '8b8e68c7-4d65-4f39-8baa-b4687eef861e' ? 1 : user?.id)

        return { error: null }
        
    } catch (error) {
        return {data: null, error: error instanceof Error ? error.message : 'Unknown error'}
    }
}

export async function updateEvent(id: string, data: { title: string; description: string; date: string; host: string; location: string }) {
    try {
        const supabase = await createClient()
        
        // Validate input
        const validationErrors = validateEvent(data)
        if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '))
        }

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
            throw new Error('Authentication required')
        }

        // Verify ownership
        const { data: event, error: fetchError } = await supabase
            .from('events')
            .select('masjid_id')
            .eq('id', id)
            .single()

        if (fetchError || !event) {
            throw new Error('Event not found')
        }

        if (event.masjid_id !== (user.id === '8b8e68c7-4d65-4f39-8baa-b4687eef861e' ? 1 : user.id)) {
            throw new Error('You do not have permission to edit this event')
        }

        // Sanitize inputs
        const sanitizedData = {
            title: sanitizeInput(data.title),
            description: sanitizeInput(data.description),
            host: sanitizeInput(data.host),
            location: sanitizeInput(data.location),
            date: data.date,
            updated_at: new Date().toISOString()
        }

        // Update event
        const { data: updatedEvent, error: updateError } = await supabase
            .from('events')
            .update(sanitizedData)
            .eq('id', id)
            .eq('masjid_id', user.id === '8b8e68c7-4d65-4f39-8baa-b4687eef861e' ? 1 : user.id)
            .select()
            .single()

        if (updateError) {
            throw new Error('Failed to update event')
        }

        // Update mosque last_event timestamp
        await supabase
            .from('mosques')
            .update({
                last_event: new Date().toISOString()
            })
            .eq('id', user.id === '8b8e68c7-4d65-4f39-8baa-b4687eef861e' ? 1 : user.id)

        revalidatePath('/dashboard/events')
        
        return { data: updatedEvent, error: null }
    } catch (error) {
        return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

export async function deleteEvent(id: string) {
    try {
        const supabase = await createClient()
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
            throw new Error('Authentication required')
        }

        // Verify ownership
        const { data: event, error: fetchError } = await supabase
            .from('events')
            .select('masjid_id, image')
            .eq('id', id)
            .single()

        if (fetchError || !event) {
            throw new Error('Event not found')
        }

        if (event.masjid_id !== (user.id === '8b8e68c7-4d65-4f39-8baa-b4687eef861e' ? 1 : user.id)) {
            throw new Error('You do not have permission to delete this event')
        }

        // Soft delete
        const { error: deleteError } = await supabase
            .from('events')
            .update({
                status: 'deleted',
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('masjid_id', user.id === '8b8e68c7-4d65-4f39-8baa-b4687eef861e' ? 1 : user.id)

        if (deleteError) {
            throw new Error('Failed to delete event')
        }

        // Optionally delete the image from storage
        if (event.image) {
            try {
                const imageName = event.image.split('/').pop()
                if (imageName) {
                    await supabase.storage.from('images').remove([imageName])
                }
            } catch (storageError) {
                console.log('Failed to delete image from storage:', storageError)
            }
        }

        revalidatePath('/dashboard/events')
        
        return { error: null }
    } catch (error) {
        return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
}