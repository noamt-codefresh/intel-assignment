import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../_services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model: any = {};
  registerResult: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {

  }

  register() {
    this.authService.registerUser(this.model).subscribe(response => {
      alert("Successfully registered, please login with user name and password");
      this.router.navigate(["/login"]);
    }, error => {
      console.error(error);
      this.registerResult = error.message;
    });
  }

}
