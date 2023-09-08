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
import { BehaviorSubject, take } from 'rxjs';
import { Gapcursor } from '@tiptap/extension-gapcursor';
import { ComponentPortal } from '@angular/cdk/portal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import Youtube, { YoutubeOptions } from '@tiptap/extension-youtube';
import { EDITOR_FEATURE, EditorFeature, EditorService } from 'codeme-tiptap';
import { VideoModalComponent } from 'projects/codeme-tiptap/src/lib/editor-feature/modals/video-modal.component';
import { CommonModule } from '@angular/common';

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

  @Input() set cdmVideoIconPath(path: string) {
    this.iconPath.next(path);
  }
  iconPath = new BehaviorSubject<string | null>(null);

  enabled = new BehaviorSubject(false);
  config = new BehaviorSubject<Partial<YoutubeOptions> | null>(null);
  button = new ComponentPortal(CdmVideoButton);

  extension = () =>
    import('@tiptap/extension-youtube').then((m) => m.Youtube as any);
}

@Component({
  imports: [CommonModule],
  selector: 'cdm-video-button',
  template: `<button (click)="onClick()">
      <img
        *ngIf="iconPath$ | async; else textVideo"
        [src]="iconPath$ | async"
      />
    </button>
    <ng-template #textVideo>Video</ng-template>`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdmVideoButton {
  editorService = inject(EditorService);
  iconPath$: BehaviorSubject<string | null>;

  constructor(
    private modalService: NzModalService,
    private messageService: NzMessageService,
    private CdmVideoDirective: CdmVideoDirective
  ) {
    this.iconPath$ = this.CdmVideoDirective.iconPath;
  }

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
