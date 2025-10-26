"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Code2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/snippets", label: "Snippets" },
  { href: "/submit", label: "Submit" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "bg-gray-950/80 backdrop-blur-md border-b border-gray-800"
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-1">
            <Link href="/" className="flex items-center space-x-2 group">
              <Image
                src="/assets/logo.svg"
                alt="Jetpack Snippets Logo"
                width={40}
                height={40}
                className="h-8 w-8"
              />
              <span className="text-lg lg:text-md font-bold gradient-text">
                Jetpack Compose Snippets
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-none items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-400 relative",
                  pathname === item.href ? "text-blue-400" : "text-gray-300"
                )}
              >
                {item.label}
                {pathname === item.href && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-400"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex flex-1 justify-end">
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 glow-blue"
            >
              <Link href="/submit">Submit Snippet</Link>
            </Button>
            {user ? (
              <Button
                variant="outline"
                className="ml-4 text-white border-gray-700 hover:bg-gray-800"
                onClick={logout}
              >
                Logout
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                className="ml-4 text-white border-gray-700 hover:bg-gray-800"
              >
                <Link href="/auth/login">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden ml-5"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-800 mt-2"
            >
              <div className="py-4 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block text-sm font-medium transition-colors hover:text-blue-400",
                      pathname === item.href ? "text-blue-400" : "text-gray-300"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
                >
                  <Link href="/submit" onClick={() => setIsOpen(false)}>
                    Submit Snippet
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
