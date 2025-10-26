"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { mockApiService } from "@/lib/services/api"

interface SnippetFiltersProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  sortBy: "newest" | "popular" | "featured"
  onSortChange: (sort: "newest" | "popular" | "featured") => void
}

export function SnippetFilters({ selectedTags, onTagsChange, sortBy, onSortChange }: SnippetFiltersProps) {
  const [availableTags, setAvailableTags] = useState<string[]>([])

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await mockApiService.getTags()
        setAvailableTags(response.data)
      } catch (error) {
        console.error("Failed to fetch tags:", error)
      }
    }

    fetchTags()
  }, [])

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const clearAllTags = () => {
    onTagsChange([])
  }

  return (
    <div className="space-y-4">
      {/* Sort */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400 whitespace-nowrap">Sort by:</span>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="newest" className="text-white hover:bg-gray-700">
              Newest
            </SelectItem>
            <SelectItem value="popular" className="text-white hover:bg-gray-700">
              Popular
            </SelectItem>
            <SelectItem value="featured" className="text-white hover:bg-gray-700">
              Featured
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Filter by tags:</span>
          {selectedTags.length > 0 && (
            <Button
              onClick={clearAllTags}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white h-auto p-1"
            >
              Clear all
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 ${
                selectedTags.includes(tag)
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-300"
              }`}
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
              {selectedTags.includes(tag) && <X className="h-3 w-3 ml-1" />}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
