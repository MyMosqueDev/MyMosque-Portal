export type User = {
    id: string | number
    email: string
}

export type MosqueInfo = {
    name: string;
    id: string;
    address: string;
    images?: string[] | null;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    hours: {
        monday: string;
        tuesday: string;
        wednesday: string;
        thursday: string;
        friday: string;
        saturday: string;
        sunday: string;
    },
    last_announcement: string | null;
    last_event: string | null;
    last_prayer: string | null;
    last_prayer_time: string | null;
    stars: number;
    jummah_times?: JummahTime[];
    prayer_settings?: PrayerSettings;
}

export type JummahTime = {
    id: string;
    name: string;
    athan: string;
    iqama: string;
}

export type PrayerSettings = {
    autoUpdate: boolean;
    sendNotifications: boolean;
    adjustForDST: boolean;
    hanafiAsr: boolean;
    calculationMethod: string;
}

export type MosqueData = {
    info: MosqueInfo;
    announcements: Announcement[];
    events: Event[];
    prayerTimes: PrayerTime[];
}

export type Event = {
    id: string;
    title: string;
    description: string;
    date: string;
    host: string;
    location: string;
    image: string;
    mosqueName?: string;
    displayDate?: string;
    status: "published" | "draft" | "deleted" | null;
}

export type EventFormData = {
    title: string;
    description: string;
    date: string;
    host?: string;
    location: string;
    image: File | null;
    status: "published" | "draft" | "deleted" | null;
}

export type PrayerTime = {
    fajr: { adhan: string; iqama: string };
    dhuhr: { adhan: string; iqama: string };
    asr: { adhan: string; iqama: string };
    maghrib: { adhan: string; iqama: string };
    isha: { adhan: string; iqama: string };
    nextPrayer: {
        name: string;
        minutesToNextPrayer: number;
        percentElapsed: number;
    };
}

export type Announcement = {
    id?: string;
    created_at: string ;
    title: string;
    description: string;
    date?: string;
    severity: "low" | "medium" | "high";
    status: "published" | "draft" | "deleted" | null;
    updated_at?: string;
    masjid_id?: string;
}

export type DateRangePrayerTimes ={
    id: string
    name: string
    startDate: string
    endDate: string
    status: "active" | "inactive" | "deleted" | null;
    prayerTimes: {
        fajr: string
        dhuhr: string
        asr: string
        maghrib: string
        isha: string
    }
    timeMode: {
        fajr: "static" | "increment"
        dhuhr: "static" | "increment"
        asr: "static" | "increment"
        maghrib: "static" | "increment"
        isha: "static" | "increment"
    }
    incrementValues: {
        fajr: number
        dhuhr: number
        asr: number
        maghrib: number
        isha: number
    }
}
