"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { submitBetaSignup } from "./actions"
import Link from "next/link"
import Image from "next/image"
import { Smartphone, CheckCircle2, ArrowLeft, Sparkles } from "lucide-react"

export default function AndroidBetaPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await submitBetaSignup({
        name: formData.name.trim(),
        email: formData.email.trim(),
      })

      if (result.error) {
        toast.error(result.error)
        setIsLoading(false)
      } else {
        toast.success("Successfully signed up for Android beta!")
        setIsSubmitted(true)
        setFormData({ name: "", email: "" })
        setIsLoading(false)
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-4 md:left-10 w-48 md:w-72 h-48 md:h-72 bg-gradient-to-br from-mosque-green/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-4 md:right-20 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-br from-mosque-blue/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-64 md:w-80 h-64 md:h-80 bg-gradient-to-br from-mosque-purple/10 to-transparent rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl shadow-lg overflow-hidden">
                <Image src="/images/logo.png" alt="MyMosque Logo" width={32} height={32} className="w-full h-full object-contain" />
              </div>
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-mosque-green to-mosque-blue bg-clip-text text-transparent">
                MyMosque
              </span>
            </div>
            
            <Link href="/">
              <Button variant="ghost" className="rounded-full hover:bg-white/50 text-xs md:text-sm px-2 md:px-4">
                <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Content */}
        <section className="relative py-6 md:py-24 px-0 md:px-4">
          <div className="w-full md:container md:mx-auto md:max-w-2xl relative z-10">
            <div className="text-center mb-8 md:mb-12 px-4 md:px-0">
              <Badge className="mb-4 bg-mosque-green/20 text-mosque-green border-mosque-green/20 rounded-full px-4 md:px-6 py-2 shadow-lg backdrop-blur-sm text-sm md:text-base">
                <CheckCircle2 className="h-3 w-3 mr-2 inline" />
                Success!
              </Badge>
              <h1 className="text-3xl md:text-6xl font-bold mb-3 md:mb-4 px-2">
                <span className="bg-gradient-to-r from-mosque-green via-mosque-blue to-mosque-purple bg-clip-text text-transparent">
                  Thank You!
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-600 px-4">
                You've successfully signed up for the Android beta. We'll notify you when the app is ready!
              </p>
            </div>

            <Card className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border-0 shadow-xl rounded-none md:rounded-3xl mb-6 md:mb-8">
              <CardContent className="p-4 md:p-8">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="rounded-full bg-gradient-to-br from-mosque-green to-mosque-blue p-6 md:p-8 shadow-lg">
                      <CheckCircle2 className="h-12 w-12 md:h-16 md:w-16 text-white" />
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button
                      asChild
                      size="lg"
                      className="bg-gradient-to-r from-mosque-green to-mosque-blue hover:from-mosque-green-light hover:to-mosque-blue-light rounded-full px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base shadow-xl transform hover:scale-105 transition-all duration-300 w-full md:w-auto"
                    >
                      <Link href="/">Return to Home</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <footer className="py-12 md:py-16 px-4 relative overflow-hidden">
          <div className="container mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl shadow-lg overflow-hidden">
                  <Image src="/images/logo.png" alt="MyMosque Logo" width={32} height={32} className="w-full h-full object-contain" />
                </div>
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-mosque-green to-mosque-blue bg-clip-text text-transparent">
                  MyMosque
                </span>
              </div>
              <p className="text-center md:text-right text-sm md:text-base">
                © 2025 MyMosque. Connecting communities, one mosque at a time.
              </p>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-4 md:left-10 w-48 md:w-72 h-48 md:h-72 bg-gradient-to-br from-mosque-green/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-4 md:right-20 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-br from-mosque-blue/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-64 md:w-80 h-64 md:h-80 bg-gradient-to-br from-mosque-purple/10 to-transparent rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl shadow-lg overflow-hidden">
              <Image src="/images/logo.png" alt="MyMosque Logo" width={32} height={32} className="w-full h-full object-contain" />
            </div>
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-mosque-green to-mosque-blue bg-clip-text text-transparent">
              MyMosque
            </span>
          </div>
          
          <Link href="/">
            <Button variant="ghost" className="rounded-full hover:bg-white/50 text-xs md:text-sm px-2 md:px-4">
              <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="relative py-6 md:py-24 px-0 md:px-4">
        <div className="w-full md:container md:mx-auto md:max-w-2xl relative z-10">
          <div className="text-center mb-8 md:mb-12 px-4 md:px-0">
            <Badge className="mb-4 bg-mosque-green/20 text-mosque-green border-mosque-green/20 rounded-full px-4 md:px-6 py-2 shadow-lg backdrop-blur-sm text-sm md:text-base">
              <Sparkles className="h-3 w-3 mr-2 inline" />
              Android Beta
            </Badge>
            <h1 className="text-3xl md:text-6xl font-bold mb-3 md:mb-4 px-2">
              <span className="bg-gradient-to-r from-mosque-green via-mosque-blue to-mosque-purple bg-clip-text text-transparent">
                Join the Beta
              </span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 px-4">
              Be among the first to experience MyMosque on Android. Sign up to get early access!
            </p>
          </div>

          <Card className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border-0 shadow-xl rounded-none md:rounded-3xl mb-6 md:mb-8">
            <CardHeader className="p-4 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 mb-4">
                <CardTitle className="text-xl md:text-3xl font-bold text-gray-900">
                  Beta Signup Form
                </CardTitle>
                <Badge className="bg-mosque-blue/20 text-mosque-blue border-mosque-blue/20 w-fit">
                  <Smartphone className="h-3 w-3 mr-1.5 inline" />
                  Early Access
                </Badge>
              </div>
              <CardDescription className="text-sm md:text-lg text-gray-600">
                Fill out your information below to join the Android beta program
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-8 pt-0">
              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm md:text-base font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="h-11 md:h-12 text-base md:text-base border-gray-200 focus:border-mosque-green focus:ring-mosque-green"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm md:text-base font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-11 md:h-12 text-base md:text-base border-gray-200 focus:border-mosque-green focus:ring-mosque-green"
                    disabled={isLoading}
                  />
                  <p className="text-xs md:text-sm text-gray-500 mt-1.5">
                    We'll use this email to notify you when the beta is available
                  </p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-mosque-green to-mosque-blue hover:from-mosque-green-light hover:to-mosque-blue-light rounded-full px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base shadow-xl transform hover:scale-105 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Sign Up for Beta"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center px-4 md:px-0">
            <Link href="/">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base w-full md:w-auto"
              >
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 md:py-16 px-4 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl shadow-lg overflow-hidden">
                <Image src="/images/logo.png" alt="MyMosque Logo" width={32} height={32} className="w-full h-full object-contain" />
              </div>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-mosque-green to-mosque-blue bg-clip-text text-transparent">
                MyMosque
              </span>
            </div>
            <p className="text-center md:text-right text-sm md:text-base">
              © 2025 MyMosque. Connecting communities, one mosque at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
