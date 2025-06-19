export interface Meal {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  foods: string[]
}

export interface MealPlan {
  breakfast: Meal
  lunch: Meal
  dinner: Meal
  snacks: Meal[]
}

const mealTemplates = {
  bulk: {
    breakfast: [
      {
        name: "Power Breakfast Bowl",
        foods: ["3 whole eggs + 2 egg whites", "1 cup oatmeal", "1 banana", "1 tbsp almond butter", "1 cup whole milk"],
        calories: 720,
        protein: 35,
        carbs: 65,
        fat: 25,
      },
      {
        name: "Protein Pancakes",
        foods: ["2 scoops whey protein", "1 cup oats", "2 eggs", "1 banana", "2 tbsp maple syrup"],
        calories: 680,
        protein: 45,
        carbs: 70,
        fat: 15,
      },
    ],
    lunch: [
      {
        name: "Chicken & Rice Bowl",
        foods: ["8oz chicken breast", "1.5 cups jasmine rice", "1 cup mixed vegetables", "1 tbsp olive oil"],
        calories: 850,
        protein: 55,
        carbs: 85,
        fat: 18,
      },
      {
        name: "Salmon Power Bowl",
        foods: ["6oz salmon fillet", "1 cup quinoa", "1 avocado", "Mixed greens", "Sweet potato (200g)"],
        calories: 920,
        protein: 45,
        carbs: 75,
        fat: 35,
      },
    ],
    dinner: [
      {
        name: "Lean Beef & Potatoes",
        foods: ["6oz lean ground beef", "300g baby potatoes", "Green beans", "2 tbsp olive oil"],
        calories: 780,
        protein: 48,
        carbs: 55,
        fat: 28,
      },
      {
        name: "Turkey & Sweet Potato",
        foods: ["8oz ground turkey", "Large sweet potato", "Broccoli", "1 tbsp coconut oil"],
        calories: 720,
        protein: 52,
        carbs: 60,
        fat: 20,
      },
    ],
  },
  cut: {
    breakfast: [
      {
        name: "Protein Veggie Scramble",
        foods: ["4 egg whites + 1 whole egg", "Spinach", "Mushrooms", "Bell peppers", "1 slice ezekiel bread"],
        calories: 320,
        protein: 25,
        carbs: 25,
        fat: 12,
      },
      {
        name: "Greek Yogurt Bowl",
        foods: ["1 cup Greek yogurt (0% fat)", "1/2 cup berries", "1 tbsp almond butter", "1 tbsp chia seeds"],
        calories: 380,
        protein: 30,
        carbs: 25,
        fat: 18,
      },
    ],
    lunch: [
      {
        name: "Grilled Chicken Salad",
        foods: ["6oz chicken breast", "Large mixed salad", "1/2 avocado", "Balsamic vinegar", "1 tbsp olive oil"],
        calories: 520,
        protein: 45,
        carbs: 15,
        fat: 28,
      },
      {
        name: "Tuna & Vegetables",
        foods: ["2 cans tuna in water", "Large cucumber", "Cherry tomatoes", "1 tbsp olive oil", "Lemon juice"],
        calories: 420,
        protein: 50,
        carbs: 12,
        fat: 15,
      },
    ],
    dinner: [
      {
        name: "Lean Fish & Veggies",
        foods: ["6oz white fish", "Steamed broccoli", "Asparagus", "1 tbsp coconut oil", "Cauliflower rice"],
        calories: 380,
        protein: 42,
        carbs: 15,
        fat: 16,
      },
      {
        name: "Chicken & Zucchini",
        foods: ["6oz chicken breast", "2 large zucchini", "Bell peppers", "1 tbsp olive oil", "Herbs & spices"],
        calories: 420,
        protein: 48,
        carbs: 18,
        fat: 16,
      },
    ],
  },
}

export function generateMealPlan(targetCalories: number, macros: any, goalType: string): MealPlan {
  const templates = mealTemplates[goalType as keyof typeof mealTemplates] || mealTemplates.bulk

  const breakfast = templates.breakfast[Math.floor(Math.random() * templates.breakfast.length)]
  const lunch = templates.lunch[Math.floor(Math.random() * templates.lunch.length)]
  const dinner = templates.dinner[Math.floor(Math.random() * templates.dinner.length)]

  const remainingCalories = targetCalories - (breakfast.calories + lunch.calories + dinner.calories)

  const snacks = []
  if (remainingCalories > 200) {
    snacks.push({
      name: "Protein Snack",
      foods: ["1 scoop whey protein", "1 medium apple", "10 almonds"],
      calories: Math.min(remainingCalories, 300),
      protein: 25,
      carbs: 20,
      fat: 8,
    })
  }

  return {
    breakfast,
    lunch,
    dinner,
    snacks,
  }
}
