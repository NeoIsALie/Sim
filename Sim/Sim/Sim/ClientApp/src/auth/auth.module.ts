import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { FormsModule } from '@angular/forms';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ApiService } from 'src/services/api/api.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from 'src/services/api/api-interceptor';
import { AuthService } from './auth.service';
import { NotifierModule } from 'angular-notifier';

@NgModule({
  declarations: [
    AuthComponent,
    SignInComponent,
    SignUpComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule,
    NotifierModule.withConfig({
      behaviour: {
        stacking: 2
      },
      position: {
        horizontal: {
          position: 'right',
        },
        vertical: {
          position: 'top',
          distance: 70
        }
      }
    })
  ],
  providers: [
    AuthService,
    ApiService, {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    }
  ],
  exports: [
    AuthComponent
  ]
})
export class AuthModule { }
