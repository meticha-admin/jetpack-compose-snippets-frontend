"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { SnippetCard } from "@/components/snippet-card"
import { SnippetFilters } from "@/components/snippet-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { mockApiService, type Snippet } from "@/lib/services/api"

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "featured">("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchSnippets = async () => {
    setLoading(true)
    try {
      const response = await mockApiService.getSnippets({
        page: currentPage,
        limit: 12,
        tags: selectedTags,
        sort: sortBy,
        search: searchQuery,
      })
      setSnippets(response.data)
      setTotalPages(response.pagination.totalPages)
    } catch (error) {
      console.error("Failed to fetch snippets:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSnippets()
  }, [currentPage, selectedTags, sortBy, searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchSnippets()
  }

  return (
    <main className="min-h-screen bg-gray-950">
      <Navigation />

      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="gradient-text">Code</span> Snippets
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover and explore our curated collection of Jetpack Compose snippets
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search snippets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  />
                </div>
              </form>

              {/* Filters */}
              <SnippetFilters
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>
          </motion.div>

          {/* Results */}
          {loading ? (
            <>
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
            </>
          ) : snippets.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <p className="text-gray-400 text-lg mb-4">No snippets found</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedTags([])
                  setSortBy("newest")
                  setCurrentPage(1)
                }}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                Clear Filters
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Snippets Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
              >
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
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex justify-center gap-2"
                >
                  <Button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-800 disabled:opacity-50"
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        variant={currentPage === page ? "default" : "outline"}
                        className={
                          currentPage === page
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "border-gray-600 text-white hover:bg-gray-800"
                        }
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-800 disabled:opacity-50"
                  >
                    Next
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
