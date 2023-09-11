import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  Inject,
  Input,
  inject,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ComponentPortal } from '@angular/cdk/portal';
import { EDITOR_FEATURE, EditorFeature, EditorService } from 'codeme-tiptap';
import { CommonModule } from '@angular/common';
import Higlight, { HighlightOptions } from '@tiptap/extension-highlight';

@Directive({
  standalone: true,
  selector: 'cdm-tiptap-editor[cdmHiglight], tiptap-editor[cdmHiglight]',
  providers: [
    {
      provide: EDITOR_FEATURE,
      useExisting: CdmHighLightDirective,
      multi: true,
    },
  ],
})
export class CdmHighLightDirective implements EditorFeature<HighlightOptions> {
  @Input() set cdmHiglight(config: Partial<HighlightOptions> | '' | false) {
    this.enabled.next(config !== false);
    this.config.next(config || null);
  }

  @Input() set cdmHiglightIconPath(path: string) {
    this.iconPath.next(path);
  }
  iconPath = new BehaviorSubject<string | null>(null);

  enabled = new BehaviorSubject(false);
  config = new BehaviorSubject<Partial<HighlightOptions> | null>(null);
  button = new ComponentPortal(CdmHighLightButton);

  //! Had Error without any
  extension = async (): Promise<any[]> => {
    const [highlightModule, HighlightColorExtension] = await Promise.all([
      import('@tiptap/extension-highlight'),
      import('../extensions/custom-highligth'),
    ]);
    return [
      highlightModule.Highlight,
      HighlightColorExtension.HighlightColorExtension,
    ];
  };
}

@Component({
  imports: [CommonModule],
  selector: 'cdm-higlight-button',
  template: `
    <button (click)="mark1()">
      <img
        *ngIf="iconPath$ | async; else textHighlight"
        [src]="iconPath$ | async"
      />
      <ng-template #textHighlight>Highlight1</ng-template>
    </button>

    <button (click)="mark2()">
      <img
        *ngIf="iconPath$ | async; else textHighlight"
        [src]="iconPath$ | async"
      />
      <ng-template #textHighlight>Highlight2</ng-template>
    </button>

    <button (click)="mark3()">
      <img
        *ngIf="iconPath$ | async; else textHighlight"
        [src]="iconPath$ | async"
      />
      <ng-template #textHighlight>Highlight3</ng-template>
    </button>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdmHighLightButton {
  editorService = inject(EditorService);
  iconPath$: BehaviorSubject<string | null>;

  constructor(private CdmHighLightDirective: CdmHighLightDirective) {
    this.iconPath$ = this.CdmHighLightDirective.iconPath;
  }

  mark1() {
    this.execMark('mark1');
  }

  mark2() {
    this.execMark('mark2');
  }

  mark3() {
    this.execMark('mark3');
  }

  private execMark(markClass: string) {
    this.editorService.exec((editor) => {
      editor
        .chain()
        .focus()
        .toggleMark('highlightColor', { class: markClass })
        .run();
    });
  }
}
