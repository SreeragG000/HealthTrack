import { LucideIcon } from 'lucide-react';

interface ProgressCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  progress: number;
  trend?: 'up' | 'down' | 'stable';
  gradient?: boolean;
}

const ProgressCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  progress,
  trend = 'stable',
  gradient = false 
}: ProgressCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-accent';
    }
  };

  return (
    <div className={`glass-card p-6 hover-glow hover-lift group ${gradient ? 'neon-glow' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${
          gradient 
            ? 'bg-gradient-to-br from-primary/20 to-accent/20' 
            : 'bg-secondary/50'
        } group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} className={gradient ? 'text-primary' : 'text-accent'} />
        </div>
        
        <div className="text-right">
          <div className={`text-2xl font-bold ${gradient ? 'gradient-text' : 'text-foreground'}`}>
            {value}
          </div>
          <div className={`text-sm ${getTrendColor()}`}>
            {subtitle}
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{title}</span>
          <span className="text-sm font-medium text-accent">{progress}%</span>
        </div>
        
        <div className="w-full bg-secondary/30 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              gradient 
                ? 'bg-gradient-to-r from-primary to-accent' 
                : 'bg-accent'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;