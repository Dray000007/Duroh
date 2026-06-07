// ================================================================
//  DUROH — Appwrite configuration
//  ⚠️  Fill in DB_ID after creating your database in Appwrite console
// ================================================================
import { Client, Account, Databases, Query, ID } from "https://esm.sh/appwrite@17";

// Must match the host in Appwrite Console → Auth → Google → redirect URI (fra for this project)
export const APPWRITE_ENDPOINT   = "https://fra.cloud.appwrite.io/v1";
export const APPWRITE_PROJECT_ID = "6a12e28c00094ef5b817";

// ↓ Paste your Appwrite Database ID here (Databases → your DB → copy ID)
export const DB_ID        = "6a141539000d4983310c";

// Collection IDs — must match exactly what you named them in Appwrite
export const COL_VIDEOS   = "videos";
export const COL_LIKES    = "video_likes";
export const COL_COMMENTS = "video_comments";
export const COL_REPOSTS  = "video_reposts";
export const COL_MESSAGES = "messages";

export const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const account   = new Account(client);
export const databases = new Databases(client);
export { Query, ID };

export async function getCurrentUser() {
  try { return await account.get(); } catch { return null; }
}
export async function requireAuth(redirectTo = "login.html") {
  const user = await getCurrentUser();
  if (!user) { window.location.replace(redirectTo); return null; }
  return user;
}
