import { User, Bell, Settings } from 'lucide-react';

const WelcomeHeader = () => {
  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getMotivation = () => {
    const motivations = [
      "Let's crush today's goals! 💪",
      "Your body can do it. It's your mind you need to convince! 🔥",
      "Progress, not perfection! ⚡",
      "Every rep counts! 🚀"
    ];
    return motivations[Math.floor(Math.random() * motivations.length)];
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex-1">
        <h1 className="text-2xl font-bold gradient-text mb-1">
          {getGreeting()}, Alex!
        </h1>
        <p className="text-muted-foreground text-sm">
          {getMotivation()}
        </p>
      </div>
      
      <div className="flex items-center space-x-3">
        <button className="p-3 glass-card hover-glow rounded-2xl group">
          <Bell size={20} className="text-muted-foreground group-hover:text-accent transition-colors" />
        </button>
        
        <button className="p-3 glass-card hover-glow rounded-2xl group">
          <Settings size={20} className="text-muted-foreground group-hover:text-accent transition-colors" />
        </button>
        
        <div className="p-1 glass-card rounded-2xl">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;