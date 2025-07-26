import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Dumbbell, UtensilsCrossed, CheckSquare } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');

  const navigationItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'workout', icon: Dumbbell, label: 'Workout', path: '/workout-routines' },
    { id: 'food', icon: UtensilsCrossed, label: 'Food', path: '/food' },
    { id: 'todo', icon: CheckSquare, label: 'To-Do', path: '/todo' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Main Content */}
      <main className="flex-1 pb-20 px-4 pt-6">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-card border-t-2 border-primary/20 rounded-t-3xl">
        <div className="flex items-center justify-around py-4 px-6">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  navigate(item.path);
                }}
                className={`flex flex-col items-center space-y-1 p-2 rounded-2xl transition-all duration-300 ${
                  location.pathname === item.path 
                    ? 'text-primary neon-glow scale-110' 
                    : 'text-muted-foreground hover:text-accent hover:scale-105'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  location.pathname === item.path 
                    ? 'bg-primary/20 shadow-lg' 
                    : 'hover:bg-accent/10'
                }`}>
                  <IconComponent size={24} />
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;