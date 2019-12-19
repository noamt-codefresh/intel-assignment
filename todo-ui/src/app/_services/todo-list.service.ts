import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {LoginResponse} from "../_models/user";
import {catchError} from "rxjs/operators";
import {TodoList} from "../_models/todo-list";

@Injectable({
  providedIn: 'root'
})
export class TodoListService {

  basePath = 'http://127.0.0.1:8686';

  constructor( private router: Router, private http: HttpClient) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  getTodoLists(): Observable<TodoList[]> {
    return this.http
      .get<TodoList[]>(`${this.basePath}/todo/lists`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(
      error.error);
  }
}
