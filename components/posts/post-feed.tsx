"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PostCard } from "./post-card"
import type { Post, User } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { Loader2, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface PostFeedProps {
  currentUser?: User | null
}

export function PostFeed({ currentUser }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeFeed = async () => {
      try {
        const supabase = createClient()

        const fetchPosts = async () => {
          // The 'author:users(*)' syntax relies on a foreign key from 'posts.author_id' to 'users.id'.
          // If you're seeing "Could not find a relationship", please verify your Supabase database schema.
          const { data, error: fetchError } = await supabase
            .from("posts")
            .select(`
              *,
              author:author_id(*)
            `)
            .order("created_at", { ascending: false })

          if (fetchError) {
            console.error("Supabase fetch posts error:", fetchError) // Log the actual error
            throw new Error(fetchError.message || "Failed to load posts from database.")
          } else {
            setPosts(data || [])
          }
          setLoading(false)
        }

        await fetchPosts()

        // Set up real-time subscription
        const channel = supabase
          .channel("posts")
          .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, async (payload) => {
            // Fetch the new post with author data
            const { data: newPost } = await supabase
              .from("posts")
              .select(`
                  *,
                  author:users(*)
                `)
              .eq("id", payload.new.id)
              .single()

            if (newPost) {
              setPosts((prev) => [newPost, ...prev])
            }
          })
          .on("postgres_changes", { event: "UPDATE", schema: "public", table: "posts" }, async (payload) => {
            // Fetch the updated post with author data
            const { data: updatedPost } = await supabase
              .from("posts")
              .select(`
                  *,
                  author:users(*)
                `)
              .eq("id", payload.new.id)
              .single()

            if (updatedPost) {
              setPosts((prev) => prev.map((post) => (post.id === updatedPost.id ? updatedPost : post)))
            }
          })
          .on("postgres_changes", { event: "DELETE", schema: "public", table: "posts" }, (payload) => {
            setPosts((prev) => prev.filter((post) => post.id !== payload.old.id))
          })
          .subscribe()

        return () => {
          supabase.removeChannel(channel)
        }
      } catch (err) {
        console.error("Error initializing post feed:", err) // Log the full error object
        setError(err instanceof Error ? err.message : "An unexpected error occurred while loading posts.")
        setLoading(false)
      }
    }

    initializeFeed()
  }, [])

  const handlePostDelete = (postId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId))
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <CardContent className="flex items-center space-x-2 p-4">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-800 dark:text-red-200">Error loading posts: {error}</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {posts.map((post) => (
          <motion.div
            key={post.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PostCard post={post} currentUser={currentUser} onDelete={() => handlePostDelete(post.id)} />
          </motion.div>
        ))}
      </AnimatePresence>

      {posts.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <p className="text-muted-foreground">No posts yet. Be the first to share your thoughts!</p>
        </motion.div>
      )}
    </div>
  )
}
