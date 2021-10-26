import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup = new FormGroup({});

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    })
  }

  submit() {
    console.log('Hi');

    if(this.loginForm.valid) {
      console.log('done');
      let user:any = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      }
      this.userService.login(user);
    }
  }
}
