import React, { useEffect, useRef } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import katex from 'katex';

interface MathComponentProps {
  node: {
    attrs: {
      latex: string;
    };
  };
  extension: {
    name: string;
  };
}

export const MathComponent: React.FC<MathComponentProps> = ({ node, extension }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInline = extension.name === 'mathInline';

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(node.attrs.latex, ref.current, {
          displayMode: !isInline,
          throwOnError: false,
        });
      } catch (e) {
        ref.current.innerText = node.attrs.latex;
      }
    }
  }, [node.attrs.latex, isInline]);

  // Use a span for inline, div for block (though NodeViewWrapper handles the container)
  const Tag = isInline ? 'span' : 'div';

  return (
    <NodeViewWrapper as={Tag} className={`math-node ${isInline ? 'math-inline' : 'math-block my-4 text-center'}`}>
      <span ref={ref} contentEditable={false} className="cursor-default select-all" />
    </NodeViewWrapper>
  );
};
