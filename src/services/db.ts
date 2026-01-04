import type { IDatabaseService, Note } from '../types';

class DatabaseService implements IDatabaseService {
  private getStore(): Note[] {
    const data = localStorage.getItem('notes');
    return data ? JSON.parse(data) : [];
  }

  private saveStore(notes: Note[]) {
    localStorage.setItem('notes', JSON.stringify(notes));
  }

  async getNotes(userId: string): Promise<Note[]> {
    await new Promise(r => setTimeout(r, 500));
    return this.getStore().filter(n => n.user_id === userId);
  }

  async getNote(id: string): Promise<Note | null> {
    await new Promise(r => setTimeout(r, 300));
    return this.getStore().find(n => n.id === id) || null;
  }

  async saveNote(noteData: Omit<Note, 'id' | 'created_at' | 'user_id'>): Promise<Note> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) throw new Error("No user logged in");

    const newNote: Note = {
      ...noteData,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      user_id: user.id,
    };

    const notes = this.getStore();
    notes.unshift(newNote); // Add to top
    this.saveStore(notes);

    return newNote;
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<Note> {
     const notes = this.getStore();
     const index = notes.findIndex(n => n.id === id);
     if (index === -1) throw new Error("Note not found");

     const updatedNote = { ...notes[index], ...updates };
     notes[index] = updatedNote;
     this.saveStore(notes);
     return updatedNote;
  }
}

export const dbService = new DatabaseService();
