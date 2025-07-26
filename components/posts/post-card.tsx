"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Post, User } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { Heart, MessageCircle, Edit, Trash2, UserIcon } from "lucide-react" // Import UserIcon
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface PostCardProps {
  post: Post
  currentUser?: User | null
  onDelete?: () => void
}

export function PostCard({ post, currentUser, onDelete }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [commentsCount, setCommentsCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchCounts = async () => {
      // Get likes count
      const { count: likes } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id)

      // Get comments count
      const { count: comments } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id)

      setLikesCount(likes || 0)
      setCommentsCount(comments || 0)

      // Check if current user liked this post
      if (currentUser) {
        const { data: userLike } = await supabase
          .from("likes")
          .select("id")
          .eq("post_id", post.id)
          .eq("user_id", currentUser.id)
          .single()

        setIsLiked(!!userLike)
      }
    }

    fetchCounts()
  }, [post.id, currentUser, supabase])

  const handleLike = async () => {
    if (!currentUser) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like posts.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      if (isLiked) {
        // Unlike
        await supabase.from("likes").delete().eq("post_id", post.id).eq("user_id", currentUser.id)

        setIsLiked(false)
        setLikesCount((prev) => prev - 1)
      } else {
        // Like
        await supabase.from("likes").insert({
          post_id: post.id,
          user_id: currentUser.id,
        })

        setIsLiked(true)
        setLikesCount((prev) => prev + 1)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!currentUser || currentUser.id !== post.author_id) return

    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      const { error } = await supabase.from("posts").delete().eq("id", post.id)

      if (error) throw error

      toast({
        title: "Post deleted",
        description: "Your post has been deleted successfully.",
      })

      onDelete?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post.",
        variant: "destructive",
      })
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                {post.author.avatar_url ? (
                  <AvatarImage
                    src={post.author.avatar_url || "/placeholder.svg"}
                    alt={post.author.name}
                    key={post.author.id || "post-author-avatar"}
                    crossOrigin="anonymous"
                  />
                ) : (
                  <AvatarFallback>
                    <UserIcon className="h-6 w-6 text-muted-foreground" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="font-semibold">{post.author.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>

            {currentUser?.id === post.author_id && (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/edit/${post.id}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <Link href={`/post/${post.id}`}>
            <h2 className="text-xl font-bold mb-2 hover:text-primary transition-colors">{post.title}</h2>
            <p className="text-muted-foreground line-clamp-3">{post.content}</p>
          </Link>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              <span>{likesCount}</span>
            </Button>

            <Button variant="ghost" size="sm" asChild className="flex items-center space-x-2">
              <Link href={`/post/${post.id}`}>
                <MessageCircle className="h-4 w-4" />
                <span>{commentsCount}</span>
              </Link>
            </Button>
          </div>

          {post.updated_at !== post.created_at && <Badge variant="secondary">Edited</Badge>}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
