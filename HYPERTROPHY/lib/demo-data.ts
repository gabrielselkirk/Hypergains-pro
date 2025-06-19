export const demoUser = {
  id: "demo-user-1",
  email: "demo@hypergains.com",
  profile: {
    id: "demo-profile-1",
    user_id: "demo-user-1",
    username: "fitnessfan",
    full_name: "Alex Johnson",
    bio: "Passionate about bodybuilding and helping others reach their fitness goals. 3 years of consistent training.",
    avatar_url: "/placeholder.svg?height=100&width=100",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
}

export const demoPosts = [
  {
    id: "post-1",
    content: "Just hit a new PR on deadlifts! 405lbs for 3 reps. The grind never stops! 💪",
    post_type: "workout",
    likes_count: 24,
    comments_count: 8,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    profiles: {
      username: "stronglifter",
      full_name: "Mike Rodriguez",
      avatar_url: "/placeholder.svg?height=40&width=40",
    },
    user_liked: false,
  },
  {
    id: "post-2",
    content: "Progress update: Down 15lbs in 8 weeks while maintaining strength. Consistency is everything!",
    post_type: "progress",
    likes_count: 42,
    comments_count: 15,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    profiles: {
      username: "transformationqueen",
      full_name: "Sarah Chen",
      avatar_url: "/placeholder.svg?height=40&width=40",
    },
    user_liked: true,
  },
  {
    id: "post-3",
    content: "Meal prep Sunday! Chicken, rice, and veggies for the week. Simple but effective for my bulk.",
    post_type: "meal",
    likes_count: 18,
    comments_count: 5,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    profiles: {
      username: "mealprep_master",
      full_name: "David Kim",
      avatar_url: "/placeholder.svg?height=40&width=40",
    },
    user_liked: false,
  },
  {
    id: "post-4",
    content: "Remember: progress isn't always linear. Trust the process, stay consistent, and results will come. 🔥",
    post_type: "general",
    likes_count: 67,
    comments_count: 23,
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    profiles: {
      username: "mindset_coach",
      full_name: "Emma Thompson",
      avatar_url: "/placeholder.svg?height=40&width=40",
    },
    user_liked: true,
  },
]
