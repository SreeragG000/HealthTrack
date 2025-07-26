import React from 'react';
import { CheckCircle2, Clock, Flame, Edit, Trash2, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Workout } from '@/pages/WorkoutTracker';

interface WorkoutCardProps {
  workout: Workout;
  onComplete: () => void;
  onEdit: (workout: Workout) => void;
  onDelete: () => void;
}

const workoutTypeColors: Record<string, string> = {
  cardio: 'bg-red-500/20 text-red-400 border-red-500/30',
  strength: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  flexibility: 'bg-green-500/20 text-green-400 border-green-500/30',
  sports: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  yoga: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  pilates: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  hiit: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  other: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ 
  workout, 
  onComplete, 
  onEdit, 
  onDelete 
}) => {
  const typeColor = workoutTypeColors[workout.type] || workoutTypeColors.other;
  const isToday = workout.scheduled_date === new Date().toISOString().split('T')[0];
  
  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 animate-fade-in group ${
      workout.completed ? 'bg-card/50 border-primary/30' : 'bg-card border-border'
    }`}>
      {/* Neon glow effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
        workout.completed ? 'bg-primary/5' : 'bg-primary/10'
      } blur-xl`} />
      
      <CardHeader className="relative pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Checkbox
              checked={workout.completed}
              onCheckedChange={onComplete}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <div className="flex-1">
              <CardTitle className={`text-lg transition-all duration-200 ${
                workout.completed ? 'line-through text-muted-foreground' : 'text-foreground'
              }`}>
                {workout.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={`text-xs ${typeColor}`}>
                  {workout.type}
                </Badge>
                {isToday && (
                  <Badge variant="default" className="text-xs bg-primary/20 text-primary border-primary/30">
                    Today
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(workout)}
              className="h-8 w-8 hover:bg-primary/20"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        {/* Workout Image */}
        {workout.image_url && (
          <div className="w-full h-32 bg-muted rounded-lg overflow-hidden">
            <img
              src={workout.image_url}
              alt={workout.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span>{workout.duration_minutes} min</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Flame className="h-4 w-4 text-primary" />
            <span>{workout.calories_burned || 0} cal</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 text-primary" />
          <span>{new Date(workout.scheduled_date).toLocaleDateString()}</span>
        </div>
        
        {workout.notes && (
          <p className="text-sm text-muted-foreground bg-muted/30 p-2 rounded border">
            {workout.notes}
          </p>
        )}
        
        {workout.completed && workout.completed_at && (
          <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 p-2 rounded border border-primary/20">
            <CheckCircle2 className="h-4 w-4" />
            <span>Completed on {new Date(workout.completed_at).toLocaleDateString()}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};