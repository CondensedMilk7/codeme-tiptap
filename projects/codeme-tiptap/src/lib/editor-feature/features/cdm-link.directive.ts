import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  Inject,
  Input,
  inject,
} from '@angular/core';
import { EDITOR_FEATURE, EditorFeature } from '../editor-feature';
import { BehaviorSubject } from 'rxjs';
import { EditorService } from '../../editor.service';
import { ComponentPortal } from '@angular/cdk/portal';
import Link, { LinkOptions } from '@tiptap/extension-link';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LinkModalComponent } from '../modals/link-modal.component';

@Directive({
  standalone: true,
  selector: 'cdm-tiptap-editor[cdmLink], tiptap-editor[cdmLink]',
  providers: [
    {
      provide: EDITOR_FEATURE,
      useExisting: CdmLinkDirective,
      multi: true,
    },
  ],
})
export class CdmLinkDirective implements EditorFeature<LinkOptions> {
  @Input() set cdmLink(config: Partial<LinkOptions> | '' | false) {
    this.enabled.next(config !== false);
    this.config.next(config || null);
  }

  enabled = new BehaviorSubject(false);
  config = new BehaviorSubject<Partial<LinkOptions> | null>(null);
  button = new ComponentPortal(CdmLinkButton);

  //! Had Error without any
  extension = () => import('@tiptap/extension-link').then((m) => m.Link as any);
}

@Component({
  selector: 'cdm-link-button',
  template: ` <button (click)="onClick()">Link</button> `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdmLinkButton {
  editorService = inject(EditorService);
  modalService = inject(NzModalService);
  messageService = inject(NzMessageService);

  // TODO: Implement Modal
  onClick() {
    this.modalService.create({
      nzTitle: 'Add Link',
      nzContent: LinkModalComponent,
      nzOnOk: (componentInstance: LinkModalComponent) => {
        if (componentInstance.formGroup.valid) {
          const url = componentInstance.urlControl.value;

          this.editorService.exec((editor) => {
            editor
              .chain()
              .focus()
              .extendMarkRange('link')
              .setLink({ href: url })
              .run();
          });
        } else {
          if (componentInstance.formGroup.hasError('required', ['url'])) {
            this.messageService.error('Please enter a URL.');
          } else if (
            componentInstance.formGroup.hasError('notHttps', ['url'])
          ) {
            this.messageService.error('URL must start with HTTPS.');
          } else {
            this.messageService.error('Invalid URL.');
          }
        }
      },
    });
  }
}
