import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DesktopComponent } from './desktop/desktop.component';
import { AuthComponent } from '../auth/auth.component';
import { SignInComponent } from '../auth/sign-in/sign-in.component';
import { SignUpComponent } from '../auth/sign-up/sign-up.component';
import { GameRoomComponent } from '../game-room/game-room.component';

const routes: Routes = [
  { path: '', redirectTo: 'desktop', pathMatch: 'full' },
    { path: 'desktop', component: DesktopComponent },
    { path: 'auth', redirectTo: 'auth/signin', pathMatch: 'full' },
    { path: 'auth', component: AuthComponent,
      children: [
        { path: 'signin', component: SignInComponent },
        { path: 'signup', component: SignUpComponent }
      ]},
    { path: 'rooms/:id', component: GameRoomComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class RootRoutingModule { }
