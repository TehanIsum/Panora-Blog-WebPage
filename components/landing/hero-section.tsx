"use client"

import { motion } from "framer-motion"
import Link from "next/link" // Ensure Link is imported
import { Button } from "@/components/ui/button"
import { Sparkles, Globe, Brain, PenTool } from "lucide-react"

export function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative w-full py-20 md:py-32 lg:py-48 overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="#e5e7eb" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
        </svg>
      </div>
      <div className="container relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Unleash Your Thoughts with Penora
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl"
        >
          Penora is your canvas for creativity. Share your stories, insights, and ideas with a vibrant community.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Button asChild size="lg" className="px-8 py-3 text-lg">
            <Link href="/create">
              {" "}
              {/* This link already points to the create post page */}
              Start Writing <PenTool className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8 py-3 text-lg bg-transparent">
            <Link href="/#latest-posts">
              {" "}
              {/* Changed to link to posts section */}
              Explore Posts <Globe className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col items-center text-center p-6 bg-background/70 rounded-lg shadow-lg backdrop-blur-sm"
          >
            <Sparkles className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Express Yourself</h3>
            <p className="text-muted-foreground">Write freely and share your unique perspective with the world.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="flex flex-col items-center text-center p-6 bg-background/70 rounded-lg shadow-lg backdrop-blur-sm"
          >
            <Brain className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Learn & Grow</h3>
            <p className="text-muted-foreground">Discover new ideas and engage in meaningful discussions.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="flex flex-col items-center text-center p-6 bg-background/70 rounded-lg shadow-lg backdrop-blur-sm"
          >
            <Globe className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Connect Globally</h3>
            <p className="text-muted-foreground">
              Join a diverse community of writers and readers from around the globe.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
