import { DateRangePrayerTimes } from "./types"

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

export function validatePrayerSchedule(data: DateRangePrayerTimes): ValidationResult {
  const errors: ValidationError[] = []

  // Validate name
  if (!data.name || data.name.trim().length === 0) {
    errors.push({ field: "name", message: "Schedule name is required" })
  } else if (data.name.trim().length < 2) {
    errors.push({ field: "name", message: "Schedule name must be at least 2 characters" })
  }

  // Validate dates
  if (!data.startDate) {
    errors.push({ field: "startDate", message: "Start date is required" })
  }

  if (!data.endDate) {
    errors.push({ field: "endDate", message: "End date is required" })
  }

  if (data.startDate && data.endDate) {
    const startDate = new Date(data.startDate)
    const endDate = new Date(data.endDate)
    
    if (startDate > endDate) {
      errors.push({ field: "endDate", message: "End date must be after start date" })
    }
  }

  // Validate prayer times
  const prayerTimes = data.prayerTimes
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/

  Object.entries(prayerTimes).forEach(([prayer, time]) => {
    if (!time) {
      errors.push({ field: `prayerTimes.${prayer}`, message: `${prayer} prayer time is required` })
    } else if (!timeRegex.test(time)) {
      errors.push({ field: `prayerTimes.${prayer}`, message: `${prayer} prayer time must be in HH:MM format` })
    }
  })

  // Validate increment values
  const incrementValues = data.incrementValues
  Object.entries(incrementValues).forEach(([prayer, value]) => {
    if (typeof value !== 'number' || value < 0) {
      errors.push({ field: `incrementValues.${prayer}`, message: `${prayer} increment value must be a non-negative number` })
    }
  })

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateDateOverlap(
  startDate: string, 
  endDate: string, 
  existingSchedules: DateRangePrayerTimes[], 
  excludeId?: string
): ValidationResult {
  const errors: ValidationError[] = []

  if (!startDate || !endDate) {
    return { isValid: true, errors: [] }
  }

  const newStart = new Date(startDate)
  const newEnd = new Date(endDate)

  const hasOverlap = existingSchedules.some(schedule => {
    if (excludeId && schedule.id === excludeId) return false
    if (!schedule.startDate || !schedule.endDate) return false

    const existingStart = new Date(schedule.startDate)
    const existingEnd = new Date(schedule.endDate)

    return newStart <= existingEnd && newEnd >= existingStart
  })

  if (hasOverlap) {
    errors.push({
      field: "dateRange",
      message: "This schedule overlaps with another existing schedule"
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateJummahTimes(jummahTimes: Array<{ id: string; name: string; athan: string; iqama: string }>): ValidationResult {
  const errors: ValidationError[] = []

  if (jummahTimes.length === 0) {
    errors.push({ field: "jummahTimes", message: "At least one Jummah time is required" })
  }

  jummahTimes.forEach((jummah, index) => {
    if (!jummah.name || jummah.name.trim().length === 0) {
      errors.push({ field: `jummahTimes.${index}.name`, message: "Jummah name is required" })
    }

    if (!jummah.athan) {
      errors.push({ field: `jummahTimes.${index}.athan`, message: "Athan time is required" })
    }

    if (!jummah.iqama) {
      errors.push({ field: `jummahTimes.${index}.iqama`, message: "Iqama time is required" })
    }

    if (jummah.athan && jummah.iqama) {
      const athanTime = new Date(`2000-01-01T${jummah.athan}`)
      const iqamaTime = new Date(`2000-01-01T${jummah.iqama}`)
      
      if (iqamaTime <= athanTime) {
        errors.push({ 
          field: `jummahTimes.${index}.iqama`, 
          message: "Iqama time must be after athan time" 
        })
      }
    }
  })

  return {
    isValid: errors.length === 0,
    errors
  }
} 