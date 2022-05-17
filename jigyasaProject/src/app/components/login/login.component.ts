import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DatabaseConnectionService } from 'src/app/services/database-connection.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private dbAPI: DatabaseConnectionService) {}

  signinTab: Boolean = true;

  signUpForm = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });

  ngOnInit(): void {
    console.log(environment.baseURL);
  }

  signup() {
    let username = this.signUpForm.value.username;
    let email = this.signUpForm.value.email;
    let password = this.signUpForm.value.password;
    let confirmPassword = this.signUpForm.value.confirmPassword;

    //empty fields validation
    if (
      username == '' ||
      email == '' ||
      password == '' ||
      confirmPassword == ''
    ) {
      document.getElementById('emptyFields')?.classList.remove('display-none');
      document.getElementById('emptyFields')?.classList.add('display');
      return;
    } else {
      if (document.getElementById('emptyFields')?.classList.contains('display'))
        document.getElementById('emptyFields')?.classList.remove('display');
      document.getElementById('emptyFields')?.classList.add('display-none');
    }
    //password fields validation
    if (password != confirmPassword) {
      if (
        document
          .getElementById('pwdMismatch')
          ?.classList.contains('display-none')
      )
        document
          .getElementById('pwdMismatch')
          ?.classList.remove('display-none');
      document.getElementById('pwdMismatch')?.classList.add('display');
      return;
    } else {
      if (document.getElementById('pwdMismatch')?.classList.contains('display'))
        document.getElementById('pwdMismatch')?.classList.remove('display');
      document.getElementById('pwdMismatch')?.classList.add('display-none');
    }

    this.dbAPI.createUser(email, username, password).subscribe(
      (response) => {
        console.log('Signup response success :');
        console.log(response);
        document.getElementById('openSignupSuccessModal')?.click();
        setTimeout(() => {
          document.getElementById('closeSignupSuccessModal')?.click();
        }, 4000);
        this.signinTab = true;
        this.switchTabs('loginTab');
      },
      (error) => {
        console.log('Signup response failure :');
        console.log(error);
      }
    );
  }

  switchTabs(tabID: any) {
    if (tabID == 'signupTab') {
      document.getElementById('loginTab')?.classList.remove('active-login');
      document.getElementById(tabID)!.classList.add('active-signup');
      this.signinTab = false;
    } else {
      document.getElementById('signupTab')?.classList.remove('active-signup');
      document.getElementById(tabID)!.classList.add('active-login');
      this.signinTab = true;
    }
  }
}
