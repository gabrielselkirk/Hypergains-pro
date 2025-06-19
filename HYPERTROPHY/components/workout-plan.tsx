"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Workout } from "@/lib/workout-generator"

interface WorkoutPlanProps {
  workouts: Workout[]
}

export default function WorkoutPlan({ workouts }: WorkoutPlanProps) {
  return (
    <div className="space-y-4">
      {workouts.map((workout, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">{workout.day}</CardTitle>
              <Badge variant="secondary">{workout.focus}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workout.exercises.map((exercise, exerciseIndex) => (
                <div key={exerciseIndex} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{exercise.name}</h4>
                      <div className="text-sm text-gray-600 mt-1">
                        {exercise.sets} sets × {exercise.reps} reps
                      </div>
                      <div className="text-xs text-gray-500">Rest: {exercise.rest}</div>
                      {exercise.notes && <div className="text-xs text-blue-600 mt-1">{exercise.notes}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
