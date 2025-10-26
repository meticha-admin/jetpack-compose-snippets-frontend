"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import toast from "react-hot-toast"

interface CodeBlockProps {
  code: string
  language: string
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success("Code copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy code")
    }
  }

  // Simple syntax highlighting for Kotlin/Compose
  const highlightCode = (code: string) => {
    return code
      .replace(
        /\b(fun|val|var|class|interface|object|data|sealed|enum|when|if|else|for|while|do|try|catch|finally|return|import|package|private|public|internal|protected|override|open|abstract|final|companion|inline|suspend|@Composable|@Preview|@OptIn)\b/g,
        '<span class="text-purple-400 font-semibold">$1</span>',
      )
      .replace(
        /\b(String|Int|Long|Float|Double|Boolean|Unit|Any|Nothing|List|MutableList|Set|MutableSet|Map|MutableMap|Array|Pair|Triple)\b/g,
        '<span class="text-blue-400">$1</span>',
      )
      .replace(/\b(true|false|null)\b/g, '<span class="text-orange-400">$1</span>')
      .replace(/(".*?")/g, '<span class="text-green-400">$1</span>')
      .replace(/(\/\/.*$)/gm, '<span class="text-gray-500 italic">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500 italic">$1</span>')
      .replace(/\b(\d+\.?\d*f?)\b/g, '<span class="text-cyan-400">$1</span>')
  }

  const lines = code.split("\n")

  return (
    <div className="relative bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-sm text-gray-400 ml-2">{language}</span>
        </div>
        <Button
          onClick={handleCopy}
          size="sm"
          variant="ghost"
          className="text-gray-400 hover:text-white hover:bg-gray-700 h-8 px-2"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>

      {/* Code Content */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed">
          <code className="block">
            {lines.map((line, index) => (
              <div key={index} className="flex">
                <span className="text-gray-500 select-none w-8 text-right mr-4 flex-shrink-0">{index + 1}</span>
                <span
                  className="flex-1 text-gray-100"
                  dangerouslySetInnerHTML={{ __html: highlightCode(line) || "&nbsp;" }}
                />
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}
