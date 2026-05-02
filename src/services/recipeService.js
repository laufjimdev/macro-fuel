/**
 * recipeService.js
 *
 * Appwrite schema for the "recipe" collection:
 *   id                  — auto (Appwrite $id)
 *   name                — string  (required)
 *   categories          — string[]  (e.g. ["Breakfast", "Snacks"])
 *   recipe_ingredients  — string  (JSON-serialised RecipeIngredient[])
 *   total_calories      — float
 *   total_protein       — float
 *   total_carbs         — float
 *   total_fat           — float
 *
 * recipe_ingredients is stored as JSON because Appwrite doesn't support
 * nested object arrays without a separate collection.  The service handles
 * serialisation/deserialisation transparently.
 */

import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';

function toRecipe(doc) {
  let recipeIngredients = [];
  try {
    recipeIngredients = doc.recipe_ingredients
      ? JSON.parse(doc.recipe_ingredients)
      : [];
  } catch {
    recipeIngredients = [];
  }

  return {
    id:                 doc.$id,
    name:               doc.name,
    categories:         doc.categories ?? [],
    recipe_ingredients: recipeIngredients,
    total_calories:     doc.total_calories ?? 0,
    total_protein:      doc.total_protein  ?? 0,
    total_carbs:        doc.total_carbs    ?? 0,
    total_fat:          doc.total_fat      ?? 0,
  };
}

function toPayload(data) {
  return {
    name:               data.name,
    categories:         data.categories ?? [],
    recipe_ingredients: JSON.stringify(data.recipe_ingredients ?? []),
    total_calories:     data.total_calories ?? 0,
    total_protein:      data.total_protein  ?? 0,
    total_carbs:        data.total_carbs    ?? 0,
    total_fat:          data.total_fat      ?? 0,
  };
}

/** List all recipes. */
export async function listRecipes() {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.RECIPE, [
    Query.limit(500),
    Query.orderAsc('name'),
  ]);
  return res.documents.map(toRecipe);
}

/** Create a new recipe. */
export async function createRecipe(data) {
  const doc = await databases.createDocument(
    DB_ID,
    COLLECTIONS.RECIPE,
    ID.unique(),
    toPayload(data)
  );
  return toRecipe(doc);
}

/** Update an existing recipe. */
export async function updateRecipe(id, data) {
  const doc = await databases.updateDocument(
    DB_ID,
    COLLECTIONS.RECIPE,
    id,
    toPayload(data)
  );
  return toRecipe(doc);
}

/** Delete a recipe. */
export async function deleteRecipe(id) {
  await databases.deleteDocument(DB_ID, COLLECTIONS.RECIPE, id);
}
