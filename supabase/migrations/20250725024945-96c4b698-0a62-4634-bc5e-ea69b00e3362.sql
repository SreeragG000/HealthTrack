-- Create workout_routines table
CREATE TABLE public.workout_routines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  workout_ids UUID[] NOT NULL DEFAULT '{}',
  total_duration INTEGER NOT NULL DEFAULT 0,
  total_calories INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.workout_routines ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own workout routines" 
ON public.workout_routines 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workout routines" 
ON public.workout_routines 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout routines" 
ON public.workout_routines 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout routines" 
ON public.workout_routines 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_workout_routines_updated_at
BEFORE UPDATE ON public.workout_routines
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();