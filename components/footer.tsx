"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Code2, Github, Twitter, Linkedin, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Code2 className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold gradient-text">Jetpack Snippets</span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              The ultimate collection of reusable Jetpack Compose snippets to accelerate your Android development.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: "/snippets", label: "Browse Snippets" },
                { href: "/submit", label: "Submit Snippet" },
                { href: "/faq", label: "FAQ" },
                { href: "/about", label: "About" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {[
                { href: "https://developer.android.com/jetpack/compose", label: "Jetpack Compose Docs" },
                { href: "https://github.com", label: "GitHub" },
                { href: "/api", label: "API Documentation" },
                { href: "/changelog", label: "Changelog" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 Jetpack Snippets. All rights reserved.</p>
          <p className="text-gray-400 text-sm flex items-center gap-1 mt-2 sm:mt-0">
            Made with <Heart className="h-4 w-4 text-red-500" /> for the Android community
          </p>
        </div>
      </div>
    </footer>
  )
}
