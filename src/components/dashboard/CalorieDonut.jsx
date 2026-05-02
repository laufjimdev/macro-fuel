import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

export default function CalorieDonut({ consumed, goal }) {
  const percentage = goal > 0 ? Math.min((consumed / goal) * 100, 100) : 0;
  const remaining = Math.max(goal - consumed, 0);

  const data = [
    { name: 'consumed', value: consumed },
    { name: 'remaining', value: remaining || 1 },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 160, height: 160 }}>
        <PieChart width={160} height={160}>
          <Pie
            data={data}
            cx={80}
            cy={80}
            innerRadius={55}
            outerRadius={72}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
          >
            <Cell fill="hsl(152, 55%, 42%)" />
            <Cell fill="hsl(210, 40%, 94%)" />
          </Pie>
        </PieChart>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{Math.round(consumed)}</span>
          <span className="text-[10px] text-muted-foreground font-medium">of {goal} kcal</span>
        </div>
      </div>
    </div>
  );
}