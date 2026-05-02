import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import RecipeFormModal from './RecipeFormModal';
import { listRecipes, createRecipe, updateRecipe, deleteRecipe } from '@/services/recipeService';
import { listIngredients } from '@/services/ingredientService';

const CATEGORY_FILTERS = ['All', 'Breakfast', 'Snacks', 'Lunch', 'Dinner'];

export default function RecipesTab() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const queryClient = useQueryClient();

  const { data: recipes = [] } = useQuery({
    queryKey: ['recipes'],
    queryFn: listRecipes,
  });

  const { data: ingredients = [] } = useQuery({
    queryKey: ['ingredients'],
    queryFn: listIngredients,
  });

  const createMutation = useMutation({
    mutationFn: createRecipe,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recipes'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateRecipe(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recipes'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRecipe,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recipes'] }),
  });

  const handleSave = async (data) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const filtered = recipes.filter((r) => {
    const matchSearch = r.name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilter === 'All' || r.categories?.includes(activeFilter);
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl"
          />
        </div>
        <Button
          size="sm"
          className="bg-primary text-primary-foreground rounded-xl h-10 px-4 shrink-0"
          onClick={() => { setEditing(null); setModalOpen(true); }}
        >
          <Plus className="w-4 h-4 mr-1" /> New
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORY_FILTERS.map((cat) => (
          <Badge
            key={cat}
            variant={activeFilter === cat ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer whitespace-nowrap text-xs px-3 py-1.5 shrink-0',
              activeFilter === cat
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            )}
            onClick={() => setActiveFilter(cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((recipe) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">
                      {recipe.name}
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {recipe.categories?.map((cat) => (
                        <Badge
                          key={cat}
                          variant="secondary"
                          className="text-[10px] px-2 py-0.5"
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => { setEditing(recipe); setModalOpen(true); }}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => deleteMutation.mutate(recipe.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {recipe.recipe_ingredients?.length > 0 && (
                  <p className="text-[11px] text-muted-foreground">
                    {recipe.recipe_ingredients
                      .map((i) => `${i.quantity} ${i.unit} ${i.ingredient_name}`)
                      .join(' · ')}
                  </p>
                )}

                <div className="grid grid-cols-4 gap-2 text-center bg-muted/50 rounded-xl p-2">
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      {Math.round(recipe.total_calories || 0)}
                    </p>
                    <p className="text-[9px] text-muted-foreground">kcal</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary">
                      {recipe.total_protein || 0}g
                    </p>
                    <p className="text-[9px] text-muted-foreground">protein</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-accent">
                      {recipe.total_carbs || 0}g
                    </p>
                    <p className="text-[9px] text-muted-foreground">carbs</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-chart-4">
                      {recipe.total_fat || 0}g
                    </p>
                    <p className="text-[9px] text-muted-foreground">fat</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No recipes yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add ingredients first, then build recipes
            </p>
          </div>
        )}
      </div>

      <RecipeFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        recipe={editing}
        ingredients={ingredients}
      />
    </div>
  );
}
