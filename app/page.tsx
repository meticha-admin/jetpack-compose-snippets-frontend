import { Navigation } from "@/components/navigation"
import HeroSection from "@/components/hero-section"
import { FeaturedSnippets } from "@/components/featured-snippets"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950">
      <Navigation />
      <HeroSection />
      <FeaturedSnippets />
      <Footer />
    </main>
  )
}
