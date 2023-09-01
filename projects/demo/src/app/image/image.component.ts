import {
  Component,
  Input,
  HostListener,
  SecurityContext,
  inject,
} from '@angular/core';
import { AngularNodeViewComponent } from 'ngx-tiptap';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NodeSelection } from 'prosemirror-state';
import { ImageModalComponent } from './image-modal.component';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-image-component',
  template: `
    <figure class="img-wrapper" (click)="showButtons = true">
      <div class="img-container">
        <img
          [src]="node.attrs['src']"
          [ngClass]="'align-' + node.attrs['alignment']"
        />
        <figcaption
          *ngIf="node.attrs['caption']"
          [ngClass]="'align-' + node.attrs['alignment']"
        >
          {{ node.attrs['caption'] }}
        </figcaption>
      </div>
      <div
        *ngIf="isSelected()"
        class="buttons"
        [style.visibility]="showButtons ? 'visible' : 'hidden'"
      >
        <div class="alignment-buttons">
          <button (click)="setAlignment('left')">
            <i class="fas fa-align-left"></i>
          </button>
          <button (click)="setAlignment('center')">
            <i class="fas fa-align-center"></i>
          </button>
          <button (click)="setAlignment('right')">
            <i class="fas fa-align-right"></i>
          </button>
        </div>
        <button class="edit-button" (click)="edit()">
          <i class="fas fa-edit"></i>Edit
        </button>
      </div>
    </figure>
  `,
  styles: [
    `
      .img-wrapper {
        position: relative;
        width: 100%;
      }

      .img-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .img-container img {
        width: auto;
        height: auto;
      }

      .img-container .align-left {
        align-self: flex-start;
        text-align: left; /* for the caption */
      }

      .img-container .align-center {
        margin-left: auto;
        margin-right: auto;
        text-align: center; /* for the caption */
      }

      .img-container .align-right {
        align-self: flex-end;
        text-align: right; /* for the caption */
      }

      .img-wrapper .buttons {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.5);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .alignment-buttons {
        display: flex;
        justify-content: space-evenly;
        width: 15%;
        margin-bottom: 10px;
      }

      .alignment-buttons button {
        background-color: #f1f1f1;
        border: none;
        cursor: pointer;
        padding: 10px;
        border-radius: 5px;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .edit-button {
        background-color: #f1f1f1;
        border: none;
        cursor: pointer;
        padding: 10px;
        border-radius: 5px;
        width: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .img-wrapper:hover .buttons {
        opacity: 1;
      }
    `,
  ],
})
export class ImageComponent extends AngularNodeViewComponent {
  private modalService = inject(NzModalService);
  private sanitizer = inject(DomSanitizer);

  constructor() {
    super();
  }

  showButtons = false;
  alignment = '';

  @Input() src!: string;

  @HostListener('click', ['$event'])
  onHostClick(event: Event) {
    this.showButtons = true;
    this.selectNode();
    event.stopPropagation();
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.showButtons = false; // Hide the buttons when the user clicks anywhere outside the image
  }

  ngOnInit() {
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }
  edit() {
    const src = this.node.attrs['src'];
    const actualSrc = this.sanitizer.sanitize(SecurityContext.URL, src); // Unwrap the SafeValue

    if (actualSrc) {
      console.log(actualSrc);

      const modal = this.modalService.create({
        nzTitle: 'Edit Image',
        nzContent: ImageModalComponent,
        nzComponentParams: {
          image: actualSrc,
          caption: this.node.attrs['caption'],
        },
      });

      modal.afterClose.subscribe((result) => {
        if (result) {
          this.updateImageSrc(result.croppedImage, result.caption);
        }
      });
    }
  }

  updateImageSrc(newSrc: string, newCaption: string) {
    const { state, view } = this.editor;
    const { selection } = state;
    const nodePos = selection.$from.pos;
    const node = state.doc.nodeAt(nodePos);

    if (node && node.type.name === 'img') {
      const tr = state.tr.setNodeMarkup(nodePos, undefined, {
        ...node.attrs,
        src: newSrc,
        caption: newCaption,
      });

      view.dispatch(tr);
    }
  }

  setAlignment(alignment: string) {
    const { state, view } = this.editor;
    const nodePos = this.getPos();
    const node = state.doc.nodeAt(nodePos);

    if (node) {
      const newNode = node.type.create({ ...node.attrs, alignment });
      const tr = state.tr.setNodeMarkup(nodePos, undefined, newNode.attrs);
      view.dispatch(tr);
    }
  }

  isSelected(): boolean {
    const { from, to } = this.editor.state.selection;
    return (
      this.editor.state.selection instanceof NodeSelection &&
      from === this.getPos() &&
      to === this.getPos() + this.node.nodeSize
    );
  }

  selectNode() {
    const { tr } = this.editor.state;
    const { from } = tr.selection;
    const nodeSelection = NodeSelection.create(tr.doc, from);
    this.editor.view.dispatch(tr.setSelection(nodeSelection));
  }
}
