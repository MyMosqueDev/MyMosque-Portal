'use server'

import { sanitizeInput } from "@/lib/utils";
import { revalidatePath } from 'next/cache'
import { EventFormData } from "@/lib/types";
import { createSupabaseClient, getCurrentUser } from "@/lib/supabase";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { Event } from "@/lib/types";
import { sendNotifications } from "@/lib/notifications";

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

async function verifyEventOwnership(supabase: SupabaseClient, id: string, user: User) {
    const {data: event, error: fetchError} = await supabase
        .from('events')
        .select('masjid_id')
        .eq('id', id)
        .single()
    if (fetchError || !event) {
        throw new Error('Event not found')
    }
    if (event.masjid_id !== user.id) {
        throw new Error('You do not have permission to edit this event')
    }
    return event as Event
}

async function updateMosqueLastEvent(supabase: SupabaseClient, user: User) {
    await supabase
        .from('mosques')
        .update({
            last_event: new Date().toISOString()
        })
        .eq('uid', user.id)
}

export async function getEvents() {
    try {
        const supabase = await createSupabaseClient()
        const user = await getCurrentUser(supabase)

        // fetch events with ownership check
        const {data, error} = await supabase
            .from('events')
            .select('*')
            .eq('masjid_id', user.id)
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
    try {
        const supabase = await createSupabaseClient()
        const user = await getCurrentUser(supabase)

        // if no host, use mosque name
        if (!event.host) {
            const {data: mosque, error: mosqueError} = await supabase
            .from('mosques')
            .select('name')
            .eq('uid', user.id)
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
            masjid_id: user.id,
            image: imageUrl,
            created_at: new Date().toISOString(),
        }

        // upload image to supabase storage
        const {error: imageError} = await supabase.storage.from('images')
            .upload(imageName, event.image as File)
        if (imageError) {
            throw new Error(imageError.message)
        }

        // create event
        const {data: newEvent, error: createError} = await supabase
            .from('events')
            .insert(sanitizedEvent)
            .select()
            .single()

        if (createError) {
            throw new Error('Failed to create event')
        }

        const {data: pushTokens, error: fetchError} = await supabase
            .from('notifications')
            .select('push_token')
            .eq('masjid_id', user.id)
            .eq('events', true);
            
            sendNotifications({
                pushTokens: pushTokens,
                title: `${newEvent.host}: ${newEvent.title}`,
                body: newEvent.description,
            })

        await updateMosqueLastEvent(supabase, user);

        return { error: null }
        
    } catch (error) {
        return {data: null, error: error instanceof Error ? error.message : 'Unknown error'}
    }
}

export async function updateEvent(id: string, data: { title: string; description: string; date: string; host: string; location: string }) {
    try {
        const supabase = await createSupabaseClient()
        const user = await getCurrentUser(supabase)
        
        // validate event data
        const validationErrors = validateEvent(data)
        if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '))
        }

        // Verify ownership
        await verifyEventOwnership(supabase, id, user)

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
            .eq('masjid_id', user.id)
            .select()
            .single()

        if (updateError) {
            throw new Error('Failed to update event')
        }

        await updateMosqueLastEvent(supabase, user);

        revalidatePath('/dashboard/events')
        
        return { data: updatedEvent, error: null }
    } catch (error) {
        return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

export async function deleteEvent(id: string) {
    try {
        const supabase = await createSupabaseClient()
        const user = await getCurrentUser(supabase)

        // Verify ownership
        const event: Event = await verifyEventOwnership(supabase, id, user)

        // Soft delete
        const { error: deleteError } = await supabase
            .from('events')
            .update({
                status: 'deleted',
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('masjid_id', user.id)

        if (deleteError) {
            throw new Error('Failed to delete event')
        }

        await updateMosqueLastEvent(supabase, user);

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