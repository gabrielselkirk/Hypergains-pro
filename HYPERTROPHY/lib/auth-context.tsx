"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { AuthUser } from "./auth"
import { demoUser } from "./demo-data"

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
  isDemoMode: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)

  const refreshUser = async () => {
    try {
      // Check if Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        // Use demo mode
        setIsDemoMode(true)
        setUser(demoUser as AuthUser)
        return
      }

      // Try to use real Supabase
      const { getCurrentUser } = await import("./auth")
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error("Error fetching user, using demo mode:", error)
      setIsDemoMode(true)
      setUser(demoUser as AuthUser)
    }
  }

  useEffect(() => {
    refreshUser().finally(() => setLoading(false))

    // Only set up auth listener if not in demo mode
    if (!isDemoMode) {
      try {
        const { supabase } = require("./supabase")
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
          if (event === "SIGNED_IN" && session) {
            await refreshUser()
          } else if (event === "SIGNED_OUT") {
            setUser(null)
          }
          setLoading(false)
        })

        return () => subscription.unsubscribe()
      } catch (error) {
        console.error("Supabase not configured, staying in demo mode")
      }
    }
  }, [isDemoMode])

  const signOut = async () => {
    if (isDemoMode) {
      setUser(null)
      return
    }

    try {
      const { supabase } = await import("./supabase")
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser, isDemoMode }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
