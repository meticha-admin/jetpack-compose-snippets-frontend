"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CodeBlock } from "@/components/code-block";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Heart,
  Eye,
  Copy,
  Share2,
  Github,
  ArrowLeft,
  Loader2,
  Pause,
  Play,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { mockApiService, type Snippet } from "@/lib/services/api";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSingleSnippet } from "@/store/slices/snippetsSlice";
import GistViewer from "@/components/GistViewer";

export interface SnippetResponseDto {
  id: number;
  title: string;
  description: string;
  gistUrl: string;
  categoryIds: number[];
  previewUrl?: string | null;
  createdAt?: string;
  [key: string]: any;
}

export default function SnippetDetailPage() {
  const params = useParams();
  const [snippet, setSnippet] = useState<SnippetResponseDto | null>(null);
  const [liked, setLiked] = useState(false);

  const previewRef = useRef<HTMLVideoElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.snippets);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        // const response = await mockApiService.getSnippetBySlug(
        //   params.slug as string
        // );
        const response = await dispatch(
          fetchSingleSnippet(params.slug as string)
        ).unwrap();
        setSnippet(response);

        // Increment view count
        // await mockApiService.incrementViews?.(response.data.id);
      } catch (error) {
        console.error("Failed to fetch snippet:", error);
        toast.error("Snippet not found");
      }
    };

    if (params.slug) {
      fetchSnippet();
    }
  }, [params.slug]);

  const handleCopyCode = async () => {
    if (snippet) {
      try {
        await navigator.clipboard.writeText(snippet.code);
        toast.success("Code copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy code");
      }
    }
  };

  const handleShare = async () => {
    if (snippet) {
      try {
        await navigator.share({
          title: snippet.title,
          text: snippet.description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        try {
          await navigator.clipboard.writeText(window.location.href);
          toast.success("Link copied to clipboard!");
        } catch (clipboardError) {
          toast.error("Failed to share");
        }
      }
    }
  };

  const handleLike = async () => {
    if (snippet && !liked) {
      try {
        setLiked(true);
        setSnippet((prev) =>
          prev ? { ...prev, likes: prev.likes + 1 } : null
        );
        toast.success("Snippet liked!");
      } catch (error) {
        setLiked(false);
        setSnippet((prev) =>
          prev ? { ...prev, likes: prev.likes - 1 } : null
        );
        toast.error("Failed to like snippet");
      }
    }
  };

  const handleVideoToggle = () => {
    if (previewRef.current) {
      if (isVideoPlaying) {
        previewRef.current.pause();
      } else {
        previewRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!snippet) {
    return (
      <main className="min-h-screen bg-gray-950">
        <Navigation />
        <div className="pt-20 text-center py-20">
          <h1 className="text-2xl font-bold text-white mb-4">
            Snippet not found
          </h1>
          <Button
            asChild
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
          >
            <Link href="/snippets">Back to Snippets</Link>
          </Button>
        </div>
        <Footer />
      </main>
    );
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
            <Button
              asChild
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              <Link href="/snippets" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Snippets
              </Link>
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Scrollable */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  {snippet.title}
                </h1>
                <p className="text-gray-400 text-lg mb-6">
                  {snippet.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {snippet.categories.map(
                    (tag: { id: string; name: string }) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="bg-blue-500/20 text-blue-300 border-blue-500/30"
                      >
                        {tag.name}
                      </Badge>
                    )
                  )}
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Heart
                      className={`h-4 w-4 ${
                        liked ? "text-red-500 fill-current" : ""
                      }`}
                    />
                    <span>{snippet.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{snippet.views}</span>
                  </div>
                  <span>
                    {snippet.createdAt
                      ? new Date(snippet.createdAt).toLocaleDateString()
                      : "Unknown date"}
                  </span>
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
                    <h2 className="text-xl font-semibold text-white">
                      Preview
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <div className="relative w-48 h-96 bg-black rounded-[2rem] p-2 shadow-xl">
                      <div className="w-full h-full bg-[#121212] rounded-[1.5rem] overflow-hidden relative">
                        {snippet.previewUrl ? (
                          <>
                            <video
                              ref={previewRef}
                              className="w-full h-full object-cover"
                              src={snippet.previewUrl}
                              poster={snippet.previewImage}
                              muted
                              loop
                              playsInline
                            />
                            <motion.div
                              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                              onClick={handleVideoToggle}
                            >
                              <motion.div
                                className="w-16 h-16 bg-white/10 border border-white/30 backdrop-blur-md rounded-full flex items-center justify-center"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                {isVideoPlaying ? (
                                  <Pause className="w-6 h-6 text-white" />
                                ) : (
                                  <Play className="w-6 h-6 text-white ml-1" />
                                )}
                              </motion.div>
                            </motion.div>
                          </>
                        ) : (
                          <img
                            src={snippet.previewImage}
                            alt={snippet.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-700 rounded-full"></div>
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full"></div>
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
                <GistViewer gistUrl={snippet.gistUrl} />
              </motion.div>
            </div>

            {/* Sidebar - Sticky */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Author */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-white">
                        Author
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={snippet.user.avatarUrl || "/placeholder.svg"}
                            alt={snippet.user.username}
                          />
                          <AvatarFallback>
                            {snippet.user.username.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Link href={`/users/${snippet.user.username}`} className="font-medium text-white">
                            {snippet.user.username}
                          </Link>
                          <div className="text-sm text-gray-400">
                            Contributor
                          </div>
                        </div>
                      </div>

                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 bg-transparent"
                      >
                        <a
                          href={`https://github.com/${snippet.user.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Github className="h-4 w-4" />
                          View Profile
                        </a>
                      </Button>
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
                      <h3 className="text-lg font-semibold text-white">
                        Actions
                      </h3>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        onClick={handleLike}
                        disabled={liked}
                        className={`w-full ${
                          liked
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-gradient-to-r from-red-600/20 to-pink-60  0/20 hover:from-red-600/30 hover:to-pink-600/30 border border-red-500/30 text-red-300 hover:text-white"
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 mr-2 ${
                            liked ? "fill-current" : ""
                          }`}
                        />
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
            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}