import { useState, useEffect } from 'react';
import { Plus, Play, Edit, Trash2, Clock, Target, Search, MoreVertical, ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import ExerciseForm from '@/components/ExerciseForm';

interface Workout {
  id: string;
  name: string;
  type: string;
  duration_minutes: number;
  calories_burned?: number;
}

interface WorkoutRoutine {
  id: string;
  name: string;
  description?: string;
  workout_ids: string[];
  total_duration: number;
  total_calories: number;
  created_at: string;
}

interface RoutineWorkout extends Workout {
  order_index: number;
}

interface Exercise {
  id: string;
  name: string;
  equipment?: string;
  primary_muscle_group?: string;
  other_muscles?: string[];
  exercise_type?: string;
  image_url?: string;
}

const WorkoutRoutines = () => {
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPerformOpen, setIsPerformOpen] = useState(false);
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);
  const [currentRoutine, setCurrentRoutine] = useState<WorkoutRoutine | null>(null);
  const [routineWorkouts, setRoutineWorkouts] = useState<RoutineWorkout[]>([]);
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isMyRoutinesOpen, setIsMyRoutinesOpen] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRoutines();
    fetchWorkouts();
    fetchExercises();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorkoutActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive, timer]);

  const fetchRoutines = async () => {
    const { data, error } = await supabase
      .from('workout_routines')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error fetching routines",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setRoutines(data || []);
    }
  };

  const fetchWorkouts = async () => {
    const { data, error } = await supabase
      .from('workouts')
      .select('id, name, type, duration_minutes, calories_burned')
      .order('name');

    if (error) {
      toast({
        title: "Error fetching workouts",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setWorkouts(data || []);
    }
  };

  const fetchExercises = async () => {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('name');

    if (error) {
      toast({
        title: "Error fetching exercises",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setExercises(data || []);
    }
  };

  const createRoutine = async (name: string, description: string) => {
    const totalDuration = selectedWorkouts.reduce((sum, workoutId) => {
      const workout = workouts.find(w => w.id === workoutId);
      return sum + (workout?.duration_minutes || 0);
    }, 0);

    const totalCalories = selectedWorkouts.reduce((sum, workoutId) => {
      const workout = workouts.find(w => w.id === workoutId);
      return sum + (workout?.calories_burned || 0);
    }, 0);

    const { data, error } = await supabase
      .from('workout_routines')
      .insert({
        name,
        description,
        workout_ids: selectedWorkouts,
        total_duration: totalDuration,
        total_calories: totalCalories,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error creating routine",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Routine created successfully!",
      });
      setIsCreateOpen(false);
      setSelectedWorkouts([]);
      fetchRoutines();
    }
  };

  const deleteRoutine = async (id: string) => {
    const { error } = await supabase
      .from('workout_routines')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error deleting routine",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Routine deleted successfully!",
      });
      fetchRoutines();
    }
  };

  const startRoutine = (routine: WorkoutRoutine) => {
    const routineWorkouts = routine.workout_ids.map((workoutId, index) => {
      const workout = workouts.find(w => w.id === workoutId);
      return {
        ...workout!,
        order_index: index,
      };
    });

    setCurrentRoutine(routine);
    setRoutineWorkouts(routineWorkouts);
    setCurrentWorkoutIndex(0);
    setTimer(routineWorkouts[0]?.duration_minutes * 60 || 0);
    setIsPerformOpen(true);
  };

  const startWorkout = () => {
    setIsWorkoutActive(true);
  };

  const pauseWorkout = () => {
    setIsWorkoutActive(false);
  };

  const nextWorkout = () => {
    if (currentWorkoutIndex < routineWorkouts.length - 1) {
      const nextIndex = currentWorkoutIndex + 1;
      setCurrentWorkoutIndex(nextIndex);
      setTimer(routineWorkouts[nextIndex]?.duration_minutes * 60 || 0);
      setIsWorkoutActive(false);
    } else {
      // Routine completed
      toast({
        title: "Routine completed!",
        description: "Great job finishing your workout routine!",
      });
      setIsPerformOpen(false);
      setCurrentRoutine(null);
      setIsWorkoutActive(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getExercisePreview = (routine: WorkoutRoutine) => {
    const exerciseNames = routine.workout_ids.slice(0, 3).map(workoutId => {
      const workout = workouts.find(w => w.id === workoutId);
      return workout?.name || '';
    }).filter(Boolean);
    
    const preview = exerciseNames.join(', ');
    if (routine.workout_ids.length > 3) {
      return preview + '...';
    }
    return preview;
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Quick Start Section */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Quick Start</h2>
          <Button 
            className="w-full justify-start glass-card hover-lift h-12"
            variant="outline"
          >
            <Plus className="h-5 w-5 mr-3" />
            Start Empty Workout
          </Button>
        </div>

        {/* Routines Section */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Routines</h2>
          <div className="grid grid-cols-2 gap-3">
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="glass-card hover-lift h-12 justify-start" variant="outline">
                  <Edit className="h-5 w-5 mr-3" />
                  New Routine
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Routine</DialogTitle>
                </DialogHeader>
                <CreateRoutineForm 
                  workouts={workouts}
                  exercises={exercises}
                  selectedWorkouts={selectedWorkouts}
                  setSelectedWorkouts={setSelectedWorkouts}
                  onSubmit={createRoutine}
                  onAddExercise={() => setIsAddExerciseOpen(true)}
                />
              </DialogContent>
            </Dialog>
            
            <Button className="glass-card hover-lift h-12 justify-start" variant="outline">
              <Search className="h-5 w-5 mr-3" />
              Explore
            </Button>
          </div>
        </div>

        {/* My Routines Section */}
        <Collapsible open={isMyRoutinesOpen} onOpenChange={setIsMyRoutinesOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center justify-start w-full p-0 h-auto text-left hover:bg-transparent"
            >
              {isMyRoutinesOpen ? (
                <ChevronDown className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2" />
              )}
              <span className="text-lg font-semibold text-foreground">
                My Routines ({routines.length})
              </span>
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-3 mt-3">
            {routines.map((routine) => (
              <Card key={routine.id} className="glass-card hover-lift">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground mb-1">
                        {routine.name.toUpperCase()}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {getExercisePreview(routine) || routine.description || 'No exercises selected'}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => startRoutine(routine)}>
                          <Play className="h-4 w-4 mr-2" />
                          Start Routine
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteRoutine(routine.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <Button 
                    onClick={() => startRoutine(routine)}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Start Routine
                  </Button>
                </CardContent>
              </Card>
            ))}
            
            {routines.length === 0 && (
              <Card className="glass-card text-center py-8">
                <CardContent>
                  <Target className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground mb-3">No routines created yet</p>
                  <Button onClick={() => setIsCreateOpen(true)} size="sm" className="glass-card hover-lift">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Routine
                  </Button>
                </CardContent>
              </Card>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Add Exercise Dialog */}
        <Dialog open={isAddExerciseOpen} onOpenChange={setIsAddExerciseOpen}>
          <DialogContent className="sm:max-w-md">
            <ExerciseForm
              onSave={(exercise) => {
                setExercises(prev => [...prev, exercise]);
                setIsAddExerciseOpen(false);
              }}
              onCancel={() => setIsAddExerciseOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Perform Routine Dialog */}
        <Dialog open={isPerformOpen} onOpenChange={setIsPerformOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{currentRoutine?.name}</DialogTitle>
            </DialogHeader>
            {currentRoutine && routineWorkouts[currentWorkoutIndex] && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {formatTime(timer)}
                  </div>
                  <p className="text-muted-foreground">
                    Exercise {currentWorkoutIndex + 1} of {routineWorkouts.length}
                  </p>
                </div>

                <Card className="glass-card">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {routineWorkouts[currentWorkoutIndex].name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Badge variant="outline">{routineWorkouts[currentWorkoutIndex].type}</Badge>
                      <span>{routineWorkouts[currentWorkoutIndex].duration_minutes} min</span>
                      <span>{routineWorkouts[currentWorkoutIndex].calories_burned} cal</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  {!isWorkoutActive ? (
                    <Button onClick={startWorkout} className="flex-1">
                      <Play className="h-4 w-4 mr-2" />
                      Start Exercise
                    </Button>
                  ) : (
                    <Button onClick={pauseWorkout} variant="outline" className="flex-1">
                      Pause
                    </Button>
                  )}
                  <Button onClick={nextWorkout} variant="outline">
                    {currentWorkoutIndex < routineWorkouts.length - 1 ? 'Next' : 'Finish'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

interface CreateRoutineFormProps {
  workouts: Workout[];
  exercises: Exercise[];
  selectedWorkouts: string[];
  setSelectedWorkouts: (workouts: string[]) => void;
  onSubmit: (name: string, description: string) => void;
  onAddExercise: () => void;
}

const CreateRoutineForm = ({ workouts, exercises, selectedWorkouts, setSelectedWorkouts, onSubmit, onAddExercise }: CreateRoutineFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && selectedWorkouts.length > 0) {
      onSubmit(name.trim(), description.trim());
      setName('');
      setDescription('');
    }
  };

  const toggleWorkout = (workoutId: string) => {
    setSelectedWorkouts(
      selectedWorkouts.includes(workoutId)
        ? selectedWorkouts.filter(id => id !== workoutId)
        : [...selectedWorkouts, workoutId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Routine Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Morning Cardio"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your routine..."
          rows={2}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Select Workouts & Exercises</Label>
          <Button 
            type="button" 
            onClick={onAddExercise}
            size="sm"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Exercise
          </Button>
        </div>
        <div className="max-h-48 overflow-y-auto space-y-2">
          {workouts.length === 0 && exercises.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <p>No workouts or exercises available.</p>
              <p className="text-sm">Create an exercise to get started!</p>
            </div>
          ) : (
            <>
              {workouts.map((workout) => (
                <div key={workout.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={workout.id}
                    checked={selectedWorkouts.includes(workout.id)}
                    onCheckedChange={() => toggleWorkout(workout.id)}
                  />
                  <Label htmlFor={workout.id} className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span>{workout.name}</span>
                      <div className="text-xs text-muted-foreground">
                        {workout.duration_minutes}min • {workout.calories_burned}cal
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
              {exercises.map((exercise) => (
                <div key={exercise.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={exercise.id}
                    checked={selectedWorkouts.includes(exercise.id)}
                    onCheckedChange={() => toggleWorkout(exercise.id)}
                  />
                  <Label htmlFor={exercise.id} className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span>{exercise.name}</span>
                      <div className="text-xs text-muted-foreground">
                        {exercise.exercise_type} • {exercise.primary_muscle_group}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={!name.trim() || selectedWorkouts.length === 0}>
        Create Routine
      </Button>
    </form>
  );
};

export default WorkoutRoutines;