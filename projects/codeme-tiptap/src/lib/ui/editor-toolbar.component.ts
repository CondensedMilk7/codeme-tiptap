import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Editor } from '@tiptap/core';
import { Subscription, fromEvent } from 'rxjs';
import { MarkStylesService } from '../shared/mark-styles.service';
import { EditorService } from '../editor.service';

@Component({
  selector: 'cdm-editor-toolbar',
  template: `
    <div class="button-group">
      <div class="button-sub-group">
        <cdm-editor-button
          (onClick)="editorService.applyHeading(editor, 1)"
          imagePath="../assets/icons8-h1-30 (1).png"
        ></cdm-editor-button>
        <cdm-editor-button
          (onClick)="editorService.applyHeading(editor, 2)"
          imagePath="../assets/icons8-h2-30.png"
        ></cdm-editor-button>
        <cdm-editor-button
          (onClick)="editorService.applyHeading(editor, 3)"
          imagePath="../assets/icons8-h3-30.png"
        ></cdm-editor-button>

        <cdm-editor-button
          (onClick)="editorService.applyBlockquote(editor)"
          iconClass="fas fa-quote-left"
        ></cdm-editor-button>

        <cdm-editor-button
          (onClick)="editorService.addMark(editor)"
          iconClass="fas fa-highlighter"
          [iconColor]="markStyles.getHexParameter('mark') || '#000'"
        >
        </cdm-editor-button>
        <cdm-editor-button
          (onClick)="editorService.addCustoMark(editor)"
          iconClass="fas fa-highlighter"
          [iconColor]="markStyles.getHexParameter('.mark1') || '#000'"
        >
        </cdm-editor-button>
        <cdm-editor-button
          (onClick)="editorService.addCustoMark2(editor)"
          iconClass="fas fa-highlighter"
          [iconColor]="markStyles.getHexParameter('.mark2') || '#000'"
        >
        </cdm-editor-button>

        <cdm-editor-button
          (onClick)="editorService.applyCodeBlock(editor)"
          iconClass="fas fa-code"
        ></cdm-editor-button>
        <!-- <cdm-editor-button
          (onClick)="editorService.applyImage(editor, modalService)"
          iconClass="fas fa-image"
        ></cdm-editor-button>
        <cdm-editor-button
          (onClick)="editorService.applyLink(editor, modalService, message)"
          iconClass="fas fa-link"
        ></cdm-editor-button> -->
        <cdm-editor-button
          (onClick)="editorService.applyBold(editor)"
          iconClass="fas fa-bold"
        ></cdm-editor-button>
        <cdm-editor-button
          (onClick)="editorService.applyItalic(editor)"
          iconClass="fas fa-italic"
        ></cdm-editor-button>
        <cdm-editor-button
          (onClick)="editorService.applyBulletList(editor)"
          iconClass="fas fa-list-ul"
        ></cdm-editor-button>
        <cdm-editor-button
          (onClick)="editorService.applyOrderedList(editor)"
          iconClass="fas fa-list-ol"
        ></cdm-editor-button>
        <!-- <cdm-editor-button
          (onClick)="editorService.addVideo(editor, modalService)"
          iconClass="fas fa-video"
        ></cdm-editor-button> -->
        <!-- <cdm-editor-button
          (onClick)="editorService.applyTable(editor, modalService, message)"
          iconClass="fas fa-table"
        ></cdm-editor-button> -->
        <cdm-editor-button
          (onClick)="editorService.goBack(editor)"
          iconClass="fa fa-undo"
        ></cdm-editor-button>
        <cdm-editor-button
          (onClick)="editorService.goForward(editor)"
          iconClass="fa fa-redo"
        ></cdm-editor-button>
      </div>
    </div>
  `,
  styles: [``],
})
export class EditorToolbarComponent {
  @Input({ required: true }) editor!: Editor;

  // isScrolling: boolean = false;
  // scrollCheckInterval!: Subscription;
  // lastScrollPosition: number = 0;
  // scrollStopTimerId!: any;
  //
  HEX: { [key: string]: string } = {};

  constructor(
    public editorService: EditorService,
    public markStyles: MarkStylesService
  ) {
    // // Subscribe to the service
    // this.scrollService.isScrolling$.subscribe((scrolling) => {
    //   this.isScrolling = scrolling;
    // });

    this.HEX = this.markStyles.getAllHexParameters();
  }

  // ngOnInit() {
  //   //! This Was Going Into Infinity Loop Had To add some Complexity
  //   //? All values here can be configured
  //   this.scrollCheckInterval = fromEvent(window, 'scroll')
  //     .pipe(throttleTime(100))
  //     .subscribe(() => {
  //       const tolerance = 50;
  //       const isCurrentlyScrolling =
  //         Math.abs(window.scrollY - this.lastScrollPosition) < tolerance;

  //       if (isCurrentlyScrolling !== this.isScrolling) {
  //         clearTimeout(this.scrollStopTimerId);

  //         this.scrollStopTimerId = setTimeout(() => {
  //           this.scrollService.setScrolling(window.scrollY > 90);
  //         }, 150);
  //       }

  //       this.lastScrollPosition = window.scrollY;
  //     });
  // }

  // ngOnDestroy() {
  //   if (this.scrollCheckInterval) {
  //     this.scrollCheckInterval.unsubscribe();
  //   }
  //   if (this.scrollStopTimerId) {
  //     clearTimeout(this.scrollStopTimerId);
  //   }
  // }
}
