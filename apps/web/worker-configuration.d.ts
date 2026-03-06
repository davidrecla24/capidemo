interface Env {
  DB: D1Database;
  FILES: R2Bucket;
  CACHE: KVNamespace;
  AI: Ai;
  ASSETS: Fetcher;
  ORDER_COORDINATOR: DurableObjectNamespace;
  CHAT_SESSION: DurableObjectNamespace;

  // Secrets
  SESSION_SECRET: string;
  GOOGLE_MAPS_API_KEY: string;
  ADMIN_BOOTSTRAP_EMAILS: string;
}
