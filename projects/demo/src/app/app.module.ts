import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {
  CdmHeadingDirective,
  CodemeTiptapModule,
  CdmTableDirective,
  CdmCodeDirective,
  CdmLinkDirective,
  CdmBoldDirective,
  CdmBulletListDirective,
  CdmVideoDirective,
  CdmGoForwardDirective,
  CdmGoBackDirective,
} from 'codeme-tiptap';
import { ReactiveFormsModule } from '@angular/forms';
import { CdmImageDirective } from './image/cdm-image.directive';

import { EditorService } from 'projects/codeme-tiptap/src/public-api';
import { TableClickDirective } from './table-click/cdm-table-click.directive';
import { CommonModule } from '@angular/common';
import { LowlightService } from './lowlight-register.service';
@NgModule({
  declarations: [AppComponent, TableClickDirective],
  imports: [
    CommonModule,
    BrowserModule,
    CodemeTiptapModule,
    ReactiveFormsModule,
    CdmHeadingDirective,
    CdmTableDirective,
    CdmImageDirective,
    CdmCodeDirective,
    CdmLinkDirective,
    CdmBoldDirective,
    CdmBulletListDirective,
    CdmVideoDirective,
    CdmGoForwardDirective,
    CdmGoBackDirective,
  ],
  providers: [EditorService, LowlightService],
  bootstrap: [AppComponent],
})
export class AppModule {}
