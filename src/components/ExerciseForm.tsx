import { useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Exercise {
  id: string;
  name: string;
  equipment?: string;
  primary_muscle_group?: string;
  other_muscles?: string[];
  exercise_type?: string;
  image_url?: string;
}

interface ExerciseFormProps {
  onSave: (exercise: Exercise) => void;
  onCancel: () => void;
}

const ExerciseForm = ({ onSave, onCancel }: ExerciseFormProps) => {
  const [name, setName] = useState('');
  const [equipment, setEquipment] = useState('');
  const [primaryMuscleGroup, setPrimaryMuscleGroup] = useState('');
  const [otherMuscles, setOtherMuscles] = useState<string[]>([]);
  const [exerciseType, setExerciseType] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const equipmentOptions = [
    'Barbell', 'Dumbbell', 'Kettlebell', 'Machine', 'Cable', 'Bodyweight',
    'Resistance Band', 'Medicine Ball', 'Plate', 'Other'
  ];

  const muscleGroups = [
    'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Glutes', 'Core', 'Cardio'
  ];

  const exerciseTypes = [
    'Strength', 'Cardio', 'Flexibility', 'Balance', 'Endurance', 'Sport'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `exercise-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('workout-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('workout-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const { data, error } = await supabase
        .from('exercises')
        .insert({
          name: name.trim(),
          equipment: equipment || null,
          primary_muscle_group: primaryMuscleGroup || null,
          other_muscles: otherMuscles.length > 0 ? otherMuscles : null,
          exercise_type: exerciseType || null,
          image_url: imageUrl,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Exercise created successfully!",
      });

      onSave(data);
    } catch (error: any) {
      toast({
        title: "Error creating exercise",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtherMuscleToggle = (muscle: string) => {
    setOtherMuscles(prev => 
      prev.includes(muscle)
        ? prev.filter(m => m !== muscle)
        : [...prev, muscle]
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Create Exercise</h2>
        <Button onClick={onCancel} variant="outline" size="sm">
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center bg-muted">
            {imageFile ? (
              <img 
                src={URL.createObjectURL(imageFile)} 
                alt="Exercise preview" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <Camera className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="exercise-image"
            />
            <Label htmlFor="exercise-image">
              <Button type="button" variant="outline" className="cursor-pointer" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Add Asset
                </span>
              </Button>
            </Label>
          </div>
        </div>

        {/* Exercise Name */}
        <div>
          <Label htmlFor="exercise-name" className="text-muted-foreground">Exercise Name</Label>
          <Input
            id="exercise-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter exercise name"
            required
            className="mt-2"
          />
        </div>

        {/* Equipment */}
        <div>
          <Label className="text-muted-foreground">Equipment</Label>
          <Select value={equipment} onValueChange={setEquipment}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select equipment" />
            </SelectTrigger>
            <SelectContent>
              {equipmentOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Primary Muscle Group */}
        <div>
          <Label className="text-muted-foreground">Primary Muscle Group</Label>
          <Select value={primaryMuscleGroup} onValueChange={setPrimaryMuscleGroup}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select primary muscle group" />
            </SelectTrigger>
            <SelectContent>
              {muscleGroups.map((muscle) => (
                <SelectItem key={muscle} value={muscle}>
                  {muscle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Other Muscles */}
        <div>
          <Label className="text-muted-foreground">Other Muscles (optional)</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {muscleGroups.filter(m => m !== primaryMuscleGroup).map((muscle) => (
              <Button
                key={muscle}
                type="button"
                variant={otherMuscles.includes(muscle) ? "default" : "outline"}
                size="sm"
                onClick={() => handleOtherMuscleToggle(muscle)}
                className="justify-start"
              >
                {muscle}
              </Button>
            ))}
          </div>
        </div>

        {/* Exercise Type */}
        <div>
          <Label className="text-muted-foreground">Exercise Type</Label>
          <Select value={exerciseType} onValueChange={setExerciseType}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select exercise type" />
            </SelectTrigger>
            <SelectContent>
              {exerciseTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={!name.trim() || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Exercise'}
        </Button>
      </form>
    </div>
  );
};

export default ExerciseForm;
