import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ProfileComponent } from '../root/profile/profile.component';


@NgModule({
  declarations: [
    HeaderComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent,
    ProfileComponent
  ]
})
export class SharedModule { }
