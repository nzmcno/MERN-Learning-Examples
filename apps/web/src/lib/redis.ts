// Redis Cache & Presence Helper (with in-memory fallback for development)

interface CacheStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  increment(key: string): Promise<number>;
}

class InMemoryCache implements CacheStore {
  private store = new Map<string, { value: string; expiresAt?: number }>();

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.store.set(key, { value, expiresAt });
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  async increment(key: string): Promise<number> {
    const current = await this.get(key);
    const num = current ? parseInt(current, 10) + 1 : 1;
    await this.set(key, num.toString());
    return num;
  }
}

export const redis: CacheStore = new InMemoryCache();
