import React, { useState, useEffect } from 'react';
import { Download, Code } from 'lucide-react';

interface SvgPreviewProps {
  svgCode: string;
}

export const SvgPreview: React.FC<SvgPreviewProps> = ({ svgCode }) => {
  const [showCode, setShowCode] = useState(false);
  const [cleanSvg, setCleanSvg] = useState('');

  useEffect(() => {
    // Basic cleanup if the AI returns markdown block wrappers
    let clean = svgCode.replace(/```xml/g, '').replace(/```svg/g, '').replace(/```/g, '').trim();
    // Ensure it starts with <svg
    if (!clean.startsWith('<svg') && clean.includes('<svg')) {
        clean = clean.substring(clean.indexOf('<svg'));
    }
    if (clean.endsWith('</svg>') && clean.length > clean.indexOf('</svg>') + 6) {
        clean = clean.substring(0, clean.indexOf('</svg>') + 6);
    }
    setCleanSvg(clean);
  }, [svgCode]);

  const handleDownload = () => {
    const blob = new Blob([cleanSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex justify-between items-center">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">Generated Diagram</span>
        <div className="flex gap-1">
          <button onClick={() => setShowCode(!showCode)} className={`p-1.5 rounded hover:bg-slate-200 text-slate-600 ${showCode ? 'bg-slate-200' : ''}`} title="View Code">
            <Code size={18} />
          </button>
          <button onClick={handleDownload} className="p-1.5 rounded hover:bg-slate-200 text-slate-600" title="Download SVG">
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-slate-100 p-4 flex items-center justify-center">
        {showCode ? (
          <pre className="w-full h-full text-xs p-4 bg-slate-800 text-slate-200 overflow-auto rounded font-mono">
            {cleanSvg}
          </pre>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: cleanSvg }}
          />
        )}
      </div>
    </div>
  );
};
