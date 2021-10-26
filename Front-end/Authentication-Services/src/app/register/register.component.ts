import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup = new FormGroup({});

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      admin: new FormControl('', [Validators.required])
    })
  }

  submit() {
    if(this.registerForm.valid) {
      let user:any = {
        email: this.registerForm.value.email,
        first_name: this.registerForm.value.first_name,
        last_name: this.registerForm.value.last_name,
        password: this.registerForm.value.password,
        admin: this.registerForm.value.admin,
      }
      this.userService.addUser(user);
    }
  }
}
