-- Create user_stats table for dashboard metrics
CREATE TABLE public.user_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  steps_today INTEGER NOT NULL DEFAULT 0,
  calories_burned INTEGER NOT NULL DEFAULT 0,
  calories_goal INTEGER NOT NULL DEFAULT 2000,
  calories_consumed INTEGER NOT NULL DEFAULT 0,
  goal_progress INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  weekly_workout_completed INTEGER NOT NULL DEFAULT 0,
  weekly_workout_goal INTEGER NOT NULL DEFAULT 5,
  fitness_tasks_completed INTEGER NOT NULL DEFAULT 0,
  fitness_tasks_total INTEGER NOT NULL DEFAULT 8,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own stats" 
ON public.user_stats 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own stats" 
ON public.user_stats 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" 
ON public.user_stats 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stats" 
ON public.user_stats 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_user_stats_updated_at
BEFORE UPDATE ON public.user_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER TABLE public.user_stats REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.user_stats;

-- Also enable realtime for exercises and workouts
ALTER TABLE public.exercises REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.exercises;

ALTER TABLE public.workouts REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.workouts;