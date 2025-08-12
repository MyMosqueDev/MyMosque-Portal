import { useEffect, useState } from "react"
import { MosqueData } from "@/lib/types"
import { supabase } from "@/utils/supabase/client"

export const useMosque = ({mosqueId, setMosque}: {mosqueId: string , setMosque: (mosque: MosqueData) => void}) => {
    useEffect(() => {
        const fetchMosque = async () => {
            if (mosqueId) {
                    const [events, announcements, prayerTimes, mosqueInfo] = await Promise.all([
                        getMosqueEvents(),
                        getMosqueAnnouncements(),
                        getMosquePrayerTimes(),
                        getMosqueInfo()
                    ])
                    setMosque({
                        info: mosqueInfo,
                        announcements: announcements || [],
                        events: events || [],
                        prayerTimes: prayerTimes || []
                    } as MosqueData)
            }
        }
        fetchMosque()
    }, [mosqueId])

    const getMosqueInfo = async () => {
        const { data, error } = await supabase.from('mosques').select('*').eq('uid', mosqueId).single()
        if (error) {
            console.error('Error fetching mosque info:', error)
        } else {
            return data
        }
    }

    const getMosqueAnnouncements = async () => {
        const { data, error } = await supabase.from('announcements').select('*').eq('masjid_id', mosqueId)
        if (error) {
            console.error('Error fetching mosque announcements:', error)
        } else {
            return data
        }
    }

    const getMosqueEvents = async () => {
        const { data, error } = await supabase.from('events').select('*').eq('masjid_id', mosqueId)
        if (error) {
            console.error('Error fetching mosque events:', error)
        } else {
            return data
        }
    }

    const getMosquePrayerTimes = async () => {
        const { data, error } = await supabase.from('prayer_times').select('*').eq('masjid_id', mosqueId)
        if (error) {
            console.error('Error fetching mosque prayer times:', error)
        } else {
            return data
        }
    }
}