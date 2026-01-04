import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dbService } from '../services/db';
import type { Note } from '../types';
import { TiptapEditor } from '../components/editor/TiptapEditor';
import { Button } from '../components/Button';
import { Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';

export const NoteEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Load note data
  useEffect(() => {
    if (id) {
      dbService.getNote(id).then(data => {
        setNote(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleSave = async () => {
    if (!note || !id) return;
    setSaving(true);
    try {
      await dbService.updateNote(id, {
        content: note.content,
        title: note.title,
      });
      setDirty(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading editor...</div>;
  if (!note) return <div className="p-8 text-center">Note not found</div>;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-slate-500 hover:text-slate-800">
            <ArrowLeft size={20} />
          </button>
          <input
            value={note.title}
            onChange={(e) => {
                setNote({ ...note, title: e.target.value });
                setDirty(true);
            }}
            className="font-bold text-lg text-slate-900 bg-transparent border-none focus:ring-0 placeholder-slate-400 w-96"
            placeholder="Note Title"
          />
        </div>
        <div className="flex items-center gap-3">
            {dirty && <span className="text-xs text-amber-600 font-medium">Unsaved changes</span>}
            <Button size="sm" onClick={handleSave} isLoading={saving} disabled={!dirty}>
                <Save className="w-4 h-4 mr-2" /> Save
            </Button>
        </div>
      </header>

      {/* Editor Layout */}
      <div className="flex-1 overflow-hidden p-4 flex justify-center">
        <div className="w-full max-w-4xl h-full flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
                <span className="text-sm font-semibold text-slate-500">Note Content</span>
                {note.original_image_url && (
                    <a href={note.original_image_url} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1 text-indigo-600 hover:underline">
                        <ImageIcon size={12} /> View Original Image
                    </a>
                )}
            </div>
            <TiptapEditor
                content={note.content}
                onChange={(html) => {
                    setNote({ ...note, content: html });
                    setDirty(true);
                }}
            />
        </div>
      </div>
    </div>
  );
};
