import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, Loader2, Target } from 'lucide-react';
import { toast } from 'sonner';
import { getGoals, upsertGoals } from '@/services/userGoalsService';

const DEFAULTS = {
  daily_calories:   2000,
  daily_protein:    150,
  daily_carbs:      250,
  daily_fat:        65,
  daily_steps_goal: 10000,
};

export default function GoalsSettings() {
  const queryClient = useQueryClient();

  const { data: goals } = useQuery({
    queryKey: ['goals'],
    queryFn: getGoals,
  });

  const [form, setForm] = useState(DEFAULTS);

  useEffect(() => {
    if (goals) {
      setForm({
        daily_calories:   goals.daily_calories   ?? DEFAULTS.daily_calories,
        daily_protein:    goals.daily_protein    ?? DEFAULTS.daily_protein,
        daily_carbs:      goals.daily_carbs      ?? DEFAULTS.daily_carbs,
        daily_fat:        goals.daily_fat        ?? DEFAULTS.daily_fat,
        daily_steps_goal: goals.daily_steps_goal ?? DEFAULTS.daily_steps_goal,
      });
    }
  }, [goals]);

  const saveMutation = useMutation({
    mutationFn: (data) => upsertGoals(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Goals saved!');
    },
    onError: () => {
      toast.error('Failed to save goals. Check your Appwrite connection.');
    },
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  return (
    <div className="px-5 pt-14 pb-6 space-y-6 max-w-lg mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Daily Goals</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Set your daily nutrition targets
        </p>
      </div>

      <div className="bg-card rounded-2xl border border-border p-5 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Nutrition Goals
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-xs font-medium">Daily Calories (kcal)</Label>
            <Input
              type="number"
              value={form.daily_calories || ''}
              onChange={(e) => handleChange('daily_calories', e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs font-medium">Protein (g)</Label>
              <Input
                type="number"
                value={form.daily_protein || ''}
                onChange={(e) => handleChange('daily_protein', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Carbs (g)</Label>
              <Input
                type="number"
                value={form.daily_carbs || ''}
                onChange={(e) => handleChange('daily_carbs', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Fat (g)</Label>
              <Input
                type="number"
                value={form.daily_fat || ''}
                onChange={(e) => handleChange('daily_fat', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium">Daily Steps Goal</Label>
            <Input
              type="number"
              value={form.daily_steps_goal || ''}
              onChange={(e) => handleChange('daily_steps_goal', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <Button
          onClick={() => saveMutation.mutate(form)}
          disabled={saveMutation.isPending}
          className="w-full bg-primary text-primary-foreground"
        >
          {saveMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Goals
        </Button>
      </div>

      <div className="bg-muted/50 rounded-2xl p-4">
        <p className="text-xs text-muted-foreground text-center">
          Tip: A balanced macro split is typically 30% protein, 40% carbs,
          30% fat of your daily calories.
        </p>
      </div>
    </div>
  );
}
