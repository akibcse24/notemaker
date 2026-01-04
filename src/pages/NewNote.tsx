import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CameraCapture } from '../components/CameraCapture';
import { FileUpload } from '../components/FileUpload';
import { Button } from '../components/Button';
import { storageService } from '../services/storage';
import { aiService } from '../services/ai';
import { dbService } from '../services/db';
import { markdownToHtml } from '../lib/markdown';
import { Sparkles, X } from 'lucide-react';

export const NewNote: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  };

  const clearFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
  };

  const processNote = async () => {
    if (!file || !preview) return;
    setProcessing(true);

    try {
      console.log('Starting processNote...');
      // 1. Upload Image (Mock or Real)
      console.log('Uploading image...');
      const imageUrl = await storageService.uploadImage(file);
      console.log('Image uploaded:', imageUrl);

      // 2. Process with AI
      console.log('Processing with AI...');
      const aiResult = await aiService.processImage(preview); // Use preview/blob for AI for now if URL not public
      console.log('AI result:', aiResult);

      // 3. Save initial draft
      console.log('Saving note to DB...');
      let htmlContent = await markdownToHtml(aiResult.markdown);

      // Append Diagram if exists
      if (aiResult.svg) {
         // We escape double quotes to avoid breaking the attribute.
         // A simpler way for massive code is to store it safely, but for now we put it in 'code' attribute.
         // We need to be careful with escaping.
         const escapedSvg = aiResult.svg.replace(/"/g, '&quot;');
         htmlContent += `<diagram-block code="${escapedSvg}"></diagram-block>`;
      }

      const savedNote = await dbService.saveNote({
        title: "New Scanned Note",
        content: htmlContent,
        svg_code: aiResult.svg, // Keep storing it separately just in case
        original_image_url: imageUrl,
      });
      console.log('Note saved:', savedNote);

      // 4. Redirect to Editor
      console.log('Navigating to:', `/note/${savedNote.id}`);
      navigate(`/note/${savedNote.id}`);

    } catch (error) {
      console.error('Error in processNote:', error);
      alert("Failed to process note. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Create New Note</h1>

      {!file ? (
        <div className="grid gap-6">
          <FileUpload onFileSelect={handleFile} />
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-50 px-2 text-slate-500">Or</span></div>
          </div>
          <CameraCapture onCapture={handleFile} />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <img src={preview!} alt="Preview" className="w-full max-h-[60vh] object-contain" />
            <button
                onClick={clearFile}
                className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white text-slate-700"
            >
                <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-end gap-4">
             <Button variant="ghost" onClick={clearFile} disabled={processing}>Cancel</Button>
             <Button onClick={processNote} isLoading={processing} className="w-40">
                <Sparkles className="w-4 h-4 mr-2" />
                Process AI
             </Button>
          </div>
        </div>
      )}
    </div>
  );
};
