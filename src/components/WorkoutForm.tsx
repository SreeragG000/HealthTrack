import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Workout } from '@/pages/WorkoutTracker';

interface WorkoutFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (workout: Partial<Workout>) => void;
  workout?: Workout | null;
}

const workoutTypes = [
  { value: 'cardio', label: 'Cardio' },
  { value: 'strength', label: 'Strength' },
  { value: 'flexibility', label: 'Flexibility' },
  { value: 'sports', label: 'Sports' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'pilates', label: 'Pilates' },
  { value: 'hiit', label: 'HIIT' },
  { value: 'other', label: 'Other' },
];

export const WorkoutForm: React.FC<WorkoutFormProps> = ({ open, onClose, onSave, workout }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<{
    name: string;
    type: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'yoga' | 'pilates' | 'hiit' | 'other';
    notes: string;
    image_url: string;
  }>({
    name: '',
    type: 'other',
    notes: '',
    image_url: '',
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (workout) {
      setFormData({
        name: workout.name,
        type: workout.type,
        notes: workout.notes || '',
        image_url: workout.image_url || '',
      });
    } else {
      setFormData({
        name: '',
        type: 'other',
        notes: '',
        image_url: '',
      });
    }
    setSelectedFile(null);
  }, [workout, open]);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to upload images",
          variant: "destructive",
        });
        return null;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${authData.user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('workout-images')
        .upload(fileName, file);

      if (uploadError) {
        toast({
          title: "Upload failed",
          description: uploadError.message,
          variant: "destructive",
        });
        return null;
      }

      const { data } = supabase.storage
        .from('workout-images')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let imageUrl = formData.image_url;

    if (selectedFile) {
      imageUrl = await uploadImage(selectedFile);
      if (!imageUrl) {
        setUploading(false);
        return;
      }
    }

    onSave({ ...formData, image_url: imageUrl });
    setUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border border-border animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {workout ? 'Edit Workout' : 'Add New Workout'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Workout Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter workout name"
              required
              className="bg-background border-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-foreground">Type</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
              <SelectTrigger className="bg-background border-input">
                <SelectValue placeholder="Select workout type" />
              </SelectTrigger>
              <SelectContent>
                {workoutTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-foreground">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Add notes about this workout..."
              rows={3}
              className="bg-background border-input resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Workout Image</Label>
            <div className="space-y-3">
              {/* Current Image Preview */}
              {(formData.image_url || selectedFile) && (
                <div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden">
                  {selectedFile ? (
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Selected workout"
                      className="w-full h-full object-cover"
                    />
                  ) : formData.image_url ? (
                    <img
                      src={formData.image_url}
                      alt="Workout"
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeImage}
                    className="absolute top-2 right-2 h-8 w-8 p-0 bg-background/80 hover:bg-background"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                />
                <Label
                  htmlFor="image-upload"
                  className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                >
                  {selectedFile || formData.image_url ? (
                    <>
                      <Image className="h-4 w-4" />
                      <span className="text-sm">Change Image</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span className="text-sm">Upload Image</span>
                    </>
                  )}
                </Label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : workout ? 'Update' : 'Create'} Workout
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};