"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { demoPosts } from "@/lib/demo-data"
import { Heart, MessageCircle, Share, Plus, ImageIcon, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Post {
  id: string
  content: string
  image_url?: string
  post_type: string
  likes_count: number
  comments_count: number
  created_at: string
  profiles: {
    username: string
    full_name: string
    avatar_url: string
  }
  user_liked?: boolean
}

export default function CommunityFeed() {
  const { user, isDemoMode } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [newPost, setNewPost] = useState("")
  const [postType, setPostType] = useState("general")

  useEffect(() => {
    fetchPosts()
  }, [isDemoMode])

  const fetchPosts = async () => {
    try {
      if (isDemoMode) {
        // Use demo data
        setPosts(demoPosts)
        setLoading(false)
        return
      }

      // Real Supabase fetch
      const { supabase } = await import("@/lib/supabase")
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          profiles:user_id (username, full_name, avatar_url),
          post_likes!left (user_id)
        `,
        )
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) throw error

      const postsWithLikes = data?.map((post) => ({
        ...post,
        user_liked: post.post_likes?.some((like: any) => like.user_id === user?.id) || false,
      }))

      setPosts(postsWithLikes || [])
    } catch (error) {
      console.error("Error fetching posts:", error)
      // Fallback to demo data
      setPosts(demoPosts)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return

    setPosting(true)
    try {
      if (isDemoMode) {
        // Demo mode - just add to local state
        const newPostObj = {
          id: `demo-post-${Date.now()}`,
          content: newPost,
          post_type: postType,
          likes_count: 0,
          comments_count: 0,
          created_at: new Date().toISOString(),
          profiles: {
            username: user.profile?.username || "demo",
            full_name: user.profile?.full_name || "Demo User",
            avatar_url: user.profile?.avatar_url || "/placeholder.svg",
          },
          user_liked: false,
        }
        setPosts((prev) => [newPostObj, ...prev])
        setNewPost("")
        setPosting(false)
        return
      }

      // Real Supabase insert
      const { supabase } = await import("@/lib/supabase")
      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        content: newPost,
        post_type: postType,
      })

      if (error) throw error

      setNewPost("")
      await fetchPosts()
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setPosting(false)
    }
  }

  const handleLike = async (postId: string, currentlyLiked: boolean) => {
    if (!user) return

    try {
      if (isDemoMode) {
        // Demo mode - just update local state
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes_count: currentlyLiked ? post.likes_count - 1 : post.likes_count + 1,
                  user_liked: !currentlyLiked,
                }
              : post,
          ),
        )
        return
      }

      // Real Supabase like/unlike
      const { supabase } = await import("@/lib/supabase")
      if (currentlyLiked) {
        await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id)
      } else {
        await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id })
      }

      // Update local state
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes_count: currentlyLiked ? post.likes_count - 1 : post.likes_count + 1,
                user_liked: !currentlyLiked,
              }
            : post,
        ),
      )
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case "progress":
        return "bg-green-500"
      case "workout":
        return "bg-blue-500"
      case "meal":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case "progress":
        return "Progress"
      case "workout":
        return "Workout"
      case "meal":
        return "Nutrition"
      default:
        return "General"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <Card className="bg-gradient-primary border-0">
          <CardContent className="p-4">
            <p className="text-black font-semibold text-center">
              🚀 Demo Mode - Experience HyperGains Pro! Connect Supabase for full functionality.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Create Post */}
      <Card className="bg-card border-gray-800">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.profile?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-primary text-black">
                {user?.profile?.full_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Share your fitness journey..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white resize-none"
                rows={3}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {["general", "progress", "workout", "meal"].map((type) => (
                <Button
                  key={type}
                  variant={postType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPostType(type)}
                  className={postType === type ? "bg-primary" : "border-gray-700 text-gray-400"}
                >
                  {getPostTypeLabel(type)}
                </Button>
              ))}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="border-gray-700 text-gray-400">
                <ImageIcon className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleCreatePost}
                disabled={!newPost.trim() || posting}
                className="bg-gradient-primary hover:opacity-90"
                size="sm"
              >
                {posting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                Post
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="bg-card border-gray-800 animate-fade-in-up">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={post.profiles.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-primary text-black">
                      {post.profiles.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-white">{post.profiles.full_name}</p>
                    <p className="text-sm text-gray-400">@{post.profiles.username}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getPostTypeColor(post.post_type)} text-white`}>
                    {getPostTypeLabel(post.post_type)}
                  </Badge>
                  <span className="text-sm text-gray-400">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-white mb-4">{post.content}</p>
              {post.image_url && (
                <img
                  src={post.image_url || "/placeholder.svg"}
                  alt="Post image"
                  className="w-full rounded-lg mb-4 max-h-96 object-cover"
                />
              )}
              <div className="flex items-center space-x-6 text-gray-400">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post.id, post.user_liked || false)}
                  className={`hover:text-red-500 ${post.user_liked ? "text-red-500" : ""}`}
                >
                  <Heart className={`w-4 h-4 mr-1 ${post.user_liked ? "fill-current" : ""}`} />
                  {post.likes_count}
                </Button>
                <Button variant="ghost" size="sm" className="hover:text-blue-500">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {post.comments_count}
                </Button>
                <Button variant="ghost" size="sm" className="hover:text-green-500">
                  <Share className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
