// StorageService simplificado usando memória (temporário)
// Em produção, considere usar SecureStore do Expo

class MemoryStorage {
  private storage: Map<string, string> = new Map();

  setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }

  getItem(key: string): string | null {
    return this.storage.get(key) || null;
  }

  removeItem(key: string): void {
    this.storage.delete(key);
  }

  multiRemove(keys: string[]): void {
    keys.forEach((key) => this.storage.delete(key));
  }

  clear(): void {
    this.storage.clear();
  }
}

const memoryStorage = new MemoryStorage();

export class StorageService {
  private static readonly TOKEN_KEY = '@auth_token';
  private static readonly USER_KEY = '@auth_user';

  static async setToken(token: string): Promise<void> {
    memoryStorage.setItem(this.TOKEN_KEY, token);
  }

  static async getToken(): Promise<string | null> {
    return memoryStorage.getItem(this.TOKEN_KEY);
  }

  static async removeToken(): Promise<void> {
    memoryStorage.removeItem(this.TOKEN_KEY);
  }

  static async setUser(user: unknown): Promise<void> {
    memoryStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static async getUser<T>(): Promise<T | null> {
    const user = memoryStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  static async removeUser(): Promise<void> {
    memoryStorage.removeItem(this.USER_KEY);
  }

  static async clear(): Promise<void> {
    memoryStorage.multiRemove([this.TOKEN_KEY, this.USER_KEY]);
  }
}
