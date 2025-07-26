"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Post } from "@/lib/types"

interface PostFormProps {
  post?: Post
  isEditing?: boolean
}

export function PostForm({ post, isEditing = false }: PostFormProps) {
  const [title, setTitle] = useState(post?.title || "")
  const [content, setContent] = useState(post?.content || "")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Basic validation
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content cannot be empty.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        console.error("Error getting user:", userError.message)
        toast({
          title: "Authentication Error",
          description: "Failed to get user session. Please sign in again.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (!user) {
        toast({
          title: "Sign in required",
          description: "You must be signed in to create or edit a post.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (isEditing && post) {
        // Update existing post
        const { error } = await supabase
          .from("posts")
          .update({
            title: title.trim(), // Trim whitespace
            content: content.trim(), // Trim whitespace
          })
          .eq("id", post.id)

        if (error) {
          console.error("Supabase update post error:", error.message)
          throw error
        }

        toast({
          title: "Post updated!",
          description: "Your post has been updated successfully.",
        })

        router.push(`/post/${post.id}`) // Redirect to the updated post's detail page
      } else {
        // Create new post
        const { data, error } = await supabase
          .from("posts")
          .insert({
            title: title.trim(), // Trim whitespace
            content: content.trim(), // Trim whitespace
            author_id: user.id,
          })
          .select()
          .single()

        if (error) {
          console.error("Supabase insert post error:", error.message)
          throw error
        }

        toast({
          title: "Post created!",
          description: "Your post has been published successfully.",
        })

        router.push("/") // Redirect to the landing page after publishing a new post
      }
    } catch (error) {
      console.error("Failed to save post:", error)
      toast({
        title: "Error",
        description: `Failed to save post: ${error instanceof Error ? error.message : "An unknown error occurred."}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Post" : "Create New Post"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter your post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your post content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                required
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update Post" : "Publish Post"}
              </Button>

              <Button type="button" variant="outline" onClick={() => router.push("/")}>
                {" "}
                {/* Changed to router.push('/') */}
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
