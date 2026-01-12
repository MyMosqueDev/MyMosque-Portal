import { supabase } from '@/utils/supabase/client'
import { NextRequest, NextResponse } from 'next/server'
import { sendNotifications } from '@/lib/notifications'


export async function GET(request: NextRequest) {
    return NextResponse.json({ message: 'Hello from Next.js!' })
}

export async function POST(request: NextRequest) {
    const data = await request.json()
    if (!data.mosqueId || !data.pushToken || !data.settings) {
        return NextResponse.json({ status: 'error', message: 'Invalid data' }, { status: 400 })
    }

    // if (data.mosqueId === 'ff37ab83-a461-4af2-9042-2d908329df27') {
    //     return NextResponse.json({ status: 'success' })
    // }

    const { data: existing, error: findError } = await supabase
        .from('notifications')
        .select('id')
        .eq('push_token', data.pushToken)
        .eq('masjid_id', data.mosqueId)
        .maybeSingle();
        let notification, notificationError;

        if (existing) {
            ({ data: notification, error: notificationError } = await supabase
                .from('notifications')
                .update({
                    events: data.settings.events.enabled,
                    announcements: data.settings.announcements.enabled,
                    prayer_times: data.settings.prayer_times.enabled,
                })
                .eq('id', existing.id)
                .select()
                .single());
        } else {
            ({ data: notification, error: notificationError } = await supabase
                .from('notifications')
                .insert({
                    push_token: data.pushToken,
                    masjid_id: data.mosqueId,
                    events: data.settings.events.enabled,
                    announcements: data.settings.announcements.enabled,
                    prayer_times: data.settings.prayer_times.enabled,
                    prayer_time_settings: null
                })
                .select()
                .single());
        }

    if (notificationError) {
        console.error('Database error fetching prayer times:', notificationError)
        return NextResponse.json({ message: 'Error updating notification: ' + notificationError.message }, { status: 500 })
    }

    if (findError) {
        console.error('Database error fetching notification:', findError)
        return NextResponse.json({ message: 'Error updating notification: ' + findError.message }, { status: 500 })
    }

    return NextResponse.json({ status: 'success' })
} 