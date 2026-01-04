import type { IDatabaseService, Note } from '../types';
import { supabase } from '../lib/supabase';

class DatabaseService implements IDatabaseService {

  async getNotes(userId: string): Promise<Note[]> {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Note[];
    } catch (error) {
      console.error("Supabase DB Fetch Error:", error);
      // Fallback to local storage if DB fails
      const localData = localStorage.getItem('notes');
      const notes: Note[] = localData ? JSON.parse(localData) : [];
      return notes.filter(n => n.user_id === userId);
    }
  }

  async getNote(id: string): Promise<Note | null> {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Note;
    } catch (error) {
       console.error("Supabase DB Get Error:", error);
       // Fallback
       const localData = localStorage.getItem('notes');
       const notes: Note[] = localData ? JSON.parse(localData) : [];
       return notes.find(n => n.id === id) || null;
    }
  }

  async saveNote(noteData: Omit<Note, 'id' | 'created_at' | 'user_id'>): Promise<Note> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    // Note: In real app, we might get user ID differently, but our AuthContext syncs to localStorage/memory
    // Here we need to pass the user_id explicitly or ensure the caller provides it?
    // The interface says saveNote takes Omit<..., 'user_id'>.
    // So we need to grab the current user ID from our Auth Service or Context.
    // For this service, we'll try to get it from authService (but that might be circular).
    // Simpler: We'll assume the authService has cached the user in localStorage as per our implementation.

    // We need to fetch the real user ID.
    // Let's rely on the one passed or stored.
    // Re-reading auth.ts: it writes to localStorage 'user'.

    if (!user.id) throw new Error("No user logged in");

    const newNote = {
      ...noteData,
      user_id: user.id,
      // Supabase handles created_at if default is set, but we can send it too or let DB handle it.
      // If we send it, we ensure it matches our Type immediately.
      // But typically we let DB set ID and created_at.
      // However, to return a full 'Note' object immediately without a refetch,
      // we might want to let Supabase return it.
    };

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([newNote])
        .select()
        .single();

      if (error) throw error;
      return data as Note;

    } catch (error) {
      console.error("Supabase DB Save Error:", error);
      // Fallback
      const fallbackNote: Note = {
        ...newNote,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
      };
      const localData = localStorage.getItem('notes');
      const notes = localData ? JSON.parse(localData) : [];
      notes.unshift(fallbackNote);
      localStorage.setItem('notes', JSON.stringify(notes));
      return fallbackNote;
    }
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<Note> {
     try {
       const { data, error } = await supabase
         .from('notes')
         .update(updates)
         .eq('id', id)
         .select()
         .single();

       if (error) throw error;
       return data as Note;
     } catch (error) {
        console.error("Supabase DB Update Error:", error);
        // Fallback
        const localData = localStorage.getItem('notes');
        const notes: Note[] = localData ? JSON.parse(localData) : [];
        const index = notes.findIndex(n => n.id === id);
        if (index > -1) {
            notes[index] = { ...notes[index], ...updates };
            localStorage.setItem('notes', JSON.stringify(notes));
            return notes[index];
        }
        throw error;
     }
  }
}

export const dbService = new DatabaseService();
