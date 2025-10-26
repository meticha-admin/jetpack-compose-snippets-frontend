"use client"

import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code2, Users, Zap, Heart, Github, Twitter } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Code2,
    title: "Curated Quality",
    description:
      "Every snippet is carefully reviewed and tested to ensure it follows best practices and works reliably in production.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Built by developers, for developers. Our community contributes, reviews, and improves snippets together.",
  },
  {
    icon: Zap,
    title: "Fast Development",
    description:
      "Save hours of development time with ready-to-use components and utilities that you can integrate immediately.",
  },
  {
    icon: Heart,
    title: "Open Source",
    description:
      "Free and open for everyone. We believe in supporting the Android development community with accessible resources.",
  },
]

const stats = [
  { label: "Code Snippets", value: "150+" },
  { label: "Contributors", value: "50+" },
  { label: "Downloads", value: "10K+" },
  { label: "GitHub Stars", value: "2.5K+" },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-950">
      <Navigation />

      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="gradient-text">About</span> Our Mission
            </h1>
            <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
              We're building the ultimate resource for Android developers working with Jetpack Compose. Our goal is to
              accelerate development and foster knowledge sharing in the Android community.
            </p>
          </motion.div>

          {/* Story Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Our Story</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Jetpack Compose Snippets was born from a simple observation: Android developers were spending too
                    much time recreating common UI patterns and components. While Jetpack Compose revolutionized Android
                    UI development with its declarative approach, developers still needed a centralized place to
                    discover, share, and learn from each other's implementations.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    What started as a small collection of personal code snippets has grown into a comprehensive platform
                    serving thousands of developers worldwide. We've carefully curated each snippet to ensure quality,
                    performance, and adherence to best practices.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Today, we're proud to be a trusted resource for Android developers at all skill levels, from
                    beginners learning their first Compose components to experienced developers looking for advanced
                    patterns and optimizations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="gradient-text">Why Choose</span> Our Platform
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                >
                  <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all duration-300 h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                          <feature.icon className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                          <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-blue-500/30">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-center text-white mb-8">Platform Statistics</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                      className="text-center"
                    >
                      <div className="text-3xl font-bold text-blue-400 mb-2">{stat.value}</div>
                      <div className="text-gray-300 text-sm">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Join Our Community</h2>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Be part of a growing community of Android developers. Contribute your snippets, learn from others, and
                  help shape the future of Android development.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 glow-blue"
                  >
                    <Link href="/submit">Submit Your Snippet</Link>
                  </Button>

                  <div className="flex gap-4">
                    <motion.a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <Github className="h-5 w-5 text-white" />
                    </motion.a>
                    <motion.a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <Twitter className="h-5 w-5 text-white" />
                    </motion.a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
