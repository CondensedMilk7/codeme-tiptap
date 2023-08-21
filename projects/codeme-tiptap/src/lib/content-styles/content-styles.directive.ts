import {
  Directive,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  Inject,
} from '@angular/core';
import { CdmContentStylesConfig, ElementName } from './content-styles';
import { DOCUMENT } from '@angular/common';
import { MarkStylesService } from '../shared/mark-styles.service';

@Directive({
  selector: '[cdmContentStyles]',
  standalone: true,
})
export class CdmContentStylesDirective implements OnChanges {
  @Input() config!: CdmContentStylesConfig | null;

  constructor(
    private hostElement: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    private markStylesService: MarkStylesService
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setStyles(this.config);
    }, 500);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const config = changes['config']
      .currentValue as CdmContentStylesConfig | null;
    this.setStyles(config);
  }

  setStyles(config: CdmContentStylesConfig | null) {
    if (config) {
      // Get the existing style tag
      let style = this.document.head.querySelector('style#customStyles');

      // If it doesn't exist, create a new one
      if (!style) {
        style = this.document.createElement('style');
        style.id = 'customStyles';
        this.document.head.appendChild(style);
      }

      // Clear the previous styles

      style.textContent = '';

      Object.entries(config.elements).forEach(([tag, styles]) => {
        const elements = this.hostElement.nativeElement.querySelectorAll(tag);
        if (elements.length) {
          const className = `.ProseMirror ${tag}`;

          let css = '';
          Object.entries(styles).forEach(([prop, value]) => {
            if (prop === 'border') {
              const borderStyles = styles.border;
              if (borderStyles) {
                let borderWidth = borderStyles.width || '0px';

                // Apply border width to all sides if the tag is an img
                if (tag === 'img') {
                  borderStyles.top = borderWidth;
                  borderStyles.right = borderWidth;
                  borderStyles.bottom = borderWidth;
                  borderStyles.left = borderWidth;
                }

                css += `
            border-style: ${borderStyles.style || 'none'};
            border-color: ${borderStyles.color || 'initial'} !important;
            border-top-width: ${borderStyles.top || '0px'};
            border-right-width: ${borderStyles.right || '0px'};
            border-bottom-width: ${borderStyles.bottom || '0px'};
            border-left-width: ${borderStyles.left || '0px'};
          `;
              }
            } else {
              css += `${this.toCssNative(prop)}: ${value};`;
            }
          });

          const styleContent = `${className} { ${css} }`;
          style!.textContent += styleContent;
        } else {
          //...
        }
      });

      if (config.elements['.ProseMirror']) {
        const proseMirrorStyles = config.elements['.ProseMirror'];
        if (proseMirrorStyles.backgroundColor) {
          const proseMirrorClassName = '.ProseMirror';
          const proseMirrorCss = `
      background-color: ${proseMirrorStyles.backgroundColor};
    `;
          const proseMirrorStyleContent = `${proseMirrorClassName} { ${proseMirrorCss} }`;
          style!.textContent += proseMirrorStyleContent;
        }
      }
      if (config.elements['blockquote']) {
        const blockquoteStyles = config.elements['blockquote'];

        // First, find the blockquote element in the host element
        const blockquote =
          this.hostElement.nativeElement.querySelector('blockquote');

        if (blockquote) {
          const children = blockquote.querySelectorAll('*');

          children.forEach((child: any) => {
            const tagName = child.tagName.toLowerCase();

            const tagStyles = config.elements[tagName as ElementName];

            if (tagStyles) {
              let css = '';
              Object.entries(tagStyles).forEach(([prop, value]) => {
                if (prop === 'border') {
                  const borderStyles = tagStyles.border;
                  if (borderStyles) {
                    let borderWidth = borderStyles.width || '0px';
                    borderStyles.top = borderWidth;
                    borderStyles.right = borderWidth;
                    borderStyles.bottom = borderWidth;
                    borderStyles.left = borderWidth;

                    css += `
                      border-style: ${borderStyles.style || 'none'};
                      border-color: ${
                        borderStyles.color || 'initial'
                      } !important;
                      border-top-width: ${borderStyles.top || '0px'};
                      border-right-width: ${borderStyles.right || '0px'};
                      border-bottom-width: ${borderStyles.bottom || '0px'};
                      border-left-width: ${borderStyles.left || '0px'};
                    `;
                  }
                } else if (prop === 'color') {
                  let color = blockquoteStyles?.color || 'red';
                  css += `${this.toCssNative('color')}: ${color};`;
                } else if (prop === 'backgroundColor') {
                  let backgroundColor =
                    blockquoteStyles?.backgroundColor || 'white';
                  css += `${this.toCssNative(
                    'backgroundColor'
                  )}: ${backgroundColor};`;
                } else if (prop === 'fontFamily') {
                  let fontFamily = blockquoteStyles?.fontFamily || 'serif';
                  css += `font-family: ${fontFamily};`;
                } else if (prop === 'fontSize') {
                  let fontSize = blockquoteStyles?.fontSize || '1.2rem';
                  css += `font-size: ${fontSize};`;
                } else if (prop === 'fontStyle') {
                  let fontStyle = blockquoteStyles?.fontStyle || 'normal';
                  css += `font-style: ${fontStyle};`;
                } else if (prop === 'maxWidth') {
                  let maxWidth = blockquoteStyles?.maxWidth || '100%';
                  css += `max-width: ${maxWidth};`;
                } else if (prop === 'padding') {
                  let padding = blockquoteStyles?.padding || '10px';
                  css += `padding: ${padding};`;
                } else if (prop === 'margin') {
                  let margin = blockquoteStyles?.margin || '0px';
                  css += `margin: ${margin};`;
                } else if (prop === 'textAlign') {
                  let textAlign = blockquoteStyles?.textAlign || 'left';
                  css += `text-align: ${textAlign};`;
                } else if (prop === 'borderRadius') {
                  let borderRadius = blockquoteStyles?.border?.radius || '0px';
                  css += `border-radius: ${borderRadius};`;
                } else {
                  css += `${this.toCssNative(prop)}: ${value};`;
                }
              });

              const styleContent = `.ProseMirror blockquote ${tagName} { ${css} }`;
              style!.textContent += styleContent;
            }
          });
        }
      }
    }

    // ! Passing This to an Shared Service.

    if (config?.elements['mark']) {
      const markStyles = config.elements['mark'];
      const backgroundColor = markStyles.backgroundColor;
      if (backgroundColor) {
        this.markStylesService.saveHexParameter('mark', backgroundColor);
      }
    }

    if (config?.elements['.mark1']) {
      const markStyles = config.elements['.mark1'];
      const backgroundColor = markStyles.backgroundColor;
      if (backgroundColor) {
        this.markStylesService.saveHexParameter('.mark1', backgroundColor);
      }
    }

    if (config?.elements['.mark2']) {
      const markStyles = config.elements['.mark2'];
      const backgroundColor = markStyles.backgroundColor;
      if (backgroundColor) {
        this.markStylesService.saveHexParameter('.mark2', backgroundColor);
      }
    }
  }

  private toCssNative(str: string) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }
}
