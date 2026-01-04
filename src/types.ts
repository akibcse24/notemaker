export interface Note {
  id: string;
  title: string;
  content: string; // Markdown/HTML from editor
  svg_code?: string;
  original_image_url?: string;
  created_at: string;
  user_id: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface IAuthService {
  login(): Promise<User>;
  logout(): Promise<void>;
  getUser(): Promise<User | null>;
}

export interface IStorageService {
  uploadImage(file: File): Promise<string>;
}

export interface IDatabaseService {
  getNotes(userId: string): Promise<Note[]>;
  getNote(id: string): Promise<Note | null>;
  saveNote(note: Omit<Note, 'id' | 'created_at' | 'user_id'>): Promise<Note>;
  updateNote(id: string, updates: Partial<Note>): Promise<Note>;
}

export interface IAIService {
  processImage(imageUrl: string): Promise<{ markdown: string; svg?: string }>;
}
