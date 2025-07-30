"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <img src="/images/logo.png" alt="MyMosque Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold text-gray-900">MyMosque</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join MyMosque</h1>
          <p className="text-gray-600">Connect your mosque with your community</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Register Your Mosque</CardTitle>
            <CardDescription>Fill out the information below to get started with MyMosque</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mosqueName">Mosque Name *</Label>
                  <Input
                    id="mosqueName"
                    name="mosqueName"
                    placeholder="Al-Noor Mosque"
                    value={formData.mosqueName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@mosque.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Main St, City, State 12345"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">About Your Mosque</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Tell us about your mosque, its history, and community..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full bg-mosque-green hover:bg-mosque-green-light" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-mosque-blue hover:text-mosque-blue-light font-medium">
                  Sign In
                </Link>
              </p>
            </div>

            {/* Demo Notice */}
            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Demo Mode:</strong> Fill out any information to continue to the dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
