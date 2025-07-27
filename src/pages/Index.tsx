import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import WelcomeHeader from '@/components/WelcomeHeader';
import ProgressCard from '@/components/ProgressCard';
import StatsGrid from '@/components/StatsGrid';
import QuickActions from '@/components/QuickActions';
import { Activity, Apple, CheckCircle, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserStats();
    setupRealtimeSubscription();
  }, []);

  const fetchUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user stats:', error);
        return;
      }

      if (!data) {
        // Create initial stats for new user
        const initialStats = {
          user_id: user.id,
          steps_today: 0,
          calories_burned: 0,
          calories_goal: 2000,
          calories_consumed: 0,
          goal_progress: 0,
          streak_days: 0,
          weekly_workout_completed: 0,
          weekly_workout_goal: 5,
          fitness_tasks_completed: 0,
          fitness_tasks_total: 8
        };

        const { data: newStats, error: insertError } = await supabase
          .from('user_stats')
          .insert(initialStats)
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user stats:', insertError);
          return;
        }

        setUserStats(newStats);
      } else {
        setUserStats(data);
      }
    } catch (error) {
      console.error('Error in fetchUserStats:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('user_stats_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_stats'
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            setUserStats(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6 max-w-md mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4"></div>
            <div className="space-y-4">
              <div className="h-24 bg-muted rounded"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-muted rounded"></div>
                <div className="h-24 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const workoutProgress = userStats ? (userStats.weekly_workout_completed / userStats.weekly_workout_goal) * 100 : 0;
  const calorieProgress = userStats ? (userStats.calories_consumed / userStats.calories_goal) * 100 : 0;
  const taskProgress = userStats ? (userStats.fitness_tasks_completed / userStats.fitness_tasks_total) * 100 : 0;

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
            value={`${userStats?.weekly_workout_completed || 0}/${userStats?.weekly_workout_goal || 5}`}
            subtitle="workouts completed"
            icon={Activity}
            progress={workoutProgress}
            trend={workoutProgress > 50 ? "up" : "stable"}
            gradient={true}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <ProgressCard
              title="Calorie Goal"
              value={`${userStats?.calories_consumed?.toLocaleString() || 0}`}
              subtitle={`of ${userStats?.calories_goal?.toLocaleString() || 2000} kcal`}
              icon={Apple}
              progress={Math.min(calorieProgress, 100)}
              trend={calorieProgress > 80 ? "up" : calorieProgress > 50 ? "stable" : "down"}
            />
            
            <ProgressCard
              title="Tasks Done"
              value={`${userStats?.fitness_tasks_completed || 0}/${userStats?.fitness_tasks_total || 8}`}
              subtitle="fitness tasks"
              icon={CheckCircle}
              progress={taskProgress}
              trend={taskProgress > 70 ? "up" : "stable"}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <StatsGrid userStats={userStats} />

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
