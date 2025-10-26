"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  Code2,
  Zap,
  Users,
  Rocket,
  Github,
  Sparkles,
  Play,
  Star,
  Download,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const codeRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -30]);
  const y2 = useTransform(scrollY, [0, 300], [0, -20]);

  useEffect(() => {
    // Simulate anime.js animations using CSS animations and setTimeout
    const animateElements = () => {
      // Title animation
      if (titleRef.current) {
        titleRef.current.style.transform = "translateY(50px)";
        titleRef.current.style.opacity = "0";
        setTimeout(() => {
          if (titleRef.current) {
            titleRef.current.style.transition =
              "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
            titleRef.current.style.transform = "translateY(0)";
            titleRef.current.style.opacity = "1";
          }
        }, 200);
      }

      // Subtitle animation
      if (subtitleRef.current) {
        subtitleRef.current.style.transform = "translateY(30px)";
        subtitleRef.current.style.opacity = "0";
        setTimeout(() => {
          if (subtitleRef.current) {
            subtitleRef.current.style.transition =
              "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
            subtitleRef.current.style.transform = "translateY(0)";
            subtitleRef.current.style.opacity = "1";
          }
        }, 500);
      }

      // Buttons animation
      if (buttonsRef.current) {
        buttonsRef.current.style.transform = "translateY(20px)";
        buttonsRef.current.style.opacity = "0";
        setTimeout(() => {
          if (buttonsRef.current) {
            buttonsRef.current.style.transition =
              "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
            buttonsRef.current.style.transform = "translateY(0)";
            buttonsRef.current.style.opacity = "1";
          }
        }, 800);
      }
      // Stats animation
      if (statsRef.current) {
        const statItems = statsRef.current.children;
        Array.from(statItems).forEach((item, index) => {
          const el = item as HTMLElement;
          el.style.transform = "translateY(20px)";
          el.style.opacity = "0";
          setTimeout(() => {
            el.style.transition =
              "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
            el.style.transform = "translateY(0)";
            el.style.opacity = "1";
          }, 1100 + index * 100);
        });
      }

      // Code editor animation
      if (codeRef.current) {
        codeRef.current.style.transform = "translateX(50px)";
        codeRef.current.style.opacity = "0";
        setTimeout(() => {
          if (!codeRef.current) return;
          codeRef.current.style.transition =
            "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
          codeRef.current.style.transform = "translateX(0)";
          codeRef.current.style.opacity = "1";
        }, 400);
      }
    };

    // Simulate anime.js timeline
    setTimeout(() => {
      setIsLoaded(true);
      animateElements();
    }, 100);
  }, []);

  const codeSnippets = [
    "fun AnimatedCard() {\n  Card(\n    modifier = Modifier\n      .animateContentSize()\n      .padding(16.dp)\n  ) {\n    // Content\n  }\n}",
    "LazyColumn {\n  items(itemList) { item ->\n    AnimatedVisibility(\n      visible = item.isVisible\n    ) {\n      ItemCard(item)\n    }\n  }\n}",
    "@Composable\nfun ShimmerEffect() {\n  val infiniteTransition = \n    rememberInfiniteTransition()\n  \n  val alpha by infiniteTransition\n    .animateFloat(\n      initialValue = 0.2f,\n      targetValue = 0.8f\n    )\n}",
  ];

  const floatingElements = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 3,
  }));

  return (
    <div
      ref={containerRef}
      className="mt-5 relative min-h-screen bg-gradient-to-br from-slate-700 via-blue-950 to-slate-950 overflow-hidden"
    >
      {/* Minimal Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.15) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Subtle Floating Elements */}
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute rounded-full bg-slate-300/40"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: element.size,
            height: element.size,
          }}
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
          }}
          transition={{
            duration: 6 + element.delay,
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Geometric Shapes */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 border border-blue-300/40 rounded-full"
        animate={{
          rotate: [0, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-32 left-16 w-24 h-24 border border-blue-300/40 rotate-45"
        animate={{
          rotate: [45, 405],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="max-w-7xl mx-auto px-6 py-12 relative z-10 min-h-screen flex items-center"
        style={{ y: y1 }}
      >
        <div className="w-full grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-slate-600 font-medium">
                Latest: v2.0{" "}
              </span>
            </motion.div>

            {/* Main Title */}
            <div className="space-y-4">
              <h1
                ref={titleRef}
                className="text-2xl md:text-5xl lg:text-6xl font-black leading-none text-slate-900"
              >
                <span className="block">Clean</span>
                <span className="block bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  Compose
                </span>
                <span className="block">Snippets</span>
              </h1>
            </div>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-2xl"
            >
              Build exceptional Android apps with our curated collection of{" "}
              <span className="text-blue-400 font-semibold">
                clean, minimal
              </span>{" "}
              Jetpack Compose snippets and utilities.
            </p>

            {/* Action Buttons */}
            <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4">
              {/* Primary CTA */}
              <motion.button
                className="group px-8 py-4 bg-slate-900 text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:bg-slate-800 hover:scale-105"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center gap-3">
                  <Rocket className="w-5 h-5" />
                  Explore Snippets
                  <motion.div className="transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </span>
              </motion.button>

              {/* Secondary CTA */}
              {!user && (
                <motion.a
                  href="https://github.com/login/oauth/authorize?client_id=Iv23liig65AUFtZomHnw&scope=read:user%20gist"
                  className="group px-8 py-4 border-2 border-slate-300 rounded-2xl font-semibold text-slate-300 hover:text-slate-700 text-lg hover:border-slate-400 hover:bg-slate-50 transition-all duration-300"
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center gap-3">
                    <Github className="w-5 h-5" />
                    Sing up with GitHub
                  </span>
                </motion.a>
              )}
            </div>

            {/* Stats */}
            <div ref={statsRef} className="flex flex-wrap gap-8 pt-8">
              {[
                { icon: Code2, label: "100+ Snippets", number: "100+" },
                { icon: Users, label: "50K+ Developers", number: "50K+" },
                { icon: Star, label: "4.9 Rating", number: "4.9" },
                { icon: Download, label: "1M+ Downloads", number: "1M+" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 group cursor-pointer transition-all duration-300 hover:scale-105"
                >
                  <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 group-hover:bg-slate-200 transition-colors duration-300">
                    <stat.icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-500">
                      {stat.number}
                    </div>
                    <div className="text-sm text-slate-400">
                      {stat.label.split(" ")[1]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Clean Code Preview */}
          <motion.div ref={codeRef} className="relative" style={{ y: y2 }}>
            {/* Dark Mode Code Editor Mockup */}
            <div className="relative max-w-lg mx-auto">
              {/* Window Frame */}
              <div className="bg-[#1e1e1e] rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
                {/* Title Bar */}
                <div className="flex items-center gap-2 px-6 py-4 bg-[#2d2d2d] border-b border-slate-700">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="ml-4 text-slate-400 text-sm font-mono">
                    MainActivity.kt
                  </span>
                </div>

                {/* Code Tabs */}
                <div className="flex border-b border-slate-700">
                  {["Animation", "Lists", "Effects"].map((tab, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTab(index)}
                      className={`px-4 py-3 text-sm font-mono transition-all duration-300 ${
                        activeTab === index
                          ? "text-blue-400 bg-[#2a2a2a] border-b-2 border-blue-500"
                          : "text-slate-400 hover:text-white hover:bg-[#2a2a2a]"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Code Content */}
                <div className="p-6 font-mono text-sm leading-relaxed h-80 overflow-hidden bg-[#1e1e1e] text-slate-300">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      {codeSnippets[activeTab]
                        .split("\n")
                        .map((line, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex"
                          >
                            <span className="text-slate-500 w-8 text-right mr-4 select-none">
                              {index + 1}
                            </span>
                            <span className="whitespace-pre-wrap">
                              {line
                                .split(
                                  /(\bfun\b|\bCard\b|\bmodifier\b|\bComposable\b|\bval\b|\by\b)/
                                )
                                .map((part, i) =>
                                  [
                                    "fun",
                                    "Card",
                                    "modifier",
                                    "Composable",
                                    "val",
                                    "by",
                                  ].includes(part) ? (
                                    <span
                                      key={i}
                                      className="text-blue-400 font-medium"
                                    >
                                      {part}
                                    </span>
                                  ) : (
                                    <span key={i}>{part}</span>
                                  )
                                )}
                            </span>
                          </motion.div>
                        ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Run Button */}
                <div className="px-6 py-4 bg-[#2d2d2d] border-t border-slate-700">
                  <motion.button
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="w-4 h-4" fill="currentColor" />
                    Run Code
                  </motion.button>
                </div>
              </div>

              {/* Floating Code Snippets */}
              <motion.div
                className="absolute -top-4 -right-4 bg-[#2d2d2d] border border-slate-700 rounded-lg px-3 py-2 shadow-lg"
                animate={{ y: [-2, 2, -2] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span className="text-xs font-mono text-blue-400">
                  @Composable
                </span>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bg-[#2d2d2d] border border-slate-700 rounded-lg px-3 py-2 shadow-lg"
                animate={{ y: [2, -2, 2] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <span className="text-xs font-mono text-blue-400">
                  Modifier
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Minimal Scroll Indicator */}
      {/* <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-slate-400 text-sm">Scroll to explore</span>
        <motion.div
          className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center"
        >
          <motion.div
            className="w-1 h-3 bg-slate-400 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div> */}
    </div>
  );
};

export default HeroSection;
