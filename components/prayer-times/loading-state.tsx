"use client"

import { DashboardHeader } from "@/components/dashboard-header"

export function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mosque-green mx-auto mb-4"></div>
            <p className="text-gray-600">Loading prayer schedules...</p>
          </div>
        </div>
      </div>
    </div>
  )
} 