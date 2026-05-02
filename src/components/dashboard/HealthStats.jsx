import React from 'react';
import { Footprints, Flame, Timer } from 'lucide-react';

export default function HealthStats({ steps, caloriesBurnt, trainingMinutes, stepsGoal }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-card rounded-2xl p-3 border border-border text-center">
        <div className="w-8 h-8 rounded-full bg-chart-3/15 flex items-center justify-center mx-auto mb-1.5">
          <Footprints className="w-4 h-4 text-chart-3" />
        </div>
        <p className="text-lg font-bold text-foreground">{(steps || 0).toLocaleString()}</p>
        <p className="text-[10px] text-muted-foreground">{stepsGoal ? `/ ${stepsGoal.toLocaleString()}` : 'steps'}</p>
      </div>
      <div className="bg-card rounded-2xl p-3 border border-border text-center">
        <div className="w-8 h-8 rounded-full bg-chart-4/15 flex items-center justify-center mx-auto mb-1.5">
          <Flame className="w-4 h-4 text-chart-4" />
        </div>
        <p className="text-lg font-bold text-foreground">{caloriesBurnt || 0}</p>
        <p className="text-[10px] text-muted-foreground">burned</p>
      </div>
      <div className="bg-card rounded-2xl p-3 border border-border text-center">
        <div className="w-8 h-8 rounded-full bg-chart-5/15 flex items-center justify-center mx-auto mb-1.5">
          <Timer className="w-4 h-4 text-chart-5" />
        </div>
        <p className="text-lg font-bold text-foreground">{trainingMinutes || 0}</p>
        <p className="text-[10px] text-muted-foreground">min trained</p>
      </div>
    </div>
  );
}