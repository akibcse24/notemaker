import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { MathComponent } from './MathComponent';

export const MathBlock = Node.create({
  name: 'mathBlock',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      latex: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'latex-block',
        getAttrs: (node: string | HTMLElement) => ({
             latex: (node as HTMLElement).textContent,
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['latex-block', mergeAttributes(HTMLAttributes), HTMLAttributes.latex];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathComponent);
  },

  addInputRules() {
      return [
          nodeInputRule({
              find: /^\$\$([\s\S]+?)\$\$$/,
              type: this.type,
              getAttributes: (match) => {
                  return { latex: match[1] };
              },
          })
      ]
  }
});

export const MathInline = Node.create({
  name: 'mathInline',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      latex: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'latex-inline',
        getAttrs: (node: string | HTMLElement) => ({
             latex: (node as HTMLElement).textContent,
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['latex-inline', mergeAttributes(HTMLAttributes), HTMLAttributes.latex];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathComponent, { className: 'inline-block' });
  },
});
