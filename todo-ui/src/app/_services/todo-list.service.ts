import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {LoginResponse} from "../_models/user";
import {catchError} from "rxjs/operators";
import {TodoList, TodoListItem} from "../_models/todo-list";

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

  createTodoList(todoListName: string): Observable<TodoList> {
    return this.http
      .post<TodoList>(`${this.basePath}/todo/lists`, {title: todoListName}, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getTodoListItems(listId: string): Observable<TodoListItem[]> {
    return this.http
      .get<TodoListItem[]>(`${this.basePath}/todo/lists/${listId}/items`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  createTodoListItem(listId: string, todoListItem: TodoListItem): Observable<TodoListItem> {
    return this.http
      .post<TodoListItem>(`${this.basePath}/todo/lists/${listId}/item`, todoListItem, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateTodoListItem(listId: string, todoListItem: TodoListItem): Observable<TodoListItem> {
    return this.http
      .put<TodoListItem>(`${this.basePath}/todo/lists/${listId}/item/${todoListItem._id}`, todoListItem, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(
      error.error);
  }

}
