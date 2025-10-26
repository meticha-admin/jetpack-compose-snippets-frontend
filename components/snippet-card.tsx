import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Eye, ExternalLink, Play, Pause, User } from 'lucide-react';

// Mock snippet data structure
const mockSnippet = {
  id: "1",
  slug: "animated-login-form",
  title: "Animated Login Form",
  description: "A beautiful login form with smooth animations and material design components for modern Android apps.",
  code: "@Composable\nfun LoginForm() {\n  // Implementation\n}",
  previewImage: "/api/placeholder/300/600", // Vertical mobile preview
  previewVideo: "/api/placeholder/300/600", // Optional video
  tags: ["Animation", "Login", "Material", "Form", "UI"],
  author: {
    name: "John Doe",
    avatar: "/api/placeholder/40/40",
    githubUrl: "https://github.com/johndoe"
  },
  createdAt: "2024-01-15",
  updatedAt: "2024-01-20",
  likes: 142,
  views: 2847,
  featured: true
};

export const SnippetCard = ({ snippet = mockSnippet }: { snippet?: typeof mockSnippet }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Animate card entrance with anime.js style timing
    const animateCard = () => {
      if (cardRef.current) {
        const el = cardRef.current;
        el.style.transform = 'translateY(30px)';
        el.style.opacity = '0';
        setTimeout(() => {
          if (!el) return;
          el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          el.style.transform = 'translateY(0)';
          el.style.opacity = '1';
        }, 100);
      }
    };

    setTimeout(() => {
      setIsLoaded(true);
      animateCard();
    }, Math.random() * 200); // Stagger animation for multiple cards
  }, []);

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
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <motion.div
      ref={cardRef}
      className="group relative bg-[#1e1e2f] rounded-3xl shadow-md border border-[#2a2a3b] overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#3a3a4f] hover:scale-[1.02]"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Featured Badge */}
      {snippet.featured && (
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        </div>
      )}

      {/* Preview Section */}
      <div className="relative bg-[#2b2b3d] flex justify-center items-center p-6">
        <div className="relative">
          <div className="relative w-48 h-96 bg-black rounded-[2rem] p-2 shadow-xl">
            <div className="w-full h-full bg-[#121212] rounded-[1.5rem] overflow-hidden relative">
              {snippet.previewVideo ? (
                <>
                  <video
                    ref={previewRef}
                    className="w-full h-full object-cover"
                    src={snippet.previewVideo}
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
            {snippet.title}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
            {snippet.description}
          </p>
        </div>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
            {snippet.author.avatar ? (
              <img
                src={snippet.author.avatar}
                alt={snippet.author.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-gray-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-200">{snippet.author.name}</p>
            <p className="text-xs text-gray-500">
              {new Date(snippet.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {snippet.tags.slice(0, 3).map((tag, index) => (
            <motion.span
              key={tag}
              className="px-3 py-1 bg-[#343449] text-gray-300 rounded-full text-xs font-medium hover:bg-[#44445f] transition-colors duration-200"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              {tag}
            </motion.span>
          ))}
          {snippet.tags.length > 3 && (
            <span className="px-3 py-1 bg-[#2e2e40] text-gray-400 rounded-full text-xs font-medium">
              +{snippet.tags.length - 3}
            </span>
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
              <span className="text-sm font-medium">{formatNumber(snippet.likes)}</span>
            </motion.div>
            <div className="flex items-center gap-1 text-gray-400">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">{formatNumber(snippet.views)}</span>
            </div>
          </div>

          <motion.a
            href={`/snippets/${snippet.slug}`}
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

  );
};
