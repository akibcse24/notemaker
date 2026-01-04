import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/db';
import type { Note } from '../types';
import { Link } from 'react-router-dom';
import { Plus, Clock, FileText } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      dbService.getNotes(user.id).then(data => {
        setNotes(data);
        setLoading(false);
      });
    }
  }, [user]);

  if (loading) return <div className="p-8 text-center">Loading notes...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Notes</h1>
          <p className="text-slate-500">Welcome back, {user?.name}</p>
        </div>
        <Link to="/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors">
          <Plus className="w-5 h-5" /> New Note
        </Link>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No notes yet</h3>
          <p className="text-slate-500 mb-6">Capture your first handwritten note to get started.</p>
          <Link to="/new" className="text-indigo-600 font-medium hover:underline">Create a new note</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map(note => (
            <Link key={note.id} to={`/note/${note.id}`} className="group block bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all">
              <div className="h-40 bg-slate-100 relative">
                {note.original_image_url ? (
                  <img src={note.original_image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <FileText className="w-12 h-12" />
                    </div>
                )}
                {note.svg_code && (
                    <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-indigo-600 shadow-sm">
                        SVG
                    </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 mb-1 truncate group-hover:text-indigo-600">{note.title || 'Untitled Note'}</h3>
                <div className="flex items-center text-xs text-slate-500 gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(note.created_at).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
