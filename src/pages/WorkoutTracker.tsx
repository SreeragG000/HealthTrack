import React, { useState, useEffect } from 'react';
import { Plus, Calendar, TrendingUp, Clock, Flame } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { WorkoutForm } from '@/components/WorkoutForm';
import { WorkoutCard } from '@/components/WorkoutCard';
import { WorkoutPlanCard } from '@/components/WorkoutPlanCard';
import { WeeklySummary } from '@/components/WeeklySummary';
import { useToast } from '@/hooks/use-toast';

type WorkoutType = 'cardio' | 'strength' | 'flexibility' | 'sports' | 'yoga' | 'pilates' | 'hiit' | 'other';

export interface Workout {
  id: string;
  user_id: string;
  name: string;
  type: WorkoutType;
  duration_minutes: number;
  calories_burned: number | null;
  notes: string | null;
  completed: boolean;
  completed_at: string | null;
  scheduled_date: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutPlan {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  days_of_week: number[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const WorkoutTracker = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchWorkouts();
    fetchWorkoutPlans();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .order('scheduled_date', { ascending: false });

      if (error) throw error;
      setWorkouts(data || []);
    } catch (error) {
      toast({
        title: "Error fetching workouts",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkoutPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkoutPlans(data || []);
    } catch (error) {
      console.error('Error fetching workout plans:', error);
    }
  };

  const handleWorkoutSave = async (workoutData: Partial<Workout>) => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save workouts",
          variant: "destructive",
        });
        return;
      }

      // Set default values for required fields
      const workoutWithDefaults = {
        ...workoutData,
        duration_minutes: workoutData.duration_minutes || 30, // Default 30 minutes
        calories_burned: workoutData.calories_burned || 200, // Default 200 calories
        scheduled_date: workoutData.scheduled_date || new Date().toISOString().split('T')[0], // Default today
      };

      if (editingWorkout) {
        const { error } = await supabase
          .from('workouts')
          .update(workoutWithDefaults)
          .eq('id', editingWorkout.id);

        if (error) throw error;
        toast({ title: "Workout updated successfully!" });
      } else {
        const { error } = await supabase
          .from('workouts')
          .insert([{ ...workoutWithDefaults, user_id: authData.user.id }]);

        if (error) throw error;
        toast({ title: "Workout created successfully!" });
      }
      
      fetchWorkouts();
      setIsFormOpen(false);
      setEditingWorkout(null);
    } catch (error) {
      toast({
        title: "Error saving workout",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleWorkoutComplete = async (workout: Workout) => {
    try {
      const { error } = await supabase
        .from('workouts')
        .update({
          completed: !workout.completed,
          completed_at: !workout.completed ? new Date().toISOString() : null
        })
        .eq('id', workout.id);

      if (error) throw error;
      fetchWorkouts();
      toast({
        title: workout.completed ? "Workout marked as incomplete" : "Workout completed!",
        description: workout.completed ? "" : "Great job! Keep up the good work.",
      });
    } catch (error) {
      toast({
        title: "Error updating workout",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleWorkoutDelete = async (workoutId: string) => {
    try {
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workoutId);

      if (error) throw error;
      fetchWorkouts();
      toast({ title: "Workout deleted successfully!" });
    } catch (error) {
      toast({
        title: "Error deleting workout",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const todaysWorkouts = workouts.filter(
    w => w.scheduled_date === new Date().toISOString().split('T')[0]
  );

  const completedToday = todaysWorkouts.filter(w => w.completed).length;
  const todayProgress = todaysWorkouts.length > 0 ? (completedToday / todaysWorkouts.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Workout Tracker</h1>
            <p className="text-muted-foreground">Track your fitness journey</p>
          </div>
          <Button
            onClick={() => setIsFormOpen(true)}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Workout
          </Button>
        </div>

        {/* Today's Progress */}
        <Card className="mb-8 bg-card border border-border shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Calendar className="w-5 h-5 text-primary" />
              Today's Progress
            </CardTitle>
            <CardDescription>
              {completedToday} of {todaysWorkouts.length} workouts completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={todayProgress} className="h-3" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {completedToday} Completed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {todaysWorkouts.reduce((acc, w) => acc + (w.completed ? w.duration_minutes : 0), 0)} min
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {todaysWorkouts.reduce((acc, w) => acc + (w.completed ? (w.calories_burned || 0) : 0), 0)} cal
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Workouts */}
        {todaysWorkouts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Today's Workouts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todaysWorkouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onComplete={() => handleWorkoutComplete(workout)}
                  onEdit={(workout) => {
                    setEditingWorkout(workout);
                    setIsFormOpen(true);
                  }}
                  onDelete={() => handleWorkoutDelete(workout.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Weekly Summary */}
        <WeeklySummary workouts={workouts} />

        {/* All Workouts */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">All Workouts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workouts.filter(w => w.scheduled_date !== new Date().toISOString().split('T')[0]).map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onComplete={() => handleWorkoutComplete(workout)}
                onEdit={(workout) => {
                  setEditingWorkout(workout);
                  setIsFormOpen(true);
                }}
                onDelete={() => handleWorkoutDelete(workout.id)}
              />
            ))}
          </div>
        </div>

        {/* Workout Plans */}
        {workoutPlans.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Workout Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workoutPlans.map((plan) => (
                <WorkoutPlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {workouts.length === 0 && (
          <Card className="text-center py-12 bg-card border border-border">
            <CardContent>
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Start Your Fitness Journey</h3>
              <p className="text-muted-foreground mb-6">Create your first workout to begin tracking your progress.</p>
              <Button onClick={() => setIsFormOpen(true)} size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Workout
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Workout Form Modal */}
      <WorkoutForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingWorkout(null);
        }}
        onSave={handleWorkoutSave}
        workout={editingWorkout}
      />
    </div>
  );
};

export default WorkoutTracker;