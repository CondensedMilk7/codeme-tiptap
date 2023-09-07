import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  EventEmitter,
  Input,
  Output,
  inject,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { EDITOR_FEATURE, EditorFeature } from '../editor-feature';
import { BehaviorSubject, take } from 'rxjs';
import { Gapcursor } from '@tiptap/extension-gapcursor';
import { EditorService } from '../../editor.service';
import { ComponentPortal } from '@angular/cdk/portal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import Youtube, { YoutubeOptions } from '@tiptap/extension-youtube';
import { VideoModalComponent } from '../modals/video-modal.component';

@Directive({
  standalone: true,
  selector: 'cdm-tiptap-editor[cdmVideo], tiptap-editor[cdmVideo]',
  providers: [
    {
      provide: EDITOR_FEATURE,
      useExisting: CdmVideoDirective,
      multi: true,
    },
  ],
})
export class CdmVideoDirective implements EditorFeature<YoutubeOptions> {
  @Input() set cdmVideo(config: Partial<YoutubeOptions> | '' | false) {
    this.enabled.next(config !== false);
    this.config.next(config || null);
  }

  enabled = new BehaviorSubject(false);
  config = new BehaviorSubject<Partial<YoutubeOptions> | null>(null);
  button = new ComponentPortal(CdmVideoButton);

  extension = () =>
    import('@tiptap/extension-youtube').then((m) => m.Youtube as any);
}

@Component({
  selector: 'cdm-video-button',
  template: ` <button (click)="onClick()">Video</button> `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdmVideoButton {
  editorService = inject(EditorService);

  constructor(
    private modalService: NzModalService,
    private messageService: NzMessageService
  ) {}

  onClick() {
    this.modalService.create({
      nzTitle: 'Add Video',
      nzContent: VideoModalComponent,
      nzOnOk: (componentInstance: VideoModalComponent) => {
        return new Promise<void>((resolve, reject) => {
          if (componentInstance.formGroup.valid) {
            const videoUrl = componentInstance.formGroup.value.videoUrl;

            this.editorService.exec((editor) => {
              editor.chain().focus().setYoutubeVideo({ src: videoUrl }).run();
            });
            resolve();
          } else {
            // Check for specific validation errors
            const formGroup = componentInstance.formGroup;
            if (formGroup.get('videoUrl')?.hasError('required')) {
              this.messageService.error('Please enter a video URL.');
            } else if (formGroup.get('videoUrl')?.hasError('youtubeUrl')) {
              this.messageService.error('Invalid YouTube URL.');
            } else {
              this.messageService.error('Invalid Video URL');
            }
            reject();
          }
        });
      },
    });
  }
}
