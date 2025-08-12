"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bell, Plus, Trash2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { validateJummahTimes } from "@/lib/validation"

interface JummahTime {
  id: string
  name: string
  athan: string
  iqama: string
}

interface JummahTimesProps {
  jummahTimes: JummahTime[]
  onJummahTimesChange: (times: JummahTime[]) => void
}

export function JummahTimes({ jummahTimes, onJummahTimesChange }: JummahTimesProps) {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  // Validate jummah times and update error state
  useEffect(() => {
    const validation = validateJummahTimes(jummahTimes)
    const errors: Record<string, string> = {}
    
    if (!validation.isValid) {
      validation.errors.forEach(error => {
        errors[error.field] = error.message
      })
    }
    
    setValidationErrors(errors)
  }, [jummahTimes])

  const handleJummahTimeChange = (id: string, field: string, value: string) => {
    onJummahTimesChange(
      jummahTimes.map(time => 
        time.id === id ? { ...time, [field]: value } : time
      )
    )
  }

  const addJummahTime = () => {
    const newId = Date.now().toString()
    const newTime: JummahTime = {
      id: newId,
      name: `Jummah ${jummahTimes.length + 1}`,
      athan: "13:30",
      iqama: "13:45",
    }
    onJummahTimesChange([...jummahTimes, newTime])
    toast({
      title: "Jummah Time Added",
      description: "New Jummah prayer time created successfully.",
    })
  }

  const removeJummahTime = (id: string) => {
    if (jummahTimes.length > 1) {
      onJummahTimesChange(jummahTimes.filter(time => time.id !== id))
      toast({
        title: "Jummah Time Removed",
        description: "Jummah prayer time has been removed.",
      })
    } else {
      toast({
        title: "Cannot Remove",
        description: "At least one Jummah time must remain.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2 text-mosque-green" />
          Jummah Prayer Times
        </CardTitle>
        <CardDescription>Friday prayer times for your mosque (applies to all schedules)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jummahTimes.map((jummah, index) => (
            <div key={jummah.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-medium">{jummah.name}</Label>
                {jummahTimes.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeJummahTime(jummah.id)}
                    className="text-red-600 hover:bg-red-50 h-6 w-6 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`athan-${jummah.id}`} className="text-sm">
                    Athan Time
                  </Label>
                  <Input
                    id={`athan-${jummah.id}`}
                    type="time"
                    value={jummah.athan}
                    onChange={(e) => handleJummahTimeChange(jummah.id, "athan", e.target.value)}
                    className={`text-sm font-mono ${validationErrors[`jummahTimes.${index}.athan`] ? "border-red-500 focus:border-red-500" : ""}`}
                  />
                  {validationErrors[`jummahTimes.${index}.athan`] && (
                    <p className="text-xs text-red-600">{validationErrors[`jummahTimes.${index}.athan`]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`iqama-${jummah.id}`} className="text-sm">
                    Iqama Time
                  </Label>
                  <Input
                    id={`iqama-${jummah.id}`}
                    type="time"
                    value={jummah.iqama}
                    onChange={(e) => handleJummahTimeChange(jummah.id, "iqama", e.target.value)}
                    className={`text-sm font-mono ${validationErrors[`jummahTimes.${index}.iqama`] ? "border-red-500 focus:border-red-500" : ""}`}
                  />
                  {validationErrors[`jummahTimes.${index}.iqama`] && (
                    <p className="text-xs text-red-600">{validationErrors[`jummahTimes.${index}.iqama`]}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          <Button
            onClick={addJummahTime}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Jummah Time
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 