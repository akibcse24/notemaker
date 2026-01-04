import type { IStorageService } from '../types';
import { supabase } from '../lib/supabase';

class StorageService implements IStorageService {
  async uploadImage(file: File): Promise<string> {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from('notes-images')
        .upload(fileName, file);

      if (error) {
        console.error('Supabase Storage Error:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('notes-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Upload failed, falling back to local URL:', error);
      // Fallback for demo if bucket doesn't exist or permissions fail
      return URL.createObjectURL(file);
    }
  }
}

export const storageService = new StorageService();
