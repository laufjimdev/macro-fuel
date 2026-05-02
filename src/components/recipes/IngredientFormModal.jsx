import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';

const empty = { name: '', unit: '', calories: '', protein: '', carbs: '', fat: '' };

export default function IngredientFormModal({ open, onClose, onSave, ingredient }) {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(ingredient
      ? { name: ingredient.name, unit: ingredient.unit, calories: ingredient.calories, protein: ingredient.protein, carbs: ingredient.carbs, fat: ingredient.fat }
      : empty
    );
  }, [ingredient, open]);

  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleSave = async () => {
    if (!form.name.trim() || !form.unit.trim()) return;
    setLoading(true);
    await onSave({
      name: form.name,
      unit: form.unit,
      calories: parseFloat(form.calories) || 0,
      protein: parseFloat(form.protein) || 0,
      carbs: parseFloat(form.carbs) || 0,
      fat: parseFloat(form.fat) || 0,
    });
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>{ingredient ? 'Edit Ingredient' : 'New Ingredient'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label className="text-xs">Name</Label>
              <Input placeholder="e.g. Wheat bread" value={form.name} onChange={(e) => set('name', e.target.value)} className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Unit (per 1 unit)</Label>
              <Input placeholder="e.g. slice, egg, cup, 100g" value={form.unit} onChange={(e) => set('unit', e.target.value)} className="mt-1" />
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-3">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Nutrition per 1 {form.unit || 'unit'}</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[10px]">Calories (kcal)</Label>
                <Input type="number" value={form.calories} onChange={(e) => set('calories', e.target.value)} className="mt-1 h-9 text-sm" />
              </div>
              <div>
                <Label className="text-[10px]">Protein (g)</Label>
                <Input type="number" value={form.protein} onChange={(e) => set('protein', e.target.value)} className="mt-1 h-9 text-sm" />
              </div>
              <div>
                <Label className="text-[10px]">Carbs (g)</Label>
                <Input type="number" value={form.carbs} onChange={(e) => set('carbs', e.target.value)} className="mt-1 h-9 text-sm" />
              </div>
              <div>
                <Label className="text-[10px]">Fat (g)</Label>
                <Input type="number" value={form.fat} onChange={(e) => set('fat', e.target.value)} className="mt-1 h-9 text-sm" />
              </div>
            </div>
          </div>

          <Button onClick={handleSave} disabled={loading || !form.name.trim() || !form.unit.trim()} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Ingredient
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}