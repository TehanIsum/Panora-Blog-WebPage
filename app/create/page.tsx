import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { PostForm } from "@/components/posts/post-form"

export default async function CreatePostPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Post</h1>
        <p className="text-muted-foreground">Share your thoughts with the community</p>
      </div>

      <PostForm />
    </div>
  )
}
