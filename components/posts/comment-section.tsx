"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Comment, User } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Send, UserIcon } from "lucide-react" // Import UserIcon

interface CommentSectionProps {
  postId: string
  comments: Comment[]
  currentUser?: User | null
  onCommentAdded: (comment: Comment) => void
}

export function CommentSection({ postId, comments, currentUser, onCommentAdded }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser) {
      toast({
        title: "Sign in required",
        description: "Please sign in to comment.",
        variant: "destructive",
      })
      return
    }

    if (!newComment.trim()) {
      toast({
        title: "Validation Error",
        description: "Comment cannot be empty.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from("comments")
        .insert({
          post_id: postId,
          user_id: currentUser.id,
          text: newComment.trim(),
        })
        .select(`
          *,
          user:users(*)
        `)
        .single()

      if (error) {
        console.error("Supabase insert comment error:", error.message)
        throw error
      }

      onCommentAdded(data)
      setNewComment("")

      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      })
    } catch (error) {
      console.error("Failed to post comment:", error)
      toast({
        title: "Error",
        description: `Failed to post comment: ${error instanceof Error ? error.message : "An unknown error occurred."}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments ({comments.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        {currentUser ? (
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="flex space-x-3">
              <Avatar className="h-8 w-8">
                {currentUser.avatar_url ? (
                  <AvatarImage
                    src={currentUser.avatar_url || "/placeholder.svg"}
                    alt={currentUser.name}
                    key={currentUser.id || "comment-current-user-avatar"}
                    crossOrigin="anonymous"
                  />
                ) : (
                  <AvatarFallback>
                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || !newComment.trim()} size="sm">
                {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                Post Comment
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Please sign in to leave a comment.</p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          <AnimatePresence>
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex space-x-3 p-4 rounded-lg bg-muted/50"
              >
                <Avatar className="h-8 w-8">
                  {comment.user.avatar_url ? (
                    <AvatarImage
                      src={comment.user.avatar_url || "/placeholder.svg"}
                      alt={comment.user.name}
                      key={comment.id || "comment-author-avatar"}
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <AvatarFallback>
                      <UserIcon className="h-5 w-5 text-muted-foreground" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-semibold text-sm">{comment.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {comments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
