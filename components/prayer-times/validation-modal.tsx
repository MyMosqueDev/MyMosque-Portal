"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, XCircle, Loader2 } from "lucide-react"
import { DateRangePrayerTimes } from "@/lib/types"
import { validatePrayerSchedule, validateDateOverlap, validateJummahTimes } from "@/lib/validation"

interface ValidationError {
  field: string
  message: string
}

interface ValidationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  dateRanges: DateRangePrayerTimes[]
  activeSchedule: string
  jummahTimes: Array<{ id: string; name: string; athan: string; iqama: string }>
  isLoading?: boolean
}

export function ValidationModal({
  isOpen,
  onClose,
  onConfirm,
  dateRanges,
  activeSchedule,
  jummahTimes,
  isLoading = false
}: ValidationModalProps) {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])

  // Run validation when modal opens
  useEffect(() => {
    if (isOpen) {
      const errors: ValidationError[] = []
      
      // Validate active schedule
      const currentSchedule = dateRanges.find(range => range.id === activeSchedule)
      if (currentSchedule) {
        const scheduleValidation = validatePrayerSchedule(currentSchedule)
        if (!scheduleValidation.isValid) {
          errors.push(...scheduleValidation.errors)
        }
        
        // Check for date overlaps
        const overlapValidation = validateDateOverlap(
          currentSchedule.startDate,
          currentSchedule.endDate,
          dateRanges,
          currentSchedule.id
        )
        if (!overlapValidation.isValid) {
          errors.push(...overlapValidation.errors)
        }
      }
      
      // Validate jummah times
      const jummahValidation = validateJummahTimes(jummahTimes)
      if (!jummahValidation.isValid) {
        errors.push(...jummahValidation.errors)
      }
      
      setValidationErrors(errors)
    }
  }, [isOpen, dateRanges, activeSchedule, jummahTimes])

  const hasErrors = validationErrors.length > 0

  const getFieldDisplayName = (field: string): string => {
    const fieldMap: Record<string, string> = {
      name: "Schedule Name",
      startDate: "Start Date",
      endDate: "End Date",
      "prayerTimes.fajr": "Fajr Prayer Time",
      "prayerTimes.dhuhr": "Dhuhr Prayer Time",
      "prayerTimes.asr": "Asr Prayer Time",
      "prayerTimes.maghrib": "Maghrib Prayer Time",
      "prayerTimes.isha": "Isha Prayer Time",
      "incrementValues.fajr": "Fajr Increment",
      "incrementValues.dhuhr": "Dhuhr Increment",
      "incrementValues.asr": "Asr Increment",
      "incrementValues.maghrib": "Maghrib Increment",
      "incrementValues.isha": "Isha Increment",
      dateRange: "Date Range",
      jummahTimes: "Jummah Times",
    }

    // Handle jummah time fields
    if (field.startsWith("jummahTimes.")) {
      const parts = field.split(".")
      const index = parseInt(parts[1])
      const fieldName = parts[2]
      const jummahName = jummahTimes[index]?.name || `Jummah ${index + 1}`
      
      const jummahFieldMap: Record<string, string> = {
        name: "Name",
        athan: "Athan Time",
        iqama: "Iqama Time"
      }
      
      return `${jummahName} - ${jummahFieldMap[fieldName] || fieldName}`
    }

    return fieldMap[field] || field
  }

  const handleConfirm = () => {
    if (!hasErrors) {
      onConfirm()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {hasErrors ? (
              <>
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Validation Errors Found
              </>
            ) : (
              <>
                <Loader2 className="h-5 w-5 text-mosque-green animate-spin" />
                Saving Changes
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {hasErrors 
              ? "Please fix the following issues before saving:"
              : "Please wait while we save your changes..."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {hasErrors ? (
            <div className="space-y-3">
              {validationErrors.map((error, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-red-800">
                      {getFieldDisplayName(error.field)}
                    </div>
                    <div className="text-sm text-red-700">
                      {error.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader2 className="h-8 w-8 text-mosque-green animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Saving your changes...</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={hasErrors || isLoading}
            className={hasErrors || isLoading ? "opacity-50 cursor-not-allowed" : ""}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : hasErrors ? (
              "Fix Issues First"
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 