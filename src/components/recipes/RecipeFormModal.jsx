import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Save, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import RecipeIngredientPicker from './RecipeIngredientPicker';

const CATEGORIES = ['Breakfast', 'Snacks', 'Lunch', 'Dinner'];

export default function RecipeFormModal({ open, onClose, onSave, recipe, ingredients }) {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (recipe) {
      setName(recipe.name || '');
      setCategories(recipe.categories || []);
      setRecipeIngredients(recipe.recipe_ingredients || []);
    } else {
      setName('');
      setCategories([]);
      setRecipeIngredients([]);
    }
  }, [recipe, open]);

  const toggleCategory = (cat) =>
    setCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);

  const calcTotal = (field) =>
    recipeIngredients.reduce((sum, i) => sum + (i[field] || 0), 0);

  const handleSave = async () => {
    if (!name.trim() || categories.length === 0) return;
    setLoading(true);
    await onSave({
      name,
      categories,
      recipe_ingredients: recipeIngredients,
      total_calories: parseFloat(calcTotal('calories').toFixed(1)),
      total_protein: parseFloat(calcTotal('protein').toFixed(1)),
      total_carbs: parseFloat(calcTotal('carbs').toFixed(1)),
      total_fat: parseFloat(calcTotal('fat').toFixed(1)),
    });
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{recipe ? 'Edit Recipe' : 'New Recipe'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-2">
          <div>
            <Label className="text-xs">Recipe Name</Label>
            <Input placeholder="e.g. Pita Sandwich" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
          </div>

          <div>
            <Label className="text-xs mb-2 block">Categories</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Badge
                  key={cat}
                  variant={categories.includes(cat) ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer text-xs px-3 py-1.5',
                    categories.includes(cat) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  )}
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          <RecipeIngredientPicker
            selectedItems={recipeIngredients}
            ingredients={ingredients}
            onChange={setRecipeIngredients}
          />

          {recipeIngredients.length > 0 && (
            <div className="bg-primary/10 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-primary mb-1">Recipe Totals</p>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <p className="text-sm font-bold text-foreground">{Math.round(calcTotal('calories'))}</p>
                  <p className="text-[9px] text-muted-foreground">kcal</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">{calcTotal('protein').toFixed(1)}g</p>
                  <p className="text-[9px] text-muted-foreground">protein</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-accent">{calcTotal('carbs').toFixed(1)}g</p>
                  <p className="text-[9px] text-muted-foreground">carbs</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-chart-4">{calcTotal('fat').toFixed(1)}g</p>
                  <p className="text-[9px] text-muted-foreground">fat</p>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleSave}
            disabled={loading || !name.trim() || categories.length === 0}
            className="w-full"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Recipe
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}