"use client"

import type React from "react"

import { login } from './actions'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
export default function LoginPage() {
  // TODO: Remove this once out of dev
  const [email, setEmail] = useState("ali.vayani2006@gmail.com")
  const [password, setPassword] = useState("nuececmosque")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

          const result = await login({ email, password })
      if (result.error) {
        console.error(result.error)
        setError("Invalid email or password. Please try again.")
              } else if (result.user) {
          const user = result.user
          localStorage.setItem('authenticatedUser', JSON.stringify(user))
          router.push('/dashboard')
        }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <Image src="/images/logo.png" alt="MyMosque Logo" width={32} height={32} className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold text-gray-900">MyMosque</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your mosque dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your mosque dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="mosque@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full bg-mosque-green hover:bg-mosque-green-light" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {"Don't have an account? "}
                <Link href="/auth/join" className="text-mosque-blue hover:text-mosque-blue-light font-medium">
                  Join MyMosque
                </Link>
              </p>
            </div>

            {/* Demo Notice */}
            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Demo Mode:</strong> Enter any email and password to continue to the dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}