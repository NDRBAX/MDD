import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { MaterialModule } from '@shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    MaterialModule,
    ProfileRoutingModule
  ],
  declarations: [
    ProfileComponent,
  ]
})
export class ProfileModule { }
