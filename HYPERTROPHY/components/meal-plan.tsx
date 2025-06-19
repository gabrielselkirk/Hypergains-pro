"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { MealPlan } from "@/lib/meal-generator"
import { useUnits } from "@/lib/unit-context"

interface MealPlanProps {
  mealPlan: MealPlan
  targetCalories: number
  macros: { protein: number; carbs: number; fat: number }
}

export default function MealPlanComponent({ mealPlan, targetCalories, macros }: MealPlanProps) {
  const { units } = useUnits()

  const MealCard = ({ meal, title }: { meal: any; title: string }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="flex gap-2">
          <Badge variant="secondary">{meal.calories} cal</Badge>
          <Badge variant="outline">P: {meal.protein}g</Badge>
          <Badge variant="outline">C: {meal.carbs}g</Badge>
          <Badge variant="outline">F: {meal.fat}g</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <h4 className="font-semibold mb-2">{meal.name}</h4>
        <ul className="space-y-1 text-sm text-gray-600">
          {meal.foods.map((food: string, index: number) => (
            <li key={index}>• {food}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Daily Nutrition Targets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{targetCalories}</div>
              <div className="text-sm text-gray-600">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{macros.protein}g</div>
              <div className="text-sm text-gray-600">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{macros.carbs}g</div>
              <div className="text-sm text-gray-600">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{macros.fat}g</div>
              <div className="text-sm text-gray-600">Fat</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <MealCard meal={mealPlan.breakfast} title="Breakfast" />
      <MealCard meal={mealPlan.lunch} title="Lunch" />
      <MealCard meal={mealPlan.dinner} title="Dinner" />

      {mealPlan.snacks.map((snack, index) => (
        <MealCard key={index} meal={snack} title={`Snack ${index + 1}`} />
      ))}
    </div>
  )
}
