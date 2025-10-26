"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Eye, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { mockApiService, type Snippet } from "@/lib/services/api"
import { SnippetCard } from "./snippet-card"

export function FeaturedSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedSnippets = async () => {
      try {
        const response = await mockApiService.getFeaturedSnippets()
        setSnippets(response.data)
      } catch (error) {
        console.error("Failed to fetch featured snippets:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedSnippets()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

            <motion.div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Card */}
              <div className="bg-[#1e1e2f] rounded-3xl border border-[#2a2a3b] overflow-hidden shadow-sm">

                {/* Preview Section */}
                <div className="bg-[#2b2b3d] p-6 flex justify-center items-center">
                  <div className="w-48 h-96 bg-[#121212] rounded-[2rem] relative">
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-700 rounded-full"></div>
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full"></div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-4">
                  {/* Title */}
                  <div className="h-5 bg-gray-700 rounded w-3/4"></div>
                  {/* Description */}
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 mt-4">
                    <div className="w-8 h-8 bg-gray-600 rounded-full" />
                    <div className="space-y-1">
                      <div className="h-3 w-24 bg-gray-700 rounded"></div>
                      <div className="h-2 w-20 bg-gray-600 rounded"></div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2 flex-wrap mt-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-6 w-16 bg-gray-700 rounded-full" />
                    ))}
                  </div>

                  {/* Stats and Button */}
                  <div className="flex justify-between items-center border-t border-[#2f2f45] pt-4 mt-4">
                    <div className="flex gap-4">
                      <div className="h-4 w-10 bg-gray-700 rounded"></div>
                      <div className="h-4 w-10 bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-8 w-24 bg-blue-700 rounded-xl"></div>
                  </div>
                </div>
              </div>
              {/* Card */}
              <div className="bg-[#1e1e2f] rounded-3xl border border-[#2a2a3b] overflow-hidden shadow-sm">

                {/* Preview Section */}
                <div className="bg-[#2b2b3d] p-6 flex justify-center items-center">
                  <div className="w-48 h-96 bg-[#121212] rounded-[2rem] relative">
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-700 rounded-full"></div>
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full"></div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-4">
                  {/* Title */}
                  <div className="h-5 bg-gray-700 rounded w-3/4"></div>
                  {/* Description */}
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 mt-4">
                    <div className="w-8 h-8 bg-gray-600 rounded-full" />
                    <div className="space-y-1">
                      <div className="h-3 w-24 bg-gray-700 rounded"></div>
                      <div className="h-2 w-20 bg-gray-600 rounded"></div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2 flex-wrap mt-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-6 w-16 bg-gray-700 rounded-full" />
                    ))}
                  </div>

                  {/* Stats and Button */}
                  <div className="flex justify-between items-center border-t border-[#2f2f45] pt-4 mt-4">
                    <div className="flex gap-4">
                      <div className="h-4 w-10 bg-gray-700 rounded"></div>
                      <div className="h-4 w-10 bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-8 w-24 bg-blue-700 rounded-xl"></div>
                  </div>
                </div>
              </div>
              {/* Card */}
              <div className="bg-[#1e1e2f] rounded-3xl border border-[#2a2a3b] overflow-hidden shadow-sm">

                {/* Preview Section */}
                <div className="bg-[#2b2b3d] p-6 flex justify-center items-center">
                  <div className="w-48 h-96 bg-[#121212] rounded-[2rem] relative">
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-700 rounded-full"></div>
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full"></div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-4">
                  {/* Title */}
                  <div className="h-5 bg-gray-700 rounded w-3/4"></div>
                  {/* Description */}
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 mt-4">
                    <div className="w-8 h-8 bg-gray-600 rounded-full" />
                    <div className="space-y-1">
                      <div className="h-3 w-24 bg-gray-700 rounded"></div>
                      <div className="h-2 w-20 bg-gray-600 rounded"></div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2 flex-wrap mt-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-6 w-16 bg-gray-700 rounded-full" />
                    ))}
                  </div>

                  {/* Stats and Button */}
                  <div className="flex justify-between items-center border-t border-[#2f2f45] pt-4 mt-4">
                    <div className="flex gap-4">
                      <div className="h-4 w-10 bg-gray-700 rounded"></div>
                      <div className="h-4 w-10 bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-8 w-24 bg-blue-700 rounded-xl"></div>
                  </div>
                </div>
              </div>
            </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">Featured</span> Snippets
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Handpicked code snippets that showcase the best of Jetpack Compose
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snippets.map((snippet, index) => (
            <motion.div
              key={snippet.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <SnippetCard snippet={snippet} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-800 glass bg-transparent"
          >
            <Link href="/snippets">View All Snippets</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
