import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Plus, Timer, Check, Home, BarChart3, User, Dumbbell, Settings, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
interface WorkoutSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  previous?: string;
}
interface ExerciseLog {
  id: string;
  name: string;
  image_url?: string;
  notes: string;
  sets: WorkoutSet[];
  restTimerActive: boolean;
}
const WorkoutLogger = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    toast
  } = useToast();

  // Get routine data from navigation state
  const routineData = location.state?.routine;
  const exercisesData = location.state?.exercises || []; // Get exercises instead of workouts

  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0);
  const [totalSets, setTotalSets] = useState(0);
  const [exercises, setExercises] = useState<ExerciseLog[]>([]);
  const [isActive, setIsActive] = useState(true);
  useEffect(() => {
    console.log('WorkoutLogger mounted with state:', location.state);
    console.log('Routine data:', routineData);
    console.log('Exercises data:', exercisesData);
    if (!routineData) {
      console.log('No routine data found, redirecting...');
      navigate('/workout-routines');
      return;
    }

    // Initialize exercises from the routine's exercises
    const initialExercises: ExerciseLog[] = exercisesData.filter((exercise: any) => exercise && exercise.name) // Filter out undefined/null exercises
    .map((exercise: any) => ({
      id: exercise.id || crypto.randomUUID(),
      name: exercise.name || 'Unknown Exercise',
      image_url: exercise.image_url,
      notes: "",
      sets: [{
        id: crypto.randomUUID(),
        weight: 0,
        reps: 0,
        completed: false,
        previous: "0kg x 0"
      }],
      restTimerActive: false
    }));
    console.log('Initial exercises:', initialExercises);
    setExercises(initialExercises);
  }, [routineData, exercisesData, navigate]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Calculate volume and total sets
  useEffect(() => {
    let newVolume = 0;
    let newTotalSets = 0;
    exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        if (set.completed) {
          newVolume += set.weight * set.reps;
          newTotalSets += 1;
        }
      });
    });
    setVolume(newVolume);
    setTotalSets(newTotalSets);
  }, [exercises]);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  const addSet = (exerciseId: string) => {
    setExercises(prev => prev.map(exercise => {
      if (exercise.id === exerciseId) {
        const lastSet = exercise.sets[exercise.sets.length - 1];
        const newSet: WorkoutSet = {
          id: crypto.randomUUID(),
          weight: lastSet?.weight || 0,
          reps: lastSet?.reps || 0,
          completed: false,
          previous: lastSet ? `${lastSet.weight}kg x ${lastSet.reps}` : "0kg x 0"
        };
        return {
          ...exercise,
          sets: [...exercise.sets, newSet]
        };
      }
      return exercise;
    }));
  };
  const updateSet = (exerciseId: string, setId: string, field: 'weight' | 'reps', value: number) => {
    setExercises(prev => prev.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.map(set => set.id === setId ? {
            ...set,
            [field]: value
          } : set)
        };
      }
      return exercise;
    }));
  };
  const toggleSetComplete = (exerciseId: string, setId: string) => {
    setExercises(prev => prev.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.map(set => set.id === setId ? {
            ...set,
            completed: !set.completed
          } : set)
        };
      }
      return exercise;
    }));
  };
  const updateNotes = (exerciseId: string, notes: string) => {
    setExercises(prev => prev.map(exercise => exercise.id === exerciseId ? {
      ...exercise,
      notes
    } : exercise));
  };
  const toggleRestTimer = (exerciseId: string) => {
    setExercises(prev => prev.map(exercise => exercise.id === exerciseId ? {
      ...exercise,
      restTimerActive: !exercise.restTimerActive
    } : exercise));
  };
  const addExercise = () => {
    // Add a new exercise to the workout
    const newExercise: ExerciseLog = {
      id: crypto.randomUUID(),
      name: "New Exercise",
      notes: "",
      sets: [{
        id: crypto.randomUUID(),
        weight: 0,
        reps: 0,
        completed: false,
        previous: "0kg x 0"
      }],
      restTimerActive: false
    };
    setExercises(prev => [...prev, newExercise]);
  };

  const discardWorkout = () => {
    toast({
      title: "Workout discarded",
      description: "Your workout has been discarded"
    });
    navigate('/workout-routines');
  };

  const openSettings = () => {
    // TODO: Implement settings functionality
    toast({
      title: "Settings",
      description: "Settings feature coming soon"
    });
  };

  const finishWorkout = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return;

      // Calculate total volume
      const totalVolume = volume;
      const completedSets = totalSets;
      const totalDuration = Math.floor(duration / 60); // Convert to minutes

      // Create workout record
      const {
        data: workoutData,
        error: workoutError
      } = await supabase.from('workouts').insert({
        name: `${routineData?.name || 'Workout'} - ${new Date().toLocaleDateString()}`,
        type: 'strength',
        duration_minutes: totalDuration,
        calories_burned: Math.floor(totalVolume * 0.5),
        // Rough estimate
        completed: true,
        completed_at: new Date().toISOString(),
        user_id: user.id,
        notes: `Completed ${exercises.length} exercises with ${completedSets} total sets`
      }).select().single();
      if (workoutError) {
        console.error('Error creating workout:', workoutError);
      }

      // Update user stats
      const {
        data: existingStats,
        error: fetchError
      } = await supabase.from('user_stats').select('*').eq('user_id', user.id).maybeSingle();
      if (fetchError) {
        console.error('Error fetching user stats:', fetchError);
      }
      const statsData = {
        user_id: user.id,
        weekly_workout_completed: (existingStats?.weekly_workout_completed || 0) + 1,
        calories_burned: (existingStats?.calories_burned || 0) + Math.floor(totalVolume * 0.5),
        streak_days: (existingStats?.streak_days || 0) + 1,
        fitness_tasks_completed: Math.min((existingStats?.fitness_tasks_completed || 0) + 1, existingStats?.fitness_tasks_total || 8),
        goal_progress: Math.min(((existingStats?.weekly_workout_completed || 0) + 1) / (existingStats?.weekly_workout_goal || 5) * 100, 100)
      };
      if (existingStats) {
        // Update existing stats
        const {
          error: updateError
        } = await supabase.from('user_stats').update(statsData).eq('user_id', user.id);
        if (updateError) {
          console.error('Error updating user stats:', updateError);
        }
      } else {
        // Create new stats record
        const {
          error: insertError
        } = await supabase.from('user_stats').insert({
          ...statsData,
          steps_today: 0,
          calories_goal: 2000,
          calories_consumed: 0,
          weekly_workout_goal: 5,
          fitness_tasks_total: 8
        });
        if (insertError) {
          console.error('Error creating user stats:', insertError);
        }
      }
      toast({
        title: "Workout completed!",
        description: `Great job! Duration: ${formatTime(duration)}, Volume: ${volume}kg, Sets: ${completedSets}`
      });
      navigate('/');
    } catch (error) {
      console.error('Error finishing workout:', error);
      toast({
        title: "Error",
        description: "Failed to save workout data",
        variant: "destructive"
      });
    }
  };
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/workout-routines')}>
            ←
          </Button>
          <h1 className="text-lg font-semibold">Log Workout</h1>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{formatTime(duration)}</span>
        </div>
        <Button onClick={finishWorkout} size="sm">
          Finish
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 p-4 border-b border-border">
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Duration</div>
          <div className="text-sm font-medium text-primary">{formatTime(duration)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Volume</div>
          <div className="text-sm font-medium">{volume} kg</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Sets</div>
          <div className="text-sm font-medium">{totalSets}</div>
        </div>
      </div>

      {/* Exercises */}
      <div className="p-4 space-y-6">
        {exercises.map(exercise => <Card key={exercise.id} className="overflow-hidden">
            <CardContent className="p-4">
              {/* Exercise Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0 overflow-hidden">
                  {exercise.image_url ? <img src={exercise.image_url} alt={exercise.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                      {exercise.name ? exercise.name.charAt(0) : '?'}
                    </div>}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-primary">{exercise.name || 'Unknown Exercise'}</h3>
                </div>
                <Button variant="ghost" size="sm">⋮</Button>
              </div>

              {/* Notes */}
              <Textarea placeholder="Add notes here..." value={exercise.notes} onChange={e => updateNotes(exercise.id, e.target.value)} className="mb-4 text-sm" rows={2} />

              {/* Rest Timer Toggle */}
              <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" size="sm" onClick={() => toggleRestTimer(exercise.id)} className="text-xs text-primary">
                  <Timer className="h-3 w-3 mr-1" />
                  Rest Timer: {exercise.restTimerActive ? 'ON' : 'OFF'}
                </Button>
              </div>

              {/* Sets Table */}
              <div className="space-y-2">
                <div className="grid grid-cols-5 gap-2 text-xs text-muted-foreground font-medium">
                  <div>SET</div>
                  <div>PREVIOUS</div>
                  <div>KG</div>
                  <div>REPS</div>
                  <div></div>
                </div>

                {exercise.sets.map((set, index) => <div key={set.id} className="grid grid-cols-5 gap-2 items-center">
                    <div className="text-sm font-medium">{index + 1}</div>
                    <div className="text-xs text-muted-foreground">
                      {set.previous}
                    </div>
                    <Input type="number" value={set.weight || ''} onChange={e => updateSet(exercise.id, set.id, 'weight', parseInt(e.target.value) || 0)} className="h-8 text-sm" placeholder="0" />
                    <Input type="number" value={set.reps || ''} onChange={e => updateSet(exercise.id, set.id, 'reps', parseInt(e.target.value) || 0)} className="h-8 text-sm" placeholder="0" />
                    <Button variant={set.completed ? "default" : "outline"} size="sm" onClick={() => toggleSetComplete(exercise.id, set.id)} className="h-8 w-8 p-0">
                      <Check className="h-3 w-3" />
                    </Button>
                  </div>)}
              </div>

              {/* Add Set Button */}
              <Button variant="outline" onClick={() => addSet(exercise.id)} className="w-full mt-4" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Set
              </Button>
            </CardContent>
          </Card>)}
      </div>

      {/* Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 space-y-3">
        <Button 
          onClick={addExercise}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Exercise
        </Button>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={openSettings}
            className="flex-1"
            size="lg"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button 
            variant="destructive" 
            onClick={discardWorkout}
            className="flex-1"
            size="lg"
          >
            <X className="h-4 w-4 mr-2" />
            Discard Workout
          </Button>
        </div>
      </div>

      {/* Add bottom padding to prevent content overlap */}
      <div className="h-40"></div>
    </div>;
};
export default WorkoutLogger;