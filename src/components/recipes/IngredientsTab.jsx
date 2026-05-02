import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import IngredientFormModal from './IngredientFormModal';
import {
  listIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from '@/services/ingredientService';

export default function IngredientsTab() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: ingredients = [] } = useQuery({
    queryKey: ['ingredients'],
    queryFn: listIngredients,
  });

  const createMutation = useMutation({
    mutationFn: createIngredient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredients'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateIngredient(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredients'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteIngredient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredients'] }),
  });

  const handleSave = async (data) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const filtered = ingredients.filter((i) =>
    i.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search ingredients..."
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

      <div className="space-y-2">
        {filtered.map((ing) => (
          <div key={ing.id} className="bg-card rounded-2xl border border-border p-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{ing.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  per 1 {ing.unit}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => { setEditing(ing); setModalOpen(true); }}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  onClick={() => deleteMutation.mutate(ing.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-2 text-center bg-muted/50 rounded-xl p-2">
              <div>
                <p className="text-xs font-bold text-foreground">{ing.calories}</p>
                <p className="text-[9px] text-muted-foreground">kcal</p>
              </div>
              <div>
                <p className="text-xs font-bold text-primary">{ing.protein}g</p>
                <p className="text-[9px] text-muted-foreground">protein</p>
              </div>
              <div>
                <p className="text-xs font-bold text-accent">{ing.carbs}g</p>
                <p className="text-[9px] text-muted-foreground">carbs</p>
              </div>
              <div>
                <p className="text-xs font-bold text-chart-4">{ing.fat}g</p>
                <p className="text-[9px] text-muted-foreground">fat</p>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No ingredients yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Tap "New" to add your first ingredient
            </p>
          </div>
        )}
      </div>

      <IngredientFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        ingredient={editing}
      />
    </div>
  );
}
