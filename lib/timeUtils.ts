/**
 * Converts a 12-hour time string (e.g., "2:30 PM") to minutes since midnight.
 * 
 * @param timeStr - Time string in format "H:MM AM/PM" or "HH:MM AM/PM"
 * @returns Number of minutes since midnight, or 0 if parsing fails
 */
export function parse12HourToMinutes(timeStr: string): number {
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
    if (!match) return 0
    
    let hours = parseInt(match[1], 10)
    const minutes = parseInt(match[2], 10)
    const ampm = match[3].toUpperCase()
    
    if (ampm === 'PM' && hours !== 12) hours += 12
    if (ampm === 'AM' && hours === 12) hours = 0
    
    return hours * 60 + minutes
}

/**
 * Converts minutes since midnight to 12-hour format string (e.g., "2:30 PM").
 * 
 * @param minutes - Number of minutes since midnight
 * @returns Time string in format "H:MM AM/PM" or "HH:MM AM/PM"
 */
export function minutesTo12Hour(minutes: number): string {
    const hours = Math.floor(minutes / 60) % 24
    const mins = minutes % 60
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const hour12 = hours % 12 || 12
    return `${hour12}:${mins.toString().padStart(2, '0')} ${ampm}`
}

/**
 * Converts a 24-hour format time string (e.g., "14:30") to 12-hour format (e.g., "2:30 PM").
 * 
 * @param time24 - Time string in 24-hour format "HH:MM"
 * @returns Time string in 12-hour format "H:MM AM/PM" or "HH:MM AM/PM"
 */
export function convert24To12Hour(time24: string): string {
    const [hours, minutes] = time24.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
}

