import { Activity, Target, Flame, Trophy } from 'lucide-react';

const StatsGrid = () => {
  const stats = [
    {
      icon: Activity,
      value: '12.5K',
      label: 'Steps Today',
      color: 'text-accent'
    },
    {
      icon: Flame,
      value: '340',
      label: 'Calories Burned',
      color: 'text-primary'
    },
    {
      icon: Target,
      value: '85%',
      label: 'Goal Progress',
      color: 'text-green-400'
    },
    {
      icon: Trophy,
      value: '7',
      label: 'Streak Days',
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div 
            key={index}
            className="glass-card p-4 hover-glow text-center animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 bg-secondary/30 rounded-2xl">
                <IconComponent size={20} className={stat.color} />
              </div>
              <div className="text-lg font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;