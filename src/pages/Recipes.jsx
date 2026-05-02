import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import IngredientsTab from '@/components/recipes/IngredientsTab';
import RecipesTab from '@/components/recipes/RecipesTab';

const TABS = ['Recipes', 'Ingredients'];

export default function Recipes() {
  const [activeTab, setActiveTab] = useState('Recipes');

  return (
    <div className="px-5 pt-14 pb-6 space-y-5 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-foreground">Food Library</h1>

      <div className="flex bg-muted rounded-xl p-1 gap-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 text-sm font-medium py-2 rounded-lg transition-all',
              activeTab === tab
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Recipes' ? <RecipesTab /> : <IngredientsTab />}
    </div>
  );
}
