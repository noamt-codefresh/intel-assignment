import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {LoginResponse, RegisterResponse} from "../_models/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // API path
  basePath = 'http://127.0.0.1:8686';

  constructor( private router: Router, private http: HttpClient) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };


  // Verify user credentials on server to get token
  loginForm(data): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.basePath}/users/auth/login`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  registerUser(data): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(`${this.basePath}/users/register`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    return throwError(
      error.error);
  }

  // After login save token and other values(if any) in localStorage
  setUser(resp: LoginResponse) {
    const {userProfile} = resp;
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    localStorage.setItem('access_token', resp.token);
    this.router.navigate(['/todolist']);
  }

  // Checking if token is set
  isLoggedIn() {
    return localStorage.getItem('access_token') != null;
  }

  // After clearing localStorage redirect to login screen
  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }


}
