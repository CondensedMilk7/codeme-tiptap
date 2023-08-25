import { NgModule } from '@angular/core';
import { CodemeTiptapComponent } from './codeme-tiptap.component';
import { NgxTiptapModule } from 'ngx-tiptap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EditorToolbarComponent } from './ui/editor-toolbar.component';
import { CdmHeadingDirective } from './editor-feature';
import { CdmParagraphDirective } from './editor-feature';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  declarations: [CodemeTiptapComponent, EditorToolbarComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgxTiptapModule,
    PortalModule,
    CdmHeadingDirective,
    CdmParagraphDirective,
  ],
  exports: [CodemeTiptapComponent, CdmHeadingDirective, CdmParagraphDirective],
})
export class CodemeTiptapModule {}
