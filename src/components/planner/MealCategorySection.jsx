import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MealCategorySection({
  category,
  selectedRecipeIds,
  recipes,
  onAdd,
  onRemove,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const available = recipes.filter(
    (r) =>
      r.name?.toLowerCase().includes(search.toLowerCase()) &&
      (r.categories?.includes(category) || true) // show all recipes in picker
  );

  const selectedRecipes = selectedRecipeIds
    .map((id) => recipes.find((r) => r.id === id))
    .filter(Boolean);

  const handleAdd = (recipe) => {
    onAdd(recipe.id);
    setSearch('');
    setOpen(false);
  };

  const categoryCalories = selectedRecipes.reduce(
    (sum, r) => sum + (r.total_calories || 0),
    0
  );

  return (
    <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{category}</h3>
          {selectedRecipes.length > 0 && (
            <p className="text-[10px] text-muted-foreground">
              {Math.round(categoryCalories)} kcal
            </p>
          )}
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 text-primary">
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2" align="end">
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search recipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>
            <div className="max-h-52 overflow-y-auto space-y-1">
              {available.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => handleAdd(recipe)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <p className="text-xs font-medium text-foreground">{recipe.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {Math.round(recipe.total_calories || 0)} kcal ·{' '}
                    {recipe.total_protein || 0}p ·{' '}
                    {recipe.total_carbs || 0}c ·{' '}
                    {recipe.total_fat || 0}f
                  </p>
                </button>
              ))}
              {available.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-3">
                  No recipes found
                </p>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {selectedRecipes.length > 0 ? (
        <div className="space-y-2">
          {selectedRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="flex items-center justify-between bg-muted/50 rounded-xl px-3 py-2"
            >
              <div>
                <p className="text-xs font-medium text-foreground">{recipe.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {Math.round(recipe.total_calories || 0)} kcal
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground shrink-0"
                onClick={() => onRemove(recipe.id)}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-2 border border-dashed border-border rounded-xl">
          No meals added
        </p>
      )}
    </div>
  );
}
