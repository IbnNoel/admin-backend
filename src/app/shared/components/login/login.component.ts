import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userForm: FormGroup;
  searchInput: any;

  account_validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ],
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 8 characters long' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase,one number and one special charachter' }
    ],
    }
    
  constructor(private _formBuilder: FormBuilder, private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.userForm = this._formBuilder.group({
      email:['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')
      ])],
      password:['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
      ])],
    })
  }

  emailLogin(value) {
    this.auth.emailLogin(value.email, value.password);
  }

  googleLogin() {
    this.auth.googlelogin();
  }

  facebookLogin() {
    this.auth.facebookLogin();
  }

}
