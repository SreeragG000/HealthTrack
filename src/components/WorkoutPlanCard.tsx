import React from 'react';
import { Calendar, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WorkoutPlan } from '@/pages/WorkoutTracker';

interface WorkoutPlanCardProps {
  plan: WorkoutPlan;
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const WorkoutPlanCard: React.FC<WorkoutPlanCardProps> = ({ plan }) => {
  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 animate-fade-in group bg-card border-border">
      {/* Neon glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary/10 blur-xl" />
      
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg text-foreground">{plan.name}</CardTitle>
            {plan.description && (
              <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
            )}
          </div>
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
            Active
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 text-primary" />
          <span>Workout Days:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {plan.days_of_week.map((day) => (
            <Badge
              key={day}
              variant="secondary"
              className="text-xs bg-muted text-muted-foreground"
            >
              {dayNames[day]}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center gap-4 pt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-primary" />
            <span>Personal Plan</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-primary" />
            <span>Created {new Date(plan.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};