/**
 * dailyLogService.js
 *
 * Appwrite schema for the "daily_log" collection:
 *   id               — auto (Appwrite $id)
 *   date             — string  (yyyy-MM-dd, required, unique index recommended)
 *   meals            — string  (JSON: { Breakfast: string[], Snacks: string[], Lunch: string[], Dinner: string[] })
 *   steps            — integer
 *   training_minutes — integer
 *   calories_burnt   — integer
 */

import { databases, DB_ID, COLLECTIONS } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';

const EMPTY_MEALS = { Breakfast: [], Snacks: [], Lunch: [], Dinner: [] };

function toLog(doc) {
  let meals = EMPTY_MEALS;
  try {
    meals = doc.meals ? JSON.parse(doc.meals) : EMPTY_MEALS;
  } catch {
    meals = EMPTY_MEALS;
  }

  return {
    id:               doc.$id,
    date:             doc.date,
    meals,
    steps:            doc.steps            ?? 0,
    training_minutes: doc.training_minutes ?? 0,
    calories_burnt:   doc.calories_burnt   ?? 0,
  };
}

function toPayload(data) {
  return {
    date:             data.date,
    meals:            JSON.stringify(data.meals ?? EMPTY_MEALS),
    steps:            data.steps            ?? 0,
    training_minutes: data.training_minutes ?? 0,
    calories_burnt:   data.calories_burnt   ?? 0,
  };
}

/**
 * Fetch the daily log for a specific date string (yyyy-MM-dd).
 * Returns null if no log exists for that date.
 */
export async function getDailyLog(dateStr) {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.DAILY_LOG, [
    Query.equal('date', dateStr),
    Query.limit(1),
  ]);
  if (res.documents.length === 0) return null;
  return toLog(res.documents[0]);
}

/** Create a new daily log. */
export async function createDailyLog(data) {
  const doc = await databases.createDocument(
    DB_ID,
    COLLECTIONS.DAILY_LOG,
    ID.unique(),
    toPayload(data)
  );
  return toLog(doc);
}

/** Update an existing daily log by its Appwrite document ID. */
export async function updateDailyLog(id, data) {
  // date is immutable after creation — don't include it in the update payload
  const { date, ...rest } = data;
  const doc = await databases.updateDocument(
    DB_ID,
    COLLECTIONS.DAILY_LOG,
    id,
    {
      meals:            JSON.stringify(rest.meals ?? EMPTY_MEALS),
      steps:            rest.steps            ?? 0,
      training_minutes: rest.training_minutes ?? 0,
      calories_burnt:   rest.calories_burnt   ?? 0,
    }
  );
  return toLog(doc);
}

/**
 * Convenience: upsert a daily log for a given date.
 * If a log already exists, update it; otherwise create it.
 */
export async function upsertDailyLog(dateStr, data) {
  const existing = await getDailyLog(dateStr);
  if (existing) {
    return updateDailyLog(existing.id, data);
  }
  return createDailyLog({ ...data, date: dateStr });
}
