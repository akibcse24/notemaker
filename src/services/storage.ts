import type { IStorageService } from '../types';

class StorageService implements IStorageService {
  async uploadImage(file: File): Promise<string> {
    // In a real app, upload to Supabase Storage
    // For mock: Create a local object URL
    return new Promise((resolve) => {
        setTimeout(() => {
            const url = URL.createObjectURL(file);
            resolve(url);
        }, 1000); // Simulate network
    });
  }
}

export const storageService = new StorageService();
