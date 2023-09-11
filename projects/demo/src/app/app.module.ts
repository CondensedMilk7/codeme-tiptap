import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {
  CdmHeadingDirective,
  CodemeTiptapModule,
  CdmCodeDirective,
  CdmBoldDirective,
  CdmBulletListDirective,
  CdmGoForwardDirective,
  CdmGoBackDirective,
  EditorService,
} from 'codeme-tiptap';
import { ReactiveFormsModule } from '@angular/forms';
import { CdmImageDirective } from './image/cdm-image.directive';

import { TableClickDirective } from './table-click/cdm-table-click.directive';
import { CommonModule } from '@angular/common';
import { CdmLinkDirective } from 'projects/demo/src/app/directives/cdm-link.directive';
import { CdmTableDirective } from 'projects/demo/src/app/directives/cdm-table.directive';
import { CdmVideoDirective } from 'projects/demo/src/app/directives/cdm-video.directive';
import { CdmHighLightDirective } from './directives/cdm-highlight.directive';
@NgModule({
  declarations: [AppComponent, TableClickDirective],
  imports: [
    CommonModule,
    BrowserModule,
    CodemeTiptapModule,
    ReactiveFormsModule,
    CdmHeadingDirective,
    CdmImageDirective,
    CdmCodeDirective,
    CdmBoldDirective,
    CdmBulletListDirective,
    CdmVideoDirective,
    CdmGoForwardDirective,
    CdmGoBackDirective,
    CdmLinkDirective,
    CdmTableDirective,
    CdmHighLightDirective,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
