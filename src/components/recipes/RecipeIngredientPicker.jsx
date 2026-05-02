import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, Search, X } from 'lucide-react';

export default function RecipeIngredientPicker({ selectedItems, ingredients, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedIds = selectedItems.map((i) => i.ingredient_id);
  const available = ingredients.filter(
    (i) => i.name?.toLowerCase().includes(search.toLowerCase())
  );

  const addIngredient = (ing) => {
    const newItem = {
      ingredient_id:   ing.id,   // normalized id from entities
      ingredient_name: ing.name,
      quantity:        1,
      unit:            ing.unit,
      calories:        ing.calories,
      protein:         ing.protein,
      carbs:           ing.carbs,
      fat:             ing.fat,
    };
    onChange([...selectedItems, newItem]);
    setSearch('');
    setOpen(false);
  };

  const updateQuantity = (index, qty) => {
    const parsed = parseFloat(qty);
    if (isNaN(parsed) || parsed < 0) return;
    const updated = [...selectedItems];
    const base = ingredients.find((i) => i.id === updated[index].ingredient_id);
    if (!base) return;
    updated[index] = {
      ...updated[index],
      quantity: parsed,
      calories: parseFloat((base.calories * parsed).toFixed(2)),
      protein:  parseFloat((base.protein  * parsed).toFixed(2)),
      carbs:    parseFloat((base.carbs    * parsed).toFixed(2)),
      fat:      parseFloat((base.fat      * parsed).toFixed(2)),
    };
    onChange(updated);
  };

  const remove = (index) => {
    onChange(selectedItems.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground">Ingredients</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 text-primary">
              <Plus className="w-4 h-4 mr-1" /> Add Ingredient
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2" align="end">
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search ingredients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>
            <div className="max-h-52 overflow-y-auto space-y-1">
              {available.map((ing) => {
                const alreadyAdded = selectedIds.includes(ing.id);
                return (
                  <button
                    key={ing.id}
                    onClick={() => !alreadyAdded && addIngredient(ing)}
                    disabled={alreadyAdded}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <p className="text-xs font-medium text-foreground">{ing.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {ing.calories} kcal · {ing.protein}p · {ing.carbs}c · {ing.fat}f per {ing.unit}
                    </p>
                  </button>
                );
              })}
              {available.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-3">No ingredients found</p>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        {selectedItems.map((item, index) => (
          <div key={item.ingredient_id} className="bg-muted/50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs font-medium text-foreground flex-1">{item.ingredient_name}</p>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground shrink-0" onClick={() => remove(index)}>
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(index, e.target.value)}
                  className="w-16 h-8 text-sm text-center"
                />
                <span className="text-xs text-muted-foreground">{item.unit}</span>
              </div>
              <div className="flex-1 grid grid-cols-4 gap-1 text-center">
                <div>
                  <p className="text-[10px] font-semibold text-foreground">{Math.round(item.calories)}</p>
                  <p className="text-[9px] text-muted-foreground">kcal</p>
                </div>
                <div><p className="text-[10px] font-semibold text-primary">{item.protein}p</p></div>
                <div><p className="text-[10px] font-semibold text-accent">{item.carbs}c</p></div>
                <div><p className="text-[10px] font-semibold text-chart-4">{item.fat}f</p></div>
              </div>
            </div>
          </div>
        ))}
        {selectedItems.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-3 border border-dashed border-border rounded-xl">
            Add ingredients from your library
          </p>
        )}
      </div>
    </div>
  );
}