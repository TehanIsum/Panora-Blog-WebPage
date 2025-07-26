"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { PostCard } from "@/components/posts/post-card"
import type { User, Post } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { Calendar, FileText, UserIcon } from "lucide-react" // Import UserIcon

interface ProfilePageProps {
  user: User
  posts: Post[]
}

export function ProfilePage({ user, posts }: ProfilePageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              {user.avatar_url ? (
                <AvatarImage
                  src={user.avatar_url || "/placeholder.svg"}
                  alt={user.name}
                  key={user.id || "profile-user-avatar"}
                  crossOrigin="anonymous"
                />
              ) : (
                <AvatarFallback className="text-2xl">
                  <UserIcon className="h-12 w-12 text-muted-foreground" />
                </AvatarFallback>
              )}
            </Avatar>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FileText className="h-4 w-4" />
                  <span>
                    {posts.length} {posts.length === 1 ? "post" : "posts"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* User's Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Your Posts</span>
            <Badge variant="secondary">{posts.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} currentUser={user} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">You haven't written any posts yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
