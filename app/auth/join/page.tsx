"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function JoinPage() {
  const [formData, setFormData] = useState({
    mosqueName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
    description: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Dummy registration - always succeeds after 1.5 seconds
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1500)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8 md:py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4 md:mb-6">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <Image src="/images/logo.png" alt="MyMosque Logo" width={32} height={32} className="w-full h-full object-contain" />
            </div>
            <span className="text-lg md:text-xl font-bold text-gray-900">MyMosque</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Join MyMosque</h1>
          <p className="text-sm md:text-base text-gray-600">Connect your mosque with your community</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="pb-4 md:pb-6">
            <CardTitle className="text-lg md:text-xl">Register Your Mosque</CardTitle>
            <CardDescription className="text-sm md:text-base">Fill out the information below to get started with MyMosque</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mosqueName" className="text-sm md:text-base">Mosque Name *</Label>
                  <Input
                    id="mosqueName"
                    name="mosqueName"
                    placeholder="Al-Noor Mosque"
                    value={formData.mosqueName}
                    onChange={handleInputChange}
                    required
                    className="h-10 md:h-11 text-sm md:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm md:text-base">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@mosque.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-10 md:h-11 text-sm md:text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm md:text-base">Password *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="h-10 md:h-11 text-sm md:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm md:text-base">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="h-10 md:h-11 text-sm md:text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm md:text-base">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Main St, City, State 12345"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="h-10 md:h-11 text-sm md:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm md:text-base">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="h-10 md:h-11 text-sm md:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm md:text-base">About Your Mosque</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Tell us about your mosque, its history, and community..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="text-sm md:text-base resize-none"
                />
              </div>

              <Button type="submit" className="w-full bg-mosque-green hover:bg-mosque-green-light h-10 md:h-11 text-sm md:text-base" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-4 md:mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-mosque-blue hover:text-mosque-blue-light font-medium">
                  Sign In
                </Link>
              </p>
            </div>

            {/* Demo Notice */}
            <div className="mt-4 md:mt-6 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs md:text-sm text-blue-800">
                <strong>Demo Mode:</strong> Fill out any information to continue to the dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
