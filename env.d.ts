export interface Env {
  DB: D1Database;
  SESSIONS_KV: KVNamespace;
  OAUTH_KV: KVNamespace;
  CACHE_KV: KVNamespace;
  R2: R2Bucket;
  CHAT_SESSION_DO: DurableObjectNamespace;
  ORDER_UPDATES_DO: DurableObjectNamespace;
  AI: Ai;
  JWT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}
