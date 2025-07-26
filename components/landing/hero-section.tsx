"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sparkles, Globe, Brain, PenTool } from "lucide-react"

export function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full py-20 md:py-32 lg:py-48 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5">
        {/* Background pattern for visual interest */}
        <svg className="w-full h-full" fill="none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <pattern id="pattern-circles" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="1" fill="currentColor" className="text-gray-300 dark:text-gray-700" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
        </svg>
      </div>
      <div className="container relative z-10 flex flex-col items-center text-center px-4 md:px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-gray-900 dark:text-gray-50"
        >
          Penora: Your Canvas for Ideas
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-6 max-w-3xl text-lg text-gray-700 dark:text-gray-300 md:text-xl"
        >
          Share your unique perspectives, explore diverse topics, and connect with a vibrant community of thinkers and
          creators. From cutting-edge AI insights to breathtaking travel adventures, Penora is where stories come alive.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Button asChild size="lg" className="px-8 py-3 text-lg">
            <Link href="/create">
              <PenTool className="mr-2 h-5 w-5" />
              Start Writing
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8 py-3 text-lg bg-transparent">
            <Link href="/auth">
              <Sparkles className="mr-2 h-5 w-5" />
              Join the Community
            </Link>
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 flex flex-wrap justify-center gap-6 text-gray-600 dark:text-gray-400"
        >
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            <span>AI & Tech</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <span>Travel & Culture</span>
          </div>
          <div className="flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            <span>Creative Writing</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
