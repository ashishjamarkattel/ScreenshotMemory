import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Camera, HardDrive, Download, ArrowRight, 
  Shield, Zap, Cloud, Layout, 
  CheckCircle2, ExternalLink, Search, FolderKanban, Share2, Plus, Image, Check, Minus, MessageSquare
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Twitter, Instagram, Linkedin } from "lucide-react";

const features = [
  {
    icon: <Shield className="w-6 h-6 text-purple-400" />,
    title: "Secure Storage",
    description: "End-to-end encryption for all your memories"
  },
  {
    icon: <Zap className="w-6 h-6 text-blue-400" />,
    title: "AI-Powered",
    description: "Smart organization with AI image analysis"
  },
  {
    icon: <Cloud className="w-6 h-6 text-pink-400" />,
    title: "Cloud Sync",
    description: "Access your memories from any device"
  }
];

const dashboardFeatures = [
  {
    title: "AI-Powered Organization",
    description: "Automatically categorize and tag your screenshots",
    icon: <Zap className="w-5 h-5" />,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10"
  },
  {
    title: "Smart Search",
    description: "Find any memory with natural language search",
    icon: <Search className="w-5 h-5" />,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10"
  },
  {
    title: "Custom Spaces",
    description: "Create dedicated spaces for different projects",
    icon: <FolderKanban className="w-5 h-5" />,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10"
  },
  {
    title: "Quick Share",
    description: "Share memories with your team instantly",
    icon: <Share2 className="w-5 h-5" />,
    color: "text-green-400",
    bgColor: "bg-green-400/10"
  }
];

const faqItems = [
  {
    question: "What is MemoriesHub and how can it help me?",
    answer: "MemoriesHub is an AI-powered platform that helps you organize and analyze your screenshots and images. It automatically generates descriptions, extracts key information, and makes your visual content searchable and more accessible."
  },
  {
    question: "How does the AI analysis work?",
    answer: "Our advanced AI analyzes your images to generate detailed descriptions, extract text, identify key elements, and organize content intelligently. This makes it easier to search and organize your visual memories."
  },
  {
    question: "Is my data secure with MemoriesHub?",
    answer: "Yes, we take security seriously. All your data is encrypted end-to-end, stored securely in the cloud, and you have complete control over what you share and keep private."
  },
  {
    question: "Can I organize my memories in different ways?",
    answer: "Absolutely! You can create custom spaces, use tags, folders, and our AI-powered categorization to organize your memories exactly how you want them."
  },
  {
    question: "What file types are supported?",
    answer: "We support all major image formats (PNG, JPEG, GIF), PDFs, and you can even save web screenshots directly through our browser extension."
  }
];

export default function Landing() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-[#1a1b1e]">
      {/* Navigation */}
      <nav className="border-b border-white/10 sticky top-0 bg-[#1a1b1e]/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-6 h-6 text-[#00DC82]" />
              <span className="text-xl font-bold text-white">MemoriesHub</span>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-6">
                <a href="#features" className="text-gray-400 hover:text-[#00DC82] transition-colors text-sm">Features</a>
                <a href="#how-it-works" className="text-gray-400 hover:text-[#00DC82] transition-colors text-sm">How it works</a>
                <a href="#faq" className="text-gray-400 hover:text-[#00DC82] transition-colors text-sm">FAQ</a>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/home">
                  <Button 
                    variant="ghost" 
                    className="text-gray-400 hover:text-white hover:bg-white/5"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="bg-[#00DC82] hover:bg-[#00B669] text-black font-medium">
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="flex items-center justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
              <span className="text-purple-400 text-sm">New</span>
              <span className="text-gray-400 text-sm">AI-powered memory organization</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-6">
              Upload and organize your memories securely!
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Safe storage for images, PDFs, and links, ensuring privacy with advanced AI assistance.
            </p>
            <div className="flex gap-4">
              <Link href="/signup">
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-6 text-lg group"
                >
                  Start for free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5 px-8 py-6 text-lg"
                onClick={() => setIsVideoPlaying(true)}
              >
                Watch demo
              </Button>
            </div>
            <div className="flex items-center gap-4 mt-8">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#1a1b1e] bg-gradient-to-r from-purple-500 to-blue-500"
                  />
                ))}
              </div>
              <div className="text-gray-400">
                <span className="text-white font-bold">4,000+</span> happy users
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="w-[400px] h-[400px] bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl absolute -z-10" />
            <div className="relative z-10 w-[500px] bg-white/5 rounded-lg border border-white/10 overflow-hidden">
              <img 
                src="/images/hero-image.png" 
                alt="Memory Storage" 
                className="w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b1e] to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Everything you need to preserve memories
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Powerful features to help you organize, protect, and relive your precious moments.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors group cursor-pointer"
            >
              <div className="p-3 bg-white/5 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How it Works Section */}
      <div id="how-it-works" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Your Intelligent Dashboard
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience a new way of organizing your digital memories with our AI-powered dashboard.
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-2xl blur-3xl" />
          <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="grid grid-cols-12 gap-6">
              {/* Sidebar Preview */}
              <div className="col-span-3 bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-4 p-2 bg-white/5 rounded-lg">
                  <FolderKanban className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">Spaces</span>
                </div>
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-lg text-gray-400 hover:bg-white/5 cursor-pointer mb-1"
                  >
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
                    <span>Space {i + 1}</span>
                  </div>
                ))}
              </div>

              {/* Main Content Preview */}
              <div className="col-span-9 space-y-6">
                {/* Search Bar */}
                <div className="flex gap-4">
                  <div className="flex-1 bg-white/5 rounded-lg border border-white/10 p-3 flex items-center gap-2">
                    <Search className="w-5 h-5 text-gray-400" />
                    <div className="h-5 w-1/3 bg-white/10 rounded animate-pulse" />
                  </div>
                  <Button className="bg-gradient-to-r from-purple-500 to-blue-500">
                    <Plus className="w-5 h-5 mr-2" />
                    New Memory
                  </Button>
                </div>

                {/* Grid Preview */}
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="group bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                      <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Image className="w-8 h-8 text-white/20" />
                        </div>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="h-4 w-2/3 bg-white/10 rounded" />
                        <div className="h-3 w-1/2 bg-white/5 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-4 gap-4 mt-8">
              {dashboardFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all group"
                >
                  <div className={`${feature.bgColor} p-2 rounded-lg w-fit mb-3 group-hover:scale-110 transition-transform`}>
                    <div className={feature.color}>{feature.icon}</div>
                  </div>
                  <h4 className="text-white font-medium mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-gray-400">AI Assistant Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-400">Auto-syncing</span>
                </div>
              </div>
              <Link href="/home">
                <Button className="bg-white/5 hover:bg-white/10 text-white">
                  Open Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00DC82]/10 border border-[#00DC82]/20 mb-4">
              <span className="text-[#00DC82] text-sm">Support</span>
              <span className="text-gray-400 text-sm">Get answers</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Find answers to common questions about our platform and services.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:bg-white/[0.07] transition-colors"
              >
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <h3 className="text-white font-medium pr-6">
                      {item.question}
                    </h3>
                    <div className="flex-shrink-0">
                      <Plus className="w-5 h-5 text-gray-400 group-open:hidden" />
                      <Minus className="w-5 h-5 text-[#00DC82] hidden group-open:block" />
                    </div>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-gray-400">
                      {item.answer}
                    </p>
                  </div>
                </details>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">
              Still have questions?
            </p>
            <Link href="/contact">
              <Button 
                variant="outline" 
                className="border-[#00DC82] text-[#00DC82] hover:bg-[#00DC82]/10"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="border-t border-white/10 bg-[#1a1b1e]">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-12 gap-8">
            {/* Logo and Description */}
            <div className="col-span-12 md:col-span-4">
              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-6 h-6 text-[#00DC82]" />
                <span className="text-xl font-bold text-white">MemoriesHub</span>
              </div>
              <p className="text-gray-400 mb-6">
                Empowering users with AI-powered memory organization tools
              </p>
              <div className="flex items-center gap-4">
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Linkedin className="w-5 h-5 text-gray-400" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Instagram className="w-5 h-5 text-gray-400" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Twitter className="w-5 h-5 text-gray-400" />
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="col-span-12 md:col-span-5 md:col-start-8">
              <h3 className="text-lg font-semibold text-white mb-2">
                Subscribe to our newsletter
              </h3>
              <p className="text-gray-400 mb-4">
                Stay updated with our latest features and releases.
              </p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <Input 
                  type="email" 
                  placeholder="name@email.com" 
                  className="bg-white/5 border-white/10 text-white"
                />
                <Button className="bg-[#00DC82] hover:bg-[#00B669] text-black font-medium whitespace-nowrap">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-12 pt-8 border-t border-white/10">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 MemoriesHub. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-[#00DC82] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00DC82] transition-colors">
                Terms of Service
              </a>
              <div className="flex items-center gap-2 text-gray-400">
                <span>Built with</span>
                <span className="text-[#00DC82]">♥</span>
                <span>by MemoriesHub Team</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="relative w-[800px] bg-[#1E1F23] rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              className="absolute top-4 right-4 text-white hover:bg-white/10"
              onClick={() => setIsVideoPlaying(false)}
            >
              Close
            </Button>
            <div className="aspect-video bg-black">
              {/* Add your video player here */}
              <div className="flex items-center justify-center h-full text-gray-400">
                Demo Video Player
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 