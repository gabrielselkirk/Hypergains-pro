"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { Camera, Save, Loader2 } from "lucide-react"

export default function Profile() {
  const { user, refreshUser, isDemoMode } = useAuth()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    full_name: user?.profile?.full_name || "",
    username: user?.profile?.username || "",
    bio: user?.profile?.bio || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      if (isDemoMode) {
        // Demo mode - simulate save
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log("Demo: Profile updated", formData)
      } else {
        const { updateProfile } = await import("@/lib/auth")
        await updateProfile(user.id, formData)
        await refreshUser()
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    try {
      if (isDemoMode) {
        // Demo mode - simulate upload
        await new Promise((resolve) => setTimeout(resolve, 1500))
        console.log("Demo: Avatar uploaded")
      } else {
        const { uploadAvatar, updateProfile } = await import("@/lib/auth")
        const avatarUrl = await uploadAvatar(user.id, file)
        await updateProfile(user.id, { avatar_url: avatarUrl })
        await refreshUser()
      }
    } catch (error) {
      console.error("Error uploading avatar:", error)
    } finally {
      setUploading(false)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {isDemoMode && (
        <Card className="bg-gradient-primary border-0">
          <CardContent className="p-4">
            <p className="text-black font-semibold text-center">
              🎭 Demo Mode - Changes won't be saved. Connect Supabase for full functionality.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user.profile?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-primary text-black text-xl">
                  {user.profile?.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-primary hover:bg-primary/90"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              </Button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{user.profile?.full_name}</h3>
              <p className="text-gray-400">@{user.profile?.username}</p>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-white">
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">
                  Username
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-white">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about your fitness journey..."
                className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
              />
            </div>
            <Button type="submit" className="bg-gradient-primary hover:opacity-90" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
