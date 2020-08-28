import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
declare var Constellation: any;

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  @ViewChild('stars', {static: true}) stars;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate['desktop'];
      return;
    }

    new Constellation(this.stars, environment.starsOptions).init();
  }

}
