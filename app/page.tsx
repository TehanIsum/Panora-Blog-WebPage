import { createServerClient } from "@/lib/supabase/server"
import { PostFeed } from "@/components/posts/post-feed"
import { SetupNotice } from "@/components/setup/setup-notice"
import { HeroSection } from "@/components/landing/hero-section"
import type { User } from "@/lib/types"

export default async function HomePage() {
  try {
    const supabase = await createServerClient()

    let currentUser: User | null = null

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (authUser) {
      const { data: userData } = await supabase.from("users").select("*").eq("id", authUser.id).single()
      currentUser = userData
    }

    return (
      <>
        <HeroSection />
        <div className="container max-w-2xl mx-auto py-8">
          <div id="latest-posts" className="mb-8 text-center">
            {" "}
            {/* Added id for scrolling */}
            <h2 className="text-3xl font-bold mb-2">Latest Posts</h2>
            <p className="text-muted-foreground">Dive into fresh content from our community</p>
          </div>

          <PostFeed currentUser={currentUser} />
        </div>
      </>
    )
  } catch (error) {
    // Show setup notice if Supabase is not configured
    return <SetupNotice />
  }
}
