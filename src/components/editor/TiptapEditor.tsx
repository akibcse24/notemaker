import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { MathBlock, MathInline } from './extensions/MathExtension';
import { DiagramExtension } from './extensions/DiagramExtension';
import React, { useEffect } from 'react';
import { Bold, Italic, List, Heading1, Heading2 } from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, onChange, editable = true }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      MathBlock,
      MathInline,
      DiagramExtension,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: editable,
    editorProps: {
        attributes: {
            class: 'prose prose-slate max-w-none focus:outline-none min-h-[300px] font-handwriting text-lg leading-relaxed',
        },
    }
  });

  // Update content if changed externally (e.g. initial load)
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
       // Only set if significantly different to avoid cursor jumps
       // ideally we'd use a more robust check, but for this simple app:
       if (editor.getText() === "") editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-col h-full border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex gap-1 flex-wrap">
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={<Bold size={18} />} />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={<Italic size={18} />} />
        <div className="w-px bg-slate-300 mx-1" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} icon={<Heading1 size={18} />} />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} icon={<Heading2 size={18} />} />
        <div className="w-px bg-slate-300 mx-1" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={<List size={18} />} />
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-auto p-6 bg-[#fdfbf7]"> {/* Slight paper color */}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

const ToolbarBtn = ({ onClick, isActive, icon }: any) => (
  <button
    onClick={onClick}
    className={`p-1.5 rounded hover:bg-slate-200 transition-colors ${isActive ? 'bg-slate-200 text-indigo-600' : 'text-slate-600'}`}
  >
    {icon}
  </button>
);
