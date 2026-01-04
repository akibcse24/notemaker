import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from './Button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
        isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:bg-slate-50'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*,.pdf"
        onChange={handleChange}
      />

      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
          <Upload className="w-6 h-6" />
        </div>
        <p className="font-medium text-slate-900">Click or drag image to upload</p>
        <p className="text-sm text-slate-500">Support for JPG, PNG</p>
        <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          Select File
        </Button>
      </div>
    </div>
  );
};
