import React from 'react';
import { TrendingUp, Clock, Flame, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Workout } from '@/pages/WorkoutTracker';

interface WeeklySummaryProps {
  workouts: Workout[];
}

export const WeeklySummary: React.FC<WeeklySummaryProps> = ({ workouts }) => {
  // Get the start of current week (Sunday)
  const now = new Date();
  const currentWeekStart = new Date(now);
  currentWeekStart.setDate(now.getDate() - now.getDay());
  currentWeekStart.setHours(0, 0, 0, 0);
  
  const currentWeekEnd = new Date(currentWeekStart);
  currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
  currentWeekEnd.setHours(23, 59, 59, 999);

  // Filter workouts for current week
  const currentWeekWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.scheduled_date);
    return workoutDate >= currentWeekStart && workoutDate <= currentWeekEnd;
  });

  const completedWorkouts = currentWeekWorkouts.filter(w => w.completed);
  const totalDuration = completedWorkouts.reduce((acc, w) => acc + w.duration_minutes, 0);
  const totalCalories = completedWorkouts.reduce((acc, w) => acc + (w.calories_burned || 0), 0);
  
  // Calculate completion rate
  const completionRate = currentWeekWorkouts.length > 0 
    ? (completedWorkouts.length / currentWeekWorkouts.length) * 100 
    : 0;

  // Weekly goals (could be made configurable)
  const weeklyGoals = {
    workouts: 5,
    duration: 300, // 5 hours
    calories: 2000
  };

  const progressMetrics = [
    {
      label: 'Workouts',
      value: completedWorkouts.length,
      goal: weeklyGoals.workouts,
      icon: Target,
      color: 'text-blue-400',
      progress: (completedWorkouts.length / weeklyGoals.workouts) * 100
    },
    {
      label: 'Duration',
      value: totalDuration,
      goal: weeklyGoals.duration,
      icon: Clock,
      color: 'text-green-400',
      suffix: 'min',
      progress: (totalDuration / weeklyGoals.duration) * 100
    },
    {
      label: 'Calories',
      value: totalCalories,
      goal: weeklyGoals.calories,
      icon: Flame,
      color: 'text-orange-400',
      suffix: 'cal',
      progress: (totalCalories / weeklyGoals.calories) * 100
    }
  ];

  return (
    <Card className="mb-8 bg-card border border-border shadow-lg animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TrendingUp className="w-5 h-5 text-primary" />
            Weekly Summary
          </CardTitle>
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
            {Math.round(completionRate)}% Complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {progressMetrics.map((metric) => (
            <div key={metric.label} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  <span className="text-sm font-medium text-foreground">{metric.label}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-foreground">
                    {metric.value}{metric.suffix}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    of {metric.goal}{metric.suffix}
                  </div>
                </div>
              </div>
              <Progress 
                value={Math.min(metric.progress, 100)} 
                className="h-2"
              />
              <div className="text-xs text-muted-foreground">
                {Math.round(metric.progress)}% of weekly goal
              </div>
            </div>
          ))}
        </div>

        {/* Workout distribution by type */}
        {completedWorkouts.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-sm font-medium text-foreground mb-3">Workout Types This Week</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(
                completedWorkouts.reduce((acc, workout) => {
                  acc[workout.type] = (acc[workout.type] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([type, count]) => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {type} ({count})
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};