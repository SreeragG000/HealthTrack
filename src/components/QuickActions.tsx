import { Plus, Timer, Camera, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();
  
  const actions = [
    {
      icon: Plus,
      label: 'Add Workout',
      color: 'bg-primary/20 text-primary border-primary/30',
      gradient: true,
      onClick: () => navigate('/workouts')
    },
    {
      icon: Camera,
      label: 'Log Food',
      color: 'bg-accent/20 text-accent border-accent/30'
    },
    {
      icon: Timer,
      label: 'Start Timer',
      color: 'bg-green-500/20 text-green-400 border-green-500/30'
    },
    {
      icon: TrendingUp,
      label: 'View Stats',
      color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`glass-card p-4 border ${action.color} hover-lift hover-glow transition-all duration-300 group`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className={`p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110 ${
                  action.gradient ? 'bg-gradient-to-br from-primary/30 to-accent/20' : 'bg-current/10'
                }`}>
                  <IconComponent size={20} />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;