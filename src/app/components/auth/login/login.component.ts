import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../services/auth.service';

import { AuthData } from '../../../models/auth-data.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  user: AuthData;
  isLoading = false;
  loginFormGroup: FormGroup;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.loginFormGroup = new FormGroup({
      userName: new FormControl(''),
      password: new FormControl('')
    });
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    )
  }

  onLogin(){
    this.user = this.loginFormGroup.value
    if(!this.user){
      return;
    }
    this.isLoading = true;
    this.authService.login(this.user.userName, this.user.password);

  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe()
  }

}
