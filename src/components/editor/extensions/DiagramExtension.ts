import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { DiagramComponent } from './DiagramComponent';

export const DiagramExtension = Node.create({
  name: 'diagramBlock',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      code: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'diagram-block',
        getAttrs: (node: string | HTMLElement) => ({
             code: (node as HTMLElement).getAttribute('code'),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    // We store the code in an attribute for persistence/parsing
    return ['diagram-block', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DiagramComponent);
  },
});
