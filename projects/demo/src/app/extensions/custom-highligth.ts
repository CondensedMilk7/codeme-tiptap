import { Mark } from '@tiptap/core';

export const HighlightColorExtension = Mark.create({
  name: 'highlightColor',

  defaultOptions: {
    HTMLAttributes: {},
  },

  addAttributes() {
    return {
      class: {
        default: 'default-class',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'mark',
        getAttrs: (dom) => {
          if (dom instanceof HTMLElement) {
            return {
              class: dom.getAttribute('class'),
            };
          }
          return {};
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'mark',
      {
        ...HTMLAttributes,
      },
      0,
    ];
  },
});
