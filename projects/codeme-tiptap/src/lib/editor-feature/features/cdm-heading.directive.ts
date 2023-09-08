import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  Input,
  inject,
} from '@angular/core';
import { EDITOR_FEATURE, EditorFeature } from '../editor-feature';
import { BehaviorSubject } from 'rxjs';
import { HeadingOptions, Level } from '@tiptap/extension-heading';
import { EditorService } from '../../editor.service';
import { ComponentPortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';

@Directive({
  standalone: true,
  selector: 'cdm-tiptap-editor[cdmHeading], tiptap-editor[cdmHeading]',
  providers: [
    {
      provide: EDITOR_FEATURE,
      useExisting: CdmHeadingDirective,
      multi: true,
    },
  ],
})
export class CdmHeadingDirective implements EditorFeature<HeadingOptions> {
  @Input() set cdmHeading(config: Partial<HeadingOptions> | '' | false) {
    this.enabled.next(config !== false);
    this.config.next(config || null);
  }
  @Input() set cdmHeadingIcons(paths: string[]) {
    this.iconsPath.next(paths);
  }
  iconsPath = new BehaviorSubject<string[] | null>(null);
  enabled = new BehaviorSubject(false);
  config = new BehaviorSubject<Partial<HeadingOptions> | null>(null);
  button = new ComponentPortal(CdmHeadingButton);

  extension = () => import('@tiptap/extension-heading').then((m) => m.Heading);
}

@Component({
  imports: [
    CommonModule,
  ],
  selector: 'cdm-heading-button',
  template: `
    <button (click)="onClick(1)">
      <img *ngIf="iconsPath$[0]; else textH1" [src]="iconsPath$[0]" alt="H1" />
      <ng-template #textH1>H1</ng-template>
    </button>
    <button (click)="onClick(2)">
      <img *ngIf="iconsPath$[1]; else textH2" [src]="iconsPath$[1]" alt="H2" />
      <ng-template #textH2>H2</ng-template>
    </button>
    <button (click)="onClick(3)">
      <img *ngIf="iconsPath$[2]; else textH3" [src]="iconsPath$[2]" alt="H3" />
      <ng-template #textH3>H3</ng-template>
    </button>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdmHeadingButton {
  editorService = inject(EditorService);
  iconsPath$!: string[];

  constructor(private cdmHeadingDirective: CdmHeadingDirective) {
    this.cdmHeadingDirective.iconsPath.subscribe((data) => {
      this.iconsPath$ = data || [];
    });
  }

  onClick(level: Level) {
    this.editorService.exec((editor) =>
      editor.chain().focus().toggleHeading({ level }).run()
    );
  }
}
