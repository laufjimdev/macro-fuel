import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import CalorieDonut from '@/components/dashboard/CalorieDonut';
import MacroDonut from '@/components/dashboard/MacroDonut';
import HealthStats from '@/components/dashboard/HealthStats';
import { Skeleton } from '@/components/ui/skeleton';
import { getGoals } from '@/services/userGoalsService';
import { getDailyLog } from '@/services/dailyLogService';
import { listRecipes } from '@/services/recipeService';

export default function Dashboard() {
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data: goals, isLoading: goalsLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: getGoals,
  });

  const { data: todayLog, isLoading: logLoading } = useQuery({
    queryKey: ['dailyLog', today],
    queryFn: () => getDailyLog(today),
  });

  const { data: recipes = [], isLoading: recipesLoading } = useQuery({
    queryKey: ['recipes'],
    queryFn: listRecipes,
  });

  const isLoading = goalsLoading || logLoading || recipesLoading;

  const userGoals = goals ?? {
    daily_calories: 2000,
    daily_protein: 150,
    daily_carbs: 250,
    daily_fat: 65,
    daily_steps_goal: 10000,
  };

  const recipeMap = {};
  recipes.forEach((r) => { recipeMap[r.id] = r; });

  const meals = todayLog?.meals ?? {};
  const allMealIds = [
    ...(meals.Breakfast || []),
    ...(meals.Snacks    || []),
    ...(meals.Lunch     || []),
    ...(meals.Dinner    || []),
  ];

  const dayTotals = allMealIds.reduce(
    (acc, id) => {
      const r = recipeMap[id];
      if (!r) return acc;
      return {
        calories: acc.calories + (r.total_calories || 0),
        protein:  acc.protein  + (r.total_protein  || 0),
        carbs:    acc.carbs    + (r.total_carbs    || 0),
        fat:      acc.fat      + (r.total_fat      || 0),
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="px-5 pt-14 pb-6 space-y-6 max-w-lg mx-auto">
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {format(new Date(), 'EEEE, MMM d')}
        </p>
        <h1 className="text-2xl font-bold text-foreground mt-0.5">Today's Nutrition</h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      ) : (
        <>
          <div className="bg-card rounded-3xl border border-border p-5 space-y-4">
            <CalorieDonut
              consumed={dayTotals.calories}
              goal={userGoals.daily_calories}
            />
            <div className="flex justify-around">
              <MacroDonut
                value={dayTotals.protein}
                goal={userGoals.daily_protein}
                label="Protein"
                color="hsl(152, 55%, 42%)"
              />
              <MacroDonut
                value={dayTotals.carbs}
                goal={userGoals.daily_carbs}
                label="Carbs"
                color="hsl(35, 90%, 55%)"
              />
              <MacroDonut
                value={dayTotals.fat}
                goal={userGoals.daily_fat}
                label="Fat"
                color="hsl(340, 65%, 55%)"
              />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">Activity</h2>
            <HealthStats
              steps={todayLog?.steps || 0}
              caloriesBurnt={todayLog?.calories_burnt || 0}
              trainingMinutes={todayLog?.training_minutes || 0}
              stepsGoal={userGoals.daily_steps_goal}
            />
          </div>

          {allMealIds.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3">Today's Meals</h2>
              <div className="space-y-2">
                {['Breakfast', 'Snacks', 'Lunch', 'Dinner'].map((cat) => {
                  const ids = meals[cat] || [];
                  if (ids.length === 0) return null;
                  return (
                    <div key={cat} className="bg-card rounded-xl border border-border px-3 py-2">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        {cat}
                      </p>
                      {ids.map((id) => {
                        const r = recipeMap[id];
                        if (!r) return null;
                        return (
                          <p key={id} className="text-xs text-foreground">
                            {r.name} ·{' '}
                            <span className="text-muted-foreground">
                              {Math.round(r.total_calories || 0)} kcal
                            </span>
                          </p>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
