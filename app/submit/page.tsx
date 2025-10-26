"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  X,
  Plus,
  Loader2,
  CheckCircle,
  Github,
  Search,
  FileCode,
  ExternalLink,
  ChevronRight,
  ImageIcon,
  Video,
  Pause,
  PlayIcon,
  User,
  Heart,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Play } from "next/font/google";
import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/slices/categoriesSlice";
import { ca } from "zod/v4/locales";
import { createSnippet } from "@/store/slices/snippetSlice";

const submitSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  previewImage: z.string().optional(),
});

type SubmitFormData = z.infer<typeof submitSchema>;

interface Gist {
  id: string;
  description: string;
  files: Record<
    string,
    { filename: string; raw_url?: string; language?: string }
  >;
  html_url: string;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
}

export default function SubmitPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [step, setStep] = useState<"select" | "details" | "upload">("select");
  const [gists, setGists] = useState<Gist[]>([]);
  const [filteredGists, setFilteredGists] = useState<Gist[]>([]);
  const [selectedGist, setSelectedGist] = useState<Gist | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingGists, setIsLoadingGists] = useState(false);
  const [tags, setTags] = useState<number[]>([]);
  const [newTag, setNewTag] = useState(0);
  const [catQuery, setCatQuery] = useState("");
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const mainImageFileInputRef = useRef<HTMLInputElement>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [isDraggingMainImage, setIsDraggingMainImage] = useState(false);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [showMainImageUrlInput, setShowMainImageUrlInput] = useState(false);
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [mainImageLoading, setMainImageLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const dispatch = useAppDispatch();
  const { categories, loading, error } = useAppSelector((s) => s.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  // Preview video states
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SubmitFormData>({
    resolver: zodResolver(submitSchema),
    defaultValues: { title: "", description: "" },
  });

  const watchedTitle = watch("title");
  const watchedDescription = watch("description");

  useEffect(() => {
    fetchGists();
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredGists(gists);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredGists(
        gists.filter(
          (gist) =>
            (gist.description || "").toLowerCase().includes(q) ||
            Object.values(gist.files).some((file) =>
              file.filename.toLowerCase().includes(q)
            )
        )
      );
    }
  }, [searchQuery, gists]);

  // ensure selected video shows a preview frame immediately
  useEffect(() => {
    const vid = previewRef.current;
    if (!vid) return;

    if (videoPreview) {
      // assign and load the new src
      vid.src = videoPreview;
      vid.load();

      const showFirstFrame = async () => {
        try {
          vid.muted = true;
          // play -> pause to paint the first frame (noop if autoplay blocked)
          await vid.play();
          vid.pause();
          vid.currentTime = 0;
        } catch (e) {}
      };

      showFirstFrame();
    } else {
      // clear src when removed
      vid.removeAttribute("src");
      vid.load();
    }

    return () => {};
  }, [videoPreview]);

  const fetchGists = async () => {
    setIsLoadingGists(true);
    try {
      const username = (user as any)?.username || (user as any)?.login;
      if (!username) {
        setGists([]);
        setFilteredGists([]);
        setIsLoadingGists(false);
        return;
      }

      const response = await fetch(
        `https://api.github.com/users/${username}/gists`
      );
      if (!response.ok) throw new Error("Failed to fetch gists");
      const data = await response.json();
      setGists(data);
      setFilteredGists(data);
    } catch (err) {
      toast.error("Failed to fetch gists");
      setGists([]);
      setFilteredGists([]);
    } finally {
      setIsLoadingGists(false);
    }
  };

  const handleSelectGist = (gist: Gist) => {
    setSelectedGist(gist);
    // Prefill title & description from gist if available
    const firstFile = Object.values(gist.files)[0];
    const defaultTitle =
      gist.description?.slice(0, 60) ||
      firstFile?.filename?.replace(/\.[^/.]+$/, "") ||
      "Untitled";
    setValue("title", defaultTitle);
    if (gist.description) setValue("description", gist.description);
    setStep("details");
  };

  const addTag = () => {
    const t = newTag;
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags((prev) => [...prev, t]);
      setNewTag(0);
    }
  };

  const removeTag = (tagToRemove: number) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const isValidImageFile = (file: File) => {
    const acceptedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    return file && acceptedImageTypes.includes(file.type);
  };

  const isValidVideoFile = (file: File) => {
    return file && file.type.startsWith("video/");
  };

  const urlToFile = async (
    url: string,
    filename: string,
    mimeType: string
  ): Promise<File | null> => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok.");
      const blob = await response.blob();
      return new File([blob], filename, { type: mimeType });
    } catch (error) {
      console.error("Error converting URL to file:", error);
      return null;
    }
  };

  const base64ToFile = (
    base64: string,
    filename: string,
    mimeType: string
  ): File | null => {
    try {
      const byteCharacters = atob(base64.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      return new File([blob], filename, { type: mimeType });
    } catch (error) {
      console.error("Error converting Base64 to file:", error);
      return null;
    }
  };

  const processImageFile = (file: File) => {
    if (!isValidImageFile(file)) {
      toast.error("Unsupported image format. Use JPG, PNG, GIF, WebP or SVG.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setMainImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleMainImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleMainImageDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingMainImage(false);
    const file = event.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  const handleMainImageUrlSubmit = async () => {
    if (!mainImageUrl) return;
    setMainImageLoading(true);
    try {
      let file: File | null = null;
      if (mainImageUrl.startsWith("data:image")) {
        const mimeMatch = mainImageUrl.match(/^data:(image\/[a-z]+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : "image/png";
        file = base64ToFile(mainImageUrl, "main-image.png", mimeType);
      } else {
        file = await urlToFile(mainImageUrl, "main-image.png", "image/png");
      }
      if (file) {
        processImageFile(file);
        setMainImageUrl("");
        setShowMainImageUrlInput(false);
      } else {
        toast.error("Unable to load image from URL/Base64.");
      }
    } catch {
      toast.error("Failed to load image.");
    } finally {
      setMainImageLoading(false);
    }
  };

  const removeMainImage = () => {
    setMainImagePreview(null);
    if (mainImageFileInputRef.current) mainImageFileInputRef.current.value = "";
    setMainImageUrl("");
    setShowMainImageUrlInput(false);
  };

  // Video handling
  const processVideoFile = (file: File) => {
    if (!isValidVideoFile(file)) {
      toast.error("Unsupported video format. Use a valid video file.");
      return;
    }
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
    setVideoFile(file);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processVideoFile(file);
  };

  const handleVideoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingVideo(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processVideoFile(file);
  };

  const removeVideo = () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoPreview(null);
    setVideoFile(null);
    if (videoFileInputRef.current) videoFileInputRef.current.value = "";
  };

  const onSubmit = async (data: SubmitFormData) => {
    if (!selectedGist) {
      toast.error("Please select a gist");
      return;
    }
    if (tags.length === 0) {
      toast.error("Please add at least one tag");
      return;
    }

    setIsSubmitting(true);

    try {
      // Build FormData to send to backend (example)
      const form = new FormData();
      form.append("title", data.title);
      form.append("description", data.description);

      form.append("gistUrl", selectedGist.html_url);
      tags.forEach((tagId) => form.append("categoryIds", String(tagId)));

      if (videoFile) {
        form.append("previewFile", videoFile, videoFile.name);
      }

      const formValues = Object.fromEntries(form.entries());
      console.log("Form Data:", formValues);
      console.log(
        "categoryIds (from FormData.getAll):",
        form.getAll("categoryIds")
      );

      // If you want a plain object that preserves arrays:
      const obj: Record<string, any> = {};
      for (const [key, value] of form.entries()) {
        if (obj[key] === undefined) obj[key] = value;
        else if (Array.isArray(obj[key])) obj[key].push(value);
        else obj[key] = [obj[key], value];
      }
      console.log("Form Data (preserving arrays):", obj);
      const payload = await dispatch(createSnippet(form)).unwrap();

      if (!payload) throw new Error("Empty response from server");

      setIsSuccess(true);
      toast.success("Snippet submitted successfully!");

      setTimeout(() => {
        reset();
        setTags([]);
        setSelectedGist(null);
        setMainImagePreview(null);
        removeVideo();
        setIsSuccess(false);
        router.push("/snippets");
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit snippet. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navigation />
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="max-w-md mx-auto text-center py-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
              </motion.div>

              <h1 className="text-3xl font-bold text-white mb-4">
                Snippet Deployed!
              </h1>
              <p className="text-gray-400 mb-6">
                Your snippet has been successfully submitted and will be live
                shortly.
              </p>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation />

      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="gradient-text">Import</span> from GitHub Gist
              </h1>
              <p className="text-gray-400 text-lg">
                {step === "select"
                  ? "Select a gist to share with the community"
                  : step === "details"
                  ? "Configure your snippet details"
                  : "Upload preview and finalize"}
              </p>
            </div>

            {/* Progress */}
            <div className="flex items-center justify-center mb-8 gap-2">
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step === "select" ? "bg-blue-600" : "bg-green-600"
                  }`}
                >
                  {step !== "select" ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    "1"
                  )}
                </div>
                <span className="ml-2 text-sm text-gray-400">Select</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-600 mx-2" />
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step === "details"
                      ? "bg-blue-600"
                      : step === "upload"
                      ? "bg-green-600"
                      : "bg-gray-700"
                  }`}
                >
                  {step === "upload" ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    "2"
                  )}
                </div>
                <span className="ml-2 text-sm text-gray-400">Details</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-600 mx-2" />
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step === "upload" ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  3
                </div>
                <span className="ml-2 text-sm text-gray-400">Upload</span>
              </div>
            </div>

            {/* two-column layout: preview | form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {/* Left: Preview panel */}
              <div className="lg:col-span-1">
                <motion.div
                  ref={cardRef}
                  className="group relative bg-[#1e1e2f] rounded-3xl shadow-md border border-[#2a2a3b] overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#3a3a4f] hover:scale-[1.02] h-full"
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                >
                  {/* Preview Section */}
                  <div className="relative bg-[#2b2b3d] flex justify-center items-center p-6">
                    <div className="relative">
                      <div className="relative w-48 h-96 bg-black rounded-[2rem] p-2 shadow-xl">
                        <div className="w-full h-full bg-[#121212] rounded-[1.5rem] overflow-hidden relative">
                          <video
                            ref={previewRef}
                            className="w-full h-full object-cover"
                            src={videoPreview ?? ""}
                            poster={`/api/placeholder/300/600`}
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
                                <PlayIcon className="w-6 h-6 text-white ml-1" />
                              )}
                            </motion.div>
                          </motion.div>
                        </div>

                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-700 rounded-full"></div>
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full"></div>
                      </div>

                      <motion.div
                        className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 space-y-4">
                    {/* Title & Description */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300 line-clamp-1">
                        {(watchedTitle || selectedGist?.description) ??
                          "Untitled Snippet"}{" "}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
                        {watchedDescription ||
                          selectedGist?.description ||
                          "No description yet. Fill details to see a live preview."}{" "}
                      </p>
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                        {(user as any)?.avatarUrl ? (
                          <img
                            src={(user as any)?.avatarUrl}
                            alt={
                              (user as any)?.name ||
                              (user as any)?.username ||
                              "Author"
                            }
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-200">
                          {(user as any)?.name ||
                            (user as any)?.username ||
                            "Author"}{" "}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(Date.now()).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 relative z-10">
                      {tags.slice(0, 3).map((tag, index) => (
                        <motion.span
                          key={tag}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.12 + index * 0.06,
                            duration: 0.32,
                          }}
                          className="px-3 py-1 bg-white/10 text-white rounded-full text-xs font-medium shadow-sm"
                        >
                          {categories.find((c) => c.id === tag)?.name || tag}
                        </motion.span>
                      ))}
                      {tags.length > 3 && (
                        <motion.span
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.12 + 3 * 0.06,
                            duration: 0.32,
                          }}
                          className="px-3 py-1 bg-[#2e2e40] text-gray-200 rounded-full text-xs font-medium"
                        >
                          {tags.length - 3}
                        </motion.span>
                      )}
                    </div>
                    {/* Stats & Button */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#2f2f45]">
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors duration-200 cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Heart className="w-4 h-4" />
                          <span className="text-sm font-medium">102</span>
                        </motion.div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm font-medium">205</span>
                        </div>
                      </div>

                      <motion.a
                        href={`#`}
                        className="group/btn px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-500 transition-all duration-300 flex items-center gap-2"
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        View Code
                        <motion.div className="transition-transform duration-300 group-hover/btn:translate-x-0.5">
                          <ExternalLink className="w-4 h-4" />
                        </motion.div>
                      </motion.a>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-[#1e1e2f]/60 to-transparent pointer-events-none rounded-3xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Right: Form area */}
              <div className="lg:col-span-2 space-y-4 flex flex-col">
                <AnimatePresence mode="wait">
                  {step === "select" ? (
                    <motion.div
                      key="select"
                      className="h-full"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                    >
                      <Card className="bg-gray-800/50 border-gray-700 h-full flex flex-col">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-white flex items-center gap-2">
                              <Github className="h-5 w-5" />
                              Your Gists
                            </CardTitle>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={fetchGists}
                              disabled={isLoadingGists}
                              className="border-gray-600 text-gray-300"
                            >
                              {isLoadingGists ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Refresh"
                              )}
                            </Button>
                          </div>

                          <div className="relative mt-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search gists..."
                              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            />
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-auto">
                          {isLoadingGists ? (
                            <div className="flex items-center justify-center py-12">
                              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                            </div>
                          ) : filteredGists.length === 0 ? (
                            <div className="text-center py-12">
                              <FileCode className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                              <p className="text-gray-400 mb-2">
                                No gists found
                              </p>
                              <p className="text-sm text-gray-500">
                                {searchQuery
                                  ? "Try a different search term"
                                  : "Create a gist on GitHub to get started"}
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {filteredGists.map((gist) => (
                                <div
                                  key={gist.id}
                                  className="p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-blue-500 transition-all cursor-pointer"
                                  onClick={() => handleSelectGist(gist)}
                                >
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                      <h3 className="text-white font-medium mb-1 truncate">
                                        {gist.description || "Untitled Gist"}
                                      </h3>
                                      <div className="flex flex-wrap gap-2 mb-2">
                                        {Object.values(gist.files).map(
                                          (file) => (
                                            <Badge
                                              key={file.filename}
                                              variant="secondary"
                                              className="bg-gray-800 text-gray-300 text-xs"
                                            >
                                              <FileCode className="h-3 w-3 mr-1" />
                                              {file.filename}
                                            </Badge>
                                          )
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-400">
                                        Updated{" "}
                                        {new Date(
                                          gist.updated_at
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <a
                                        href={gist.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-gray-400 hover:text-white transition-colors"
                                      >
                                        <ExternalLink className="h-4 w-4" />
                                      </a>
                                      <ChevronRight className="h-5 w-5 text-gray-400" />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : step === "details" ? (
                    <motion.div
                      key="details"
                      className="h-full"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <Card className="bg-gray-800/50 border-gray-700 h-full flex flex-col">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-white">
                              Configure Snippet
                            </CardTitle>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                reset();
                                setStep("select");
                              }}
                              className="border-gray-600 text-gray-300 hover:text-white"
                            >
                              Change Gist
                            </Button>
                          </div>

                          {selectedGist && (
                            <div className="mt-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                              <div className="flex items-center gap-2 mb-2">
                                <Github className="h-12 w-12 text-gray-400" />
                                <span className="text-sm text-gray-300 font-medium">
                                  {selectedGist.description || "Untitled Gist"}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {Object.values(selectedGist.files).map(
                                  (file) => (
                                    <Badge
                                      key={file.filename}
                                      variant="secondary"
                                      className="bg-gray-800 text-gray-300 text-xs"
                                    >
                                      {file.filename}
                                    </Badge>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="flex-1 overflow-auto">
                          <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                          >
                            <div>
                              <Label htmlFor="title" className="text-white">
                                Title *
                              </Label>
                              <Input
                                id="title"
                                {...register("title")}
                                placeholder="e.g., Animated Button Component"
                                className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              />
                              {errors.title && (
                                <p className="text-red-400 text-sm mt-1">
                                  {errors.title.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor="description"
                                className="text-white"
                              >
                                Description *
                              </Label>
                              <Textarea
                                id="description"
                                {...register("description")}
                                placeholder="Describe what your snippet does..."
                                rows={4}
                                className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              />
                              {errors.description && (
                                <p className="text-red-400 text-sm mt-1">
                                  {errors.description.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label className="text-white">Tags *</Label>
                              <div className="mt-1 space-y-2">
                                {/* searchable select - only allow pre-fetched categories */}
                                <div className="relative">
                                  <div className="flex gap-2">
                                    <Input
                                      value={catQuery}
                                      onChange={(e) => {
                                        setCatQuery(e.target.value);
                                        setShowCatDropdown(true);
                                      }}
                                      placeholder="Search categories..."
                                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          const q = catQuery.trim();
                                          if (!q) return;
                                          const match = categories.find(
                                            (c) =>
                                              c.name.toLowerCase() ===
                                              q.toLowerCase()
                                          );
                                          if (!match) {
                                            toast.error(
                                              "Only existing categories can be selected."
                                            );
                                            return;
                                          }
                                          if (
                                            !tags.includes(match.id) &&
                                            tags.length < 5
                                          ) {
                                            setTags((prev) => [
                                              ...prev,
                                              match.id,
                                            ]);
                                          }
                                          setCatQuery("");
                                          setShowCatDropdown(false);
                                        }
                                        if (e.key === "Escape") {
                                          setShowCatDropdown(false);
                                        }
                                      }}
                                    />
                                    <Button
                                      type="button"
                                      onClick={() => {
                                        const q = catQuery.trim();
                                        if (!q) return;
                                        const match = categories.find(
                                          (c) =>
                                            c.name.toLowerCase() ===
                                            q.toLowerCase()
                                        );
                                        if (!match) {
                                          toast.error(
                                            "Only existing categories can be selected."
                                          );
                                          return;
                                        }
                                        if (
                                          !tags.includes(match.id) &&
                                          tags.length < 5
                                        ) {
                                          setTags((prev) => [
                                            ...prev,
                                            match.id,
                                          ]);
                                        }
                                        setCatQuery("");
                                        setShowCatDropdown(false);
                                      }}
                                      size="icon"
                                      variant="outline"
                                      className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>

                                  {/* dropdown: show matching pre-fetched categories only */}
                                  {showCatDropdown && catQuery.trim() && (
                                    <div className="absolute z-20 mt-2 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-44 overflow-auto">
                                      {categories
                                        .filter(
                                          (c) =>
                                            c.name
                                              .toLowerCase()
                                              .includes(
                                                catQuery.toLowerCase()
                                              ) && !tags.includes(c.id)
                                        )
                                        .map((c) => (
                                          <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => {
                                              if (tags.length >= 5) return;
                                              setTags((prev) => [
                                                ...prev,
                                                c.id,
                                              ]);
                                              setCatQuery("");
                                              setShowCatDropdown(false);
                                            }}
                                            className="w-full text-left px-3 py-2 hover:bg-gray-700 text-gray-100"
                                          >
                                            {c.name}
                                          </button>
                                        ))}
                                      {categories.filter((c) =>
                                        c.name
                                          .toLowerCase()
                                          .includes(catQuery.toLowerCase())
                                      ).length === 0 && (
                                        <div className="px-3 py-2 text-sm text-gray-400">
                                          No matching category. Only existing
                                          categories can be selected.
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* selected tags */}
                                <div className="flex flex-wrap gap-2">
                                  {tags.map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="secondary"
                                      className="bg-blue-500/20 text-blue-300 border-blue-500/30 pr-1"
                                    >
                                      {categories.find((c) => c.id === tag)
                                        ?.name || tag}
                                      <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="ml-1 hover:text-red-400"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </Badge>
                                  ))}
                                </div>

                                <p className="text-sm text-gray-400">
                                  Select up to 5 categories as tags (only
                                  pre-fetched categories allowed).
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  reset();
                                  setStep("select");
                                }}
                                className="flex-1 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                              >
                                Back
                              </Button>
                              <Button
                                type="button"
                                onClick={() => setStep("upload")}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 glow-blue"
                              >
                                Next
                              </Button>
                            </div>
                          </form>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="upload"
                      className="h-full"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <Card className="bg-gray-800/50 border-gray-700 h-full flex flex-col">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-white">
                              Upload Output
                            </CardTitle>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                reset();
                                setStep("select");
                              }}
                              className="border-gray-600 text-gray-300 hover:text-white"
                            >
                              Change Gist
                            </Button>
                          </div>

                          {selectedGist && (
                            <div className="mt-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                              <div className="flex items-center gap-2 mb-2">
                                <Github className="h-12 w-12 text-gray-400" />
                                <span className="text-sm text-gray-300 font-medium">
                                  {selectedGist.description || "Untitled Gist"}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {Object.values(selectedGist.files).map(
                                  (file) => (
                                    <Badge
                                      key={file.filename}
                                      variant="secondary"
                                      className="bg-gray-800 text-gray-300 text-xs"
                                    >
                                      {file.filename}
                                    </Badge>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </CardHeader>

                        <CardContent className="flex-1 overflow-auto">
                          <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                          >
                            <div>
                              <Label>Preview Video (optional)</Label>
                              <p className="text-sm text-muted-foreground mb-5">
                                Upload a short preview video (mp4, webm).
                              </p>

                              {videoPreview ? (
                                <Card className="p-4">
                                  <div className="flex items-start gap-4">
                                    <div className="w-40 h-24 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                                      <video
                                        src={videoPreview}
                                        className="w-full h-full object-cover"
                                        playsInline
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium">
                                        {videoFile?.name}
                                      </p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          videoFileInputRef.current?.click()
                                        }
                                      >
                                        Replace
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={removeVideo}
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </Card>
                              ) : (
                                <Card
                                  className={`border-2 border-dashed ${
                                    isDraggingVideo
                                      ? "border-purple-500 bg-purple-50"
                                      : "border-border hover:border-accent/50"
                                  } transition-colors cursor-pointer`}
                                  onDragEnter={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsDraggingVideo(true);
                                  }}
                                  onDragLeave={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsDraggingVideo(false);
                                  }}
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  onDrop={handleVideoDrop}
                                >
                                  <div className="p-6 text-center">
                                    <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-muted flex items-center justify-center">
                                      <Video className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-center gap-2">
                                        <Button
                                          type="button"
                                          variant="link"
                                          onClick={() =>
                                            videoFileInputRef.current?.click()
                                          }
                                          className="p-0 h-auto"
                                        >
                                          Upload a video
                                        </Button>
                                        <span>or</span>
                                        <span className="text-sm text-muted-foreground">
                                          Drag and drop
                                        </span>
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        Accepted: mp4, webm
                                      </p>
                                    </div>
                                  </div>
                                </Card>
                              )}

                              <input
                                ref={videoFileInputRef}
                                type="file"
                                accept="video/*"
                                onChange={handleVideoUpload}
                                className="hidden"
                              />
                            </div>

                            <div className="flex gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  reset();
                                  setStep("details");
                                }}
                                className="flex-1 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                              >
                                Back
                              </Button>
                              <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 glow-blue"
                              >
                                {isSubmitting ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                                    Deploying...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="h-4 w-4 mr-2" /> Deploy
                                    Snippet
                                  </>
                                )}
                              </Button>
                            </div>
                          </form>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
