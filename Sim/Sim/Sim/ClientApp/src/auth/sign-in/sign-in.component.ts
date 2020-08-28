import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ApiService } from 'src/services/api/api.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['../auth.component.css']
})
export class SignInComponent implements OnInit {
  username: string;
  password: string

  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService,
    private notifierService: NotifierService
  ) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate['desktop'];
    }
  }

  login(): void {
    this.apiService.login(this.username, this.password).subscribe((res) => {
      this.authService.setSession(res);
      this.router.navigate(['desktop']);
    }, (err) => {
      this.notifierService.notify('error', 'Ошибка авториации: ' + err.statusText);
    });
  }

}
