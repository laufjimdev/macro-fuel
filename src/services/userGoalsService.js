/**
 * userGoalsService.js
 *
 * Appwrite schema for the "user_goals" collection:
 *   id                — auto (Appwrite $id)
 *   daily_calories    — integer
 *   daily_protein     — integer
 *   daily_carbs       — integer
 *   daily_fat         — integer
 *   daily_steps_goal  — integer
 *
 * This collection is designed to hold a single document per user.
 * The service exposes getGoals() and upsertGoals() for this pattern.
 */

import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';

const DEFAULTS = {
  daily_calories:   2000,
  daily_protein:    150,
  daily_carbs:      250,
  daily_fat:        65,
  daily_steps_goal: 10000,
};

function toGoals(doc) {
  return {
    id:               doc.$id,
    daily_calories:   doc.daily_calories   ?? DEFAULTS.daily_calories,
    daily_protein:    doc.daily_protein    ?? DEFAULTS.daily_protein,
    daily_carbs:      doc.daily_carbs      ?? DEFAULTS.daily_carbs,
    daily_fat:        doc.daily_fat        ?? DEFAULTS.daily_fat,
    daily_steps_goal: doc.daily_steps_goal ?? DEFAULTS.daily_steps_goal,
  };
}

/**
 * Fetch the first user goals document.
 * Returns an object with defaults if none exists yet.
 */
export async function getGoals() {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.USER_GOALS, [
    Query.limit(1),
  ]);
  if (res.documents.length === 0) return { id: null, ...DEFAULTS };
  return toGoals(res.documents[0]);
}

/** Create a new goals document. */
export async function createGoals(data) {
  const doc = await databases.createDocument(
    DB_ID,
    COLLECTIONS.USER_GOALS,
    ID.unique(),
    {
      daily_calories:   data.daily_calories   ?? DEFAULTS.daily_calories,
      daily_protein:    data.daily_protein    ?? DEFAULTS.daily_protein,
      daily_carbs:      data.daily_carbs      ?? DEFAULTS.daily_carbs,
      daily_fat:        data.daily_fat        ?? DEFAULTS.daily_fat,
      daily_steps_goal: data.daily_steps_goal ?? DEFAULTS.daily_steps_goal,
    }
  );
  return toGoals(doc);
}

/** Update an existing goals document. */
export async function updateGoals(id, data) {
  const doc = await databases.updateDocument(
    DB_ID,
    COLLECTIONS.USER_GOALS,
    id,
    {
      daily_calories:   data.daily_calories   ?? DEFAULTS.daily_calories,
      daily_protein:    data.daily_protein    ?? DEFAULTS.daily_protein,
      daily_carbs:      data.daily_carbs      ?? DEFAULTS.daily_carbs,
      daily_fat:        data.daily_fat        ?? DEFAULTS.daily_fat,
      daily_steps_goal: data.daily_steps_goal ?? DEFAULTS.daily_steps_goal,
    }
  );
  return toGoals(doc);
}

/**
 * Convenience: upsert goals.
 * Creates on first save, updates on subsequent saves.
 */
export async function upsertGoals(data) {
  const existing = await getGoals();
  if (existing.id) {
    return updateGoals(existing.id, data);
  }
  return createGoals(data);
}
