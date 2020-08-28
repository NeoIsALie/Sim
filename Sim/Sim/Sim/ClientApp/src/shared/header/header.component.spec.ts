import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { ProfileComponent } from 'src/root/profile/profile.component';
import { AuthService } from 'src/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@aspnet/signalr';
import { HttpClientModule } from '@angular/common/http';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        HeaderComponent,
        ProfileComponent
      ],
      imports: [RouterTestingModule, HttpClientModule ],
      providers: [AuthService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
