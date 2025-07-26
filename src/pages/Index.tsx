import Layout from '@/components/Layout';
import WelcomeHeader from '@/components/WelcomeHeader';
import ProgressCard from '@/components/ProgressCard';
import StatsGrid from '@/components/StatsGrid';
import QuickActions from '@/components/QuickActions';
import { Activity, Apple, CheckCircle, TrendingUp } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      <div className="space-y-6 max-w-md mx-auto">
        {/* Welcome Header */}
        <WelcomeHeader />

        {/* Progress Overview Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Today's Progress</h2>
          
          <ProgressCard
            title="Weekly Workout Goal"
            value="4/5"
            subtitle="workouts completed"
            icon={Activity}
            progress={80}
            trend="up"
            gradient={true}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <ProgressCard
              title="Calorie Goal"
              value="1,847"
              subtitle="of 2,000 kcal"
              icon={Apple}
              progress={92}
              trend="up"
            />
            
            <ProgressCard
              title="Tasks Done"
              value="6/8"
              subtitle="fitness tasks"
              icon={CheckCircle}
              progress={75}
              trend="stable"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <StatsGrid />

        {/* Quick Actions */}
        <QuickActions />

        {/* Motivational Quote Card */}
        <div className="glass-card p-6 text-center animate-float">
          <div className="p-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl mb-4 inline-block">
            <TrendingUp size={32} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold gradient-text mb-2">
            "Success is the sum of small efforts repeated day in and day out."
          </h3>
          <p className="text-muted-foreground text-sm">
            Keep pushing forward! 🚀
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
