import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Plus, TrendingUp, Coffee, Camera, ArrowLeft, Apple, Utensils, ChefHat, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';

const FoodTracker = () => {
  const navigate = useNavigate();
  const [fastingHours, setFastingHours] = useState(14);
  const [calorieGoal] = useState(1400);
  const [currentCalories] = useState(0);
  const [mealCalories] = useState({
    breakfast: 350,
    morningSnack: 175,
    lunch: 350,
    eveningSnack: 175,
    dinner: 350
  });

  const meals = [
    {
      name: 'Breakfast',
      calories: mealCalories.breakfast,
      current: 0,
      suggestions: [
        {
          name: 'Upma',
          calories: 110,
          description: '1.0 katori • 110 Cal',
          image: '🍚'
        }
      ]
    },
    {
      name: 'Morning Snack',
      calories: mealCalories.morningSnack,
      current: 0,
      description: 'Get energized by grabbing a morning snack 🥨'
    },
    {
      name: 'Lunch',
      calories: mealCalories.lunch,
      current: 0,
    }
  ];

  const fastingProgress = (fastingHours / 16) * 100;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in pb-20">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/workout-routines')}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Today</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <TrendingUp className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              ⋮
            </Button>
          </div>
        </div>

        {/* Intermittent Fasting Card */}
        <Card className="glass-card bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold">Set up Intermittent Fasting</h2>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Recommended Plan</p>
                <p className="text-2xl font-bold">{fastingHours} hrs</p>
              </div>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 shadow-lg">
                Get Started
              </Button>
            </div>
            <div className="mt-4">
              <Progress value={fastingProgress} className="h-3 bg-blue-100 dark:bg-blue-900/30" />
            </div>
          </CardContent>
        </Card>

        {/* Calorie Goal Card */}
        <Card className="glass-card bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Apple className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-lg font-semibold">Eat up to {calorieGoal} Cal</h2>
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <Progress value={(currentCalories / calorieGoal) * 100} className="h-3 mt-4 bg-green-100 dark:bg-green-900/30" />
            <p className="text-sm text-muted-foreground mt-2">
              {currentCalories} of {calorieGoal} Cal consumed today
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="glass-card hover-lift cursor-pointer transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 mx-auto mb-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Utensils className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-sm font-medium">Diet Plan</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card hover-lift cursor-pointer transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 mx-auto mb-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-sm font-medium">Insights</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card hover-lift cursor-pointer transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 mx-auto mb-2 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <ChefHat className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-sm font-medium">Recipes</p>
            </CardContent>
          </Card>
        </div>

        {/* Meals */}
        {meals.map((meal, index) => (
          <div key={meal.name} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{meal.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {meal.current} of {meal.calories} Cal
                </span>
                <Button size="icon" variant="ghost" className="h-8 w-8 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md transition-all duration-200 hover:scale-105">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {meal.description && (
              <p className="text-sm text-muted-foreground">{meal.description}</p>
            )}

            {meal.suggestions && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Hey, here are some Healthy {meal.name} Suggestions for you
                </p>
                {meal.suggestions.map((suggestion, idx) => (
                  <Card key={idx} className="glass-card hover-lift cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/30 dark:to-emerald-800/30 rounded-lg flex items-center justify-center text-2xl border-l-4 border-green-500">
                          {suggestion.image}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{suggestion.name}</h4>
                          <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Snap Button */}
        <div className="fixed bottom-6 right-6">
          <Button 
            size="lg" 
            className="rounded-full h-14 w-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-xl transition-all duration-300 hover:scale-110"
          >
            <Camera className="h-6 w-6" />
          </Button>
          <span className="absolute -top-8 right-0 text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full shadow-md">
            Snap
          </span>
        </div>
      </div>
    </Layout>
  );
};

export default FoodTracker;