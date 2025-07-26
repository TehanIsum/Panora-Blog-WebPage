import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { ProfilePage } from "@/components/profile/profile-page"

export default async function Profile() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  const { data: userPosts } = await supabase
    .from("posts")
    .select(`
      *,
      author:users(*)
    `)
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <ProfilePage user={userData} posts={userPosts || []} />
    </div>
  )
}
