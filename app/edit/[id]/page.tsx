import { notFound, redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { PostForm } from "@/components/posts/post-form"

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      *,
      author:users(*)
    `)
    .eq("id", id)
    .single()

  if (error || !post) {
    notFound()
  }

  // Check if user is the author
  if (post.author_id !== user.id) {
    redirect("/")
  }

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Post</h1>
        <p className="text-muted-foreground">Make changes to your post</p>
      </div>

      <PostForm post={post} isEditing={true} />
    </div>
  )
}
