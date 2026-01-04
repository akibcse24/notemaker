import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';

interface DiagramComponentProps {
  node: {
    attrs: {
      code: string;
    };
  };
}

export const DiagramComponent: React.FC<DiagramComponentProps> = ({ node }) => {
  const { code } = node.attrs;

  // Try decoding Base64; if it fails, fallback to the raw code (for backwards compatibility if needed)
  let svgContent = code;
  try {
     // Check if it looks like base64 (no < or >)
     if (!code.trim().startsWith('<')) {
         svgContent = atob(code);
     }
  } catch (e) {
     console.error("Failed to decode diagram SVG", e);
  }

  return (
    <NodeViewWrapper className="diagram-component my-6 flex justify-center">
      <div
        className="p-4 border border-slate-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </NodeViewWrapper>
  );
};
