import { Injector } from '@angular/core';
import { Node, mergeAttributes } from '@tiptap/core';
import { AngularNodeViewRenderer } from 'ngx-tiptap';
import { ImageComponent } from './image.component';

export const ImageComponentExtension = (injector: Injector): Node => {
  return Node.create({
    name: 'img',

    group: 'block',

    inline: false,

    atom: true,

    addAttributes() {
      return {
        src: {
          default: null,
        },
        alignment: {
          default: 'left',
        },
        caption: {
          // added caption attribute
          default: '',
        },
      };
    },

    parseHTML() {
      return [
        {
          tag: 'figure',
          getAttrs: (dom) => {
            if (dom instanceof HTMLElement) {
              const imgElement = dom.querySelector('img');
              const figcaptionElement = dom.querySelector('figcaption');
              const alignment =
                imgElement?.getAttribute('class')?.replace('align-', '') ||
                'center';
              return {
                src: imgElement?.getAttribute('src'),
                alignment,
                caption: figcaptionElement?.innerText || null,
              };
            }
            return {};
          },
        },
      ];
    },

    renderHTML({ node, HTMLAttributes }) {
      const attrs = mergeAttributes({
        class: `align-${node.attrs['alignment']}`,
        src: node.attrs['src'],
        ...HTMLAttributes,
      });

      return node.attrs['caption'] && node.attrs['caption'].trim() !== ''
        ? [
            'figure',
            {},
            ['img', attrs],
            ['figcaption', {}, node.attrs['caption']],
          ]
        : // Second
          ['figure', {}, ['img', attrs]];
    },

    addNodeView() {
      return AngularNodeViewRenderer(ImageComponent, { injector });
    },
  });
};
