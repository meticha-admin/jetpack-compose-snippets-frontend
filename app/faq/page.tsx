"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "What is Jetpack Compose?",
    answer:
      "Jetpack Compose is Android's modern toolkit for building native UI. It simplifies and accelerates UI development on Android with less code, powerful tools, and intuitive Kotlin APIs. It's fully declarative, meaning you describe your UI by calling a series of functions that transform data into a UI hierarchy.",
  },
  {
    question: "How can I contribute to this platform?",
    answer:
      "Contributing is easy! You can submit your own Jetpack Compose snippets through our submission form. Make sure your code is well-documented, follows best practices, and includes a clear description of what it does. You can also contribute by reporting bugs, suggesting improvements, or helping other developers in the community.",
  },
  {
    question: "Who is this platform for?",
    answer:
      "This platform is designed for Android developers of all skill levels who are working with or learning Jetpack Compose. Whether you're a beginner looking for examples to learn from, or an experienced developer wanting to share your knowledge and discover new techniques, you'll find value here.",
  },
  {
    question: "Why should I use these snippets?",
    answer:
      "Our snippets are carefully curated and tested to ensure they follow best practices and work reliably. They can help you save development time, learn new techniques, and avoid common pitfalls. Each snippet comes with clear documentation and examples, making it easy to understand and integrate into your projects.",
  },
  {
    question: "Are the snippets free to use?",
    answer:
      "Yes! All snippets on this platform are free to use in your projects, whether they're personal, commercial, or open source. We believe in supporting the developer community by providing high-quality, accessible resources for everyone.",
  },
  {
    question: "How do I report issues or suggest improvements?",
    answer:
      "If you find any issues with snippets or have suggestions for improvements, you can reach out through our GitHub repository or contact form. We welcome feedback and actively work to improve the platform based on community input.",
  },
  {
    question: "Can I modify the snippets for my needs?",
    answer:
      "The snippets are meant to be starting points that you can customize and adapt for your specific use cases. Feel free to modify, extend, or combine snippets to fit your project requirements.",
  },
  {
    question: "How often is new content added?",
    answer:
      "We regularly add new snippets to the platform, with contributions coming from both our team and the community. New content is typically added weekly, and we're always working to expand our collection with the latest Jetpack Compose patterns and techniques.",
  },
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <main className="min-h-screen bg-gray-950">
      <Navigation />

      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="gradient-text">Frequently Asked</span> Questions
              </h1>
              <p className="text-gray-400 text-lg">Everything you need to know about Jetpack Compose Snippets</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                    <CardHeader className="cursor-pointer" onClick={() => toggleItem(index)}>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                        <motion.div
                          animate={{ rotate: openItems.includes(index) ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        </motion.div>
                      </div>
                    </CardHeader>

                    <AnimatePresence>
                      {openItems.includes(index) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardContent className="pt-0">
                            <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center mt-12"
            >
              <Card className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-blue-500/30">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Still have questions?</h3>
                  <p className="text-gray-300 mb-6">
                    Can't find the answer you're looking for? Feel free to reach out to our community.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all duration-300 glow-blue"
                    >
                      Join GitHub Discussions
                    </motion.a>
                    <motion.a
                      href="mailto:support@jetpack-snippets.com"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center justify-center px-6 py-3 border border-gray-600 text-white hover:bg-gray-800 rounded-lg font-medium transition-all duration-300"
                    >
                      Contact Support
                    </motion.a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
