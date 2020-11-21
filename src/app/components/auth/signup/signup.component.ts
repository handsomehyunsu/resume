import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, Form, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AuthData } from '../../../models/auth-data.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  user: AuthData;
  isLoading = false;
  signupFormGroup: FormGroup
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.signupFormGroup = new FormGroup({
      userName: new FormControl(''),
      password: new FormControl(''),
      key: new FormControl('', Validators.required)
    }, {validators: this.matchingKey}
    )
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        console.log("signup component ngOnInit authStatus data " + authStatus);
        this.isLoading = false;
      }
    );
  }

  matchingKey = (control: AbstractControl): {[key: string]: boolean} =>{
    const inputKey = control.get('key');
    // if no values, valid
    if (!inputKey) {
      return null;
    } 
    // if values match return null, else 'mismatchedPasswords:true'  
    return inputKey.value === "kim" ? null : { notMatch: true };
  }  

  onSignup(){
    this.user = this.signupFormGroup.value;
    this.isLoading = true;
    this.authService.createUser(
      this.user.userName,
      this.user.password
    )
  }


  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
