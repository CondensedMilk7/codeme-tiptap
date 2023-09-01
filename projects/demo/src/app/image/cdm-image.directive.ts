import { Component, Directive, Injector, inject } from '@angular/core';
import { EDITOR_FEATURE, EditorFeature, EditorService } from 'codeme-tiptap';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject } from 'rxjs';
import { ImageModalComponent } from './image-modal.component';
import { CommonModule } from '@angular/common';
import { ComponentPortal } from '@angular/cdk/portal';
import { Editor } from '@tiptap/core';

@Directive({
  standalone: true,
  selector: 'cdm-tiptap-editor[cdmImage], tiptap-editor[cdmImage]',
  providers: [
    {
      provide: EDITOR_FEATURE,
      useExisting: CdmImageDirective,
      multi: true,
    },
  ],
})
export class CdmImageDirective implements EditorFeature {
  injector = inject(Injector);

  enabled = new BehaviorSubject(true);
  config = new BehaviorSubject(null);
  button = new ComponentPortal(CdmImageButtonComponent);

  extension = () =>
    import('./image-extension').then((m) =>
      m.ImageComponentExtension(this.injector)
    );
}

@Component({
  imports: [CommonModule, NzModalModule],
  standalone: true,
  selector: 'cdm-image-button',
  template: `<button (click)="applyImage()">IMG</button>`,
})
export class CdmImageButtonComponent {
  editor = inject(EditorService);
  modalService = inject(NzModalService);

  applyImage(): void {
    const modal = this.modalService.create({
      nzContent: ImageModalComponent,
      nzClosable: false,
      nzStyle: {},
      nzFooter: null,
      nzOnOk: (componentInstance) => componentInstance.submitForm(),
    });

    modal.afterClose.subscribe((result) => {
      console.log(result); // Check this output
      if (result) {
        console.log('Base64:', result);
        const attrs = {
          src: result.croppedImage || null,
          alignment: result.alignment || 'left',
          caption: result.caption || '',
        };

        if (attrs.src) {
          this.editor.exec((editor: Editor) => {
            editor
              .chain()
              .focus()
              .insertContent({
                type: 'img',
                attrs,
              })
              .run();
          });
        }
      }
    });
  }
}
