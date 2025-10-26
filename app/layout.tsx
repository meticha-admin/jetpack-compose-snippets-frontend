import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "react-hot-toast"
import ProvidersClientWrapper from "./ProvidersClientWrapper"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Jetpack Compose Snippets - Build Android Apps Faster",
  description:
    "Discover curated and reusable Jetpack Compose snippets. Build Android Apps faster with our collection of reusable components, snippets and utilities.",
  keywords: ["Jetpack Compose", "Android", "Kotlin", "UI Components", "Code Snippets"],
  authors: [{ name: "Jetpack Compose Snippets Team" }],
  openGraph: {
    title: "Jetpack Compose Snippets - Build Android Apps Faster",
    description: "Discover curated and reusable Jetpack Compose snippets",
    type: "website",
    url: "https://jetpack-compose-snippets.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jetpack Compose Snippets",
    description: "Build Android Apps faster with curated Jetpack Compose snippets",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-white antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <ProvidersClientWrapper>{children}</ProvidersClientWrapper>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1f2937",
                color: "#f9fafb",
                border: "1px solid #374151",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
