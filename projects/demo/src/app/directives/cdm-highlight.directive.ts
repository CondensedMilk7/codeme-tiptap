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

  @Input() mark1Color: string | null = '#ff0000'; // Default Red
  @Input() mark2Color: string | null = '#00ff00'; // Default Green
  @Input() mark3Color: string | null = '#0000ff'; // Default Blue
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
    <button (click)="mark1()" [style.backgroundColor]="mark1Color">
      <img
        *ngIf="iconPath$ | async; else textHighlight"
        [src]="iconPath$ | async"
      />
      <ng-template #textHighlight>Highlight1</ng-template>
    </button>

    <button (click)="mark2()" [style.backgroundColor]="mark2Color">
      <img
        *ngIf="iconPath$ | async; else textHighlight"
        [src]="iconPath$ | async"
      />
      <ng-template #textHighlight>Highlight2</ng-template>
    </button>

    <button (click)="mark3()" [style.backgroundColor]="mark3Color">
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

  mark1Color: string | null;
  mark2Color: string | null;
  mark3Color: string | null;

  constructor(private cdmHighLightDirective: CdmHighLightDirective) {
    this.iconPath$ = this.cdmHighLightDirective.iconPath;
    this.mark1Color = this.cdmHighLightDirective.mark1Color;
    this.mark2Color = this.cdmHighLightDirective.mark2Color;
    this.mark3Color = this.cdmHighLightDirective.mark3Color;
  }

  //? we can define any marks we want here just pass the class
  mark1() {
    if (this.mark1Color) {
      this.execMark('mark1', this.mark1Color);
    } else {
      console.warn('mark1Color is null. Cannot execute mark.');
    }
  }

  mark2() {
    if (this.mark2Color) {
      this.execMark('mark2', this.mark2Color);
    } else {
      console.warn('mark2Color is null. Cannot execute mark.');
    }
  }

  mark3() {
    if (this.mark3Color) {
      this.execMark('mark3', this.mark3Color);
    } else {
      console.warn('mark3Color is null. Cannot execute mark.');
    }
  }

  private execMark(markClass: string, markColor: string) {
    this.editorService.exec((editor) => {
      editor
        .chain()
        .focus()
        .toggleMark('highlightColor', { class: markClass })
        .run();
    });
  }
}
