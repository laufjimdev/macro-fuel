/**
 * ingredientService.js
 *
 * Appwrite schema for the "ingredient" collection:
 *   id         — auto (Appwrite document $id)
 *   name       — string  (required)
 *   unit       — string  (e.g. "slice", "egg", "100g")
 *   calories   — float
 *   protein    — float
 *   carbs      — float
 *   fat        — float
 */

import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';

/** Normalise an Appwrite document to a plain ingredient object. */
function toIngredient(doc) {
  return {
    id:       doc.$id,
    name:     doc.name,
    unit:     doc.unit,
    calories: doc.calories ?? 0,
    protein:  doc.protein  ?? 0,
    carbs:    doc.carbs    ?? 0,
    fat:      doc.fat      ?? 0,
  };
}

/** List all ingredients. */
export async function listIngredients() {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.INGREDIENT, [
    Query.limit(500),
    Query.orderAsc('name'),
  ]);
  return res.documents.map(toIngredient);
}

/** Create a new ingredient. */
export async function createIngredient(data) {
  const doc = await databases.createDocument(
    DB_ID,
    COLLECTIONS.INGREDIENT,
    ID.unique(),
    {
      name:     data.name,
      unit:     data.unit,
      calories: data.calories ?? 0,
      protein:  data.protein  ?? 0,
      carbs:    data.carbs    ?? 0,
      fat:      data.fat      ?? 0,
    }
  );
  return toIngredient(doc);
}

/** Update an existing ingredient by Appwrite document ID. */
export async function updateIngredient(id, data) {
  const doc = await databases.updateDocument(
    DB_ID,
    COLLECTIONS.INGREDIENT,
    id,
    {
      name:     data.name,
      unit:     data.unit,
      calories: data.calories ?? 0,
      protein:  data.protein  ?? 0,
      carbs:    data.carbs    ?? 0,
      fat:      data.fat      ?? 0,
    }
  );
  return toIngredient(doc);
}

/** Delete an ingredient by Appwrite document ID. */
export async function deleteIngredient(id) {
  await databases.deleteDocument(DB_ID, COLLECTIONS.INGREDIENT, id);
}
