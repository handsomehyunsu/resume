import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../../angular-material.module';
import { CommonModule } from '@angular/common';

import { ContentsComponent } from './contents/contents.component';
import { ContentFormComponent } from './content-form/content-form.component';

import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ContentsComponent,
    ContentFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})

export class PostModule{}