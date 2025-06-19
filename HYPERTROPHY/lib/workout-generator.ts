export interface Exercise {
  name: string
  sets: number
  reps: string
  rest: string
  notes?: string
}

export interface Workout {
  day: string
  focus: string
  exercises: Exercise[]
}

const hypertrophyWorkouts: Workout[] = [
  {
    day: "Monday",
    focus: "Chest & Triceps",
    exercises: [
      { name: "Barbell Bench Press", sets: 4, reps: "8-10", rest: "2-3 min" },
      { name: "Incline Dumbbell Press", sets: 4, reps: "10-12", rest: "2 min" },
      { name: "Dumbbell Flyes", sets: 3, reps: "12-15", rest: "90 sec" },
      { name: "Dips", sets: 3, reps: "10-12", rest: "90 sec" },
      { name: "Close-Grip Bench Press", sets: 4, reps: "8-10", rest: "2 min" },
      { name: "Tricep Rope Pushdowns", sets: 3, reps: "12-15", rest: "60 sec" },
      { name: "Overhead Tricep Extension", sets: 3, reps: "10-12", rest: "60 sec" },
    ],
  },
  {
    day: "Tuesday",
    focus: "Back & Biceps",
    exercises: [
      { name: "Deadlifts", sets: 4, reps: "6-8", rest: "3 min" },
      { name: "Pull-ups/Lat Pulldowns", sets: 4, reps: "8-12", rest: "2 min" },
      { name: "Barbell Rows", sets: 4, reps: "8-10", rest: "2 min" },
      { name: "T-Bar Rows", sets: 3, reps: "10-12", rest: "90 sec" },
      { name: "Barbell Curls", sets: 4, reps: "10-12", rest: "90 sec" },
      { name: "Hammer Curls", sets: 3, reps: "12-15", rest: "60 sec" },
      { name: "Cable Curls", sets: 3, reps: "12-15", rest: "60 sec" },
    ],
  },
  {
    day: "Wednesday",
    focus: "Rest or Light Cardio",
    exercises: [
      { name: "20-30 min moderate cardio", sets: 1, reps: "20-30 min", rest: "N/A", notes: "Optional recovery day" },
    ],
  },
  {
    day: "Thursday",
    focus: "Shoulders & Abs",
    exercises: [
      { name: "Overhead Press", sets: 4, reps: "8-10", rest: "2-3 min" },
      { name: "Lateral Raises", sets: 4, reps: "12-15", rest: "90 sec" },
      { name: "Rear Delt Flyes", sets: 4, reps: "12-15", rest: "90 sec" },
      { name: "Upright Rows", sets: 3, reps: "10-12", rest: "90 sec" },
      { name: "Shrugs", sets: 3, reps: "12-15", rest: "60 sec" },
      { name: "Plank", sets: 3, reps: "30-60 sec", rest: "60 sec" },
      { name: "Russian Twists", sets: 3, reps: "20-30", rest: "60 sec" },
    ],
  },
  {
    day: "Friday",
    focus: "Legs & Glutes",
    exercises: [
      { name: "Squats", sets: 4, reps: "8-10", rest: "3 min" },
      { name: "Romanian Deadlifts", sets: 4, reps: "10-12", rest: "2-3 min" },
      { name: "Bulgarian Split Squats", sets: 3, reps: "12-15 each leg", rest: "90 sec" },
      { name: "Leg Press", sets: 4, reps: "15-20", rest: "2 min" },
      { name: "Leg Curls", sets: 3, reps: "12-15", rest: "90 sec" },
      { name: "Calf Raises", sets: 4, reps: "15-20", rest: "60 sec" },
      { name: "Hip Thrusts", sets: 3, reps: "12-15", rest: "90 sec" },
    ],
  },
  {
    day: "Saturday",
    focus: "Arms & Core",
    exercises: [
      { name: "Barbell Curls", sets: 4, reps: "10-12", rest: "90 sec" },
      { name: "Close-Grip Bench Press", sets: 4, reps: "10-12", rest: "90 sec" },
      { name: "Hammer Curls", sets: 3, reps: "12-15", rest: "60 sec" },
      { name: "Tricep Dips", sets: 3, reps: "12-15", rest: "60 sec" },
      { name: "Cable Curls", sets: 3, reps: "12-15", rest: "60 sec" },
      { name: "Overhead Tricep Extension", sets: 3, reps: "12-15", rest: "60 sec" },
      { name: "Dead Bug", sets: 3, reps: "10 each side", rest: "60 sec" },
    ],
  },
  {
    day: "Sunday",
    focus: "Rest Day",
    exercises: [{ name: "Complete Rest", sets: 1, reps: "Full day", rest: "N/A", notes: "Recovery and meal prep day" }],
  },
]

export function generateWorkoutPlan(): Workout[] {
  return hypertrophyWorkouts
}
