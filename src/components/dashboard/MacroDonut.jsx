import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

export default function MacroDonut({ value, goal, label, color, unit = 'g' }) {
  const percentage = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;
  const remaining = Math.max(100 - percentage, 0);

  const data = [
    { name: 'consumed', value: percentage },
    { name: 'remaining', value: remaining },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 80, height: 80 }}>
        <PieChart width={80} height={80}>
          <Pie
            data={data}
            cx={40}
            cy={40}
            innerRadius={28}
            outerRadius={36}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
          >
            <Cell fill={color} />
            <Cell fill="hsl(210, 40%, 94%)" />
          </Pie>
        </PieChart>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-foreground">{Math.round(percentage)}%</span>
        </div>
      </div>
      <p className="text-[11px] font-semibold text-foreground mt-1">{label}</p>
      <p className="text-[10px] text-muted-foreground">{Math.round(value)}/{goal}{unit}</p>
    </div>
  );
}