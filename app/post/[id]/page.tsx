import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { PostDetail } from "@/components/posts/post-detail"
import type { User } from "@/lib/types"

interface PostPageProps {
  params: Promise<{ id: string }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params
  const supabase = await createServerClient()

  // Get current user
  let currentUser: User | null = null
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (authUser) {
    const { data: userData } = await supabase.from("users").select("*").eq("id", authUser.id).single()

    currentUser = userData
  }

  // Get post with author
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

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <PostDetail post={post} currentUser={currentUser} />
    </div>
  )
}
