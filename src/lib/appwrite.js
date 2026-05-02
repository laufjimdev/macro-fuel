import { Client, Account, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export { client };

// Collection IDs from env — fall back to sensible defaults so the app
// doesn't crash on a fresh clone before .env is filled in.
export const DB_ID = import.meta.env.VITE_APPWRITE_DB_ID ?? '';
export const COLLECTIONS = {
  USER_GOALS: import.meta.env.VITE_COLLECTION_USER_GOALS ?? 'user_goals',
  DAILY_LOG:  import.meta.env.VITE_COLLECTION_DAILY_LOG  ?? 'daily_log',
  RECIPE:     import.meta.env.VITE_COLLECTION_RECIPE     ?? 'recipe',
  INGREDIENT: import.meta.env.VITE_COLLECTION_INGREDIENT ?? 'ingredient',
};
