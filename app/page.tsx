import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Bell, Calendar, Users, Smartphone, Globe, Star, Heart, Moon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Masjid Network",
      description:
        "Connect with and follow your favorite masjids to stay updated with their latest activities and announcements",
      gradient: "from-mosque-green/20 to-mosque-blue/20",
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: "Real-time Announcements",
      description:
        "Receive instant notifications about important mosque announcements, community updates, and urgent messages",
      gradient: "from-mosque-blue/20 to-mosque-purple/20",
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Event Management",
      description:
        "Stay informed about upcoming events, programs, lectures, and community gatherings at your connected masjids",
      gradient: "from-mosque-purple/20 to-mosque-green/20",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Prayer Times",
      description: "Access accurate, location-based prayer times for your local masjids with automatic updates",
      gradient: "from-mosque-green/20 to-mosque-blue/20",
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Push Notifications",
      description: "Get real-time alerts for announcements, event reminders, and prayer time notifications",
      gradient: "from-mosque-blue/20 to-mosque-purple/20",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Community Connection",
      description:
        "Bridge the gap between masjid administration and community members through seamless digital communication",
      gradient: "from-mosque-purple/20 to-mosque-green/20",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-mosque-green/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-mosque-blue/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-mosque-purple/10 to-transparent rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Floating Stars */}
        <Star className="absolute top-32 left-1/4 h-4 w-4 text-mosque-green/30 animate-pulse" />
        <Star className="absolute top-64 right-1/3 h-3 w-3 text-mosque-blue/40 animate-pulse delay-500" />
        <Moon className="absolute top-48 right-1/4 h-5 w-5 text-mosque-purple/30 animate-pulse delay-1000" />
        <Heart className="absolute bottom-1/3 left-1/5 h-4 w-4 text-mosque-green/30 animate-pulse delay-1500" />
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl sticky top-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl shadow-lg overflow-hidden">
              <img src="/images/logo.png" alt="MyMosque Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-mosque-green to-mosque-blue bg-clip-text text-transparent">
              MyMosque
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="rounded-full hover:bg-white/50">
                Log In
              </Button>
            </Link>
            <Link href="/auth/join">
              <Button className="bg-gradient-to-r from-mosque-green to-mosque-blue hover:from-mosque-green-light hover:to-mosque-blue-light rounded-full shadow-lg">
                Join
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-4">
        <div className="container mx-auto text-center relative z-10">
          <Badge className="mb-8 bg-mosque-green/20 text-mosque-green border-mosque-green/20 rounded-full px-6 py-2 shadow-lg backdrop-blur-sm">
            Connecting Communities
          </Badge>

          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-mosque-green via-mosque-blue to-mosque-purple bg-clip-text text-transparent">
              Bridge Your Mosque
            </span>
            <br />
            <span className="text-gray-800">with Your Community</span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            MyMosque is a comprehensive platform that connects masjid administrators with their community members
            through real-time announcements, event management, and seamless digital communication.
            <span className="text-mosque-blue font-medium"> Experience the future of mosque community management.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/auth/join">
              <Button
                size="lg"
                className="bg-gradient-to-r from-mosque-green to-mosque-blue hover:from-mosque-green-light hover:to-mosque-blue-light rounded-full px-8 py-4 text-lg shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Start Your Journey
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-4 text-lg border-2 border-mosque-blue/30 hover:bg-mosque-blue/5 backdrop-blur-sm bg-transparent"
              >
                Discover More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Hero Cards */}
      <section className="px-4 mb-24 relative">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Main Hero Image */}
            <div className="md:col-span-2 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
                <Image
                  src="/images/nueces.jpg"
                  alt="Nueces Mosque Image"
                  width={1200}
                  height={600}
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-3xl font-bold mb-3">Empowering Sacred Connections</h3>
                  <p className="text-lg opacity-90">Where tradition meets innovation</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl transform hover:scale-105 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-mosque-green to-mosque-blue rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">100+</h4>
                  <p className="text-gray-600">People Connected</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl transform hover:scale-105 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-mosque-blue to-mosque-purple rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Bell className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">100+</h4>
                  <p className="text-gray-600">Daily Notifications</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 relative">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-mosque-purple/20 text-mosque-purple border-mosque-purple/20 rounded-full px-6 py-2">
              Magical Features
            </Badge>
            <h2 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-mosque-blue to-mosque-purple bg-clip-text text-transparent">
                Everything Your Mosque
              </span>
              <br />
              <span className="text-gray-900">Dreams Of</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive features designed to strengthen the sacred bond between your mosque and community members.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border-0 shadow-xl rounded-3xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>
                <CardHeader className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-mosque-green/20 to-mosque-blue/20 rounded-2xl flex items-center justify-center text-mosque-blue mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-mosque-blue transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-mosque-green to-mosque-blue bg-clip-text text-transparent">
                Your Journey
              </span>
              <br />
              <span className="text-gray-900">in Three Simple Steps</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Begin your transformation with these magical steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-mosque-green to-mosque-blue rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <div className="absolute -inset-4 bg-gradient-to-br from-mosque-green/20 to-mosque-blue/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Sign Up Your Mosque</h3>
              <p className="text-gray-600 leading-relaxed">
                Register your sacred space and set up your profile with love, care, and attention to detail.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-mosque-blue to-mosque-purple rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <div className="absolute -inset-4 bg-gradient-to-br from-mosque-blue/20 to-mosque-purple/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Create & Share</h3>
              <p className="text-gray-600 leading-relaxed">
                Use our intuitive dashboard to share announcements, manage events, and spread joy throughout your
                community.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-mosque-purple to-mosque-green rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <div className="absolute -inset-4 bg-gradient-to-br from-mosque-purple/20 to-mosque-green/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Connect Hearts</h3>
              <p className="text-gray-600 leading-relaxed">
                Watch as your community members connect, engage, and grow together through the beautiful mobile
                experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto text-center relative z-10">
          <div className="bg-gradient-to-br from-mosque-green via-mosque-blue to-mosque-purple rounded-3xl p-12 md:p-16 shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 border border-white rounded-full"></div>
              <div className="absolute top-20 right-20 w-16 h-16 border border-white rounded-full"></div>
              <div className="absolute bottom-16 left-1/4 w-12 h-12 border border-white rounded-full"></div>
              <div className="absolute bottom-20 right-1/3 w-24 h-24 border border-white rounded-full"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-5xl font-bold text-white mb-6">
                Ready to Transform
                <br />
                Your Community?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
                Join our network of mosques using MyMosque to create magical connections and strengthen your community
                bonds.
              </p>
              <Link href="/auth/join">
                <Button
                  size="lg"
                  className="bg-white text-mosque-green hover:bg-gray-50 rounded-full px-10 py-4 text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Strengthen Your Community
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-16 px-4 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 rounded-2xl shadow-lg overflow-hidden">
                <img src="/images/logo.png" alt="MyMosque Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-mosque-green to-mosque-blue bg-clip-text text-transparent">
                MyMosque
              </span>
            </div>
            <p className="text-center md:text-right">
              © 2025 MyMosque. Connecting communities, one mosque at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
