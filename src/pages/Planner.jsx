import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, addDays, subDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Footprints, Flame, Timer } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MealCategorySection from '@/components/planner/MealCategorySection';
import { listRecipes } from '@/services/recipeService';
import { getDailyLog, upsertDailyLog } from '@/services/dailyLogService';

const CATEGORIES = ['Breakfast', 'Snacks', 'Lunch', 'Dinner'];
const EMPTY_MEALS = { Breakfast: [], Snacks: [], Lunch: [], Dinner: [] };

export default function Planner() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const queryClient = useQueryClient();

  const { data: recipes = [] } = useQuery({
    queryKey: ['recipes'],
    queryFn: listRecipes,
  });

  const { data: todayLog } = useQuery({
    queryKey: ['dailyLog', dateStr],
    queryFn: () => getDailyLog(dateStr),
  });

  const [meals, setMeals] = useState(EMPTY_MEALS);
  const [healthData, setHealthData] = useState({
    steps: 0,
    training_minutes: 0,
    calories_burnt: 0,
  });

  // Sync local state when the fetched log changes (e.g. date navigation)
  useEffect(() => {
    if (todayLog) {
      setMeals({
        Breakfast: todayLog.meals?.Breakfast || [],
        Snacks:    todayLog.meals?.Snacks    || [],
        Lunch:     todayLog.meals?.Lunch     || [],
        Dinner:    todayLog.meals?.Dinner    || [],
      });
      setHealthData({
        steps:            todayLog.steps            || 0,
        training_minutes: todayLog.training_minutes || 0,
        calories_burnt:   todayLog.calories_burnt   || 0,
      });
    } else {
      setMeals(EMPTY_MEALS);
      setHealthData({ steps: 0, training_minutes: 0, calories_burnt: 0 });
    }
  }, [todayLog, dateStr]);

  const saveMutation = useMutation({
    mutationFn: (data) => upsertDailyLog(dateStr, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyLog', dateStr] });
      queryClient.invalidateQueries({ queryKey: ['dailyLog', format(new Date(), 'yyyy-MM-dd')] });
    },
  });

  const saveAll = (updatedMeals, updatedHealth) => {
    saveMutation.mutate({
      meals:            updatedMeals  ?? meals,
      steps:            (updatedHealth ?? healthData).steps,
      training_minutes: (updatedHealth ?? healthData).training_minutes,
      calories_burnt:   (updatedHealth ?? healthData).calories_burnt,
    });
  };

  const handleAddMeal = (category, recipeId) => {
    const updated = { ...meals, [category]: [...meals[category], recipeId] };
    setMeals(updated);
    saveAll(updated, null);
  };

  const handleRemoveMeal = (category, recipeId) => {
    const updated = {
      ...meals,
      [category]: meals[category].filter((id) => id !== recipeId),
    };
    setMeals(updated);
    saveAll(updated, null);
  };

  const handleHealthChange = (field, value) => {
    setHealthData((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const handleHealthBlur = () => {
    saveAll(null, healthData);
  };

  const recipeMap = {};
  recipes.forEach((r) => { recipeMap[r.id] = r; });

  const allMealIds = [
    ...meals.Breakfast,
    ...meals.Snacks,
    ...meals.Lunch,
    ...meals.Dinner,
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
    <div className="px-5 pt-14 pb-6 space-y-5 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-foreground">Meal Planner</h1>

      {/* Date navigator */}
      <div className="flex items-center justify-between bg-card rounded-2xl border border-border px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setSelectedDate((d) => subDays(d, 1))}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">
            {format(selectedDate, 'EEEE')}
          </p>
          <p className="text-xs text-muted-foreground">
            {format(selectedDate, 'MMM d, yyyy')}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setSelectedDate((d) => addDays(d, 1))}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Day totals */}
      <div className="bg-primary/10 rounded-2xl p-4">
        <p className="text-xs font-semibold text-primary mb-2">Day Totals</p>
        <div className="grid grid-cols-4 gap-3 text-center">
          <div>
            <p className="text-base font-bold text-foreground">
              {Math.round(dayTotals.calories)}
            </p>
            <p className="text-[10px] text-muted-foreground">kcal</p>
          </div>
          <div>
            <p className="text-base font-bold text-primary">
              {Math.round(dayTotals.protein)}g
            </p>
            <p className="text-[10px] text-muted-foreground">protein</p>
          </div>
          <div>
            <p className="text-base font-bold text-accent">
              {Math.round(dayTotals.carbs)}g
            </p>
            <p className="text-[10px] text-muted-foreground">carbs</p>
          </div>
          <div>
            <p className="text-base font-bold text-chart-4">
              {Math.round(dayTotals.fat)}g
            </p>
            <p className="text-[10px] text-muted-foreground">fat</p>
          </div>
        </div>
      </div>

      {/* Meal categories */}
      <div className="space-y-3">
        {CATEGORIES.map((cat) => (
          <MealCategorySection
            key={cat}
            category={cat}
            selectedRecipeIds={meals[cat]}
            recipes={recipes}
            onAdd={(id) => handleAddMeal(cat, id)}
            onRemove={(id) => handleRemoveMeal(cat, id)}
          />
        ))}
      </div>

      {/* Activity data */}
      <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Activity Data</h3>
        <p className="text-[10px] text-muted-foreground -mt-2">
          Enter your data from Apple Health
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label className="text-[10px] flex items-center gap-1 mb-1">
              <Footprints className="w-3 h-3" /> Steps
            </Label>
            <Input
              type="number"
              value={healthData.steps || ''}
              onChange={(e) => handleHealthChange('steps', e.target.value)}
              onBlur={handleHealthBlur}
              className="h-9 text-sm"
            />
          </div>
          <div>
            <Label className="text-[10px] flex items-center gap-1 mb-1">
              <Timer className="w-3 h-3" /> Training
            </Label>
            <Input
              type="number"
              value={healthData.training_minutes || ''}
              onChange={(e) => handleHealthChange('training_minutes', e.target.value)}
              onBlur={handleHealthBlur}
              className="h-9 text-sm"
              placeholder="min"
            />
          </div>
          <div>
            <Label className="text-[10px] flex items-center gap-1 mb-1">
              <Flame className="w-3 h-3" /> Burned
            </Label>
            <Input
              type="number"
              value={healthData.calories_burnt || ''}
              onChange={(e) => handleHealthChange('calories_burnt', e.target.value)}
              onBlur={handleHealthBlur}
              className="h-9 text-sm"
              placeholder="kcal"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
