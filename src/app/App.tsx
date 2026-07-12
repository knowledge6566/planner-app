import { useState, useMemo } from "react";
import { Sun, CalendarDays, ShoppingCart, ChefHat, Plus, Minus, X, Search, Users, Clock, Flame, ArrowLeft, Check, Trash2, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

interface Recipe {
  id: string;
  name: string;
  category: string;
  cuisine: string;
  time: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  baseServings: number;
  color: string;
  emoji: string;
  image?: string;
  ingredients: Ingredient[];
  steps?: string[];
}

type MealType = "breakfast" | "lunch" | "dinner";

interface PlannedMeal {
  recipeId: string;
  people: number;
}

type DayPlan = Partial<Record<MealType, PlannedMeal>>;

// ── Data ───────────────────────────────────────────────────────────────────────

const RECIPES: Recipe[] = [
  {
    id: "r1",
    name: "Avocado Toast",
    category: "Breakfast",
    cuisine: "Western",
    time: 10,
    calories: 320,
    protein: 12,
    carbs: 30,
    fat: 18,
    baseServings: 1,
    color: "#16a34a",
    emoji: "🥑",
    image: "https://images.unsplash.com/photo-1687276287139-88f7333c8ca4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Sourdough bread", amount: 2, unit: "slices" },
      { name: "Avocado", amount: 1, unit: "whole" },
      { name: "Lemon juice", amount: 1, unit: "tbsp" },
      { name: "Red pepper flakes", amount: 0.5, unit: "tsp" },
      { name: "Salt & pepper", amount: 1, unit: "pinch" },
      { name: "Eggs", amount: 2, unit: "whole" },
    ],
    steps: [
      "Toast the sourdough slices until golden and crisp.",
      "Halve the avocado, scoop into a bowl, and mash with lemon juice, salt, and pepper.",
      "Meanwhile, fry or poach the eggs to your liking.",
      "Spread the mashed avocado generously over the toast.",
      "Top each toast with an egg, sprinkle red pepper flakes, and serve immediately.",
    ],
  },
  {
    id: "r2",
    name: "Greek Yogurt Parfait",
    category: "Breakfast",
    cuisine: "Western",
    time: 5,
    calories: 280,
    protein: 18,
    carbs: 35,
    fat: 6,
    baseServings: 1,
    color: "#db2777",
    emoji: "🫐",
    image: "https://images.unsplash.com/photo-1571230389215-b34a89739ef1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Greek yogurt", amount: 200, unit: "g" },
      { name: "Granola", amount: 40, unit: "g" },
      { name: "Mixed berries", amount: 80, unit: "g" },
      { name: "Honey", amount: 1, unit: "tbsp" },
      { name: "Chia seeds", amount: 1, unit: "tsp" },
    ],
    steps: [
      "Spoon a layer of Greek yogurt into the bottom of a glass or jar.",
      "Add a layer of granola, then a layer of mixed berries.",
      "Repeat the layers until the glass is full, finishing with berries on top.",
      "Drizzle with honey and sprinkle chia seeds over the top.",
      "Serve right away, or chill for up to an hour before eating.",
    ],
  },
  {
    id: "r3",
    name: "Chicken Caesar Salad",
    category: "Lunch",
    cuisine: "Western",
    time: 20,
    calories: 420,
    protein: 38,
    carbs: 15,
    fat: 22,
    baseServings: 2,
    color: "#d97706",
    emoji: "🥗",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Chicken breasts", amount: 300, unit: "g" },
      { name: "Romaine lettuce", amount: 1, unit: "head" },
      { name: "Parmesan cheese", amount: 40, unit: "g" },
      { name: "Caesar dressing", amount: 60, unit: "ml" },
      { name: "Croutons", amount: 30, unit: "g" },
      { name: "Lemon", amount: 0.5, unit: "whole" },
    ],
    steps: [
      "Season the chicken breasts with salt and pepper.",
      "Grill or pan-sear the chicken 6-7 minutes per side until cooked through, then rest and slice.",
      "Wash and chop the romaine lettuce into bite-sized pieces.",
      "Toss the lettuce with Caesar dressing until evenly coated.",
      "Top with sliced chicken, croutons, and shaved parmesan. Squeeze lemon over and serve.",
    ],
  },
  {
    id: "r4",
    name: "Ramen Bowl",
    category: "Lunch",
    cuisine: "Chinese",
    time: 35,
    calories: 520,
    protein: 28,
    carbs: 62,
    fat: 18,
    baseServings: 2,
    color: "#7c3aed",
    emoji: "🍜",
    image: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Ramen noodles", amount: 200, unit: "g" },
      { name: "Chicken broth", amount: 800, unit: "ml" },
      { name: "Chicken breast", amount: 250, unit: "g" },
      { name: "Soft boiled eggs", amount: 2, unit: "whole" },
      { name: "Green onions", amount: 3, unit: "stalks" },
      { name: "Soy sauce", amount: 2, unit: "tbsp" },
      { name: "Sesame oil", amount: 1, unit: "tbsp" },
      { name: "Nori sheets", amount: 2, unit: "sheets" },
    ],
    steps: [
      "Bring the chicken broth to a gentle simmer and stir in soy sauce and sesame oil.",
      "Poach the chicken breast in the broth until cooked, then remove and slice thinly.",
      "Cook the ramen noodles separately according to package directions, then drain.",
      "Divide the noodles between bowls and ladle the hot broth over them.",
      "Top with sliced chicken, halved soft-boiled eggs, chopped green onions, and nori. Serve hot.",
    ],
  },
  {
    id: "r5",
    name: "Grilled Salmon",
    category: "Dinner",
    cuisine: "Western",
    time: 25,
    calories: 480,
    protein: 45,
    carbs: 8,
    fat: 28,
    baseServings: 2,
    color: "#ea580c",
    emoji: "🐟",
    image: "https://images.unsplash.com/photo-1539136788836-5699e78bfc75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Salmon fillets", amount: 400, unit: "g" },
      { name: "Olive oil", amount: 2, unit: "tbsp" },
      { name: "Garlic cloves", amount: 3, unit: "cloves" },
      { name: "Lemon", amount: 1, unit: "whole" },
      { name: "Fresh dill", amount: 10, unit: "g" },
      { name: "Asparagus", amount: 200, unit: "g" },
      { name: "Salt", amount: 1, unit: "tsp" },
    ],
    steps: [
      "Pat the salmon dry and rub with olive oil, minced garlic, salt, and chopped dill.",
      "Preheat a grill or grill pan over medium-high heat.",
      "Grill the salmon skin-side down for 4-5 minutes, then flip and cook 3-4 minutes more.",
      "Toss the asparagus in olive oil and salt, and grill until tender-crisp.",
      "Squeeze fresh lemon over the salmon and asparagus and serve.",
    ],
  },
  {
    id: "r6",
    name: "Pasta Bolognese",
    category: "Dinner",
    cuisine: "Western",
    time: 45,
    calories: 620,
    protein: 32,
    carbs: 72,
    fat: 20,
    baseServings: 4,
    color: "#dc2626",
    emoji: "🍝",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Spaghetti", amount: 400, unit: "g" },
      { name: "Ground beef", amount: 500, unit: "g" },
      { name: "Tomato sauce", amount: 400, unit: "ml" },
      { name: "Onion", amount: 1, unit: "whole" },
      { name: "Garlic cloves", amount: 4, unit: "cloves" },
      { name: "Carrot", amount: 1, unit: "whole" },
      { name: "Celery stalks", amount: 2, unit: "stalks" },
      { name: "Red wine", amount: 120, unit: "ml" },
      { name: "Parmesan", amount: 60, unit: "g" },
    ],
    steps: [
      "Finely dice the onion, carrot, and celery, and mince the garlic.",
      "Sauté the vegetables in olive oil until softened, about 5 minutes.",
      "Add the ground beef and cook until browned, breaking it up as it cooks.",
      "Pour in the red wine and let it reduce, then add the tomato sauce.",
      "Simmer gently for 30-40 minutes until rich and thick. Cook the spaghetti until al dente.",
      "Toss the pasta with the sauce and serve topped with grated parmesan.",
    ],
  },
  {
    id: "r7",
    name: "Overnight Oats",
    category: "Breakfast",
    cuisine: "Western",
    time: 5,
    calories: 350,
    protein: 14,
    carbs: 52,
    fat: 10,
    baseServings: 1,
    color: "#0891b2",
    emoji: "🥣",
    image: "https://images.unsplash.com/photo-1649118173382-dad295004282?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Rolled oats", amount: 80, unit: "g" },
      { name: "Almond milk", amount: 200, unit: "ml" },
      { name: "Chia seeds", amount: 1, unit: "tbsp" },
      { name: "Maple syrup", amount: 1, unit: "tbsp" },
      { name: "Vanilla extract", amount: 0.5, unit: "tsp" },
      { name: "Banana", amount: 0.5, unit: "whole" },
    ],
    steps: [
      "In a jar, combine the rolled oats, chia seeds, almond milk, maple syrup, and vanilla.",
      "Stir well to make sure the oats are fully submerged in the liquid.",
      "Seal the jar and refrigerate overnight, or for at least 4 hours.",
      "In the morning, stir and add a splash more milk if too thick.",
      "Top with sliced banana and any extra toppings, then enjoy cold.",
    ],
  },
  {
    id: "r8",
    name: "Veggie Stir Fry",
    category: "Dinner",
    cuisine: "Chinese",
    time: 20,
    calories: 380,
    protein: 16,
    carbs: 42,
    fat: 14,
    baseServings: 2,
    color: "#059669",
    emoji: "🥦",
    image: "https://images.unsplash.com/photo-1722290680497-389e0f684e05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Tofu", amount: 300, unit: "g" },
      { name: "Broccoli", amount: 200, unit: "g" },
      { name: "Bell peppers", amount: 2, unit: "whole" },
      { name: "Snow peas", amount: 100, unit: "g" },
      { name: "Soy sauce", amount: 3, unit: "tbsp" },
      { name: "Sesame oil", amount: 1, unit: "tbsp" },
      { name: "Ginger", amount: 1, unit: "tsp" },
      { name: "Rice", amount: 200, unit: "g" },
    ],
    steps: [
      "Press and cube the tofu, then pan-fry until golden on all sides. Set aside.",
      "Cook the rice separately and keep warm.",
      "Heat sesame oil in a wok and stir-fry the grated ginger for 30 seconds.",
      "Add the broccoli, bell peppers, and snow peas, and stir-fry over high heat until crisp-tender.",
      "Return the tofu, pour in the soy sauce, and toss everything to coat.",
      "Serve the stir fry hot over the steamed rice.",
    ],
  },
  // ── North Indian ──
  {
    id: "r9",
    name: "Butter Chicken",
    category: "Dinner",
    cuisine: "North Indian",
    time: 50,
    calories: 580,
    protein: 42,
    carbs: 18,
    fat: 36,
    baseServings: 4,
    color: "#ea580c",
    emoji: "🍗",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Chicken thighs", amount: 800, unit: "g" },
      { name: "Butter", amount: 80, unit: "g" },
      { name: "Tomato puree", amount: 400, unit: "ml" },
      { name: "Heavy cream", amount: 200, unit: "ml" },
      { name: "Onion", amount: 2, unit: "whole" },
      { name: "Garam masala", amount: 2, unit: "tbsp" },
      { name: "Ginger garlic paste", amount: 2, unit: "tbsp" },
      { name: "Kashmiri chili powder", amount: 1, unit: "tbsp" },
      { name: "Yogurt", amount: 150, unit: "g" },
    ],
    steps: [
      "Marinate chicken in yogurt, half the ginger-garlic paste, chili powder, and salt for at least 1 hour.",
      "Grill or pan-sear the marinated chicken until charred and about 80% cooked. Set aside.",
      "In a pan, melt butter and sauté onions until golden. Add remaining ginger-garlic paste and cook 1 minute.",
      "Add tomato puree and garam masala. Simmer 10-15 minutes until the oil separates.",
      "Blend the sauce smooth (optional), return to pan, and stir in the cream.",
      "Add the cooked chicken, simmer 10 minutes until tender. Finish with a knob of butter and serve with naan or rice.",
    ],
  },
  {
    id: "r10",
    name: "Paneer Butter Masala",
    category: "Dinner",
    cuisine: "North Indian",
    time: 40,
    calories: 520,
    protein: 24,
    carbs: 26,
    fat: 34,
    baseServings: 4,
    color: "#f59e0b",
    emoji: "🧀",
    ingredients: [
      { name: "Paneer", amount: 400, unit: "g" },
      { name: "Tomato puree", amount: 350, unit: "ml" },
      { name: "Cashews", amount: 60, unit: "g" },
      { name: "Butter", amount: 60, unit: "g" },
      { name: "Cream", amount: 150, unit: "ml" },
      { name: "Onion", amount: 2, unit: "whole" },
      { name: "Garam masala", amount: 1.5, unit: "tbsp" },
      { name: "Kasuri methi", amount: 1, unit: "tbsp" },
      { name: "Ginger garlic paste", amount: 2, unit: "tbsp" },
    ],
    steps: [
      "Soak cashews in warm water for 15 minutes, then blend into a smooth paste.",
      "Sauté onions in butter until soft, add ginger-garlic paste and cook until fragrant.",
      "Add tomato puree and cook 8-10 minutes until thick and the oil separates.",
      "Stir in cashew paste, garam masala, and a little water. Simmer 5 minutes.",
      "Add cream and cubed paneer, simmer gently 5 minutes (do not boil hard).",
      "Crush kasuri methi between your palms, sprinkle on top, and serve hot.",
    ],
  },
  {
    id: "r11",
    name: "Chole Bhature",
    category: "Lunch",
    cuisine: "North Indian",
    time: 60,
    calories: 640,
    protein: 20,
    carbs: 88,
    fat: 24,
    baseServings: 4,
    color: "#d97706",
    emoji: "🫓",
    image: "https://images.unsplash.com/photo-1780504863220-514ba37dcba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Chickpeas", amount: 400, unit: "g" },
      { name: "All-purpose flour", amount: 400, unit: "g" },
      { name: "Yogurt", amount: 100, unit: "g" },
      { name: "Onion", amount: 2, unit: "whole" },
      { name: "Tomatoes", amount: 3, unit: "whole" },
      { name: "Chole masala", amount: 2, unit: "tbsp" },
      { name: "Ginger garlic paste", amount: 2, unit: "tbsp" },
      { name: "Oil", amount: 200, unit: "ml" },
    ],
    steps: [
      "For bhature: mix flour, yogurt, a pinch of salt and sugar into a soft dough. Cover and rest 2 hours.",
      "For chole: pressure-cook soaked chickpeas until soft.",
      "Sauté onions until brown, add ginger-garlic paste, then chopped tomatoes and chole masala. Cook into a thick masala.",
      "Add the boiled chickpeas with some cooking water. Simmer 15-20 minutes until thick.",
      "Roll rested dough into discs and deep-fry in hot oil until puffed and golden.",
      "Serve hot bhature with the chole, sliced onions, and lemon.",
    ],
  },
  {
    id: "r12",
    name: "Aloo Paratha",
    category: "Breakfast",
    cuisine: "North Indian",
    time: 35,
    calories: 380,
    protein: 9,
    carbs: 58,
    fat: 13,
    baseServings: 2,
    color: "#ca8a04",
    emoji: "🥔",
    ingredients: [
      { name: "Whole wheat flour", amount: 250, unit: "g" },
      { name: "Potatoes", amount: 400, unit: "g" },
      { name: "Green chilies", amount: 2, unit: "whole" },
      { name: "Coriander leaves", amount: 20, unit: "g" },
      { name: "Cumin seeds", amount: 1, unit: "tsp" },
      { name: "Ghee", amount: 40, unit: "g" },
      { name: "Salt", amount: 1, unit: "tsp" },
    ],
    steps: [
      "Knead wheat flour with water and a pinch of salt into a soft dough. Rest 20 minutes.",
      "Boil and mash potatoes. Mix in chopped green chilies, coriander, cumin seeds, and salt.",
      "Take a ball of dough, flatten, place a spoon of filling in the center, and seal.",
      "Dust with flour and gently roll into a paratha, keeping the filling inside.",
      "Cook on a hot tawa, applying ghee on both sides, until golden brown spots appear.",
      "Serve hot with yogurt, pickle, or butter.",
    ],
  },
  {
    id: "r31",
    name: "Paneer Paratha",
    category: "Breakfast",
    cuisine: "North Indian",
    time: 35,
    calories: 400,
    protein: 15,
    carbs: 50,
    fat: 16,
    baseServings: 2,
    color: "#ea580c",
    emoji: "🧀",
    ingredients: [
      { name: "Whole wheat flour", amount: 250, unit: "g" },
      { name: "Paneer (grated)", amount: 250, unit: "g" },
      { name: "Green chilies", amount: 2, unit: "whole" },
      { name: "Coriander leaves", amount: 20, unit: "g" },
      { name: "Garam masala", amount: 0.5, unit: "tsp" },
      { name: "Ginger (grated)", amount: 1, unit: "tsp" },
      { name: "Ghee", amount: 40, unit: "g" },
      { name: "Salt", amount: 1, unit: "tsp" },
    ],
    steps: [
      "Knead wheat flour with water and salt into a soft dough. Rest 20 minutes.",
      "Mix grated paneer with chopped chilies, coriander, ginger, garam masala, and salt.",
      "Flatten a ball of dough, add a spoon of paneer filling, and seal into a ball.",
      "Dust with flour and gently roll into a paratha without tearing the filling.",
      "Cook on a hot tawa with ghee on both sides until golden brown spots appear.",
      "Serve hot with yogurt, butter, or pickle.",
    ],
  },
  {
    id: "r32",
    name: "Gobi Paratha",
    category: "Breakfast",
    cuisine: "North Indian",
    time: 35,
    calories: 360,
    protein: 9,
    carbs: 54,
    fat: 12,
    baseServings: 2,
    color: "#65a30d",
    emoji: "🥦",
    ingredients: [
      { name: "Whole wheat flour", amount: 250, unit: "g" },
      { name: "Cauliflower (grated)", amount: 300, unit: "g" },
      { name: "Green chilies", amount: 2, unit: "whole" },
      { name: "Coriander leaves", amount: 20, unit: "g" },
      { name: "Ajwain (carom seeds)", amount: 0.5, unit: "tsp" },
      { name: "Red chili powder", amount: 0.5, unit: "tsp" },
      { name: "Ghee", amount: 40, unit: "g" },
      { name: "Salt", amount: 1, unit: "tsp" },
    ],
    steps: [
      "Knead wheat flour with water and salt into a soft dough. Rest 20 minutes.",
      "Grate cauliflower, squeeze out excess moisture, then mix with chilies, coriander, ajwain, chili powder, and salt.",
      "Stuff a ball of dough with the gobi filling and seal well.",
      "Roll gently into a paratha, dusting with flour to prevent sticking.",
      "Cook on a hot tawa with ghee on both sides until crisp and golden.",
      "Serve hot with yogurt, butter, or pickle.",
    ],
  },
  {
    id: "r21",
    name: "Tandoori Chicken",
    category: "Dinner",
    cuisine: "North Indian",
    time: 60,
    calories: 420,
    protein: 46,
    carbs: 8,
    fat: 22,
    baseServings: 4,
    color: "#dc2626",
    emoji: "🍗",
    image: "https://images.unsplash.com/photo-1727280376746-b89107a5b0df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Chicken drumsticks", amount: 8, unit: "pieces" },
      { name: "Thick yogurt", amount: 250, unit: "g" },
      { name: "Ginger garlic paste", amount: 2, unit: "tbsp" },
      { name: "Tandoori masala", amount: 2, unit: "tbsp" },
      { name: "Kashmiri chili powder", amount: 1, unit: "tbsp" },
      { name: "Lemon juice", amount: 2, unit: "tbsp" },
      { name: "Mustard oil", amount: 2, unit: "tbsp" },
      { name: "Salt", amount: 1, unit: "tsp" },
    ],
    steps: [
      "Make deep slits in the chicken and rub with lemon juice, salt, and chili powder. Rest 15 minutes.",
      "Whisk yogurt with ginger-garlic paste, tandoori masala, and mustard oil into a thick marinade.",
      "Coat chicken thoroughly and marinate in the fridge for at least 4 hours (overnight is best).",
      "Roast at 220°C / 425°F for 30-35 minutes, turning once, until charred at the edges.",
      "Brush with a little oil or butter and give a final 5-minute blast of heat for smoky char.",
      "Serve with mint chutney, onion rings, and lemon wedges.",
    ],
  },
  {
    id: "r22",
    name: "Paneer Tikka",
    category: "Lunch",
    cuisine: "North Indian",
    time: 40,
    calories: 380,
    protein: 22,
    carbs: 16,
    fat: 26,
    baseServings: 3,
    color: "#ea580c",
    emoji: "🧆",
    image: "https://images.unsplash.com/photo-1666001120694-3ebe8fd207be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Paneer", amount: 400, unit: "g" },
      { name: "Thick yogurt", amount: 200, unit: "g" },
      { name: "Bell peppers", amount: 2, unit: "whole" },
      { name: "Onion", amount: 1, unit: "whole" },
      { name: "Ginger garlic paste", amount: 1, unit: "tbsp" },
      { name: "Tandoori masala", amount: 1.5, unit: "tbsp" },
      { name: "Gram flour (besan)", amount: 1, unit: "tbsp" },
      { name: "Oil", amount: 2, unit: "tbsp" },
    ],
    steps: [
      "Cut paneer, peppers, and onion into large cubes.",
      "Whisk yogurt with ginger-garlic paste, tandoori masala, roasted gram flour, oil, and salt.",
      "Fold paneer and vegetables into the marinade and rest 30 minutes.",
      "Thread onto skewers, alternating paneer and vegetables.",
      "Grill, air-fry, or pan-cook on high heat until charred on all sides, about 10-12 minutes.",
      "Sprinkle chaat masala and lemon, serve hot with mint chutney.",
    ],
  },
  {
    id: "r23",
    name: "Dal Makhani",
    category: "Dinner",
    cuisine: "North Indian",
    time: 90,
    calories: 440,
    protein: 18,
    carbs: 46,
    fat: 20,
    baseServings: 4,
    color: "#78350f",
    emoji: "🥣",
    image: "https://images.unsplash.com/photo-1596560314766-08c0c6890024?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Whole black urad dal", amount: 250, unit: "g" },
      { name: "Rajma (kidney beans)", amount: 50, unit: "g" },
      { name: "Butter", amount: 80, unit: "g" },
      { name: "Cream", amount: 150, unit: "ml" },
      { name: "Tomato puree", amount: 300, unit: "ml" },
      { name: "Ginger garlic paste", amount: 2, unit: "tbsp" },
      { name: "Garam masala", amount: 1, unit: "tbsp" },
      { name: "Kashmiri chili powder", amount: 1, unit: "tbsp" },
    ],
    steps: [
      "Soak urad dal and rajma overnight, then pressure-cook until very soft.",
      "Melt butter, add ginger-garlic paste and cook until fragrant.",
      "Add tomato puree, chili powder, and garam masala. Cook until oil separates.",
      "Add the cooked dal with its water and mash lightly with the back of a spoon.",
      "Simmer on low heat for 40-60 minutes, stirring often, adding water as needed.",
      "Stir in cream and a final knob of butter. Serve with naan or jeera rice.",
    ],
  },
  {
    id: "r24",
    name: "Samosas",
    category: "Lunch",
    cuisine: "North Indian",
    time: 60,
    calories: 300,
    protein: 6,
    carbs: 38,
    fat: 15,
    baseServings: 4,
    color: "#d97706",
    emoji: "🥟",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "All-purpose flour", amount: 300, unit: "g" },
      { name: "Potatoes", amount: 500, unit: "g" },
      { name: "Green peas", amount: 100, unit: "g" },
      { name: "Cumin seeds", amount: 1, unit: "tsp" },
      { name: "Garam masala", amount: 1, unit: "tbsp" },
      { name: "Green chilies", amount: 2, unit: "whole" },
      { name: "Carom seeds (ajwain)", amount: 0.5, unit: "tsp" },
      { name: "Oil", amount: 300, unit: "ml" },
    ],
    steps: [
      "Make a stiff dough with flour, ajwain, salt, and a little oil. Rest 30 minutes.",
      "Boil and roughly mash potatoes. Sauté cumin, peas, chilies, and garam masala, then mix in the potatoes.",
      "Roll dough into ovals, cut in half, and form cones. Fill with the potato mixture and seal the edges.",
      "Heat oil to medium-low (not too hot) for a crisp shell.",
      "Fry samosas slowly until golden and crisp, about 12-15 minutes.",
      "Drain and serve hot with tamarind and mint chutney.",
    ],
  },
  {
    id: "r25",
    name: "Chicken Biryani",
    category: "Dinner",
    cuisine: "North Indian",
    time: 75,
    calories: 640,
    protein: 36,
    carbs: 76,
    fat: 24,
    baseServings: 4,
    color: "#b45309",
    emoji: "🍛",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Basmati rice", amount: 500, unit: "g" },
      { name: "Chicken", amount: 700, unit: "g" },
      { name: "Yogurt", amount: 200, unit: "g" },
      { name: "Onion", amount: 3, unit: "whole" },
      { name: "Biryani masala", amount: 3, unit: "tbsp" },
      { name: "Ginger garlic paste", amount: 2, unit: "tbsp" },
      { name: "Mint & coriander", amount: 40, unit: "g" },
      { name: "Saffron milk", amount: 60, unit: "ml" },
      { name: "Ghee", amount: 60, unit: "g" },
    ],
    steps: [
      "Marinate chicken in yogurt, ginger-garlic paste, and biryani masala for 1 hour.",
      "Deep-fry sliced onions until golden and crisp (birista); set aside.",
      "Parboil rice with whole spices until 70% cooked, then drain.",
      "Cook the marinated chicken in ghee until nearly done and the masala is thick.",
      "Layer rice over the chicken, sprinkle fried onions, herbs, and saffron milk.",
      "Cover tightly and cook on 'dum' (very low heat) 20-25 minutes. Gently fluff and serve.",
    ],
  },
  {
    id: "r26",
    name: "Seekh Kebab",
    category: "Dinner",
    cuisine: "North Indian",
    time: 40,
    calories: 360,
    protein: 30,
    carbs: 6,
    fat: 24,
    baseServings: 3,
    color: "#991b1b",
    emoji: "🍢",
    ingredients: [
      { name: "Minced mutton or chicken", amount: 500, unit: "g" },
      { name: "Onion", amount: 1, unit: "whole" },
      { name: "Ginger garlic paste", amount: 1.5, unit: "tbsp" },
      { name: "Green chilies", amount: 2, unit: "whole" },
      { name: "Garam masala", amount: 1, unit: "tbsp" },
      { name: "Roasted gram flour", amount: 2, unit: "tbsp" },
      { name: "Coriander leaves", amount: 20, unit: "g" },
      { name: "Oil", amount: 2, unit: "tbsp" },
    ],
    steps: [
      "Finely chop onion, chilies, and coriander (or pulse briefly with the mince).",
      "Mix mince with all ingredients and gram flour until sticky and well combined.",
      "Rest the mixture 30 minutes in the fridge so it holds its shape.",
      "Wet your hands and press the mince around skewers into long cylinders.",
      "Grill or pan-cook on medium-high, turning, until browned and cooked through, 10-12 minutes.",
      "Brush with oil, sprinkle chaat masala, and serve with onions and mint chutney.",
    ],
  },
  {
    id: "r27",
    name: "Rajma",
    category: "Lunch",
    cuisine: "North Indian",
    time: 60,
    calories: 380,
    protein: 16,
    carbs: 54,
    fat: 10,
    baseServings: 4,
    color: "#7f1d1d",
    emoji: "🫘",
    image: "https://images.unsplash.com/photo-1668236534990-73c4ed23043c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Kidney beans (rajma)", amount: 300, unit: "g" },
      { name: "Onion", amount: 2, unit: "whole" },
      { name: "Tomatoes", amount: 3, unit: "whole" },
      { name: "Ginger garlic paste", amount: 2, unit: "tbsp" },
      { name: "Rajma masala", amount: 2, unit: "tbsp" },
      { name: "Cumin seeds", amount: 1, unit: "tsp" },
      { name: "Oil", amount: 3, unit: "tbsp" },
      { name: "Rice", amount: 300, unit: "g" },
    ],
    steps: [
      "Soak rajma overnight, then pressure-cook with salt until soft.",
      "Temper cumin seeds in oil, add onions, and fry until golden brown.",
      "Add ginger-garlic paste, then pureed tomatoes and rajma masala. Cook until oil separates.",
      "Add the cooked beans with their water and simmer 20-25 minutes.",
      "Mash a few beans to thicken the gravy and adjust seasoning.",
      "Serve hot over steamed rice (rajma chawal).",
    ],
  },
  {
    id: "r28",
    name: "Momos",
    category: "Lunch",
    cuisine: "North Indian",
    time: 50,
    calories: 320,
    protein: 14,
    carbs: 44,
    fat: 9,
    baseServings: 3,
    color: "#0891b2",
    emoji: "🥟",
    image: "https://images.unsplash.com/photo-1589047133481-02b4a5327d89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "All-purpose flour", amount: 250, unit: "g" },
      { name: "Minced chicken or veg", amount: 300, unit: "g" },
      { name: "Cabbage", amount: 100, unit: "g" },
      { name: "Spring onions", amount: 3, unit: "stalks" },
      { name: "Ginger garlic paste", amount: 1, unit: "tbsp" },
      { name: "Soy sauce", amount: 1, unit: "tbsp" },
      { name: "Black pepper", amount: 0.5, unit: "tsp" },
      { name: "Sesame oil", amount: 1, unit: "tsp" },
    ],
    steps: [
      "Knead flour with water into a smooth, firm dough and rest 20 minutes.",
      "Mix filling: mince, finely chopped cabbage and spring onions, ginger-garlic, soy sauce, pepper, and sesame oil.",
      "Roll dough into small thin discs.",
      "Place filling in the center and pleat the edges to seal into a purse or half-moon.",
      "Steam in a greased steamer for 10-12 minutes until the wrapper turns translucent.",
      "Serve hot with spicy tomato-garlic momo chutney.",
    ],
  },
  {
    id: "r29",
    name: "Sheermal",
    category: "Breakfast",
    cuisine: "North Indian",
    time: 120,
    calories: 340,
    protein: 8,
    carbs: 52,
    fat: 11,
    baseServings: 4,
    color: "#f59e0b",
    emoji: "🫓",
    ingredients: [
      { name: "All-purpose flour", amount: 400, unit: "g" },
      { name: "Warm milk", amount: 200, unit: "ml" },
      { name: "Sugar", amount: 3, unit: "tbsp" },
      { name: "Ghee", amount: 60, unit: "g" },
      { name: "Active dry yeast", amount: 1, unit: "tsp" },
      { name: "Saffron", amount: 1, unit: "pinch" },
      { name: "Cardamom powder", amount: 0.5, unit: "tsp" },
    ],
    steps: [
      "Warm milk with saffron and sugar; add yeast and let it froth for 10 minutes.",
      "Mix flour, cardamom, and ghee, then knead with the saffron milk into a soft dough.",
      "Cover and let it rise for about 1 hour until doubled.",
      "Divide, roll into thick discs, and prick all over with a fork.",
      "Bake at 200°C / 400°F for 12-15 minutes until lightly golden.",
      "Brush with saffron milk and ghee while warm for a glossy, sweet finish.",
    ],
  },
  {
    id: "r30",
    name: "Siddu",
    category: "Breakfast",
    cuisine: "North Indian",
    time: 90,
    calories: 300,
    protein: 9,
    carbs: 46,
    fat: 9,
    baseServings: 3,
    color: "#16a34a",
    emoji: "🥠",
    ingredients: [
      { name: "Whole wheat flour", amount: 300, unit: "g" },
      { name: "Active dry yeast", amount: 1, unit: "tsp" },
      { name: "Walnuts or poppy seeds", amount: 80, unit: "g" },
      { name: "Green chilies", amount: 2, unit: "whole" },
      { name: "Ginger", amount: 1, unit: "tsp" },
      { name: "Ghee", amount: 40, unit: "g" },
      { name: "Salt", amount: 1, unit: "tsp" },
    ],
    steps: [
      "Knead wheat flour with yeast, salt, and warm water into a soft dough. Let it rise 1 hour.",
      "Grind walnuts (or poppy seeds) with green chilies, ginger, and salt into a coarse filling.",
      "Roll out portions of dough, place filling in the center, and fold into a sealed pocket.",
      "Bring water to a boil in a steamer or pressure cooker (without whistle).",
      "Steam the siddu for 20-25 minutes until firm and cooked through.",
      "Serve hot with ghee, mint chutney, or dal.",
    ],
  },
  // ── South Indian ──
  {
    id: "r13",
    name: "Masala Dosa",
    category: "Breakfast",
    cuisine: "South Indian",
    time: 30,
    calories: 340,
    protein: 8,
    carbs: 54,
    fat: 10,
    baseServings: 2,
    color: "#eab308",
    emoji: "🥞",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Dosa batter", amount: 500, unit: "ml" },
      { name: "Potatoes", amount: 400, unit: "g" },
      { name: "Onion", amount: 1, unit: "whole" },
      { name: "Mustard seeds", amount: 1, unit: "tsp" },
      { name: "Curry leaves", amount: 10, unit: "leaves" },
      { name: "Turmeric", amount: 0.5, unit: "tsp" },
      { name: "Oil", amount: 40, unit: "ml" },
    ],
    steps: [
      "Boil the potatoes until soft, then peel and roughly mash them.",
      "Heat oil, splutter mustard seeds, add curry leaves, sliced onion, and turmeric. Sauté until soft.",
      "Mix in the mashed potatoes with salt to make the masala filling. Set aside.",
      "Heat a flat tawa, pour a ladle of dosa batter, and spread in a thin circle.",
      "Drizzle oil around the edges and cook until the dosa turns golden and crisp.",
      "Place a spoon of potato masala in the centre, fold the dosa over, and serve with chutney and sambar.",
    ],
  },
  {
    id: "r14",
    name: "Idli Sambar",
    category: "Breakfast",
    cuisine: "South Indian",
    time: 40,
    calories: 290,
    protein: 12,
    carbs: 52,
    fat: 4,
    baseServings: 3,
    color: "#16a34a",
    emoji: "🍚",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Idli batter", amount: 600, unit: "ml" },
      { name: "Toor dal", amount: 150, unit: "g" },
      { name: "Mixed vegetables", amount: 200, unit: "g" },
      { name: "Sambar powder", amount: 2, unit: "tbsp" },
      { name: "Tamarind", amount: 30, unit: "g" },
      { name: "Tomatoes", amount: 2, unit: "whole" },
      { name: "Curry leaves", amount: 10, unit: "leaves" },
    ],
    steps: [
      "Grease idli moulds and pour in the batter. Steam for 10-12 minutes until fluffy.",
      "Boil the toor dal until soft and mash it smooth.",
      "Cook the mixed vegetables and tomatoes with sambar powder and turmeric until tender.",
      "Add the mashed dal, tamarind extract, and salt, then simmer the sambar for 10 minutes.",
      "Temper mustard seeds and curry leaves in oil and pour over the sambar.",
      "Serve the hot idlis with the sambar and coconut chutney.",
    ],
  },
  {
    id: "r15",
    name: "Hyderabadi Biryani",
    category: "Dinner",
    cuisine: "South Indian",
    time: 75,
    calories: 620,
    protein: 34,
    carbs: 78,
    fat: 22,
    baseServings: 4,
    color: "#dc2626",
    emoji: "🍛",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Basmati rice", amount: 500, unit: "g" },
      { name: "Chicken", amount: 700, unit: "g" },
      { name: "Yogurt", amount: 200, unit: "g" },
      { name: "Onion", amount: 3, unit: "whole" },
      { name: "Biryani masala", amount: 3, unit: "tbsp" },
      { name: "Mint leaves", amount: 30, unit: "g" },
      { name: "Saffron", amount: 1, unit: "pinch" },
      { name: "Ghee", amount: 60, unit: "g" },
    ],
    steps: [
      "Marinate the chicken in yogurt, biryani masala, and salt for at least 1 hour.",
      "Deep-fry the sliced onions until golden and crisp to make birista.",
      "Parboil the basmati rice with whole spices until 70% cooked, then drain.",
      "Layer the marinated chicken in a heavy pot, then top with rice, fried onions, mint, and saffron milk.",
      "Cover tightly and cook on 'dum' over very low heat for 25-30 minutes.",
      "Gently fluff, drizzle with ghee, and serve with raita.",
    ],
  },
  {
    id: "r16",
    name: "Coconut Veg Curry",
    category: "Lunch",
    cuisine: "South Indian",
    time: 30,
    calories: 360,
    protein: 10,
    carbs: 40,
    fat: 18,
    baseServings: 3,
    color: "#059669",
    emoji: "🥥",
    image: "https://images.unsplash.com/photo-1720949579179-b4d04403f548?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Mixed vegetables", amount: 400, unit: "g" },
      { name: "Coconut milk", amount: 400, unit: "ml" },
      { name: "Onion", amount: 1, unit: "whole" },
      { name: "Green chilies", amount: 2, unit: "whole" },
      { name: "Mustard seeds", amount: 1, unit: "tsp" },
      { name: "Curry leaves", amount: 10, unit: "leaves" },
      { name: "Turmeric", amount: 0.5, unit: "tsp" },
      { name: "Rice", amount: 300, unit: "g" },
    ],
    steps: [
      "Heat oil and splutter the mustard seeds, then add curry leaves and sliced onion.",
      "Add slit green chilies and turmeric, and sauté until the onion softens.",
      "Add the mixed vegetables with a little water and cook until nearly tender.",
      "Pour in the coconut milk and simmer gently — do not boil hard — for 5 minutes.",
      "Season with salt and simmer until the curry thickens slightly.",
      "Serve the coconut curry hot with steamed rice.",
    ],
  },
  // ── Chinese ──
  {
    id: "r17",
    name: "Kung Pao Chicken",
    category: "Dinner",
    cuisine: "Chinese",
    time: 30,
    calories: 490,
    protein: 36,
    carbs: 24,
    fat: 28,
    baseServings: 2,
    color: "#b91c1c",
    emoji: "🌶️",
    image: "https://images.unsplash.com/photo-1605704922285-e82455dba38b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Chicken breast", amount: 400, unit: "g" },
      { name: "Peanuts", amount: 80, unit: "g" },
      { name: "Dried red chilies", amount: 8, unit: "whole" },
      { name: "Soy sauce", amount: 3, unit: "tbsp" },
      { name: "Rice vinegar", amount: 1, unit: "tbsp" },
      { name: "Bell pepper", amount: 1, unit: "whole" },
      { name: "Garlic cloves", amount: 3, unit: "cloves" },
      { name: "Cornstarch", amount: 1, unit: "tbsp" },
    ],
    steps: [
      "Cube the chicken and toss with cornstarch and a splash of soy sauce.",
      "Mix the sauce: soy sauce, rice vinegar, a little sugar, and water.",
      "Heat oil in a wok and fry the dried red chilies and garlic until fragrant.",
      "Add the chicken and stir-fry over high heat until golden and cooked through.",
      "Add the diced bell pepper and peanuts, then pour in the sauce and toss until glossy.",
      "Serve the kung pao chicken hot with steamed rice.",
    ],
  },
  {
    id: "r18",
    name: "Veg Hakka Noodles",
    category: "Lunch",
    cuisine: "Chinese",
    time: 25,
    calories: 420,
    protein: 12,
    carbs: 66,
    fat: 14,
    baseServings: 2,
    color: "#7c3aed",
    emoji: "🍜",
    image: "https://images.unsplash.com/photo-1617622141675-d3005b9067c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Hakka noodles", amount: 250, unit: "g" },
      { name: "Cabbage", amount: 150, unit: "g" },
      { name: "Carrot", amount: 1, unit: "whole" },
      { name: "Bell peppers", amount: 2, unit: "whole" },
      { name: "Soy sauce", amount: 3, unit: "tbsp" },
      { name: "Vinegar", amount: 1, unit: "tbsp" },
      { name: "Spring onions", amount: 3, unit: "stalks" },
      { name: "Garlic cloves", amount: 4, unit: "cloves" },
    ],
    steps: [
      "Boil the hakka noodles until just done, drain, and toss with a little oil to prevent sticking.",
      "Julienne the cabbage, carrot, and bell peppers into thin strips.",
      "Heat oil in a wok over high heat and stir-fry the minced garlic for 30 seconds.",
      "Add the vegetables and stir-fry quickly so they stay crunchy.",
      "Add the noodles, soy sauce, and vinegar, and toss everything together over high heat.",
      "Garnish with chopped spring onions and serve hot.",
    ],
  },
  {
    id: "r19",
    name: "Sweet & Sour Pork",
    category: "Dinner",
    cuisine: "Chinese",
    time: 35,
    calories: 540,
    protein: 30,
    carbs: 48,
    fat: 24,
    baseServings: 3,
    color: "#ea580c",
    emoji: "🍍",
    image: "https://images.unsplash.com/photo-1537340728969-d9c8b65093be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Pork shoulder", amount: 500, unit: "g" },
      { name: "Pineapple chunks", amount: 200, unit: "g" },
      { name: "Bell peppers", amount: 2, unit: "whole" },
      { name: "Ketchup", amount: 4, unit: "tbsp" },
      { name: "Rice vinegar", amount: 3, unit: "tbsp" },
      { name: "Sugar", amount: 3, unit: "tbsp" },
      { name: "Cornstarch", amount: 3, unit: "tbsp" },
      { name: "Onion", amount: 1, unit: "whole" },
    ],
    steps: [
      "Cube the pork, season, and coat lightly in cornstarch.",
      "Deep-fry the pork until golden and crisp, then drain on paper towels.",
      "Mix the sauce: ketchup, rice vinegar, sugar, and a little water.",
      "Stir-fry the onion, bell peppers, and pineapple chunks in a hot wok for 2 minutes.",
      "Pour in the sauce and simmer until it thickens into a glossy glaze.",
      "Toss the fried pork through the sauce and serve immediately with rice.",
    ],
  },
  {
    id: "r20",
    name: "Veg Fried Rice",
    category: "Lunch",
    cuisine: "Chinese",
    time: 20,
    calories: 400,
    protein: 10,
    carbs: 64,
    fat: 12,
    baseServings: 2,
    color: "#65a30d",
    emoji: "🍚",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Cooked rice", amount: 400, unit: "g" },
      { name: "Mixed vegetables", amount: 200, unit: "g" },
      { name: "Eggs", amount: 2, unit: "whole" },
      { name: "Soy sauce", amount: 3, unit: "tbsp" },
      { name: "Spring onions", amount: 3, unit: "stalks" },
      { name: "Garlic cloves", amount: 3, unit: "cloves" },
      { name: "Sesame oil", amount: 1, unit: "tbsp" },
    ],
    steps: [
      "Use cold, day-old cooked rice for the best texture.",
      "Heat oil in a wok, scramble the eggs, and set them aside.",
      "Stir-fry the minced garlic and mixed vegetables over high heat until crisp-tender.",
      "Add the rice and break up any clumps, tossing to heat through.",
      "Pour in the soy sauce and sesame oil, return the eggs, and toss well.",
      "Garnish with chopped spring onions and serve hot.",
    ],
  },
  // ── New South Indian dishes ──
  {
    id: "r33",
    name: "Uttapam",
    category: "Breakfast",
    cuisine: "South Indian",
    time: 25,
    calories: 300,
    protein: 9,
    carbs: 48,
    fat: 8,
    baseServings: 2,
    color: "#f59e0b",
    emoji: "🧇",
    image: "https://images.unsplash.com/photo-1736239092023-ba677fd6751c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Dosa batter", amount: 500, unit: "ml" },
      { name: "Onion", amount: 1, unit: "whole" },
      { name: "Tomato", amount: 1, unit: "whole" },
      { name: "Green chilies", amount: 2, unit: "whole" },
      { name: "Coriander", amount: 15, unit: "g" },
      { name: "Oil", amount: 30, unit: "ml" },
    ],
    steps: [
      "Finely chop the onion, tomato, green chilies, and coriander.",
      "Heat a tawa and pour a ladle of thick dosa batter, spreading it into a thick round.",
      "Sprinkle the chopped vegetables over the top and press them gently into the batter.",
      "Drizzle oil around the edges and cook until the base is golden brown.",
      "Flip and cook the topping side for a minute until set.",
      "Serve the uttapam hot with coconut chutney and sambar.",
    ],
  },
  {
    id: "r34",
    name: "Medu Vada",
    category: "Breakfast",
    cuisine: "South Indian",
    time: 40,
    calories: 340,
    protein: 12,
    carbs: 38,
    fat: 16,
    baseServings: 3,
    color: "#d97706",
    emoji: "🍩",
    image: "https://images.unsplash.com/photo-1624374053855-39a5a1a41402?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Urad dal", amount: 250, unit: "g" },
      { name: "Green chilies", amount: 2, unit: "whole" },
      { name: "Ginger", amount: 1, unit: "tsp" },
      { name: "Curry leaves", amount: 10, unit: "leaves" },
      { name: "Black pepper", amount: 1, unit: "tsp" },
      { name: "Oil", amount: 400, unit: "ml" },
    ],
    steps: [
      "Soak the urad dal for 4 hours, then grind to a thick, fluffy batter with minimal water.",
      "Mix in chopped green chilies, ginger, curry leaves, crushed pepper, and salt.",
      "Wet your hands, take a ball of batter, and shape it into a doughnut with a hole in the centre.",
      "Heat oil and gently slide the vadas in, frying in batches.",
      "Fry until deep golden and crisp on both sides, then drain.",
      "Serve the medu vada hot with coconut chutney and sambar.",
    ],
  },
  {
    id: "r35",
    name: "Lemon Rice",
    category: "Lunch",
    cuisine: "South Indian",
    time: 20,
    calories: 320,
    protein: 6,
    carbs: 58,
    fat: 9,
    baseServings: 2,
    color: "#ca8a04",
    emoji: "🍋",
    image: "https://images.unsplash.com/photo-1666251214795-a1296307d29c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Cooked rice", amount: 400, unit: "g" },
      { name: "Lemon", amount: 2, unit: "whole" },
      { name: "Peanuts", amount: 50, unit: "g" },
      { name: "Mustard seeds", amount: 1, unit: "tsp" },
      { name: "Curry leaves", amount: 10, unit: "leaves" },
      { name: "Turmeric", amount: 0.5, unit: "tsp" },
      { name: "Green chilies", amount: 2, unit: "whole" },
    ],
    steps: [
      "Heat oil and splutter the mustard seeds, then fry the peanuts until golden.",
      "Add curry leaves, slit green chilies, and turmeric, and sauté briefly.",
      "Turn off the heat and stir in the lemon juice and salt.",
      "Add the cooked rice and mix gently until evenly coloured.",
      "Adjust salt and lemon to taste and serve warm.",
    ],
  },
  {
    id: "r36",
    name: "Rasam",
    category: "Lunch",
    cuisine: "South Indian",
    time: 30,
    calories: 180,
    protein: 8,
    carbs: 26,
    fat: 4,
    baseServings: 3,
    color: "#dc2626",
    emoji: "🍲",
    image: "https://images.unsplash.com/photo-1668236534990-73c4ed23043c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Toor dal", amount: 100, unit: "g" },
      { name: "Tomatoes", amount: 3, unit: "whole" },
      { name: "Tamarind", amount: 25, unit: "g" },
      { name: "Rasam powder", amount: 2, unit: "tbsp" },
      { name: "Garlic cloves", amount: 4, unit: "cloves" },
      { name: "Curry leaves", amount: 10, unit: "leaves" },
      { name: "Coriander", amount: 15, unit: "g" },
    ],
    steps: [
      "Boil the toor dal until soft and mash it lightly.",
      "Soak the tamarind in warm water and extract the pulp.",
      "Simmer the tamarind water with chopped tomatoes, rasam powder, crushed garlic, and salt.",
      "Add the mashed dal with more water and bring to a gentle froth — do not boil hard.",
      "Temper mustard seeds and curry leaves in ghee and pour over the rasam.",
      "Garnish with coriander and serve hot with rice or as a soup.",
    ],
  },
  {
    id: "r37",
    name: "Upma",
    category: "Breakfast",
    cuisine: "South Indian",
    time: 20,
    calories: 290,
    protein: 7,
    carbs: 46,
    fat: 9,
    baseServings: 2,
    color: "#eab308",
    emoji: "🥣",
    image: "https://images.unsplash.com/photo-1665660710687-b44c50751054?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Semolina (rava)", amount: 200, unit: "g" },
      { name: "Onion", amount: 1, unit: "whole" },
      { name: "Mixed vegetables", amount: 150, unit: "g" },
      { name: "Mustard seeds", amount: 1, unit: "tsp" },
      { name: "Curry leaves", amount: 10, unit: "leaves" },
      { name: "Green chilies", amount: 2, unit: "whole" },
      { name: "Ghee", amount: 30, unit: "g" },
    ],
    steps: [
      "Dry-roast the semolina until lightly golden and aromatic, then set aside.",
      "Heat ghee, splutter mustard seeds, and add curry leaves and green chilies.",
      "Add the onion and mixed vegetables and sauté until softened.",
      "Pour in about 2.5 cups of hot water with salt and bring to a boil.",
      "Lower the heat and slowly stir in the roasted semolina to avoid lumps.",
      "Cover and cook 2-3 minutes until fluffy, then serve hot.",
    ],
  },
  {
    id: "r38",
    name: "Chettinad Chicken",
    category: "Dinner",
    cuisine: "South Indian",
    time: 50,
    calories: 520,
    protein: 40,
    carbs: 16,
    fat: 30,
    baseServings: 4,
    color: "#b91c1c",
    emoji: "🍗",
    image: "https://images.unsplash.com/photo-1708782344490-9026aaa5eec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Chicken", amount: 800, unit: "g" },
      { name: "Onion", amount: 2, unit: "whole" },
      { name: "Tomato", amount: 2, unit: "whole" },
      { name: "Coconut", amount: 50, unit: "g" },
      { name: "Chettinad masala", amount: 3, unit: "tbsp" },
      { name: "Ginger garlic paste", amount: 2, unit: "tbsp" },
      { name: "Curry leaves", amount: 12, unit: "leaves" },
    ],
    steps: [
      "Dry-roast the whole spices and coconut, then grind into a fresh Chettinad masala paste.",
      "Heat oil and sauté the onions until golden, then add ginger-garlic paste.",
      "Add the tomatoes and cook until soft and pulpy.",
      "Add the chicken and the ground masala, and sauté until the chicken is coated and sealed.",
      "Add water, cover, and simmer until the chicken is tender and the gravy thickens.",
      "Finish with curry leaves and serve hot with rice or dosa.",
    ],
  },
  // ── New Chinese dishes ──
  {
    id: "r39",
    name: "Chilli Chicken",
    category: "Dinner",
    cuisine: "Chinese",
    time: 35,
    calories: 470,
    protein: 34,
    carbs: 22,
    fat: 26,
    baseServings: 3,
    color: "#dc2626",
    emoji: "🌶️",
    image: "https://images.unsplash.com/photo-1601565960311-8a7f4e1ab709?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Chicken breast", amount: 500, unit: "g" },
      { name: "Bell peppers", amount: 2, unit: "whole" },
      { name: "Onion", amount: 1, unit: "whole" },
      { name: "Soy sauce", amount: 3, unit: "tbsp" },
      { name: "Chili sauce", amount: 2, unit: "tbsp" },
      { name: "Cornstarch", amount: 3, unit: "tbsp" },
      { name: "Garlic cloves", amount: 4, unit: "cloves" },
    ],
    steps: [
      "Cube the chicken, coat in cornstarch and a little soy sauce, and deep-fry until crisp.",
      "In a wok, heat oil and stir-fry the garlic until fragrant.",
      "Add the diced onion and bell peppers and stir-fry over high heat for 2 minutes.",
      "Add the soy sauce, chili sauce, and a splash of water to make the sauce.",
      "Toss the fried chicken in the sauce until well coated and glossy.",
      "Serve the chilli chicken hot as a starter or with fried rice.",
    ],
  },
  {
    id: "r40",
    name: "Veg Manchurian",
    category: "Dinner",
    cuisine: "Chinese",
    time: 45,
    calories: 420,
    protein: 12,
    carbs: 52,
    fat: 18,
    baseServings: 3,
    color: "#92400e",
    emoji: "🧆",
    image: "https://images.unsplash.com/photo-1682622110433-65513a55d7da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Cabbage", amount: 200, unit: "g" },
      { name: "Carrot", amount: 2, unit: "whole" },
      { name: "All-purpose flour", amount: 100, unit: "g" },
      { name: "Cornstarch", amount: 60, unit: "g" },
      { name: "Soy sauce", amount: 3, unit: "tbsp" },
      { name: "Ginger garlic paste", amount: 2, unit: "tbsp" },
      { name: "Spring onions", amount: 3, unit: "stalks" },
    ],
    steps: [
      "Grate the cabbage and carrot, mix with flour, cornstarch, and salt to form a stiff mixture.",
      "Shape into small balls and deep-fry until golden and crisp. Drain.",
      "In a wok, stir-fry the ginger-garlic paste until fragrant.",
      "Add soy sauce, a little chili sauce, and water, and bring to a simmer.",
      "Thicken with a cornstarch slurry, then toss the fried balls through the sauce.",
      "Garnish with spring onions and serve hot.",
    ],
  },
  {
    id: "r41",
    name: "Spring Rolls",
    category: "Lunch",
    cuisine: "Chinese",
    time: 40,
    calories: 360,
    protein: 8,
    carbs: 44,
    fat: 16,
    baseServings: 3,
    color: "#ca8a04",
    emoji: "🌯",
    image: "https://images.unsplash.com/photo-1695712641569-05eee7b37b6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Spring roll wrappers", amount: 12, unit: "sheets" },
      { name: "Cabbage", amount: 200, unit: "g" },
      { name: "Carrot", amount: 2, unit: "whole" },
      { name: "Bell pepper", amount: 1, unit: "whole" },
      { name: "Soy sauce", amount: 2, unit: "tbsp" },
      { name: "Garlic cloves", amount: 3, unit: "cloves" },
      { name: "Oil", amount: 400, unit: "ml" },
    ],
    steps: [
      "Julienne the cabbage, carrot, and bell pepper into thin strips.",
      "Stir-fry the garlic and vegetables over high heat with soy sauce until just wilted. Cool.",
      "Place a spoon of filling on a wrapper, fold the sides in, and roll up tightly, sealing with water.",
      "Heat oil and deep-fry the rolls in batches until golden and crisp.",
      "Drain on paper towels and serve hot with sweet chili dipping sauce.",
    ],
  },
  {
    id: "r42",
    name: "Hot & Sour Soup",
    category: "Lunch",
    cuisine: "Chinese",
    time: 30,
    calories: 220,
    protein: 14,
    carbs: 20,
    fat: 9,
    baseServings: 3,
    color: "#b45309",
    emoji: "🥣",
    image: "https://images.unsplash.com/photo-1611345157614-26d3bdd10c93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Vegetable broth", amount: 1000, unit: "ml" },
      { name: "Tofu", amount: 150, unit: "g" },
      { name: "Mushrooms", amount: 100, unit: "g" },
      { name: "Carrot", amount: 1, unit: "whole" },
      { name: "Soy sauce", amount: 3, unit: "tbsp" },
      { name: "Vinegar", amount: 3, unit: "tbsp" },
      { name: "Cornstarch", amount: 2, unit: "tbsp" },
      { name: "White pepper", amount: 1, unit: "tsp" },
    ],
    steps: [
      "Bring the vegetable broth to a boil in a large pot.",
      "Add julienned carrot, sliced mushrooms, and cubed tofu, and simmer 5 minutes.",
      "Stir in the soy sauce, vinegar, and white pepper for the hot-and-sour balance.",
      "Mix cornstarch with cold water and stir it in to thicken the soup.",
      "Drizzle in a beaten egg while stirring for silky ribbons (optional).",
      "Taste, adjust the sour and pepper levels, and serve piping hot.",
    ],
  },
  {
    id: "r43",
    name: "Chow Mein",
    category: "Dinner",
    cuisine: "Chinese",
    time: 25,
    calories: 440,
    protein: 14,
    carbs: 64,
    fat: 15,
    baseServings: 2,
    color: "#a16207",
    emoji: "🍜",
    image: "https://images.unsplash.com/photo-1634864572865-1cf8ff8bd23d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Chow mein noodles", amount: 250, unit: "g" },
      { name: "Cabbage", amount: 150, unit: "g" },
      { name: "Carrot", amount: 1, unit: "whole" },
      { name: "Bean sprouts", amount: 100, unit: "g" },
      { name: "Soy sauce", amount: 3, unit: "tbsp" },
      { name: "Oyster sauce", amount: 2, unit: "tbsp" },
      { name: "Spring onions", amount: 3, unit: "stalks" },
    ],
    steps: [
      "Boil the noodles until just tender, drain, and toss with a little oil.",
      "Shred the cabbage and carrot into thin strips.",
      "Heat a wok over high heat and stir-fry the vegetables and bean sprouts for 2 minutes.",
      "Add the noodles, soy sauce, and oyster sauce, tossing constantly.",
      "Stir-fry until the noodles are lightly charred and coated in sauce.",
      "Garnish with spring onions and serve hot.",
    ],
  },
  {
    id: "r44",
    name: "Dim Sum Dumplings",
    category: "Lunch",
    cuisine: "Chinese",
    time: 50,
    calories: 380,
    protein: 18,
    carbs: 40,
    fat: 14,
    baseServings: 3,
    color: "#7c3aed",
    emoji: "🥟",
    image: "https://images.unsplash.com/photo-1543198432-a20fa3055570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Dumpling wrappers", amount: 24, unit: "sheets" },
      { name: "Ground chicken", amount: 300, unit: "g" },
      { name: "Cabbage", amount: 100, unit: "g" },
      { name: "Ginger", amount: 1, unit: "tbsp" },
      { name: "Soy sauce", amount: 2, unit: "tbsp" },
      { name: "Sesame oil", amount: 1, unit: "tbsp" },
      { name: "Spring onions", amount: 2, unit: "stalks" },
    ],
    steps: [
      "Mix the ground chicken with finely chopped cabbage, ginger, spring onions, soy sauce, and sesame oil.",
      "Place a spoon of filling in the centre of each wrapper.",
      "Moisten the edges and pleat to seal into little parcels.",
      "Line a steamer with parchment and arrange the dumplings without touching.",
      "Steam over boiling water for 8-10 minutes until cooked through.",
      "Serve the dim sum hot with soy-vinegar dipping sauce.",
    ],
  },
  // ── New Western dishes ──
  {
    id: "r45",
    name: "Margherita Pizza",
    category: "Dinner",
    cuisine: "Western",
    time: 40,
    calories: 560,
    protein: 22,
    carbs: 68,
    fat: 22,
    baseServings: 2,
    color: "#dc2626",
    emoji: "🍕",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Pizza dough", amount: 400, unit: "g" },
      { name: "Tomato sauce", amount: 150, unit: "ml" },
      { name: "Fresh mozzarella", amount: 200, unit: "g" },
      { name: "Fresh basil", amount: 10, unit: "g" },
      { name: "Olive oil", amount: 2, unit: "tbsp" },
      { name: "Salt", amount: 1, unit: "tsp" },
    ],
    steps: [
      "Preheat your oven as hot as it goes (250°C+) with a baking stone or tray inside.",
      "Stretch the pizza dough into a thin round on a floured surface.",
      "Spread a thin layer of tomato sauce, leaving a border for the crust.",
      "Tear the mozzarella over the top and drizzle with olive oil.",
      "Bake for 8-10 minutes until the crust is blistered and the cheese is bubbling.",
      "Scatter fresh basil over the hot pizza, slice, and serve.",
    ],
  },
  {
    id: "r46",
    name: "Classic Cheeseburger",
    category: "Dinner",
    cuisine: "Western",
    time: 25,
    calories: 650,
    protein: 35,
    carbs: 40,
    fat: 38,
    baseServings: 2,
    color: "#b45309",
    emoji: "🍔",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Ground beef", amount: 400, unit: "g" },
      { name: "Burger buns", amount: 2, unit: "whole" },
      { name: "Cheddar slices", amount: 2, unit: "slices" },
      { name: "Lettuce", amount: 4, unit: "leaves" },
      { name: "Tomato", amount: 1, unit: "whole" },
      { name: "Onion", amount: 0.5, unit: "whole" },
      { name: "Burger sauce", amount: 2, unit: "tbsp" },
    ],
    steps: [
      "Divide the beef into patties slightly wider than the buns and season with salt and pepper.",
      "Heat a skillet or grill over high heat until very hot.",
      "Cook the patties 3-4 minutes per side, adding cheese in the last minute to melt.",
      "Lightly toast the buns cut-side down.",
      "Spread sauce on the buns and layer lettuce, tomato, onion, and the patty.",
      "Close the burger and serve immediately with fries.",
    ],
  },
  {
    id: "r47",
    name: "Fluffy Pancakes",
    category: "Breakfast",
    cuisine: "Western",
    time: 20,
    calories: 430,
    protein: 12,
    carbs: 62,
    fat: 14,
    baseServings: 2,
    color: "#d97706",
    emoji: "🥞",
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "All-purpose flour", amount: 200, unit: "g" },
      { name: "Milk", amount: 300, unit: "ml" },
      { name: "Eggs", amount: 2, unit: "whole" },
      { name: "Baking powder", amount: 2, unit: "tsp" },
      { name: "Sugar", amount: 2, unit: "tbsp" },
      { name: "Butter", amount: 40, unit: "g" },
      { name: "Maple syrup", amount: 4, unit: "tbsp" },
    ],
    steps: [
      "Whisk together the flour, baking powder, sugar, and a pinch of salt.",
      "In a separate bowl, beat the eggs with the milk and melted butter.",
      "Combine the wet and dry ingredients into a smooth batter — don't overmix.",
      "Heat a greased pan over medium and pour in rounds of batter.",
      "Flip when bubbles form on the surface and cook until golden on both sides.",
      "Stack the pancakes and serve with maple syrup and butter.",
    ],
  },
  {
    id: "r48",
    name: "Fish and Chips",
    category: "Dinner",
    cuisine: "Western",
    time: 45,
    calories: 720,
    protein: 34,
    carbs: 70,
    fat: 34,
    baseServings: 2,
    color: "#a16207",
    emoji: "🐟",
    image: "https://images.unsplash.com/photo-1579208030886-b937da0925dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "White fish fillets", amount: 400, unit: "g" },
      { name: "Potatoes", amount: 600, unit: "g" },
      { name: "All-purpose flour", amount: 150, unit: "g" },
      { name: "Cold beer or soda water", amount: 200, unit: "ml" },
      { name: "Baking powder", amount: 1, unit: "tsp" },
      { name: "Oil", amount: 800, unit: "ml" },
      { name: "Salt", amount: 1, unit: "tsp" },
    ],
    steps: [
      "Cut the potatoes into thick chips and fry once at a lower temperature until soft, then drain.",
      "Whisk the flour, baking powder, salt, and cold beer into a smooth batter.",
      "Pat the fish dry, dip into the batter, and let the excess drip off.",
      "Deep-fry the battered fish until golden and crisp, then drain.",
      "Fry the chips a second time at high heat until golden and crunchy.",
      "Season with salt and serve the fish and chips hot with tartar sauce.",
    ],
  },
  {
    id: "r49",
    name: "Mac and Cheese",
    category: "Dinner",
    cuisine: "Western",
    time: 35,
    calories: 610,
    protein: 24,
    carbs: 58,
    fat: 32,
    baseServings: 3,
    color: "#eab308",
    emoji: "🧀",
    image: "https://images.unsplash.com/photo-1667499989723-c4ab9549d63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Macaroni", amount: 300, unit: "g" },
      { name: "Cheddar cheese", amount: 250, unit: "g" },
      { name: "Milk", amount: 500, unit: "ml" },
      { name: "Butter", amount: 50, unit: "g" },
      { name: "All-purpose flour", amount: 40, unit: "g" },
      { name: "Breadcrumbs", amount: 50, unit: "g" },
    ],
    steps: [
      "Cook the macaroni until just al dente, then drain.",
      "Melt the butter, stir in the flour, and cook 1 minute to make a roux.",
      "Gradually whisk in the milk and cook until the sauce thickens.",
      "Stir in most of the grated cheddar until smooth and melted, then season.",
      "Fold in the macaroni and transfer to a baking dish.",
      "Top with the remaining cheese and breadcrumbs, and bake until golden and bubbling.",
    ],
  },
  {
    id: "r50",
    name: "Club Sandwich",
    category: "Lunch",
    cuisine: "Western",
    time: 15,
    calories: 490,
    protein: 28,
    carbs: 44,
    fat: 22,
    baseServings: 1,
    color: "#16a34a",
    emoji: "🥪",
    image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ingredients: [
      { name: "Bread slices", amount: 3, unit: "slices" },
      { name: "Chicken breast", amount: 150, unit: "g" },
      { name: "Bacon", amount: 2, unit: "strips" },
      { name: "Lettuce", amount: 2, unit: "leaves" },
      { name: "Tomato", amount: 1, unit: "whole" },
      { name: "Mayonnaise", amount: 2, unit: "tbsp" },
    ],
    steps: [
      "Cook and slice the chicken breast, and fry the bacon until crisp.",
      "Toast the three bread slices until golden.",
      "Spread mayonnaise on the toast slices.",
      "Layer the first slice with lettuce, tomato, and chicken.",
      "Add the second slice, then bacon and more lettuce, and top with the third slice.",
      "Secure with picks, cut into quarters, and serve.",
    ],
  },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner"];
const MEAL_LABELS: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
};
const MEAL_EMOJIS: Record<MealType, string> = {
  breakfast: "☀️",
  lunch: "🌤️",
  dinner: "🌙",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function scaleIngredients(recipe: Recipe, people: number): Ingredient[] {
  const ratio = people / recipe.baseServings;
  return recipe.ingredients.map((ing) => ({
    ...ing,
    amount: parseFloat((ing.amount * ratio).toFixed(1)),
  }));
}

function formatAmount(amount: number): string {
  if (amount < 1 && amount > 0) {
    const fractions: Record<number, string> = { 0.25: "¼", 0.5: "½", 0.75: "¾", 0.1: "⅒", 0.3: "⅓", 0.2: "⅕" };
    const close = Object.keys(fractions).find((k) => Math.abs(parseFloat(k) - amount) < 0.05);
    if (close) return fractions[parseFloat(close)];
  }
  return amount % 1 === 0 ? amount.toString() : amount.toFixed(1);
}

function getRecipeById(id: string, recipes: Recipe[] = RECIPES): Recipe | undefined {
  return recipes.find((r) => r.id === id);
}

const CUISINES = ["North Indian", "South Indian", "Chinese", "Western"];

// Generic cooking-stage images, picked per step by matching keywords in the step text.
const STAGE_IMAGES = {
  prep: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  fry: "https://images.unsplash.com/photo-1766422526750-6099697a2dd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  simmer: "https://images.unsplash.com/photo-1715733593146-93c3461765b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  dough: "https://images.unsplash.com/photo-1549590143-d5855148a9d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  serve: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  marinate: "https://images.unsplash.com/photo-1612949059698-1a619560ff02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  spices: "https://images.unsplash.com/photo-1716816211590-c15a328a5ff0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
};

function getStepImage(step: string, isLast: boolean, recipe: Recipe): string {
  const s = step.toLowerCase();
  if (isLast || s.includes("serve") || s.includes("plate")) return recipe.image || STAGE_IMAGES.serve;
  if (s.includes("marinat")) return STAGE_IMAGES.marinate;
  if (s.includes("knead") || s.includes("dough") || s.includes("roll") || s.includes("flour")) return STAGE_IMAGES.dough;
  if (s.includes("fry") || s.includes("sauté") || s.includes("saute") || s.includes("onion") || s.includes("grill") || s.includes("roast") || s.includes("sear")) return STAGE_IMAGES.fry;
  if (s.includes("simmer") || s.includes("cook") || s.includes("boil") || s.includes("steam") || s.includes("add")) return STAGE_IMAGES.simmer;
  return STAGE_IMAGES.spices;
}

// ── Radial Progress ───────────────────────────────────────────────────────────

function RadialProgress({ value, max, color, size = 64, label, sublabel }: {
  value: number; max: number; color: string; size?: number; label: string; sublabel: string;
}) {
  const pct = Math.min(value / max, 1);
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={6} />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={color} strokeWidth={6}
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold" style={{ color }}>{Math.round(pct * 100)}%</span>
        </div>
      </div>
      <span className="text-xs font-semibold text-gray-800">{label}</span>
      <span className="text-xs text-gray-500">{sublabel}</span>
    </div>
  );
}

// ── Pill Tag ──────────────────────────────────────────────────────────────────

function Pill({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
        active
          ? "bg-purple-600 text-white border-purple-600"
          : "bg-white text-gray-800 border-gray-300 hover:border-purple-400"
      }`}
    >
      {label}
    </button>
  );
}

// ── Recipe Card ───────────────────────────────────────────────────────────────

function RecipeCard({ recipe, onSelect }: { recipe: Recipe; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 hover:border-purple-300 hover:shadow-md transition-all w-full text-left"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ backgroundColor: recipe.color + "22" }}
      >
        {recipe.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm truncate">{recipe.name}</p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={10} />{recipe.time} min</span>
          <span className="text-xs text-gray-500 flex items-center gap-1"><Flame size={10} />{recipe.calories} kcal</span>
          <span className="text-xs text-purple-600 font-medium">{recipe.category}</span>
        </div>
      </div>
    </button>
  );
}

// ── Screens ───────────────────────────────────────────────────────────────────

// TODAY SCREEN
function TodayScreen({
  todayPlan,
  recipes,
  onViewRecipe,
}: {
  todayPlan: DayPlan;
  recipes: Recipe[];
  onViewRecipe: (recipeId: string, people: number) => void;
}) {
  const meals = MEAL_TYPES.map((type) => {
    const planned = todayPlan[type];
    const recipe = planned ? getRecipeById(planned.recipeId, recipes) : undefined;
    return { type, planned, recipe };
  });

  const totalCalories = meals.reduce((sum, m) => {
    if (!m.recipe || !m.planned) return sum;
    return sum + Math.round((m.recipe.calories * m.planned.people) / m.recipe.baseServings);
  }, 0);

  const totalProtein = meals.reduce((sum, m) => {
    if (!m.recipe || !m.planned) return sum;
    return sum + Math.round((m.recipe.protein * m.planned.people) / m.recipe.baseServings);
  }, 0);

  const totalCarbs = meals.reduce((sum, m) => {
    if (!m.recipe || !m.planned) return sum;
    return sum + Math.round((m.recipe.carbs * m.planned.people) / m.recipe.baseServings);
  }, 0);

  const totalFat = meals.reduce((sum, m) => {
    if (!m.recipe || !m.planned) return sum;
    return sum + Math.round((m.recipe.fat * m.planned.people) / m.recipe.baseServings);
  }, 0);

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Header */}
      <div className="px-5 pt-5">
        <p className="text-sm text-gray-500">{dateStr}</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-0.5">Today's Meals</h1>
      </div>

      {/* Nutrition Summary */}
      {totalCalories > 0 && (
        <div className="mx-5 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm opacity-80">Today's Progress</p>
              <p className="text-2xl font-bold mt-0.5">🔥 {totalCalories} <span className="text-sm font-normal opacity-80">kcal</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-70">Goal: 2000 kcal</p>
              <div className="w-24 h-2 bg-white/20 rounded-full mt-1">
                <div
                  className="h-full bg-white rounded-full"
                  style={{ width: `${Math.min((totalCalories / 2000) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-around">
            <RadialProgress value={totalProtein} max={120} color="#a78bfa" size={60} label={`${totalProtein}g`} sublabel="Protein" />
            <RadialProgress value={totalCarbs} max={250} color="#34d399" size={60} label={`${totalCarbs}g`} sublabel="Carbs" />
            <RadialProgress value={totalFat} max={65} color="#fbbf24" size={60} label={`${totalFat}g`} sublabel="Fat" />
          </div>
        </div>
      )}

      {/* Meal Cards */}
      <div className="px-5 flex flex-col gap-3">
        {meals.map(({ type, planned, recipe }) => (
          <div key={type} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
              <span className="text-base">{MEAL_EMOJIS[type]}</span>
              <span className="font-semibold text-sm text-gray-700">{MEAL_LABELS[type]}</span>
            </div>
            {recipe && planned ? (
              <button
                onClick={() => onViewRecipe(planned.recipeId, planned.people)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: recipe.color + "22" }}
                >
                  {recipe.emoji}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{recipe.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Users size={10} /> {planned.people} {planned.people === 1 ? "person" : "people"}
                    </span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Flame size={10} /> {Math.round((recipe.calories * planned.people) / recipe.baseServings)} kcal
                    </span>
                  </div>
                </div>
                <span className="text-purple-600 text-xs font-medium">View →</span>
              </button>
            ) : (
              <div className="px-4 py-4 flex items-center justify-center">
                <span className="text-sm text-gray-400 italic">No meal planned</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick tip */}
      <div className="mx-5 bg-purple-50 border border-purple-100 rounded-2xl p-4">
        <p className="text-sm font-semibold text-purple-800 mb-1">💡 Tip</p>
        <p className="text-xs text-purple-700">Go to <strong>Meal Plan</strong> to add meals for today and adjust servings for your group.</p>
      </div>
    </div>
  );
}

// RECIPE DETAIL SCREEN
// COOKING MODE — full-screen guided, step-by-step flow with photos
function CookingMode({ recipe, onExit }: { recipe: Recipe; onExit: () => void }) {
  const steps = recipe.steps || [];
  const [index, setIndex] = useState(0);
  const isLast = index === steps.length - 1;
  const isFirst = index === 0;
  const stepText = steps[index];
  const img = getStepImage(stepText, isLast, recipe);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top bar */}
      <div className="flex-shrink-0 px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onExit} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
            <X size={16} className="text-gray-700" />
          </button>
          <span className="text-sm font-semibold text-gray-700">{recipe.name}</span>
          <span className="text-xs text-gray-500 w-9 text-right">
            {index + 1}/{steps.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1.5 rounded-full transition-colors"
              style={{ backgroundColor: i <= index ? recipe.color : "#e5e7eb" }}
            />
          ))}
        </div>
      </div>

      {/* Step image */}
      <div className="flex-shrink-0 px-5">
        <div className="relative rounded-2xl overflow-hidden h-56 bg-gray-100">
          <ImageWithFallback src={img} alt={`Step ${index + 1}`} className="w-full h-full object-cover" />
          <div
            className="absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg"
            style={{ backgroundColor: recipe.color }}
          >
            {index + 1}
          </div>
          {isLast && (
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
              Final step 🎉
            </div>
          )}
        </div>
      </div>

      {/* Step text */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: recipe.color }}>
          Step {index + 1} of {steps.length}
        </p>
        <p className="text-lg text-gray-900 leading-relaxed">{stepText}</p>

        {/* Full step list preview */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">All steps</p>
          <div className="flex flex-col gap-1.5">
            {steps.map((s, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`flex items-start gap-2 text-left rounded-lg px-2 py-1.5 transition-colors ${
                  i === index ? "bg-gray-100" : ""
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${
                    i < index ? "text-white" : i === index ? "text-white" : "bg-gray-200 text-gray-500"
                  }`}
                  style={i <= index ? { backgroundColor: recipe.color } : undefined}
                >
                  {i < index ? <Check size={10} /> : i + 1}
                </div>
                <span className={`text-xs leading-snug ${i === index ? "text-gray-900" : "text-gray-500"}`}>{s}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="flex-shrink-0 px-5 py-4 border-t border-gray-100 flex gap-3">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={isFirst}
          className="flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-1 bg-gray-100 text-gray-700 disabled:opacity-40 transition-all active:scale-95"
        >
          <ChevronLeft size={18} /> Back
        </button>
        {isLast ? (
          <button
            onClick={onExit}
            className="flex-[2] py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-1 shadow-lg transition-all active:scale-95"
            style={{ backgroundColor: recipe.color }}
          >
            <Check size={18} /> Done Cooking
          </button>
        ) : (
          <button
            onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))}
            className="flex-[2] py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-1 shadow-lg transition-all active:scale-95"
            style={{ backgroundColor: recipe.color }}
          >
            Next Step <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

function RecipeDetailScreen({
  recipe,
  initialPeople,
  onBack,
}: {
  recipe: Recipe;
  initialPeople: number;
  onBack: () => void;
}) {
  const [people, setPeople] = useState(initialPeople);
  const [cooking, setCooking] = useState(false);
  const scaled = useMemo(() => scaleIngredients(recipe, people), [recipe, people]);
  const hasSteps = !!(recipe.steps && recipe.steps.length > 0);

  if (cooking && hasSteps) {
    return <CookingMode recipe={recipe} onExit={() => setCooking(false)} />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Hero */}
      <div
        className="relative flex-shrink-0 h-52 flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${recipe.color}33, ${recipe.color}66)` }}
      >
        {recipe.image ? (
          <ImageWithFallback src={recipe.image} alt={recipe.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <span className="text-7xl">{recipe.emoji}</span>
        )}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-9 h-9 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow z-10"
        >
          <ArrowLeft size={16} className="text-gray-700" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-white rounded-t-3xl -mt-4 relative">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="px-5 pb-6">
          {/* Title & meta */}
          <div className="mb-4">
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">{recipe.category}</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-0.5">{recipe.name}</h2>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-gray-500 flex items-center gap-1.5"><Clock size={14} className="text-gray-400" />{recipe.time} min</span>
              <span className="text-sm text-gray-500 flex items-center gap-1.5"><Flame size={14} className="text-orange-400" />{recipe.calories} kcal</span>
              <span className="text-sm text-gray-500 flex items-center gap-1.5">🍽️ {recipe.baseServings} base serving{recipe.baseServings > 1 ? "s" : ""}</span>
            </div>
          </div>

          {/* Macros */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { label: "Protein", value: `${Math.round((recipe.protein * people) / recipe.baseServings)}g`, color: "#7c3aed", bg: "#ede9fe" },
              { label: "Carbs", value: `${Math.round((recipe.carbs * people) / recipe.baseServings)}g`, color: "#059669", bg: "#d1fae5" },
              { label: "Fat", value: `${Math.round((recipe.fat * people) / recipe.baseServings)}g`, color: "#d97706", bg: "#fef3c7" },
            ].map((m) => (
              <div key={m.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: m.bg }}>
                <p className="text-xs text-gray-500">{m.label}</p>
                <p className="text-base font-bold mt-0.5" style={{ color: m.color }}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* People selector */}
          <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3 mb-5">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-purple-600" />
              <span className="font-semibold text-gray-900 text-sm">Number of People</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPeople(Math.max(1, people - 1))}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:border-purple-400 transition-colors"
              >
                <Minus size={14} className="text-gray-600" />
              </button>
              <span className="text-xl font-bold text-gray-900 w-6 text-center">{people}</span>
              <button
                onClick={() => setPeople(Math.min(20, people + 1))}
                className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shadow-sm hover:bg-purple-700 transition-colors"
              >
                <Plus size={14} className="text-white" />
              </button>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">Ingredients</h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                for {people} {people === 1 ? "person" : "people"}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {scaled.map((ing, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: recipe.color }} />
                    <span className="text-sm text-gray-800">{ing.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatAmount(ing.amount)} {ing.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* How to cook */}
          {recipe.steps && recipe.steps.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold text-gray-900 mb-3">How to Cook</h3>
              <div className="flex flex-col gap-3">
                {recipe.steps.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                      style={{ backgroundColor: recipe.color }}
                    >
                      {i + 1}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Start Cooking */}
          <button
            onClick={() => hasSteps && setCooking(true)}
            className="w-full mt-6 py-4 rounded-2xl font-bold text-white text-base shadow-lg transition-all active:scale-95 disabled:opacity-60"
            style={{ backgroundColor: recipe.color }}
            disabled={!hasSteps}
          >
            {hasSteps ? "Start Cooking 🍳" : "No steps available"}
          </button>
        </div>
      </div>
    </div>
  );
}

// MEAL PLAN SCREEN
function MealPlanScreen({
  weekPlan,
  recipes,
  onAddMeal,
  onRemoveMeal,
  onViewRecipe,
}: {
  weekPlan: DayPlan[];
  recipes: Recipe[];
  onAddMeal: (dayIndex: number, mealType: MealType) => void;
  onRemoveMeal: (dayIndex: number, mealType: MealType) => void;
  onViewRecipe: (recipeId: string, people: number) => void;
}) {
  const [selectedDay, setSelectedDay] = useState(0);
  const dayPlan = weekPlan[selectedDay];

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Header */}
      <div className="px-5 pt-5">
        <h1 className="text-2xl font-bold text-gray-900">Meal Plan</h1>
        <p className="text-sm text-gray-500 mt-0.5">Plan your week, know your ingredients</p>
      </div>

      {/* Day selector */}
      <div className="px-5">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {DAYS.map((day, i) => {
            const hasAny = MEAL_TYPES.some((t) => weekPlan[i][t]);
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(i)}
                className={`flex-shrink-0 flex flex-col items-center px-3 py-2.5 rounded-xl transition-all ${
                  selectedDay === i
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-purple-300"
                }`}
              >
                <span className="text-xs font-medium">{day}</span>
                {hasAny && (
                  <div className={`w-1.5 h-1.5 rounded-full mt-1 ${selectedDay === i ? "bg-white/60" : "bg-purple-500"}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Meals for selected day */}
      <div className="px-5 flex flex-col gap-3">
        {MEAL_TYPES.map((mealType) => {
          const planned = dayPlan[mealType];
          const recipe = planned ? getRecipeById(planned.recipeId, recipes) : undefined;

          return (
            <div key={mealType} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Meal header */}
              <div className="px-4 py-2.5 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{MEAL_EMOJIS[mealType]}</span>
                  <span className="font-semibold text-sm text-gray-700">{MEAL_LABELS[mealType]}</span>
                </div>
                {!planned && (
                  <button
                    onClick={() => onAddMeal(selectedDay, mealType)}
                    className="flex items-center gap-1 text-xs text-purple-600 font-medium hover:text-purple-800 transition-colors"
                  >
                    <Plus size={14} /> Add meal
                  </button>
                )}
              </div>

              {/* Meal content */}
              {recipe && planned ? (
                <div className="px-4 py-3">
                  <button
                    onClick={() => onViewRecipe(planned.recipeId, planned.people)}
                    className="flex items-center gap-3 w-full text-left mb-3 hover:opacity-80 transition-opacity"
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ backgroundColor: recipe.color + "22" }}
                    >
                      {recipe.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{recipe.name}</p>
                      <p className="text-xs text-gray-500">
                        {Math.round((recipe.calories * planned.people) / recipe.baseServings)} kcal ·{" "}
                        {recipe.time} min
                      </p>
                    </div>
                  </button>
                  <div className="flex items-center justify-between bg-purple-50 rounded-xl px-3 py-2">
                    <div className="flex items-center gap-1.5 text-sm text-purple-800 font-medium">
                      <Users size={14} /> {planned.people} {planned.people === 1 ? "person" : "people"}
                    </div>
                    <button
                      onClick={() => onRemoveMeal(selectedDay, mealType)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => onAddMeal(selectedDay, mealType)}
                  className="w-full py-5 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-50 border-2 border-dashed border-purple-200 flex items-center justify-center">
                    <Plus size={18} className="text-purple-400" />
                  </div>
                  <span className="text-sm text-gray-400">Tap to add {mealType}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ADD MEAL MODAL
function AddMealModal({
  mealType,
  recipes,
  onSelect,
  onClose,
}: {
  mealType: MealType;
  recipes: Recipe[];
  onSelect: (recipeId: string, people: number) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [people, setPeople] = useState(2);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  const filters = ["All", "Breakfast", "Lunch", "Dinner", ...CUISINES];

  const filtered = recipes.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      selectedFilter === "All" || r.category === selectedFilter || r.cuisine === selectedFilter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end">
      <div className="bg-white rounded-t-3xl w-full max-h-[85vh] flex flex-col">
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-xl font-bold text-gray-900">Add {MEAL_LABELS[mealType]}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} className="text-gray-600" />
          </button>
        </div>

        {/* People selector in modal */}
        <div className="px-5 mb-3">
          <div className="flex items-center justify-between bg-purple-50 rounded-xl px-4 py-2.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-purple-800">
              <Users size={16} /> Serving for
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPeople(Math.max(1, people - 1))}
                className="w-7 h-7 rounded-full bg-white border border-purple-200 flex items-center justify-center"
              >
                <Minus size={12} className="text-purple-600" />
              </button>
              <span className="text-lg font-bold text-purple-900 w-5 text-center">{people}</span>
              <button
                onClick={() => setPeople(Math.min(20, people + 1))}
                className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center"
              >
                <Plus size={12} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-5 mb-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipes..."
              className="bg-transparent text-sm outline-none flex-1 text-gray-800 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="px-5 mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map((f) => (
            <Pill key={f} label={f} active={selectedFilter === f} onClick={() => setSelectedFilter(f)} />
          ))}
        </div>

        {/* Recipe list */}
        <div className="px-5 pb-5 flex flex-col gap-2 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No recipes found</p>
          ) : (
            filtered.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} onSelect={() => onSelect(recipe.id, people)} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// GROCERY LIST SCREEN
interface GroceryItem {
  name: string;
  amount: number | null;
  unit: string;
  custom: boolean;
}

function GroceryScreen({ weekPlan, recipes }: { weekPlan: DayPlan[]; recipes: Recipe[] }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const [customItems, setCustomItems] = useState<GroceryItem[]>([]);
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newUnit, setNewUnit] = useState("");

  const planGroceries = useMemo<GroceryItem[]>(() => {
    const map = new Map<string, { amount: number; unit: string }>();

    weekPlan.forEach((dayPlan) => {
      MEAL_TYPES.forEach((type) => {
        const planned = dayPlan[type];
        if (!planned) return;
        const recipe = getRecipeById(planned.recipeId, recipes);
        if (!recipe) return;
        const scaled = scaleIngredients(recipe, planned.people);
        scaled.forEach((ing) => {
          const key = ing.name.toLowerCase();
          if (map.has(key)) {
            const existing = map.get(key)!;
            if (existing.unit === ing.unit) {
              map.set(key, { ...existing, amount: existing.amount + ing.amount });
            }
          } else {
            map.set(key, { amount: ing.amount, unit: ing.unit });
          }
        });
      });
    });

    return Array.from(map.entries()).map(([name, data]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      amount: parseFloat(data.amount.toFixed(1)),
      unit: data.unit,
      custom: false,
    }));
  }, [weekPlan, recipes]);

  const groceries = useMemo(() => {
    // Custom items take precedence if names collide.
    const customNames = new Set(customItems.map((c) => c.name.toLowerCase()));
    const merged = [
      ...customItems,
      ...planGroceries.filter(
        (g) => !customNames.has(g.name.toLowerCase()) && !removed.has(g.name)
      ),
    ];
    return merged.sort((a, b) => a.name.localeCompare(b.name));
  }, [planGroceries, customItems, removed]);

  const removePlanItem = (name: string) => {
    setRemoved((prev) => new Set(prev).add(name));
    setChecked((prev) => {
      const next = new Set(prev);
      next.delete(name);
      return next;
    });
  };

  const restoreAll = () => setRemoved(new Set());

  const toggleItem = (name: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const addCustomItem = () => {
    const name = newName.trim();
    if (!name) return;
    if (groceries.some((g) => g.name.toLowerCase() === name.toLowerCase())) {
      setNewName("");
      setNewAmount("");
      setNewUnit("");
      return;
    }
    const amt = parseFloat(newAmount);
    setCustomItems((prev) => [
      ...prev,
      {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        amount: isNaN(amt) ? null : amt,
        unit: newUnit.trim(),
        custom: true,
      },
    ]);
    setNewName("");
    setNewAmount("");
    setNewUnit("");
  };

  const removeCustomItem = (name: string) => {
    setCustomItems((prev) => prev.filter((c) => c.name !== name));
    setChecked((prev) => {
      const next = new Set(prev);
      next.delete(name);
      return next;
    });
  };

  const pending = groceries.filter((g) => !checked.has(g.name));
  const done = groceries.filter((g) => checked.has(g.name));

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="px-5 pt-5 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grocery List</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {checked.size} of {groceries.length} items checked
          </p>
        </div>
        {removed.size > 0 && (
          <button
            onClick={restoreAll}
            className="text-xs text-purple-600 font-medium bg-purple-50 px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors mt-1"
          >
            Restore {removed.size} removed
          </button>
        )}
      </div>

      {/* Add custom item */}
      <div className="mx-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Add your own item</p>
        <div className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomItem()}
            placeholder="Item name"
            className="flex-1 min-w-0 bg-gray-100 rounded-xl px-3 py-2.5 text-sm outline-none text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-300"
          />
          <input
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomItem()}
            placeholder="Qty"
            inputMode="decimal"
            className="w-14 bg-gray-100 rounded-xl px-2 py-2.5 text-sm outline-none text-gray-800 placeholder:text-gray-400 text-center focus:ring-2 focus:ring-purple-300"
          />
          <input
            value={newUnit}
            onChange={(e) => setNewUnit(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomItem()}
            placeholder="Unit"
            className="w-16 bg-gray-100 rounded-xl px-2 py-2.5 text-sm outline-none text-gray-800 placeholder:text-gray-400 text-center focus:ring-2 focus:ring-purple-300"
          />
          <button
            onClick={addCustomItem}
            className="w-10 flex-shrink-0 rounded-xl bg-purple-600 flex items-center justify-center hover:bg-purple-700 transition-colors"
          >
            <Plus size={18} className="text-white" />
          </button>
        </div>
      </div>

      {groceries.length === 0 ? (
        <div className="mx-5 bg-gray-50 rounded-2xl py-12 flex flex-col items-center gap-3">
          <span className="text-5xl">🛒</span>
          <p className="text-gray-500 text-sm text-center">Add meals to your plan or add your<br />own items to build your grocery list</p>
        </div>
      ) : (
        <>
          {/* Progress bar */}
          <div className="mx-5">
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full transition-all"
                style={{ width: `${(checked.size / groceries.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Pending items */}
          {pending.length > 0 && (
            <div className="px-5">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">To Buy ({pending.length})</p>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {pending.map((item, i) => (
                  <div
                    key={item.name}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${i > 0 ? "border-t border-gray-50" : ""}`}
                  >
                    <button onClick={() => toggleItem(item.name)} className="flex items-center gap-3 flex-1 text-left">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                      <span className="text-sm text-gray-800 flex-1">{item.name}</span>
                      {item.custom && (
                        <span className="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full">custom</span>
                      )}
                      {item.amount !== null && (
                        <span className="text-sm font-semibold text-gray-900">
                          {formatAmount(item.amount)} {item.unit}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => (item.custom ? removeCustomItem(item.name) : removePlanItem(item.name))}
                      className="text-red-300 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Done items */}
          {done.length > 0 && (
            <div className="px-5">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">In Cart ({done.length})</p>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {done.map((item, i) => (
                  <div
                    key={item.name}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors opacity-50 ${i > 0 ? "border-t border-gray-50" : ""}`}
                  >
                    <button onClick={() => toggleItem(item.name)} className="flex items-center gap-3 flex-1 text-left">
                      <div className="w-5 h-5 rounded-full bg-purple-600 border-2 border-purple-600 flex items-center justify-center flex-shrink-0">
                        <Check size={10} className="text-white" />
                      </div>
                      <span className="text-sm text-gray-500 flex-1 line-through">{item.name}</span>
                      {item.amount !== null && (
                        <span className="text-sm font-semibold text-gray-400">
                          {formatAmount(item.amount)} {item.unit}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => (item.custom ? removeCustomItem(item.name) : removePlanItem(item.name))}
                      className="text-red-300 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {checked.size === groceries.length && groceries.length > 0 && (
            <div className="mx-5 bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
              <p className="text-2xl mb-1">🎉</p>
              <p className="text-sm font-semibold text-green-800">All done! Happy cooking!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// CREATE RECIPE SCREEN
const RECIPE_EMOJIS = ["🍽️", "🍲", "🥘", "🍛", "🍜", "🍝", "🥗", "🌮", "🍕", "🍔", "🥪", "🍚", "🍗", "🐟", "🥦", "🧀", "🥞", "🌶️", "🥥", "🍰"];
const RECIPE_COLORS = ["#7c3aed", "#dc2626", "#ea580c", "#d97706", "#16a34a", "#059669", "#0891b2", "#db2777"];

function CreateRecipeScreen({
  onSave,
  onBack,
}: {
  onSave: (recipe: Recipe) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Dinner");
  const [cuisine, setCuisine] = useState("North Indian");
  const [time, setTime] = useState("30");
  const [servings, setServings] = useState("2");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [emoji, setEmoji] = useState("🍽️");
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: "", amount: 1, unit: "" }]);

  const updateIngredient = (i: number, field: keyof Ingredient, value: string) => {
    setIngredients((prev) =>
      prev.map((ing, idx) =>
        idx === i ? { ...ing, [field]: field === "amount" ? parseFloat(value) || 0 : value } : ing
      )
    );
  };

  const addIngredientRow = () => setIngredients((prev) => [...prev, { name: "", amount: 1, unit: "" }]);
  const removeIngredientRow = (i: number) => setIngredients((prev) => prev.filter((_, idx) => idx !== i));

  const validIngredients = ingredients.filter((ing) => ing.name.trim());
  const canSave = name.trim() && validIngredients.length > 0;

  const handleSave = () => {
    if (!canSave) return;
    const s = Math.max(1, parseInt(servings) || 1);
    const recipe: Recipe = {
      id: "custom-" + Date.now(),
      name: name.trim(),
      category,
      cuisine,
      time: parseInt(time) || 0,
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fat: parseInt(fat) || 0,
      baseServings: s,
      color: RECIPE_COLORS[Math.floor(Math.random() * RECIPE_COLORS.length)],
      emoji,
      ingredients: validIngredients.map((ing) => ({
        name: ing.name.trim(),
        amount: ing.amount || 1,
        unit: ing.unit.trim(),
      })),
    };
    onSave(recipe);
  };

  const inputCls = "bg-gray-100 rounded-xl px-3 py-2.5 text-sm outline-none text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-300";

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 flex items-center gap-3 px-5 pt-5 pb-3 bg-white border-b border-gray-100">
        <button onClick={onBack} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
          <ArrowLeft size={16} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">New Recipe</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        {/* Emoji picker */}
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Icon</label>
          <div className="flex gap-1.5 flex-wrap mt-2">
            {RECIPE_EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                  emoji === e ? "bg-purple-100 ring-2 ring-purple-500" : "bg-gray-100"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Recipe Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Grandma's Dal Tadka" className={inputCls} />
        </div>

        {/* Meal type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Meal Type</label>
          <div className="flex gap-2 flex-wrap">
            {["Breakfast", "Lunch", "Dinner"].map((c) => (
              <Pill key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
            ))}
          </div>
        </div>

        {/* Cuisine */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Cuisine</label>
          <div className="flex gap-2 flex-wrap">
            {CUISINES.map((c) => (
              <Pill key={c} label={c} active={cuisine === c} onClick={() => setCuisine(c)} />
            ))}
          </div>
        </div>

        {/* Time & servings */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Cook time (min)</label>
            <input value={time} onChange={(e) => setTime(e.target.value)} inputMode="numeric" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Base servings</label>
            <input value={servings} onChange={(e) => setServings(e.target.value)} inputMode="numeric" className={inputCls} />
          </div>
        </div>

        {/* Macros */}
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Nutrition (per serving)</label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            <input value={calories} onChange={(e) => setCalories(e.target.value)} inputMode="numeric" placeholder="kcal" className={inputCls + " text-center px-1"} />
            <input value={protein} onChange={(e) => setProtein(e.target.value)} inputMode="numeric" placeholder="Prot" className={inputCls + " text-center px-1"} />
            <input value={carbs} onChange={(e) => setCarbs(e.target.value)} inputMode="numeric" placeholder="Carb" className={inputCls + " text-center px-1"} />
            <input value={fat} onChange={(e) => setFat(e.target.value)} inputMode="numeric" placeholder="Fat" className={inputCls + " text-center px-1"} />
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Ingredients</label>
            <button onClick={addIngredientRow} className="flex items-center gap-1 text-xs text-purple-600 font-medium">
              <Plus size={14} /> Add
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={ing.name}
                  onChange={(e) => updateIngredient(i, "name", e.target.value)}
                  placeholder="Ingredient"
                  className={inputCls + " flex-1 min-w-0"}
                />
                <input
                  value={ing.amount || ""}
                  onChange={(e) => updateIngredient(i, "amount", e.target.value)}
                  inputMode="decimal"
                  placeholder="Qty"
                  className={inputCls + " w-14 text-center"}
                />
                <input
                  value={ing.unit}
                  onChange={(e) => updateIngredient(i, "unit", e.target.value)}
                  placeholder="Unit"
                  className={inputCls + " w-16 text-center"}
                />
                <button
                  onClick={() => removeIngredientRow(i)}
                  disabled={ingredients.length === 1}
                  className="w-9 flex-shrink-0 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 disabled:opacity-30"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">Amounts are for {servings || 1} serving(s) and scale automatically for more people.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={!canSave}
          className="w-full mt-2 py-4 rounded-2xl font-bold text-white text-base shadow-lg transition-all active:scale-95 bg-purple-600 disabled:bg-gray-300 disabled:shadow-none"
        >
          Save Recipe
        </button>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────

type Tab = "today" | "plan" | "grocery" | "recipes";

type AppView =
  | { type: "tab"; tab: Tab }
  | { type: "recipe"; recipeId: string; people: number; fromTab: Tab }
  | { type: "addMeal"; dayIndex: number; mealType: MealType }
  | { type: "createRecipe" };

export default function App() {
  const [view, setView] = useState<AppView>({ type: "tab", tab: "today" });
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([]);
  const recipes = useMemo(() => [...customRecipes, ...RECIPES], [customRecipes]);
  const [recipeFilter, setRecipeFilter] = useState<string>("All");
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>(() =>
    Array.from({ length: 7 }, (_, i) => {
      if (i === 0) {
        return {
          breakfast: { recipeId: "r7", people: 2 },
          lunch: { recipeId: "r3", people: 2 },
          dinner: { recipeId: "r5", people: 3 },
        };
      }
      if (i === 1) {
        return {
          breakfast: { recipeId: "r2", people: 1 },
          dinner: { recipeId: "r6", people: 4 },
        };
      }
      return {};
    })
  );

  const activeTab: Tab =
    view.type === "tab" ? view.tab : view.type === "recipe" ? view.fromTab : view.type === "createRecipe" ? "recipes" : "plan";

  const handleSaveRecipe = (recipe: Recipe) => {
    setCustomRecipes((prev) => [recipe, ...prev]);
    setView({ type: "recipe", recipeId: recipe.id, people: recipe.baseServings, fromTab: "recipes" });
  };

  const handleViewRecipe = (recipeId: string, people: number) => {
    setView({ type: "recipe", recipeId, people, fromTab: activeTab });
  };

  const handleAddMeal = (dayIndex: number, mealType: MealType) => {
    setView({ type: "addMeal", dayIndex, mealType });
  };

  const handleMealSelected = (recipeId: string, people: number) => {
    if (view.type !== "addMeal") return;
    const { dayIndex, mealType } = view;
    setWeekPlan((prev) => {
      const next = [...prev];
      next[dayIndex] = { ...next[dayIndex], [mealType]: { recipeId, people } };
      return next;
    });
    setView({ type: "tab", tab: "plan" });
  };

  const handleRemoveMeal = (dayIndex: number, mealType: MealType) => {
    setWeekPlan((prev) => {
      const next = [...prev];
      const day = { ...next[dayIndex] };
      delete day[mealType];
      next[dayIndex] = day;
      return next;
    });
  };

  const NAV_ITEMS: { id: Tab; label: string; icon: JSX.Element }[] = [
    { id: "today", label: "Today", icon: <Sun size={20} /> },
    { id: "plan", label: "Meal Plan", icon: <CalendarDays size={20} /> },
    { id: "grocery", label: "Grocery", icon: <ShoppingCart size={20} /> },
    { id: "recipes", label: "Recipes", icon: <ChefHat size={20} /> },
  ];

  return (
    <div
      className="flex items-center justify-center w-full min-h-screen bg-gray-100"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Phone shell */}
      <div className="relative w-full max-w-sm h-screen max-h-[844px] bg-gray-50 overflow-hidden flex flex-col shadow-2xl rounded-[2.5rem] border border-gray-200">
        {/* Status bar */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 pt-3 pb-1 bg-white">
          <span className="text-xs font-semibold text-gray-800">9:41</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5 items-end">
              {[3, 5, 7, 9].map((h, i) => (
                <div key={i} className="w-1 bg-gray-800 rounded-sm" style={{ height: h }} />
              ))}
            </div>
            <svg width="14" height="10" viewBox="0 0 14 10" className="text-gray-800 fill-current ml-1">
              <path d="M7 1.5C9.1 1.5 11 2.4 12.3 3.9L13.5 2.6C11.8 0.9 9.5 0 7 0C4.5 0 2.2 0.9 0.5 2.6L1.7 3.9C3 2.4 4.9 1.5 7 1.5Z" />
              <path d="M7 4.5C8.4 4.5 9.7 5.1 10.6 6.1L11.8 4.8C10.5 3.5 8.8 2.7 7 2.7C5.2 2.7 3.5 3.5 2.2 4.8L3.4 6.1C4.3 5.1 5.6 4.5 7 4.5Z" />
              <circle cx="7" cy="8.5" r="1.5" />
            </svg>
            <div className="ml-1 flex items-center gap-0.5">
              <div className="w-5 h-2.5 rounded-sm border border-gray-800 relative">
                <div className="absolute inset-0.5 bg-gray-800 rounded-sm" style={{ width: "70%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Main scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {view.type === "tab" && view.tab === "today" && (
            <TodayScreen todayPlan={weekPlan[0]} recipes={recipes} onViewRecipe={handleViewRecipe} />
          )}
          {view.type === "tab" && view.tab === "plan" && (
            <MealPlanScreen
              weekPlan={weekPlan}
              recipes={recipes}
              onAddMeal={handleAddMeal}
              onRemoveMeal={handleRemoveMeal}
              onViewRecipe={handleViewRecipe}
            />
          )}
          {view.type === "tab" && view.tab === "grocery" && (
            <GroceryScreen weekPlan={weekPlan} recipes={recipes} />
          )}
          {view.type === "tab" && view.tab === "recipes" && (() => {
            const filters = ["All", ...CUISINES];
            const shown = recipes.filter((r) => recipeFilter === "All" || r.cuisine === recipeFilter);
            return (
              <div className="flex flex-col gap-4 pb-4">
                <div className="px-5 pt-5 flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">All Recipes</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{recipes.length} recipes available</p>
                  </div>
                  <button
                    onClick={() => setView({ type: "createRecipe" })}
                    className="flex items-center gap-1 bg-purple-600 text-white text-sm font-medium px-3 py-2 rounded-full shadow hover:bg-purple-700 transition-colors"
                  >
                    <Plus size={16} /> New
                  </button>
                </div>
                <div className="px-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {filters.map((f) => (
                    <Pill key={f} label={f} active={recipeFilter === f} onClick={() => setRecipeFilter(f)} />
                  ))}
                </div>
                <div className="px-5 flex flex-col gap-2">
                  {shown.length === 0 ? (
                    <p className="text-center text-gray-400 py-8 text-sm">No recipes in this cuisine yet</p>
                  ) : (
                    shown.map((r) => (
                      <RecipeCard key={r.id} recipe={r} onSelect={() => handleViewRecipe(r.id, 2)} />
                    ))
                  )}
                </div>
              </div>
            );
          })()}
          {view.type === "createRecipe" && (
            <CreateRecipeScreen
              onSave={handleSaveRecipe}
              onBack={() => setView({ type: "tab", tab: "recipes" })}
            />
          )}
          {view.type === "recipe" && (() => {
            const recipe = getRecipeById(view.recipeId, recipes);
            return recipe ? (
              <RecipeDetailScreen
                recipe={recipe}
                initialPeople={view.people}
                onBack={() => setView({ type: "tab", tab: view.fromTab })}
              />
            ) : null;
          })()}
        </div>

        {/* Bottom nav */}
        {view.type !== "recipe" && view.type !== "createRecipe" && (
          <div className="flex-shrink-0 bg-white border-t border-gray-100 flex pb-safe">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setView({ type: "tab", tab: item.id })}
                className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                  activeTab === item.id ? "text-purple-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {item.icon}
                <span className="text-xs font-medium">{item.label}</span>
                {activeTab === item.id && (
                  <div className="w-1 h-1 rounded-full bg-purple-600" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Add Meal Modal */}
      {view.type === "addMeal" && (
        <AddMealModal
          mealType={view.mealType}
          recipes={recipes}
          onSelect={handleMealSelected}
          onClose={() => setView({ type: "tab", tab: "plan" })}
        />
      )}
    </div>
  );
}
