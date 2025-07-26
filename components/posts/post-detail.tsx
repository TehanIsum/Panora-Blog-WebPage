"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Post, User, Comment } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { Heart, MessageCircle, Edit, Trash2, UserIcon } from "lucide-react" // Import UserIcon
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CommentSection } from "./comment-section"

interface PostDetailProps {
  post: Post
  currentUser?: User | null
}

export function PostDetail({ post, currentUser }: PostDetailProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      // Get likes count
      const { count: likes } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id)

      // Get comments with user data
      const { data: commentsData } = await supabase
        .from("comments")
        .select(`
          *,
          user:users(*)
        `)
        .eq("post_id", post.id)
        .order("created_at", { ascending: true })

      setLikesCount(likes || 0)
      setComments(commentsData || [])

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

    fetchData()

    // Set up real-time subscription for comments
    const channel = supabase
      .channel(`post-${post.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments", filter: `post_id=eq.${post.id}` },
        async (payload) => {
          const { data: newComment } = await supabase
            .from("comments")
            .select(`
              *,
              user:users(*)
            `)
            .eq("id", payload.new.id)
            .single()

          if (newComment) {
            setComments((prev) => [...prev, newComment])
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
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
        await supabase.from("likes").delete().eq("post_id", post.id).eq("user_id", currentUser.id)

        setIsLiked(false)
        setLikesCount((prev) => prev - 1)
      } else {
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

      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post.",
        variant: "destructive",
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                {post.author.avatar_url ? (
                  <AvatarImage
                    src={post.author.avatar_url || "/placeholder.svg"}
                    alt={post.author.name}
                    key={post.author.id || "post-detail-author-avatar"}
                    crossOrigin="anonymous"
                  />
                ) : (
                  <AvatarFallback>
                    <UserIcon className="h-7 w-7 text-muted-foreground" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{post.author.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  {post.updated_at !== post.created_at && (
                    <Badge variant="secondary" className="ml-2">
                      Edited
                    </Badge>
                  )}
                </p>
              </div>
            </div>

            {currentUser?.id === post.author_id && (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/edit/${post.id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <div className="prose prose-gray max-w-none">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 pt-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              <span>
                {likesCount} {likesCount === 1 ? "like" : "likes"}
              </span>
            </Button>

            <div className="flex items-center space-x-2 text-muted-foreground">
              <MessageCircle className="h-5 w-5" />
              <span>
                {comments.length} {comments.length === 1 ? "comment" : "comments"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <CommentSection
        postId={post.id}
        comments={comments}
        currentUser={currentUser}
        onCommentAdded={(comment) => setComments((prev) => [...prev, comment])}
      />
    </motion.div>
  )
}
