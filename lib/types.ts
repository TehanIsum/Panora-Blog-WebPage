export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
}

export interface Post {
  id: string
  title: string
  content: string
  author_id: string
  created_at: string
  updated_at: string
  author: User
  comments?: Comment[]
  likes?: Like[]
  _count?: {
    comments: number
    likes: number
  }
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  text: string
  created_at: string
  user: User
}

export interface Like {
  id: string
  post_id: string
  user_id: string
  created_at: string
  user: User
}
