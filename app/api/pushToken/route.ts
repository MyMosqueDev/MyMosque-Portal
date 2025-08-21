import { supabase } from '@/utils/supabase/client'
import { NextRequest, NextResponse } from 'next/server'


export async function GET(request: NextRequest) {
    return NextResponse.json({ message: 'Hello from Next.js!' })
}

export async function POST(request: NextRequest) {
    const data = await request.json()
    const settings = JSON.parse(data.settings)

    if (data.mosqueId === 'ff37ab83-a461-4af2-9042-2d908329df27') {
        return NextResponse.json({ status: 'success' })
    }

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
                    events: settings.events.enabled,
                    announcements: settings.announcements.enabled,
                    prayer_times: false,
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
                    events: settings.events.enabled,
                    announcements: settings.announcements.enabled,
                    prayer_times: false,
                    prayer_time_settings: null
                })
                .select()
                .single());
        }

    if (notificationError) {
        console.error('Database error fetching prayer times:', notificationError)
        return NextResponse.json({ message: 'Error updating notification: ' + notificationError.message }, { status: 500 })
    }

    return NextResponse.json({ status: 'success' })
} 