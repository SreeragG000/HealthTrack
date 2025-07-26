-- Create storage bucket for workout images
INSERT INTO storage.buckets (id, name, public) VALUES ('workout-images', 'workout-images', true);

-- Create policies for workout image uploads
CREATE POLICY "Workout images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'workout-images');

CREATE POLICY "Users can upload workout images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'workout-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own workout images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'workout-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own workout images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'workout-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add image_url column to workouts table
ALTER TABLE public.workouts ADD COLUMN image_url TEXT;