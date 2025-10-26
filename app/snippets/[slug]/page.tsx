"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CodeBlock } from "@/components/code-block"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Heart, Eye, Copy, Share2, Github, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { mockApiService, type Snippet } from "@/lib/services/api"
import toast from "react-hot-toast"

export default function SnippetDetailPage() {
  const params = useParams()
  const [snippet, setSnippet] = useState<Snippet | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const response = await mockApiService.getSnippetBySlug(params.slug as string)
        setSnippet(response.data)

        // Increment view count
        await mockApiService.incrementViews?.(response.data.id)
      } catch (error) {
        console.error("Failed to fetch snippet:", error)
        toast.error("Snippet not found")
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchSnippet()
    }
  }, [params.slug])

  const handleCopyCode = async () => {
    if (snippet) {
      try {
        await navigator.clipboard.writeText(snippet.code)
        toast.success("Code copied to clipboard!")
      } catch (error) {
        toast.error("Failed to copy code")
      }
    }
  }

  const handleShare = async () => {
    if (snippet) {
      try {
        await navigator.share({
          title: snippet.title,
          text: snippet.description,
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to copying URL
        try {
          await navigator.clipboard.writeText(window.location.href)
          toast.success("Link copied to clipboard!")
        } catch (clipboardError) {
          toast.error("Failed to share")
        }
      }
    }
  }

  const handleLike = async () => {
    if (snippet && !liked) {
      try {
        setLiked(true)
        setSnippet((prev) => (prev ? { ...prev, likes: prev.likes + 1 } : null))
        toast.success("Snippet liked!")
      } catch (error) {
        setLiked(false)
        setSnippet((prev) => (prev ? { ...prev, likes: prev.likes - 1 } : null))
        toast.error("Failed to like snippet")
      }
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
        <Footer />
      </main>
    )
  }

  if (!snippet) {
    return (
      <main className="min-h-screen bg-gray-950">
        <Navigation />
        <div className="pt-20 text-center py-20">
          <h1 className="text-2xl font-bold text-white mb-4">Snippet not found</h1>
          <Button asChild variant="outline" className="border-gray-600 text-white hover:bg-gray-800 bg-transparent">
            <Link href="/snippets">Back to Snippets</Link>
          </Button>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950">
      <Navigation />

      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Button asChild variant="ghost" className="text-gray-400 hover:text-white">
              <Link href="/snippets" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Snippets
              </Link>
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{snippet.title}</h1>
                <p className="text-gray-400 text-lg mb-6">{snippet.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {snippet.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Heart className={`h-4 w-4 ${liked ? "text-red-500 fill-current" : ""}`} />
                    <span>{snippet.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{snippet.views}</span>
                  </div>
                  <span>{new Date(snippet.createdAt).toLocaleDateString()}</span>
                </div>
              </motion.div>

              {/* Preview */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-white">Preview</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="relative overflow-hidden rounded-lg">
                      <Image
                        src={snippet.previewImage || "/placeholder.svg"}
                        alt={snippet.title}
                        width={800}
                        height={400}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Code */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-white">Code</h2>
                      <Button
                        onClick={handleCopyCode}
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 bg-transparent"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <CodeBlock code={snippet.code} language="kotlin" />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Author */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-white">Author</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={snippet.author.avatar || "/placeholder.svg"} alt={snippet.author.name} />
                        <AvatarFallback>{snippet.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-white">{snippet.author.name}</div>
                        <div className="text-sm text-gray-400">Contributor</div>
                      </div>
                    </div>

                    {snippet.author.githubUrl && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 bg-transparent"
                      >
                        <a
                          href={snippet.author.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Github className="h-4 w-4" />
                          View Profile
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-white">Actions</h3>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={handleLike}
                      disabled={liked}
                      className={`w-full ${
                        liked
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/30 hover:to-pink-600/30 border border-red-500/30 text-red-300 hover:text-white"
                      }`}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${liked ? "fill-current" : ""}`} />
                      {liked ? "Liked!" : "Like"}
                    </Button>

                    <Button
                      onClick={handleShare}
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 bg-transparent"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
