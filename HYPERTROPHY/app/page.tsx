"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import OnboardingForm from "@/components/onboarding-form"
import MealPlanComponent from "@/components/meal-plan"
import WorkoutPlan from "@/components/workout-plan"
import Profile from "@/components/profile"
import CommunityFeed from "@/components/community-feed"
import AuthForm from "@/components/auth-form"
import UnitSelector from "@/components/unit-selector"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { UnitProvider, useUnits } from "@/lib/unit-context"
import { type UserStats, calculateTargetCalories, calculateMacros, formatWeight } from "@/lib/calculations"
import { generateMealPlan } from "@/lib/meal-generator"
import { generateWorkoutPlan } from "@/lib/workout-generator"
import { Dumbbell, Utensils, Users, User, Settings, RotateCcw, LogOut, Menu, X, Home, TrendingUp } from "lucide-react"

function AppContent() {
  const { user, loading, signOut } = useAuth()
  const { units } = useUnits()
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [mealPlan, setMealPlan] = useState<any>(null)
  const [workoutPlan, setWorkoutPlan] = useState<any>(null)
  const [targetCalories, setTargetCalories] = useState<number>(0)
  const [macros, setMacros] = useState<any>(null)
  const [showUnitSelector, setShowUnitSelector] = useState(false)
  const [activeTab, setActiveTab] = useState("community")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleOnboardingComplete = (stats: UserStats) => {
    setUserStats(stats)
    const calories = calculateTargetCalories(stats)
    const calculatedMacros = calculateMacros(calories, stats.goal_type)
    setTargetCalories(calories)
    setMacros(calculatedMacros)
    setMealPlan(generateMealPlan(calories, calculatedMacros, stats.goal_type))
    setWorkoutPlan(generateWorkoutPlan())
    setActiveTab("dashboard")
  }

  const handleRestart = () => {
    setUserStats(null)
    setMealPlan(null)
    setWorkoutPlan(null)
    setTargetCalories(0)
    setMacros(null)
    setActiveTab("community")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <Dumbbell className="w-8 h-8 text-black" />
          </div>
          <p className="text-gray-400">Loading HyperGains Pro...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  if (!userStats && activeTab === "dashboard") {
    return <OnboardingForm onComplete={handleOnboardingComplete} />
  }

  const navigationItems = [
    { id: "community", label: "Community", icon: Users },
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "meals", label: "Nutrition", icon: Utensils },
    { id: "workouts", label: "Training", icon: Dumbbell },
    { id: "progress", label: "Progress", icon: TrendingUp },
    { id: "profile", label: "Profile", icon: User },
  ]

  return (
    <>
      <div className="min-h-screen bg-gradient-dark">
        {/* Mobile Header */}
        <header className="lg:hidden bg-card border-b border-gray-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-black" />
              </div>
              <h1 className="text-lg font-bold text-white">HyperGains Pro</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setShowUnitSelector(true)}>
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-card border-r border-gray-800">
            <div className="flex items-center space-x-3 p-6 border-b border-gray-800">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">HyperGains</h1>
                <p className="text-xs text-gray-400">Pro</p>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeTab === item.id
                      ? "bg-gradient-primary text-black hover:opacity-90"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.profile?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-primary text-black">
                    {user.profile?.full_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.profile?.full_name}</p>
                  <p className="text-xs text-gray-400 truncate">@{user.profile?.username}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-700 text-gray-400 hover:text-white"
                  onClick={() => setShowUnitSelector(true)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-700 text-gray-400 hover:text-white"
                  onClick={signOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </aside>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
              <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-gray-800">
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                  <h2 className="text-lg font-semibold text-white">Menu</h2>
                  <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <nav className="p-4 space-y-2">
                  {navigationItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        activeTab === item.id
                          ? "bg-gradient-primary text-black"
                          : "text-gray-400 hover:text-white hover:bg-gray-800"
                      }`}
                      onClick={() => {
                        setActiveTab(item.id)
                        setMobileMenuOpen(false)
                      }}
                    >
                      <item.icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </Button>
                  ))}
                </nav>
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-gray-700 text-gray-400 hover:text-white mb-2"
                    onClick={signOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 lg:ml-64">
            <div className="min-h-screen">
              {activeTab === "community" && <CommunityFeed />}

              {activeTab === "dashboard" && userStats && (
                <div className="p-4 lg:p-6">
                  <div className="max-w-4xl mx-auto">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-white mb-2">Your Dashboard</h2>
                      <p className="text-gray-400">
                        Goal: {userStats.goal_type.charAt(0).toUpperCase() + userStats.goal_type.slice(1)} • Target:{" "}
                        {formatWeight(userStats.goal_weight_kg, units.weightUnit)} • Daily Calories: {targetCalories}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                      <div className="bg-gradient-primary p-6 rounded-xl text-black">
                        <h3 className="text-lg font-semibold mb-2">Daily Calories</h3>
                        <p className="text-3xl font-bold">{targetCalories}</p>
                      </div>
                      <div className="bg-card p-6 rounded-xl border border-gray-800">
                        <h3 className="text-lg font-semibold text-white mb-2">Current Weight</h3>
                        <p className="text-3xl font-bold text-primary">
                          {formatWeight(userStats.current_weight_kg, units.weightUnit)}
                        </p>
                      </div>
                      <div className="bg-card p-6 rounded-xl border border-gray-800">
                        <h3 className="text-lg font-semibold text-white mb-2">Goal Weight</h3>
                        <p className="text-3xl font-bold text-green-500">
                          {formatWeight(userStats.goal_weight_kg, units.weightUnit)}
                        </p>
                      </div>
                    </div>

                    <Button onClick={handleRestart} variant="outline" className="border-gray-700 text-gray-400 mb-6">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Update Plan
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "meals" && mealPlan && (
                <div className="p-4 lg:p-6">
                  <MealPlanComponent mealPlan={mealPlan} targetCalories={targetCalories} macros={macros} />
                </div>
              )}

              {activeTab === "workouts" && workoutPlan && (
                <div className="p-4 lg:p-6">
                  <WorkoutPlan workouts={workoutPlan} />
                </div>
              )}

              {activeTab === "progress" && (
                <div className="p-4 lg:p-6">
                  <div className="max-w-2xl mx-auto text-center py-12">
                    <TrendingUp className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Progress Tracking</h2>
                    <p className="text-gray-400">Track your transformation journey with photos and measurements.</p>
                    <Button className="mt-6 bg-gradient-primary hover:opacity-90">Coming Soon</Button>
                  </div>
                </div>
              )}

              {activeTab === "profile" && <Profile />}
            </div>
          </main>
        </div>
      </div>

      <UnitSelector isOpen={showUnitSelector} onClose={() => setShowUnitSelector(false)} />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <UnitProvider>
        <AppContent />
      </UnitProvider>
    </AuthProvider>
  )
}
