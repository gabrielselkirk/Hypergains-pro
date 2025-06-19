export interface UserStats {
  height_cm: number
  current_weight_kg: number
  goal_weight_kg: number
  age: number
  gender: "male" | "female"
  activity_level: "sedentary" | "light" | "moderate" | "active" | "very_active"
  goal_type: "bulk" | "cut" | "maintain"
}

export type WeightUnit = "kg" | "lbs"
export type HeightUnit = "cm" | "ft"

// Conversion utilities
export function lbsToKg(lbs: number): number {
  return lbs * 0.453592
}

export function kgToLbs(kg: number): number {
  return kg * 2.20462
}

export function cmToFeet(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54
  const feet = Math.floor(totalInches / 12)
  const inches = Math.round(totalInches % 12)
  return { feet, inches }
}

export function feetToCm(feet: number, inches: number): number {
  return (feet * 12 + inches) * 2.54
}

export function formatWeight(weight: number, unit: WeightUnit): string {
  if (unit === "lbs") {
    return `${Math.round(kgToLbs(weight))} lbs`
  }
  return `${weight.toFixed(1)} kg`
}

export function formatHeight(heightCm: number, unit: HeightUnit): string {
  if (unit === "ft") {
    const { feet, inches } = cmToFeet(heightCm)
    return `${feet}'${inches}"`
  }
  return `${heightCm} cm`
}

export function calculateBMR(stats: UserStats): number {
  // Mifflin-St Jeor Equation
  const { height_cm, current_weight_kg, age, gender } = stats

  let bmr = 10 * current_weight_kg + 6.25 * height_cm - 5 * age

  if (gender === "male") {
    bmr += 5
  } else {
    bmr -= 161
  }

  return Math.round(bmr)
}

export function calculateTDEE(stats: UserStats): number {
  const bmr = calculateBMR(stats)
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }

  return Math.round(bmr * activityMultipliers[stats.activity_level])
}

export function calculateTargetCalories(stats: UserStats): number {
  const tdee = calculateTDEE(stats)

  switch (stats.goal_type) {
    case "bulk":
      return tdee + 300 // Moderate surplus
    case "cut":
      return tdee - 500 // Moderate deficit
    case "maintain":
      return tdee
    default:
      return tdee
  }
}

export function calculateMacros(targetCalories: number, goalType: string) {
  let proteinRatio, carbRatio, fatRatio

  switch (goalType) {
    case "bulk":
      proteinRatio = 0.25 // 25% protein
      carbRatio = 0.45 // 45% carbs
      fatRatio = 0.3 // 30% fat
      break
    case "cut":
      proteinRatio = 0.35 // 35% protein
      carbRatio = 0.35 // 35% carbs
      fatRatio = 0.3 // 30% fat
      break
    default:
      proteinRatio = 0.3 // 30% protein
      carbRatio = 0.4 // 40% carbs
      fatRatio = 0.3 // 30% fat
  }

  return {
    protein: Math.round((targetCalories * proteinRatio) / 4), // 4 cal per gram
    carbs: Math.round((targetCalories * carbRatio) / 4), // 4 cal per gram
    fat: Math.round((targetCalories * fatRatio) / 9), // 9 cal per gram
  }
}
