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

  return (
    <NodeViewWrapper className="diagram-component my-6 flex justify-center">
      <div
        className="p-4 border border-slate-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
        dangerouslySetInnerHTML={{ __html: code }}
      />
    </NodeViewWrapper>
  );
};
