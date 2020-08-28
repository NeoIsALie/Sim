import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api/api.service';
import { AuthService } from '../auth.service';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['../auth.component.css']
})

export class SignUpComponent implements OnInit {
  email: string;
  username: string;
  password: string;

  constructor(private router: Router,
    private apiService: ApiService,
    private authService: AuthService,
    private notifierService: NotifierService
  ) { }

  ngOnInit() {
  }

  signup(): void {
    this.apiService.register(this.email, this.username, this.password).subscribe((res) => {
      this.authService.setSession(res);
      this.router.navigate(['desktop']);
    }, (err) => {
      this.notifierService.notify('error', 'Ошибка регистрации: ' + err.statusText);
    });
  }
  
}
