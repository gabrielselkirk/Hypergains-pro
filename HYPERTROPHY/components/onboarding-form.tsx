"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Settings } from "lucide-react"
import { useUnits } from "@/lib/unit-context"
import UnitSelector from "./unit-selector"
import { type UserStats, lbsToKg, feetToCm } from "@/lib/calculations"

interface OnboardingFormProps {
  onComplete: (stats: UserStats) => void
}

interface FormData {
  height_cm?: number
  height_feet?: number
  height_inches?: number
  current_weight_display?: number
  goal_weight_display?: number
  age?: number
  gender?: "male" | "female"
  activity_level?: "sedentary" | "light" | "moderate" | "active" | "very_active"
  goal_type?: "bulk" | "cut" | "maintain"
}

export default function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({})
  const [showUnitSelector, setShowUnitSelector] = useState(false)
  const { units } = useUnits()

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const convertToUserStats = (): UserStats => {
    let height_cm: number
    let current_weight_kg: number
    let goal_weight_kg: number

    // Convert height to cm
    if (units.heightUnit === "ft") {
      height_cm = feetToCm(formData.height_feet || 0, formData.height_inches || 0)
    } else {
      height_cm = formData.height_cm || 0
    }

    // Convert weights to kg
    if (units.weightUnit === "lbs") {
      current_weight_kg = lbsToKg(formData.current_weight_display || 0)
      goal_weight_kg = lbsToKg(formData.goal_weight_display || 0)
    } else {
      current_weight_kg = formData.current_weight_display || 0
      goal_weight_kg = formData.goal_weight_display || 0
    }

    return {
      height_cm,
      current_weight_kg,
      goal_weight_kg,
      age: formData.age || 0,
      gender: formData.gender || "male",
      activity_level: formData.activity_level || "moderate",
      goal_type: formData.goal_type || "bulk",
    }
  }

  const handleComplete = () => {
    if (isFormComplete()) {
      const stats = convertToUserStats()
      onComplete(stats)
    }
  }

  const isFormComplete = () => {
    const hasHeight =
      units.heightUnit === "ft" ? formData.height_feet && formData.height_inches !== undefined : formData.height_cm

    return (
      hasHeight &&
      formData.current_weight_display &&
      formData.goal_weight_display &&
      formData.age &&
      formData.gender &&
      formData.activity_level &&
      formData.goal_type
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-center flex-1">Build Your Perfect Plan</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowUnitSelector(true)} className="p-2">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex justify-center space-x-2 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${i <= step ? "bg-blue-600" : "bg-gray-300"}`} />
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Info</h3>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={formData.age || ""}
                    onChange={(e) => setFormData({ ...formData, age: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value as "male" | "female" })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Body Stats</h3>

                {/* Height Input */}
                <div className="space-y-2">
                  <Label>Height</Label>
                  {units.heightUnit === "cm" ? (
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="175"
                        value={formData.height_cm || ""}
                        onChange={(e) => setFormData({ ...formData, height_cm: Number.parseInt(e.target.value) })}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        cm
                      </span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          type="number"
                          placeholder="5"
                          value={formData.height_feet || ""}
                          onChange={(e) => setFormData({ ...formData, height_feet: Number.parseInt(e.target.value) })}
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                          ft
                        </span>
                      </div>
                      <div className="relative flex-1">
                        <Input
                          type="number"
                          placeholder="10"
                          value={formData.height_inches || ""}
                          onChange={(e) => setFormData({ ...formData, height_inches: Number.parseInt(e.target.value) })}
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                          in
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Current Weight */}
                <div className="space-y-2">
                  <Label htmlFor="current-weight">Current Weight</Label>
                  <div className="relative">
                    <Input
                      id="current-weight"
                      type="number"
                      step="0.1"
                      placeholder={units.weightUnit === "kg" ? "70.0" : "154.0"}
                      value={formData.current_weight_display || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, current_weight_display: Number.parseFloat(e.target.value) })
                      }
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      {units.weightUnit}
                    </span>
                  </div>
                </div>

                {/* Goal Weight */}
                <div className="space-y-2">
                  <Label htmlFor="goal-weight">Goal Weight</Label>
                  <div className="relative">
                    <Input
                      id="goal-weight"
                      type="number"
                      step="0.1"
                      placeholder={units.weightUnit === "kg" ? "75.0" : "165.0"}
                      value={formData.goal_weight_display || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, goal_weight_display: Number.parseFloat(e.target.value) })
                      }
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      {units.weightUnit}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Activity Level</h3>
                <Select
                  value={formData.activity_level}
                  onValueChange={(value) => setFormData({ ...formData, activity_level: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (desk job, no exercise)</SelectItem>
                    <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="very_active">Very Active (physical job + exercise)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Your Goal</h3>
                <RadioGroup
                  value={formData.goal_type}
                  onValueChange={(value) => setFormData({ ...formData, goal_type: value as any })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bulk" id="bulk" />
                    <Label htmlFor="bulk">Bulk (Gain muscle mass)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cut" id="cut" />
                    <Label htmlFor="cut">Cut (Lose fat, maintain muscle)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="maintain" id="maintain" />
                    <Label htmlFor="maintain">Maintain (Body recomposition)</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
              {step < 4 ? (
                <Button onClick={handleNext} className="ml-auto">
                  Next
                </Button>
              ) : (
                <Button onClick={handleComplete} className="ml-auto" disabled={!isFormComplete()}>
                  Create My Plan
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <UnitSelector isOpen={showUnitSelector} onClose={() => setShowUnitSelector(false)} />
    </>
  )
}
